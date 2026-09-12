'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function purchaseItem(itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };
  const { error } = await supabase.rpc('life_rpg', { p_action: 'purchase', p_id: itemId });
  if (error) return { error: error.message };
  revalidatePath('/app', 'layout');
  return { success: true };
}
