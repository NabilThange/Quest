import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { cn } from '@/lib/utils';

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: entries } = await supabase
    .from('users')
    .select('id, username, level, xp')
    .order('level', { ascending: false })
    .order('xp', { ascending: false })
    .limit(50);

  const rankColors = ['text-brand-gold', 'text-slate-300', 'text-amber-600'];
  const rankEmojis = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-text-secondary mt-1">Top 50 adventurers ranked by level and XP.</p>
      </div>

      <section aria-label="Leaderboard rankings">
        <div className="space-y-2">
          {(entries ?? []).map((entry, i) => (
            <div
              key={entry.id}
              className={cn(
                'card flex items-center gap-4 transition-all',
                entry.id === user.id && 'border-brand-cyan/40 bg-brand-cyan/5'
              )}
            >
              <div className={cn('w-8 text-center font-bold font-mono text-lg flex-shrink-0', rankColors[i] ?? 'text-text-muted')}>
                {i < 3 ? rankEmojis[i] : `#${i + 1}`}
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center font-bold text-brand-cyan flex-shrink-0">
                {entry.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {entry.username}
                  {entry.id === user.id && <span className="ml-2 text-xs text-brand-cyan">(you)</span>}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <LevelBadge level={entry.level} size="sm" />
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-text-muted">XP</p>
                  <p className="font-mono text-sm text-text-secondary">{entry.xp}</p>
                </div>
                <Trophy className="w-4 h-4 text-brand-gold" />
              </div>
            </div>
          ))}
          {(entries ?? []).length === 0 && (
            <div className="card text-center py-10 text-text-muted">
              <p className="text-4xl mb-3">🏆</p>
              <p>No adventurers yet. Be the first!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
