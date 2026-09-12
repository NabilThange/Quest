'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Lazy rollover check — called on login.
 * Compares last_active_date to today and applies HP penalties
 * for missed dailies, updates streaks.
 */
export async function checkAndApplyRollover() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return;

  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.last_active_date;

  // Already checked today
  if (lastActive === today) return;

  // If there was a previous active date, check for missed dailies
  if (lastActive) {
    const lastDate = new Date(lastActive);
    const todayDate = new Date(today);
    const daysDiff = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff >= 1) {
      // Fetch yesterday's dailies
      const { data: dailies } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'daily');

      const missedCount = (dailies ?? []).filter((t) => !t.is_completed).length;
      const completedCount = (dailies ?? []).filter((t) => t.is_completed).length;

      let newHp = profile.hp;
      let newStreak = profile.streak_count;

      // HP penalty for missed dailies
      newHp = Math.max(0, newHp - missedCount * 10);

      // HP restore if all dailies were completed
      if (missedCount === 0 && completedCount > 0) {
        newHp = Math.min(profile.max_hp, newHp + 5);
        newStreak += 1;
      } else if (daysDiff > 1) {
        // Full day gap — reset streak
        newStreak = 0;
      }

      // Weakened state if HP hits 0
      const isWeakened = newHp <= 0;

      // Reset dailies for new day
      await supabase
        .from('tasks')
        .update({ is_completed: false })
        .eq('user_id', user.id)
        .eq('type', 'daily');

      await supabase
        .from('users')
        .update({
          hp: isWeakened ? 10 : newHp, // give 10 HP floor so they can recover
          streak_count: newStreak,
          last_active_date: today,
        })
        .eq('id', user.id);
    }
  } else {
    // First login ever — just set today
    await supabase
      .from('users')
      .update({ last_active_date: today })
      .eq('id', user.id);
  }

  revalidatePath('/app');
}
