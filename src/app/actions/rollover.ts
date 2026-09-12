'use server';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/get-user';

/**
 * Wrapped with React.cache() so both AppLayout and DashboardPage
 * share a single rollover call per request — no double execution.
 */
export const checkAndApplyRollover = cache(async () => {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  // RPC serializes rollover with completions, healing and battle turns.
  // No revalidatePath here: this function also runs during server rendering.
  const { error } = await supabase.rpc('life_rpg', { p_action: 'refresh' });
  return error ? { error: error.message } : { success: true };
});
