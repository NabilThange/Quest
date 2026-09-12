import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TaskList } from '@/components/app/TaskList';
import { AddTaskForm } from '@/components/app/AddTaskForm';

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: todos } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'todo')
    .order('is_completed', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  const active = (todos ?? []).filter((t) => !t.is_completed);
  const completed = (todos ?? []).filter((t) => t.is_completed);

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Quests</h1>
        <p className="text-text-secondary mt-1">One-off tasks and goals.</p>
      </div>
      <AddTaskForm defaultType="todo" />
      <section aria-label="Active quests">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Active ({active.length})</h2>
        <TaskList tasks={active} emptyMessage="No active quests. Add one above!" />
      </section>
      {completed.length > 0 && (
        <section aria-label="Completed quests">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Completed ({completed.length})</h2>
          <TaskList tasks={completed} />
        </section>
      )}
    </div>
  );
}
