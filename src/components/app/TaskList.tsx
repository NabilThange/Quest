'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { completeTask, deleteTask } from '@/app/actions/tasks';
import { LevelUpModal } from '@/components/ui/LevelUpModal';
import { ATTRIBUTE_COLORS, DIFFICULTY_COLORS } from '@/types';
import type { Task } from '@/types';
import { Trash2, CheckCircle2, Circle, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
}

export function TaskList({ tasks, emptyMessage = 'No tasks here yet.' }: TaskListProps) {
  const [completing, setCompleting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [levelUp, setLevelUp] = useState<{ show: boolean; level: number }>({ show: false, level: 1 });

  async function handleComplete(task: Task) {
    if (completing) return;
    setCompleting(task.id);
    const result = await completeTask(task.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`+${result.xpGained} XP  +${result.currencyGained} 💰`, { icon: '⚔️' });
      if (result.leveledUp) setLevelUp({ show: true, level: result.newLevel });
    }
    setCompleting(null);
  }

  async function handleDelete(taskId: string) {
    if (deleting) return;
    setDeleting(taskId);
    const result = await deleteTask(taskId);
    if (result.error) toast.error(result.error);
    setDeleting(null);
  }

  if (tasks.length === 0) {
    return (
      <div className="card text-center py-10 text-text-muted">
        <p className="text-4xl mb-3">📜</p>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <LevelUpModal show={levelUp.show} level={levelUp.level} onClose={() => setLevelUp({ show: false, level: 1 })} />
      <ul className="space-y-3" role="list">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={cn('card flex items-start gap-3 group transition-all duration-150', task.is_completed && task.type !== 'habit' && 'opacity-50')}>
                <button
                  onClick={() => handleComplete(task)}
                  disabled={completing === task.id || (task.is_completed && task.type !== 'habit')}
                  className="mt-0.5 flex-shrink-0 text-text-muted hover:text-brand-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 rounded"
                  aria-label={`Complete ${task.title}`}
                >
                  {completing === task.id ? (
                    <span className="animate-spin block w-5 h-5 text-center">◌</span>
                  ) : task.is_completed && task.type !== 'habit' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn('font-medium text-sm', task.is_completed && task.type !== 'habit' && 'line-through text-text-muted')}>
                    {task.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {task.attribute && (
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border', ATTRIBUTE_COLORS[task.attribute])}>
                        {task.attribute}
                      </span>
                    )}
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border capitalize', DIFFICULTY_COLORS[task.difficulty])}>
                      {task.difficulty}
                    </span>
                    {task.type === 'habit' && task.habit_streak > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-orange-400/30 bg-orange-400/10 text-orange-400 flex items-center gap-1">
                        <Flame className="w-3 h-3" />{task.habit_streak}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="text-xs text-text-muted">Due {task.due_date}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  disabled={deleting === task.id}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-text-muted hover:text-red-400 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400/50 rounded"
                  aria-label={`Delete ${task.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
