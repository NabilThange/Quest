'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Difficulty, TaskType, Attribute } from '@/types';
import type { GameResult } from '@/types/rpg';

function validTitle(title: string) {
  return typeof title === 'string' && title.trim().length > 0 && title.trim().length <= 200;
}

export async function createTask(data: {
  title: string; type: TaskType; difficulty: Difficulty; attribute?: Attribute; due_date?: string;
}) {
  if (!validTitle(data.title)) return { error: 'Use a quest title between 1 and 200 characters.' };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };
  const { error } = await supabase.from('tasks').insert({
    user_id: user.id, title: data.title.trim(), type: data.type, difficulty: data.difficulty,
    attribute: data.attribute ?? null, due_date: data.due_date || null,
    recurrence_rule: data.type === 'daily' ? 'daily' : null,
  });
  if (error) return { error: error.message };
  revalidatePath('/app', 'layout');
  return { success: true };
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };
  const { error } = await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', user.id);
  if (error) return { error: error.message };
  revalidatePath('/app', 'layout');
  return { success: true };
}

export async function updateTask(taskId: string, updates: Partial<{
  title: string; difficulty: Difficulty; attribute: Attribute; due_date: string;
}>) {
  if (updates.title !== undefined && !validTitle(updates.title)) return { error: 'Use a quest title between 1 and 200 characters.' };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };
  // Explicitly whitelist editable fields; never accept completion/economy fields.
  const fields: Record<string, string | null> = {};
  if (updates.title !== undefined) fields.title = updates.title.trim();
  if (updates.difficulty !== undefined) fields.difficulty = updates.difficulty;
  if (updates.attribute !== undefined) fields.attribute = updates.attribute;
  if (updates.due_date !== undefined) fields.due_date = updates.due_date || null;
  const { error } = await supabase.from('tasks').update(fields).eq('id', taskId).eq('user_id', user.id);
  if (error) return { error: error.message };
  revalidatePath('/app', 'layout');
  return { success: true };
}

export async function completeTask(taskId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };
  const { data, error } = await supabase.rpc('life_rpg', { p_action: 'complete', p_id: taskId });
  if (error) return { error: error.message };
  const result = data as GameResult;
  if (result.error || !result.reward) return { error: result.error ?? 'Reward could not be confirmed.' };
  revalidatePath('/app', 'layout');
  return { success: true, ...result.reward };
}
