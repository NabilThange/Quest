import { getLevelTitle } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LevelBadge({ level, className, size = 'md' }: LevelBadgeProps) {
  const title = getLevelTitle(level);

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        'bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan',
        sizes[size],
        className
      )}
    >
      <span className="font-mono">Lv.{level}</span>
      <span className="text-text-secondary font-normal">{title}</span>
    </span>
  );
}
