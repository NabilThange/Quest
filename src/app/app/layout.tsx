import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/app/Sidebar';
import { checkAndApplyRollover } from '@/app/actions/rollover';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Lazy rollover check on every app load
  await checkAndApplyRollover();

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 btn-primary">Skip to content</a>
      <Sidebar profile={profile} />
      <main
        className="flex-1 min-h-screen overflow-y-auto"
        id="main-content"
        tabIndex={-1}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
