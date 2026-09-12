import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { XpBar } from '@/components/ui/XpBar';
import { HpBar } from '@/components/ui/HpBar';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { signOut } from '@/app/actions/auth';
import { getLevelTitle, xpToNextLevel } from '@/lib/utils';
import { LogOut, Flame, Zap, Shield, Coins } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: profile }, { data: inventory }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('user_inventory').select('*, shop_items(*)').eq('user_id', user.id),
  ]);

  if (!profile) redirect('/login');

  const stats = [
    { label: 'Level', value: profile.level, icon: <Zap className="w-4 h-4" />, color: 'text-brand-cyan' },
    { label: 'Currency', value: `💰 ${profile.currency}`, icon: <Coins className="w-4 h-4" />, color: 'text-brand-gold' },
    { label: 'HP', value: `${profile.hp} / ${profile.max_hp}`, icon: <Shield className="w-4 h-4" />, color: 'text-green-400' },
    { label: 'Streak', value: `🔥 ${profile.streak_count} days`, icon: <Flame className="w-4 h-4" />, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <h1 className="text-2xl font-bold">Character Sheet</h1>

      {/* Character card */}
      <div className="card-elevated">
        <div className="flex flex-wrap items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-cyan/20 border-2 border-brand-cyan/50 flex items-center justify-center text-4xl font-bold text-brand-cyan">
            {profile.username[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <LevelBadge level={profile.level} size="md" />
            <p className="text-text-muted text-sm mt-1">{getLevelTitle(profile.level)}</p>
          </div>
        </div>
        <div className="space-y-3">
          <XpBar xp={profile.xp} level={profile.level} />
          <p className="text-xs text-text-muted text-right">{xpToNextLevel(profile.level) - profile.xp} XP to next level</p>
          <HpBar hp={profile.hp} maxHp={profile.max_hp} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              {s.icon}<span>{s.label}</span>
            </div>
            <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Inventory */}
      {(inventory ?? []).length > 0 && (
        <section aria-label="Inventory">
          <h2 className="text-lg font-semibold mb-4">Inventory</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(inventory ?? []).map((item) => (
              <div key={item.id} className="card text-center">
                <div className="text-3xl mb-2">{(item.shop_items as { icon?: string })?.icon ?? '📦'}</div>
                <p className="text-sm font-medium">{(item.shop_items as { name?: string })?.name}</p>
                <p className="text-xs text-text-muted capitalize">{(item.shop_items as { type?: string })?.type}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sign out */}
      <div className="pt-4 border-t border-border">
        <form action={signOut}>
          <button type="submit" className="btn-danger flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
