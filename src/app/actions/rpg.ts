'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { GameAction, GameResult } from '@/types/rpg';

export async function gameAction(action: GameAction, input: {
  id?: string; species?: number; request?: string; encounter?: string;
} = {}): Promise<GameResult> {
  if (!['refresh', 'choose', 'attack', 'switch', 'rest', 'potion'].includes(action))