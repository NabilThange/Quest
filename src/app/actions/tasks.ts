'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { xpToNextLevel, XP_REWARDS, CURRENCY_REWARDS } from '@/types';
import type { Difficulty, TaskType, Attribute } from '@/types';

export async function createTask(data: {
  title: string;
  type: TaskType;
  difficulty: Difficulty;
  attribute?: Attribute;
  due_date?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('tasks').insert({
    user_id: user.id,
    title: data.title,
    type: data.type,
    difficulty: data.difficulty,
    attribute: data.attribute ?? null,
    due_date: data.due_date ?? null,
    recurrence_rule: data.type === 'daily' ? 'daily' : null,
  });

  if (error) return { error: error.message };
  revalidatePath('/app');
  revalidatePath('/app/todos');
  revalidatePath('/app/habits');
  return { success: true };
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/app');
  revalidatePath('/app/todos');
  revalidatePath('/app/habits');
  return { success: true };
}

export async function updateTask(taskId: string, updates: Partial<{
  title: string;
  difficulty: Difficulty;
  attribute: Attribute;
  due_date: string;
  is_completed: boolean;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/app');
  return { success: true };
}

export async function completeTask(taskId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // Fetch task
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .eq('user_id', user.id)
    .single();

  if (taskError || !task) return { error: 'Task not found' };
  if (task.is_completed && task.type !== 'habit') return { error: 'Already completed' };

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) return { error: 'Profile not found' };

  const xpGained = XP_REWARDS[task.difficulty as Difficulty];
  const currencyGained = CURRENCY_REWARDS[task.difficulty as Difficulty];

  let newXp = profile.xp + xpGained;
  let newLevel = profile.level;
  let leveledUp = false;

  // Non-linear leveling loop
  while (newXp >= xpToNextLevel(newLevel)) {
    newXp -= xpToNextLevel(newLevel);
    newLevel += 1;
    leveledUp = true;
  }

  const today = new Date().toISOString().split('T')[0];

  // Update task
  const taskUpdate: Record<string, unknown> = { is_completed: true };
  if (task.type === 'habit') {
    taskUpdate.habit_streak = task.habit_streak + 1;
    taskUpdate.is_completed = false; // habits don't stay completed
  }

  await supabase.from('tasks').update(taskUpdate).eq('id', taskId);

  // Update user profile
  await supabase
    .from('users')
    .update({
      xp: newXp,
      level: newLevel,
      currency: profile.currency + currencyGained,
      last_active_date: today,
    })
    .eq('id', user.id);

  // Insert task log
  await supabase.from('task_logs').insert({
    task_id: taskId,
    user_id: user.id,
    xp_awarded: xpGained,
    currency_awarded: currencyGained,
  });

  revalidatePath('/app');
  revalidatePath('/app/todos');
  revalidatePath('/app/habits');

  return {
    success: true,
    xpGained,
    currencyGained,
    leveledUp,
    newLevel,
  };
}
