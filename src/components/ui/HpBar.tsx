'use client';

import { motion } from 'framer-motion';
import { getHpColor } from '@/lib/utils';

interface HpBarProps {
  hp: number;
  maxHp: number;
  showLabel?: boolean;
  className?: string;
}

export function HpBar({ hp, maxHp, showLabel = true, className = '' }: HpBarProps) {
  const pct = Math.min((hp / maxHp) * 100, 100);
  const colorClass = getHpColor(hp, maxHp);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>HP</span>
          <span className="font-mono">
            {hp} / {maxHp}
          </span>
        </div>
      )}
      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden border border-border">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
