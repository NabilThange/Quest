'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function purchaseItem(itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // Fetch item
  const { data: item, error: itemError } = await supabase
    .from('shop_items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (itemError || !item) return { error: 'Item not found' };

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('currency')
    .eq('id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  // Server-side currency check
  if (profile.currency < item.cost) {
    return { error: 'Insufficient currency' };
  }

  // Check if already owned
  const { data: existing } = await supabase
    .from('user_inventory')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .single();

  if (existing) return { error: 'Already owned' };

  // Deduct currency and add to inventory
  await supabase
    .from('users')
    .update({ currency: profile.currency - item.cost })
    .eq('id', user.id);

  await supabase.from('user_inventory').insert({
    user_id: user.id,
    item_id: itemId,
  });

  revalidatePath('/app/rewards');
  revalidatePath('/app/profile');
  return { success: true };
}
