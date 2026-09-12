'use client';

import { motion } from 'framer-motion';
import { xpToNextLevel } from '@/lib/utils';

interface XpBarProps {
  xp: number;
  level: number;
  showLabel?: boolean;
  className?: string;
}

export function XpBar({ xp, level, showLabel = true, className = '' }: XpBarProps) {
  const needed = xpToNextLevel(level);
  const pct = Math.min((xp / needed) * 100, 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>XP</span>
          <span className="font-mono">
            {xp} / {needed}
          </span>
        </div>
      )}
      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden border border-border">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
