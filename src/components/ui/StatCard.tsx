import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  className?: string;
}

export function StatCard({ label, value, icon, color = 'text-brand-cyan', className }: StatCardProps) {
  return (
    <div className={cn('card flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2 text-text-secondary text-xs">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <div className={cn('text-2xl font-bold font-mono', color)}>{value}</div>
    </div>
  );
}
