import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CalendarView } from '@/components/app/CalendarView';

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .in('type', ['daily', 'todo'])
    .order('due_date', { ascending: true });

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-text-secondary mt-1">Your dailies and todos laid out by date.</p>
      </div>
      <CalendarView tasks={tasks ?? []} />
    </div>
  );
}
