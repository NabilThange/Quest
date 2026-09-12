'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Onboarding,
  ChoiceGroup,
  useOnboarding,
} from '@/components/ui/onboarding';
import {
  generateOnboardingTasks,
  commitOnboardingTasks,
  type OnboardingIntake,
  type TaskSuggestion,
} from '@/app/actions/ai-coach';

// ─── Constants ─────────────────────────────────────────────────────────────

const FOCUS_OPTIONS = [
  { value: 'Fitness',        label: 'Fitness',         sub: 'Strength' },
  { value: 'Study/Learning', label: 'Study / Learning', sub: 'Intellect' },
  { value: 'Career',         label: 'Career',           sub: 'Discipline' },
  { value: 'Creativity',     label: 'Creativity',       sub: 'Creativity' },
  { value: 'Sleep',          label: 'Sleep',            sub: 'Discipline' },
  { value: 'Social',         label: 'Social',           sub: 'Creativity' },
  { value: 'Finances',       label: 'Finances',         sub: 'Discipline' },
];

const ENERGY_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Flexible'];
const TIME_OPTIONS = ['<30m', '30-60m', '1-2h', '2h+'];

const BLOCKER_OPTIONS = [
  'Forget',
  'Lose motivation',
  'Too busy',
  'Don\'t know where to start',
  'Perfectionism',
];

const ATTRIBUTE_LABEL: Record<string, { border: string; text: string }> = {
  Strength:   { border: 'border-red-300/50',    text: 'text-red-400' },
  Intellect:  { border: 'border-blue-300/50',   text: 'text-blue-400' },
  Discipline: { border: 'border-yellow-300/50', text: 'text-yellow-500' },
  Creativity: { border: 'border-purple-300/50', text: 'text-purple-400' },
};

const TYPE_LABEL: Record<string, string> = {
  daily: 'Daily',
  todo:  'To-Do',
  habit: 'Habit',
};

const DIFF_LABEL: Record<string, string> = {
  easy:   'Easy',
  medium: 'Medium',
  hard:   'Hard',
};

// ─── Multi-select helper ────────────────────────────────────────────────────

function useMultiSelect(initial: string[] = []) {
  const [selected, setSelected] = useState<string[]>(initial);
  const toggle = useCallback((val: string) => {
    setSelected((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  }, []);
  return { selected, toggle };
}

// ─── Small UI atoms ─────────────────────────────────────────────────────────

function ChipButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'min-h-[44px] px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-text-primary hover:bg-secondary',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-widest text-text-muted font-medium mb-3">
      {children}
    </p>
  );
}

// ─── Suggestion card ────────────────────────────────────────────────────────

function SuggestionCard({
  suggestion,
  checked,
  onToggle,
}: {
  suggestion: TaskSuggestion;
  checked: boolean;
  onToggle: () => void;
}) {
  const attr = ATTRIBUTE_LABEL[suggestion.attribute] ?? { border: 'border-border', text: 'text-text-primary' };

  return (
    <label
      className={[
        'flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors select-none',
        attr.border,
        checked ? 'bg-secondary' : 'bg-card hover:bg-secondary/50',
      ].join(' ')}
    >
      {/* Checkbox */}
      <div className="mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="sr-only"
        />
        <span
          aria-hidden
          className={[
            'w-5 h-5 rounded border flex items-center justify-center transition-colors',
            checked ? 'bg-foreground border-foreground' : 'border-border bg-background',
          ].join(' ')}
        >
          {checked && (
            <svg viewBox="0 0 12 10" className="w-3 h-2.5 text-background" fill="none">
              <path d="M1 5l3 4 7-8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-sm font-medium text-text-primary leading-snug">
            {suggestion.title}
          </span>
          <span className={`text-xs font-mono ${attr.text}`}>{suggestion.attribute}</span>
        </div>
        <div className="flex gap-2 mb-2">
          <span className="text-xs text-text-muted border border-border rounded px-1.5 py-0.5">
            {TYPE_LABEL[suggestion.type]}
          </span>
          <span className="text-xs text-text-muted border border-border rounded px-1.5 py-0.5">
            {DIFF_LABEL[suggestion.difficulty]}
          </span>
        </div>
        {suggestion.rationale && (
          <p className="text-xs text-text-muted leading-relaxed italic">{suggestion.rationale}</p>
        )}
      </div>
    </label>
  );
}

// ─── Loading screen ─────────────────────────────────────────────────────────

function GeneratingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-text-muted">Building your personal quest list&hellip;</p>
    </div>
  );
}

// ─── Main wizard ─────────────────────────────────────────────────────────────

export default function OnboardingCoachPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Step 1 — focus areas (multi-select)
  const { selected: focusAreas, toggle: toggleFocus } = useMultiSelect();

  // Step 2 — energy + time (single select each)
  const [energyWindow, setEnergyWindow] = useState('');
  const [timeBudget, setTimeBudget] = useState('');

  // Step 3 — blockers (multi-select) + open text
  const { selected: blockers, toggle: toggleBlocker } = useMultiSelect();
  const [goal, setGoal] = useState('');
  const [workingHabits, setWorkingHabits] = useState('');

  // Step 4 — AI results
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [aiSource, setAiSource] = useState<'ai' | 'fallback' | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [committing, setCommitting] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [commitError, setCommitError] = useState('');

  // Navigate to step 4 = trigger AI call
  const handleStepChange = (step: number) => {
    if (step === 4 && suggestions.length === 0) {
      const intake: OnboardingIntake = {
        focusAreas,
        energyWindow,
        timeBudget,
        blockers,
        goal,
        workingHabits,
      };
      setGenerating(true);
      startTransition(() => {
        generateOnboardingTasks(intake).then((result) => {
          setSuggestions(result.suggestions);
          setAiSource(result.source);
          // Select all by default
          setSelectedIds(new Set(result.suggestions.map((_, i) => i)));
          setGenerating(false);
        });
      });
    }
  };

  const toggleSuggestion = (idx: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(suggestions.map((_, i) => i)));
  const clearAll  = () => setSelectedIds(new Set());

  const handleCommit = () => {
    const chosen = [...selectedIds].map((i) => ({
      title:      suggestions[i].title,
      type:       suggestions[i].type,
      attribute:  suggestions[i].attribute,
      difficulty: suggestions[i].difficulty,
    }));
    setCommitting(true);
    startTransition(() => {
      commitOnboardingTasks(chosen).then((res) => {
        setCommitting(false);
        if (res.success) {
          setCommitted(true);
          setTimeout(() => router.push('/app/todos'), 1200);
        } else {
          setCommitError(res.error ?? 'Something went wrong.');
        }
      });
    });
  };

  // canGoNext gates
  const canGoNext = (step: number) => {
    if (step === 1) return focusAreas.length > 0;
    if (step === 2) return !!energyWindow && !!timeBudget;
    return true;
  };

  // Skip to app
  const handleSkip = () => router.push('/app');

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Skip link */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            Skip for now
          </button>
        </div>

        <Onboarding
          totalSteps={4}
          canGoNext={canGoNext}
          onValueChange={handleStepChange}
          className="gap-8 bg-card border border-border shadow-lg rounded-2xl"
        >
          {/* Step indicators */}
          <Onboarding.StepIndicator variant="pills" className="mb-2" />

          {/* ── Step 1: Focus areas ─────────────────────────────────────── */}
          <Onboarding.Step step={1}>
            <Onboarding.Header
              title="What do you want to improve?"
              description="Pick one or more — we'll build habits around these."
            />
            <div className="mt-6">
              <SectionLabel>Areas</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {FOCUS_OPTIONS.map((opt) => (
                  <ChipButton
                    key={opt.value}
                    label={opt.label}
                    active={focusAreas.includes(opt.value)}
                    onClick={() => toggleFocus(opt.value)}
                  />
                ))}
              </div>
              {focusAreas.length === 0 && (
                <p className="mt-3 text-xs text-text-muted">Select at least one area to continue.</p>
              )}
            </div>
          </Onboarding.Step>

          {/* ── Step 2: Energy + time ────────────────────────────────────── */}
          <Onboarding.Step step={2}>
            <Onboarding.Header
              title="When are you at your best?"
              description="We'll time your habits around your natural energy."
            />

            <div className="mt-6 space-y-6">
              <div>
                <SectionLabel>Peak energy window</SectionLabel>
                <ChoiceGroup
                  name="energy-window"
                  orientation="horizontal"
                  value={energyWindow}
                  onValueChange={setEnergyWindow}
                  className="flex flex-wrap gap-2"
                >
                  {ENERGY_OPTIONS.map((opt) => (
                    <ChoiceGroup.Item
                      key={opt}
                      value={opt}
                      className={[
                        'min-h-[44px] px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer',
                        'focus-visible:outline-none focus-visible:ring-2',
                        'data-[state=selected]:border-foreground data-[state=selected]:bg-foreground data-[state=selected]:text-background',
                        'data-[state=unselected]:border-border data-[state=unselected]:bg-card data-[state=unselected]:text-text-primary data-[state=unselected]:hover:bg-secondary',
                      ].join(' ')}
                    >
                      {opt}
                    </ChoiceGroup.Item>
                  ))}
                </ChoiceGroup>
              </div>

              <div>
                <SectionLabel>Free time per day</SectionLabel>
                <ChoiceGroup
                  name="time-budget"
                  orientation="horizontal"
                  value={timeBudget}
                  onValueChange={setTimeBudget}
                  className="flex flex-wrap gap-2"
                >
                  {TIME_OPTIONS.map((opt) => (
                    <ChoiceGroup.Item
                      key={opt}
                      value={opt}
                      className={[
                        'min-h-[44px] px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer',
                        'focus-visible:outline-none focus-visible:ring-2',
                        'data-[state=selected]:border-foreground data-[state=selected]:bg-foreground data-[state=selected]:text-background',
                        'data-[state=unselected]:border-border data-[state=unselected]:bg-card data-[state=unselected]:text-text-primary data-[state=unselected]:hover:bg-secondary',
                      ].join(' ')}
                    >
                      {opt}
                    </ChoiceGroup.Item>
                  ))}
                </ChoiceGroup>
              </div>
            </div>
          </Onboarding.Step>

          {/* ── Step 3: Blockers + open text ────────────────────────────── */}
          <Onboarding.Step step={3}>
            <Onboarding.Header
              title="A bit more about you"
              description="Optional but useful — the more context, the better the suggestions."
            />

            <div className="mt-6 space-y-6">
              <div>
                <SectionLabel>What has stopped you before? (optional)</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {BLOCKER_OPTIONS.map((b) => (
                    <ChipButton
                      key={b}
                      label={b}
                      active={blockers.includes(b)}
                      onClick={() => toggleBlocker(b)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <SectionLabel>One thing you wish you were better at</SectionLabel>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Staying consistent with exercise..."
                  rows={3}
                  maxLength={400}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-foreground/30"
                />
              </div>

              <div>
                <SectionLabel>Anything already working for you? (optional)</SectionLabel>
                <textarea
                  value={workingHabits}
                  onChange={(e) => setWorkingHabits(e.target.value)}
                  placeholder="e.g. I already take a short walk after dinner..."
                  rows={2}
                  maxLength={400}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-foreground/30"
                />
              </div>
            </div>
          </Onboarding.Step>

          {/* ── Step 4: Review suggestions ──────────────────────────────── */}
          <Onboarding.Step step={4}>
            {committed ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-foreground" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-base font-medium">Quests added! Redirecting&hellip;</p>
              </div>
            ) : generating || isPending && suggestions.length === 0 ? (
              <GeneratingScreen />
            ) : (
              <>
                <Onboarding.Header
                  title="Your starter quest list"
                  description={
                    aiSource === 'ai'
                      ? 'Personalised by AI based on your answers. Deselect anything that doesn\'t fit.'
                      : 'Curated suggestions based on your answers.'
                  }
                />

                {/* Select all / clear */}
                <div className="mt-4 flex justify-end gap-3">
                  <button type="button" onClick={selectAll} className="text-xs text-text-muted hover:text-text-primary transition-colors">
                    Select all
                  </button>
                  <span className="text-xs text-border">|</span>
                  <button type="button" onClick={clearAll} className="text-xs text-text-muted hover:text-text-primary transition-colors">
                    Clear
                  </button>
                </div>

                {/* Suggestions */}
                <div className="mt-3 space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {suggestions.map((s, i) => (
                    <SuggestionCard
                      key={i}
                      suggestion={s}
                      checked={selectedIds.has(i)}
                      onToggle={() => toggleSuggestion(i)}
                    />
                  ))}
                </div>

                {/* Error */}
                {commitError && (
                  <p className="mt-3 text-xs text-red-400">{commitError}</p>
                )}

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="flex-1 min-h-[44px] rounded-xl border border-border bg-card text-sm text-text-primary hover:bg-secondary transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={handleCommit}
                    disabled={selectedIds.size === 0 || committing || isPending}
                    className="flex-1 min-h-[44px] rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {committing ? 'Adding…' : `Add ${selectedIds.size} quest${selectedIds.size !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </>
            )}
          </Onboarding.Step>

          {/* Navigation — hidden on step 4 (we render our own actions there) */}
          <StepNav />
        </Onboarding>
      </div>
    </div>
  );
}

// Render Navigation only for steps 1-3; step 4 has its own action buttons
function StepNav() {
  const { currentStep } = useOnboarding();
  if (currentStep === 4) return null;
  return (
    <Onboarding.Navigation
      backLabel="Back"
      nextLabel="Continue"
      completeLabel="Continue"
    />
  );
}
