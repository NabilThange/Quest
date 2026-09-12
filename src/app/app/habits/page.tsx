import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TaskList } from '@/components/app/TaskList';
import { AddTaskForm } from '@/components/app/AddTaskForm';

export default async function HabitsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: habits } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'habit')
    .order('habit_streak', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Habits</h1>
        <p className="text-text-secondary mt-1">Earn cards once per habit per UTC day. Your streak grows with consecutive daily completions.</p>
      </div>
      <AddTaskForm defaultType="habit" />
      <section aria-label="Your habits">
        <TaskList tasks={habits ?? []} emptyMessage="No habits tracked yet. Add your first habit above!" />
      </section>
    </div>
  );
}
