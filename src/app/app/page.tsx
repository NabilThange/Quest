import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TaskList } from '@/components/app/TaskList';
import { GameSection } from '@/components/rpg/GameSection';
import { OverworldBanner } from '@/components/rpg/OverworldBanner';
import { getTodayString } from '@/lib/utils';
import { checkAndApplyRollover } from '@/app/actions/rollover';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  // Layouts and pages can render concurrently. Settle rollover before reading today's quests.
  await checkAndApplyRollover();
  const [{ data: profile }, { data: dailies }, { data: todos }] = await Promise.all([
    supabase.from('users').select('streak_count').eq('id', user.id).single(),
    supabase.from('tasks').select('*').eq('user_id', user.id).eq('type', 'daily').order('created_at'),
    supabase.from('tasks').select('*').eq('user_id', user.id).eq('type', 'todo').eq('is_completed', false)
      .or(`due_date.is.null,due_date.lte.${getTodayString()}`).order('due_date', { ascending: true }).limit(5),
  ]);

  const completedDailies = dailies?.filter(d => d.is_completed).length ?? 0;
  const totalDailies = dailies?.length ?? 0;

  return <div className="space-y-8 pb-24 lg:pb-0">
    <GameSection view="lodge" />
    <OverworldBanner
      completedTasks={completedDailies}
      totalTasks={totalDailies}
      streakCount={profile?.streak_count ?? 0}
    />
    <section aria-label="Today's quests" className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="font-serif text-2xl">Small steps, real progress.</h2><Link href="/app/todos" className="text-sm underline underline-offset-4">Add quest</Link></div>
      <p className="text-sm text-text-secondary">Finish a quest to earn companion XP, gold, and a move card. Hard quests earn three cards.</p>
      <TaskList tasks={dailies ?? []} emptyMessage="No daily quests yet. Plant a small intention in the Quests tab." />
    </section>
    {(todos ?? []).length > 0 && <section aria-label="Due today" className="space-y-4"><h2 className="font-serif text-2xl">On your path today</h2><TaskList tasks={todos ?? []} /></section>}
  </div>;
}
