'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Attribute, Difficulty, TaskType } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OnboardingIntake {
  focusAreas: string[];          // e.g. ['Fitness', 'Study']
  energyWindow: string;          // 'Morning' | 'Afternoon' | 'Evening' | 'Flexible'
  timeBudget: string;            // '<30m' | '30-60m' | '1-2h' | '2h+'
  blockers: string[];            // e.g. ['Forget', 'Too busy']
  goal: string;                  // open text
  workingHabits: string;         // open text (optional)
}

export interface TaskSuggestion {
  title: string;
  type: TaskType;
  attribute: Attribute;
  difficulty: Difficulty;
  rationale: string;
}

export interface GenerateResult {
  suggestions: TaskSuggestion[];
  source: 'ai' | 'fallback';
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a practical habit-formation coach helping someone turn vague goals into a short list of small, realistic daily habits and tasks. You are NOT a therapist and do not diagnose or treat mental health conditions.

Given the person's onboarding answers, suggest 5-8 tasks. Favor small, concrete, immediately startable actions (e.g. "10-minute walk after lunch" not "get fit"). Match each suggestion to their stated energy windows and time constraints.

Map each task to one of these attributes: Strength, Intellect, Discipline, Creativity.
Map each task to one of these types: daily, todo, habit.
Map difficulty to: easy, medium, hard.

For each suggestion, write one SHORT sentence (under 20 words) explaining why it fits what they told you.

If the person's answers suggest significant distress, burnout, or mention self-harm, do NOT coach them — instead output a single suggestion with title "Talk to someone you trust" and rationale "Professional support is more helpful here than a habit list."

Return ONLY valid JSON in exactly this schema:
{
  "suggestions": [
    {
      "title": "string",
      "type": "daily" | "todo" | "habit",
      "attribute": "Strength" | "Intellect" | "Discipline" | "Creativity",
      "difficulty": "easy" | "medium" | "hard",
      "rationale": "string"
    }
  ]
}`;

// ─── Fallback generator ───────────────────────────────────────────────────────

const FALLBACK_BANKS: Record<string, TaskSuggestion[]> = {
  Fitness: [
    { title: '10-minute morning stretch', type: 'daily', attribute: 'Strength', difficulty: 'easy', rationale: 'Low barrier — just floor space and 10 minutes, builds the morning movement habit.' },
    { title: '20-minute walk after lunch', type: 'daily', attribute: 'Strength', difficulty: 'easy', rationale: 'Breaks up sedentary time and is easy to attach to an existing lunch routine.' },
  ],
  'Study/Learning': [
    { title: 'Read one chapter before bed', type: 'daily', attribute: 'Intellect', difficulty: 'easy', rationale: 'Evening reading pairs well with winding down and compounds over months.' },
    { title: 'Watch one educational video', type: 'daily', attribute: 'Intellect', difficulty: 'easy', rationale: 'Keeps learning concrete and measurable — one video is a clear win.' },
  ],
  Career: [
    { title: 'Write 3 things you learned today', type: 'daily', attribute: 'Intellect', difficulty: 'easy', rationale: 'Reflection accelerates skill development and takes under 5 minutes.' },
    { title: 'Spend 25 min on one key project task', type: 'daily', attribute: 'Discipline', difficulty: 'medium', rationale: 'A Pomodoro block for your most important work — short enough to start.' },
  ],
  Creativity: [
    { title: 'Sketch or write for 15 minutes', type: 'daily', attribute: 'Creativity', difficulty: 'easy', rationale: 'Daily creative practice builds a habit before motivation wavers.' },
    { title: 'Capture one idea in a notes app', type: 'habit', attribute: 'Creativity', difficulty: 'easy', rationale: 'Ideas evaporate — capturing them takes 30 seconds and builds creative capital.' },
  ],
  Sleep: [
    { title: 'No screens 30 min before bed', type: 'daily', attribute: 'Discipline', difficulty: 'medium', rationale: 'One of the highest-impact sleep changes with no equipment needed.' },
    { title: 'Set a consistent bedtime alarm', type: 'todo', attribute: 'Discipline', difficulty: 'easy', rationale: 'Consistency of sleep schedule matters as much as duration.' },
  ],
  Social: [
    { title: 'Send one meaningful message today', type: 'daily', attribute: 'Creativity', difficulty: 'easy', rationale: 'Relationships compound — one intentional touch per day is realistic.' },
  ],
  Finances: [
    { title: 'Log today\'s spending', type: 'daily', attribute: 'Discipline', difficulty: 'easy', rationale: 'Awareness is step one — you can\'t manage what you don\'t measure.' },
  ],
};

function buildFallback(intake: OnboardingIntake): GenerateResult {
  const suggestions: TaskSuggestion[] = [];

  for (const area of intake.focusAreas) {
    const bank = FALLBACK_BANKS[area] ?? [];
    // Pick one suggestion per area, avoid duplicates
    const pick = bank.find((s) => !suggestions.some((x) => x.title === s.title));
    if (pick) suggestions.push(pick);
  }

  // Always add a discipline anchor if time is tight
  if (intake.timeBudget === '<30m' && !suggestions.some((s) => s.attribute === 'Discipline')) {
    suggestions.push({
      title: 'Pick one task and finish it fully',
      type: 'daily',
      attribute: 'Discipline',
      difficulty: 'easy',
      rationale: 'With limited time, single-task focus beats context-switching every time.',
    });
  }

  // Cap at 6
  return { suggestions: suggestions.slice(0, 6), source: 'fallback' };
}

// ─── AI call ──────────────────────────────────────────────────────────────────

export async function generateOnboardingTasks(intake: OnboardingIntake): Promise<GenerateResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn('[ai-coach] GROQ_API_KEY not set — using fallback suggestions.');
    return buildFallback(intake);
  }

  const userMessage = `Here are my onboarding answers:

Focus areas I want to improve: ${intake.focusAreas.join(', ') || 'Not specified'}
Best energy/focus window: ${intake.energyWindow}
Realistic free time per day: ${intake.timeBudget}
What has stopped me before: ${intake.blockers.join(', ') || 'None specified'}
One thing I wish I were better at: ${intake.goal || 'Not provided'}
What is already working for me: ${intake.workingHabits || 'Nothing yet'}

Please suggest 5-8 tasks tailored to this.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[ai-coach] Groq API error:', res.status, errText);
      return buildFallback(intake);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw) as { suggestions?: TaskSuggestion[] };

    const VALID_TYPES: TaskType[] = ['daily', 'todo', 'habit'];
    const VALID_ATTRS: Attribute[] = ['Strength', 'Intellect', 'Discipline', 'Creativity'];
    const VALID_DIFFS: Difficulty[] = ['easy', 'medium', 'hard'];

    // Validate + sanitize each suggestion
    const suggestions = (parsed.suggestions ?? [])
      .filter(
        (s) =>
          typeof s.title === 'string' &&
          s.title.trim().length > 0 &&
          VALID_TYPES.includes(s.type) &&
          VALID_ATTRS.includes(s.attribute) &&
          VALID_DIFFS.includes(s.difficulty)
      )
      .map((s) => ({
        title: s.title.trim().slice(0, 200),
        type: s.type,
        attribute: s.attribute,
        difficulty: s.difficulty,
        rationale: typeof s.rationale === 'string' ? s.rationale.trim().slice(0, 500) : '',
      }))
      .slice(0, 8);

    if (suggestions.length === 0) {
      return buildFallback(intake);
    }

    return { suggestions, source: 'ai' };
  } catch (err) {
    console.error('[ai-coach] Unexpected error:', err);
    return buildFallback(intake);
  }
}

// ─── Commit selected tasks to Supabase ────────────────────────────────────────

export async function commitOnboardingTasks(
  selected: Omit<TaskSuggestion, 'rationale'>[]
): Promise<{ success: boolean; error?: string; count?: number }> {
  if (selected.length === 0) return { success: true, count: 0 };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const rows = selected.map((s) => ({
    user_id: user.id,
    title: s.title,
    type: s.type,
    attribute: s.attribute,
    difficulty: s.difficulty,
    recurrence_rule: s.type === 'daily' ? 'daily' : null,
  }));

  const { error } = await supabase.from('tasks').insert(rows);
  if (error) return { success: false, error: error.message };

  revalidatePath('/app', 'layout');
  return { success: true, count: rows.length };
}
