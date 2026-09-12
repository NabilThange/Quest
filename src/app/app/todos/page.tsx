import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { QuestTabs } from '@/components/app/QuestTabs';

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('is_completed', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Quests</h1>
        <p className="text-text-secondary mt-1">Daily intentions, habits, and one-off goals.</p>
      </div>

      {/* AI Coach banner — always visible as a quick entry point */}
      <Link
        href="/onboarding"
        className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:bg-secondary transition-colors group"
        aria-label="Launch AI Habit Coach"
      >
        <div>
          <p className="text-sm font-medium text-text-primary">AI Habit Coach</p>
          <p className="text-xs text-text-muted mt-0.5">Answer a few questions — get a personalised quest list.</p>
        </div>
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors flex-shrink-0"
          fill="none"
        >
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <QuestTabs tasks={tasks ?? []} />
    </div>
  );
}
