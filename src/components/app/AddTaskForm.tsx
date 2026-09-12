'use client';

import { useState } from 'react';
import { createTask } from '@/app/actions/tasks';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TaskType, Difficulty, Attribute } from '@/types';

interface AddTaskFormProps {
  defaultType?: TaskType;
}

export function AddTaskForm({ defaultType = 'todo' }: AddTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>(defaultType);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [attribute, setAttribute] = useState<Attribute | ''>('');
  const [dueDate, setDueDate] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const result = await createTask({
      title: title.trim(),
      type,
      difficulty,
      attribute: attribute || undefined,
      due_date: dueDate || undefined,
    });
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Quest added! ⚔️');
      setTitle('');
      setDueDate('');
      setOpen(false);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary w-full flex items-center justify-center gap-2" aria-label="Add new task">
        <Plus className="w-4 h-4" /> Add quest
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-elevated space-y-4" aria-label="Add task form">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">New Quest</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div>
        <label htmlFor="task-title" className="label">Quest title</label>
        <input id="task-title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="e.g. Read for 30 minutes" autoFocus />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-type" className="label">Type</label>
          <select id="task-type" value={type} onChange={(e) => setType(e.target.value as TaskType)} className="input">
            <option value="todo">Todo</option>
            <option value="daily">Daily</option>
            <option value="habit">Habit</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-difficulty" className="label">Difficulty</label>
          <select id="task-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="input">
            <option value="easy">Easy (+10 XP)</option>
            <option value="medium">Medium (+20 XP)</option>
            <option value="hard">Hard (+30 XP)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-attribute" className="label">Attribute</label>
          <select id="task-attribute" value={attribute} onChange={(e) => setAttribute(e.target.value as Attribute | '')} className="input">
            <option value="">None</option>
            <option value="Strength">⚔️ Strength</option>
            <option value="Intellect">📚 Intellect</option>
            <option value="Discipline">🛡️ Discipline</option>
            <option value="Creativity">✨ Creativity</option>
          </select>
        </div>
        {type === 'todo' && (
          <div>
            <label htmlFor="task-due" className="label">Due date</label>
            <input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Adding...' : 'Add quest'}</button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
