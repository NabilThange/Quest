'use client';

import { useState, useMemo } from 'react';
import type { Task, TaskType } from '@/types';
import { TaskList } from '@/components/app/TaskList';
import { AddTaskForm } from '@/components/app/AddTaskForm';
import { cn, getTodayString } from '@/lib/utils';
import { playNavSound } from '@/lib/sound';
import Link from 'next/link';

interface QuestTabsProps {
  tasks: Task[];
}

type TabType = 'all' | TaskType;

export function QuestTabs({ tasks }: QuestTabsProps) {
  const [tab, setTab] = useState<TabType>('all');
  const today = getTodayString();

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.type === 'todo').length,
      daily: tasks.filter((t) => t.type === 'daily').length,
      habit: tasks.filter((t) => t.type === 'habit').length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (tab === 'all') return tasks;
    return tasks.filter((t) => t.type === tab);
  }, [tasks, tab]);

  const { active, completed } = useMemo(() => {
    const act: Task[] = [];
    const comp: Task[] = [];

    for (const task of filteredTasks) {
      const earnedToday = task.last_rewarded_at?.slice(0, 10) === today;
      const isDone = task.type === 'todo' ? task.is_completed : (task.is_completed || earnedToday);

      if (isDone) {
        comp.push(task);
      } else {
        act.push(task);
      }
    }

    return { active: act, completed: comp };
  }, [filteredTasks, today]);

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'todo', label: 'To-Dos', count: counts.todo },
    { id: 'daily', label: 'Dailies', count: counts.daily },
    { id: 'habit', label: 'Habits', count: counts.habit },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        {tabs.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                if (tab !== t.id) playNavSound();
                setTab(t.id);
              }}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-foreground text-background'
                  : 'text-text-secondary hover:text-text-primary hover:bg-secondary'
              )}
            >
              <span>{t.label}</span>
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  isActive ? 'bg-background/20 text-background' : 'bg-secondary text-text-muted'
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add Task Form with contextual defaultType */}
      <AddTaskForm defaultType={tab === 'all' ? 'todo' : tab} />

      {/* AI Coach banner — contextual quick entry point */}
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

      {/* Active Tasks */}
      <section aria-label="Active quests">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Active ({active.length})
        </h2>
        <TaskList
          tasks={active}
          emptyMessage={
            tab === 'all'
              ? 'No active quests. Add one above or generate some with the AI Habit Coach!'
              : `No active ${tab} quests found.`
          }
        />
      </section>

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <section aria-label="Completed quests">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Completed ({completed.length})
          </h2>
          <TaskList tasks={completed} />
        </section>
      )}
    </div>
  );
}
