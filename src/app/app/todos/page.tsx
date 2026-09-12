import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
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

      <QuestTabs tasks={tasks ?? []} />
    </div>
  );
}
