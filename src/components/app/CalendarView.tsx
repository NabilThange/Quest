'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart); // 0=Sun

  function tasksForDay(day: Date) {
    return tasks.filter((t) => {
      if (t.type === 'daily') return true;
      if (t.due_date) return isSameDay(new Date(t.due_date), day);
      return false;
    });
  }

  const selectedTasks = selected ? tasksForDay(selected) : [];

  return (
    <div className="space-y-6">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrent(subMonths(current, 1))} className="btn-secondary p-2" aria-label="Previous month">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="font-semibold text-lg">{format(current, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrent(addMonths(current, 1))} className="btn-secondary p-2" aria-label="Next month">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      <div className="card-elevated">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs text-text-muted py-2 font-medium">{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding cells */}
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => {
            const dayTasks = tasksForDay(day);
            const isSelected = selected && isSameDay(day, selected);
            const today = isToday(day);
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelected(day)}
                className={cn(
                  'relative flex flex-col items-center p-1.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-cyan/50',
                  isSelected && 'bg-brand-cyan/20 border border-brand-cyan/40',
                  today && !isSelected && 'border border-brand-cyan/20',
                  !isSelected && !today && 'hover:bg-bg-elevated'
                )}
                aria-label={format(day, 'MMMM d, yyyy')}
                aria-pressed={!!isSelected}
              >
                <span className={cn('font-mono', today && 'text-brand-cyan font-bold')}>
                  {format(day, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {dayTasks.slice(0, 3).map((t, i) => (
                      <div
                        key={i}
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          t.is_completed ? 'bg-green-400' : 'bg-brand-cyan'
                        )}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      {selected && (
        <div>
          <h3 className="font-semibold mb-3">{format(selected, 'EEEE, MMMM d')}</h3>
          {selectedTasks.length === 0 ? (
            <div className="card text-center py-8 text-text-muted">No tasks for this day.</div>
          ) : (
            <ul className="space-y-2">
              {selectedTasks.map((task) => (
                <li key={task.id} className="card flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', task.is_completed ? 'bg-green-400' : 'bg-brand-cyan')} />
                  <span className={cn('text-sm', task.is_completed && 'line-through text-text-muted')}>{task.title}</span>
                  <span className="ml-auto text-xs text-text-muted capitalize">{task.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
