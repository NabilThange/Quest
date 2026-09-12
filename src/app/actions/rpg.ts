'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { GameAction, GameResult } from '@/types/rpg';

export async function gameAction(action: GameAction, input: {
  id?: string; species?: number; request?: string; encounter?: string;
} = {}): Promise<GameResult> {
  if (!['refresh', 'choose', 'attack', 'switch', 'rest', 'potion'].includes(action)) {
    return { error: 'Unknown game action.' };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in again.' };
  const { data, error } = await supabase.rpc('life_rpg', {
    p_action: action, p_id: input.id ?? null, p_species: input.species ?? null,
    p_request: input.request ?? null, p_encounter: input.encounter ?? null,
  });
  if (error) return { error: error.message };
  if (action !== 'refresh') revalidatePath('/app', 'layout');
  return data as GameResult;
}
