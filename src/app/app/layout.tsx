import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/app/Sidebar';
import { checkAndApplyRollover } from '@/app/actions/rollover';
import { NavSoundListener } from '@/components/app/NavSoundListener';
import { CardDraftHost } from '@/components/rpg/CardDraftHost';
import { getUser } from '@/lib/supabase/get-user';
import { createClient } from '@/lib/supabase/server';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser(); // cached — no double round-trip with child pages
  if (!user) redirect('/login');

  // Cached — safe to call here even if DashboardPage calls it too
  await checkAndApplyRollover();

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('users')
    .select('id, username, avatar_url, level, xp, currency, streak_count, hp, max_hp, last_active_date, created_at, companion_id')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <NavSoundListener />
      <CardDraftHost />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 btn-primary">Skip to content</a>
      <Sidebar profile={profile} />
      <main
        className="flex-1 min-h-screen overflow-y-auto"
        id="main-content"
        tabIndex={-1}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
