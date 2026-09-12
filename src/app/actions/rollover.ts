'use server';

import { createClient } from '@/lib/supabase/server';

export async function checkAndApplyRollover() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  // RPC serializes rollover with completions, healing and battle turns.
  // No revalidatePath here: this function also runs during server rendering.
  const { error } = await supabase.rpc('life_rpg', { p_action: 'refresh' });
  return error ? { error: error.message } : { success: true };
}
