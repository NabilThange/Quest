'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { completeTask, deleteTask, updateTask } from '@/app/actions/tasks';
import { LevelUpModal } from '@/components/ui/LevelUpModal';
import { ATTRIBUTE_COLORS, DIFFICULTY_COLORS } from '@/types';
import type { Attribute, Difficulty, Task } from '@/types';
import { Trash2, CheckCircle2, Circle, Flame, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { playQuestCompleteSound, playCoinSound, playLevelUpSound } from '@/lib/sound';
import { generateCardDraft } from '@/lib/rpg/cardCatalog';
import { triggerCardDraft } from '@/lib/rpg/cardEvents';

interface TaskListProps { tasks: Task[]; emptyMessage?: string }

export function TaskList({ tasks, emptyMessage = 'No tasks here yet.' }: TaskListProps) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const lock = useRef(false);
  const [reward, setReward] = useState<{ id: string; text: string } | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const [levelUp, setLevelUp] = useState({ show: false, level: 1 });

  useEffect(() => {
    const update = () => setToday(new Date().toISOString().slice(0, 10));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleComplete(task: Task) {
    if (lock.current) return;
    lock.current = true;
    setPending(task.id);
    try {
      const result = await completeTask(task.id);
      if (result.error) toast.error(result.error);
      else if (result.success) {
        const text = `+${result.xpGained} XP · +${result.currencyGained} gold${result.companionLeveledUp ? ` · Companion reached level ${result.companionLevel}!` : ''}`;
        setReward({ id: task.id, text });
        toast.success(text, { icon: '✦', duration: 4500 });
        playQuestCompleteSound();
        if (result.currencyGained > 0) {
          setTimeout(() => playCoinSound(), 200);
        }
        if (result.leveledUp || result.companionLeveledUp) {
          setTimeout(() => playLevelUpSound(), 450);
        }
        if (result.leveledUp) setLevelUp({ show: true, level: result.newLevel ?? 1 });

        // Generate 3 card draft options biased by task attribute and trigger top-level modal
        const draftedCards = generateCardDraft({
          taskAttribute: task.attribute,
        });
        triggerCardDraft({
          cards: draftedCards,
          taskTitle: task.title,
          taskAttribute: task.attribute,
        });
      }
    } catch {
      toast.error('Connection interrupted. Refresh to check whether your reward was saved.');
    } finally { lock.current = false; setPending(null); }
  }

  async function handleDelete(taskId: string) {
    if (lock.current || !window.confirm('Delete this quest? Earned rewards and history are kept.')) return;
    lock.current = true;
    setPending(taskId);
    try {
      const result = await deleteTask(taskId);
      if (result.error) toast.error(result.error);
      else router.refresh();
    } catch { toast.error('Could not delete this quest. Try again.'); }
    finally { lock.current = false; setPending(null); }
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || lock.current) return;
    const data = new FormData(event.currentTarget);
    lock.current = true;
    setPending(editing.id);
    try {
      const attribute = data.get('attribute') as Attribute;
      const result = await updateTask(editing.id, {
        title: String(data.get('title') ?? ''), difficulty: data.get('difficulty') as Difficulty,
        attribute: attribute || null, due_date: String(data.get('due_date') ?? ''),
      });
      if (result.error) toast.error(result.error);
      else { setEditing(null); router.refresh(); }
    } catch { toast.error('Could not save this quest. Try again.'); }
    finally { lock.current = false; setPending(null); }
  }

  return (
    <MotionConfig reducedMotion="user">
      <LevelUpModal show={levelUp.show} level={levelUp.level} onClose={() => setLevelUp({ show: false, level: 1 })} />
      {tasks.length === 0 ? (
        <div className="card text-center py-10 text-text-muted">
          <p className="text-3xl mb-3" aria-hidden="true">❧</p>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {tasks.map(task => {
              const earnedToday = today !== null && task.last_rewarded_at?.slice(0, 10) === today;
              const done = task.type === 'todo' ? task.is_completed : earnedToday;
              return <motion.li key={task.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
                <div className="card">
                  {editing?.id === task.id ? <form onSubmit={saveEdit} className="space-y-3">
                    <label className="label">Quest title<input name="title" className="input mt-1" defaultValue={task.title} maxLength={200} required autoFocus /></label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <label className="label">Difficulty<select name="difficulty" className="input mt-1" defaultValue={task.difficulty}>{['easy','medium','hard'].map(v => <option key={v}>{v}</option>)}</select></label>
                      <label className="label">Attribute<select name="attribute" className="input mt-1" defaultValue={task.attribute ?? ''}><option value="">Energy / uncategorized</option>{Object.keys(ATTRIBUTE_COLORS).map(v => <option key={v}>{v}</option>)}</select></label>
                      <label className="label">Due date<input type="date" name="due_date" className="input mt-1" defaultValue={task.due_date ?? ''} /></label>
                    </div>
                    <div className="flex gap-2"><button className="btn-primary" disabled={pending !== null}>Save</button><button type="button" className="btn-secondary" disabled={pending !== null} onClick={() => setEditing(null)}>Cancel</button></div>
                  </form> : <div className="flex items-start gap-3">
                    <button onClick={() => void handleComplete(task)} disabled={pending !== null || done} className="mt-0.5 rounded p-1 text-text-secondary hover:text-primary" aria-label={`${done ? 'Completed' : 'Complete'} ${task.title}`}>
                      {pending === task.id ? <span className="block w-5 animate-spin" aria-hidden="true">◌</span> : done ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={cn('font-medium text-sm', done && 'line-through text-text-secondary')}>{task.title}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-secondary capitalize text-text-secondary">{task.type}</span>
                        {task.attribute && <span className={cn('text-xs px-2 py-0.5 rounded-full border', ATTRIBUTE_COLORS[task.attribute])}>{task.attribute}</span>}
                        <span className={cn('text-xs px-2 py-0.5 rounded-full border capitalize', DIFFICULTY_COLORS[task.difficulty])}>{task.difficulty}</span>
                        {task.type === 'habit' && task.habit_streak > 0 && <span className="flex items-center gap-1 text-xs text-orange-400"><Flame className="h-3 w-3" />{task.habit_streak}</span>}
                        {task.due_date && <span className="text-xs text-text-secondary">Due {task.due_date}</span>}
                        {done && task.type !== 'todo' && <span className="text-xs text-text-secondary">Reward earned · resets at midnight UTC</span>}
                      </div>
                    </div>
                    <button onClick={() => setEditing(task)} disabled={pending !== null} className="rounded p-1 text-text-secondary hover:text-primary" aria-label={`Edit ${task.title}`}><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => void handleDelete(task.id)} disabled={pending !== null} className="rounded p-1 text-text-secondary hover:text-red-400" aria-label={`Delete ${task.title}`}><Trash2 className="h-4 w-4" /></button>
                  </div>}
                  <AnimatePresence>{reward?.id === task.id && <motion.p key={reward.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="status" className="mt-3 rounded-xl bg-secondary px-3 py-2 text-xs font-medium">✦ {reward.text}</motion.p>}</AnimatePresence>
                </div>
              </motion.li>;
            })}
          </AnimatePresence>
        </ul>
      )}
    </MotionConfig>
  );
}
