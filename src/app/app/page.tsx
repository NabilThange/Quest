import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { XpBar } from '@/components/ui/XpBar';
import { HpBar } from '@/components/ui/HpBar';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { StatCard } from '@/components/ui/StatCard';
import { TaskList } from '@/components/app/TaskList';
import { Flame, Zap, Shield } from 'lucide-react';
import { getTodayString } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: profile }, { data: dailies }, { data: todos }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('tasks').select('*').eq('user_id', user.id).eq('type', 'daily').order('created_at'),
    supabase.from('tasks').select('*').eq('user_id', user.id).eq('type', 'todo').eq('is_completed', false)
      .or(`due_date.is.null,due_date.lte.${getTodayString()}`)
      .order('due_date', { ascending: true }).limit(5),
  ]);

  if (!profile) redirect('/login');

  const completedDailies = (dailies ?? []).filter((t) => t.is_completed).length;
  const totalDailies = (dailies ?? []).length;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, <span className="text-brand-cyan">{profile.username}</span> ⚔️</h1>
        <p className="text-text-secondary mt-1">Here&apos;s your quest log for today.</p>
      </div>

      <section aria-label="Character stats">
        <div className="card-elevated mb-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-brand-cyan/20 border-2 border-brand-cyan/40 flex items-center justify-center text-2xl font-bold text-brand-cyan">
              {profile.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-lg">{profile.username}</p>
              <LevelBadge level={profile.level} />
            </div>
            {profile.streak_count > 0 && (
              <div className="ml-auto flex items-center gap-1.5 bg-orange-400/10 border border-orange-400/20 rounded-full px-3 py-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-semibold text-sm">{profile.streak_count} day streak</span>
              </div>
            )}
          </div>
          <div className="grid gap-3">
            <XpBar xp={profile.xp} level={profile.level} />
            <HpBar hp={profile.hp} maxHp={profile.max_hp} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Level" value={profile.level} icon={<Zap className="w-4 h-4" />} color="text-brand-cyan" />
          <StatCard label="Currency" value={`💰 ${profile.currency}`} color="text-brand-gold" />
          <StatCard label="HP" value={`${profile.hp}/${profile.max_hp}`} icon={<Shield className="w-4 h-4" />} color={profile.hp > 60 ? 'text-green-400' : profile.hp > 30 ? 'text-yellow-400' : 'text-red-400'} />
          <StatCard label="Streak" value={`🔥 ${profile.streak_count}`} icon={<Flame className="w-4 h-4" />} color="text-orange-400" />
        </div>
      </section>

      <section aria-label="Daily quests">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Daily Quests <span className="text-sm font-normal text-text-secondary">{completedDailies}/{totalDailies} completed</span></h2>
          {totalDailies > 0 && (
            <div className="text-xs text-text-muted">{completedDailies === totalDailies ? '✅ All done!' : `⏳ ${totalDailies - completedDailies} remaining`}</div>
          )}
        </div>
        <TaskList tasks={dailies ?? []} emptyMessage="No daily quests yet. Add some in the Quests tab!" />
      </section>

      {(todos ?? []).length > 0 && (
        <section aria-label="Due today">
          <h2 className="text-lg font-semibold mb-4">Due Today</h2>
          <TaskList tasks={todos ?? []} />
        </section>
      )}
    </div>
  );
}
