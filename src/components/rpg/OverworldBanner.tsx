'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

interface OverworldBannerProps {
  completedTasks: number;
  totalTasks: number;
  streakCount: number;
}

export function OverworldBanner({ completedTasks, totalTasks, streakCount }: OverworldBannerProps) {
  const reduced = useReducedMotion();
  const safeTotal = Math.max(1, totalTasks);
  const progressPercent = Math.min(100, Math.max(0, Math.round((completedTasks / safeTotal) * 100)));
  const isAllDone = totalTasks > 0 && completedTasks >= totalTasks;
  const hasStreak = streakCount > 0;

  // The avatar walks from 8% (lodge doorway) to 88% (milestone chest)
  const avatarLeft = 8 + (progressPercent / 100) * 80;

  return (
    <section
      aria-label="Daily quest progress journey"
      className="relative isolate overflow-hidden rounded-3xl border border-border bg-[#d6dfc3]/30 dark:bg-card p-4 sm:p-6 select-none shadow-sm"
    >
      {/* Sky to Grass gradient ambience */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#cedde3]/40 via-transparent to-[#d6dfc3]/40 dark:from-card/60 dark:to-card pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-text-secondary">
            Today’s Journey
          </span>
          <span className="rounded-full bg-card border border-border px-2.5 py-0.5 font-mono text-[11px]">
            {completedTasks} / {totalTasks} Quests ({progressPercent}%)
          </span>
        </div>
        {hasStreak && (
          <div className="flex items-center gap-1.5 rounded-full bg-[#edd2bd]/60 dark:bg-[#793d27]/40 border border-[#793d27]/20 px-3 py-0.5 text-xs text-[#793d27] dark:text-[#edd2bd]">
            <img
              src="/assets/avatar/char1_shield_front.png"
              alt=""
              className="w-3.5 h-3.5 pixel-art"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="font-medium">Streak Guard Active ({streakCount}d)</span>
          </div>
        )}
      </div>

      {/* Overworld Stage */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden rounded-2xl border border-border/60 bg-[#a3b88c]/25 dark:bg-secondary/40">
        {/* Repeating path strip at the bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 border-t border-border/40 opacity-85"
          style={{
            backgroundImage: 'url(/assets/world/path.png)',
            backgroundRepeat: 'repeat-x',
            backgroundSize: '32px 32px',
            imageRendering: 'pixelated',
          }}
        />

        {/* Left Landmark: Starting Lodge */}
        <div className="absolute bottom-4 left-2 sm:left-4 z-10 flex flex-col items-center">
          <img
            src="/assets/world/house_lodge.png"
            alt="Lodge"
            className="h-14 sm:h-16 w-auto pixel-art drop-shadow-sm"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-[10px] font-mono text-text-secondary mt-0.5">Lodge</span>
        </div>

        {/* Scenery Decorations along the path */}
        <div className="absolute bottom-5 left-[28%] z-0 opacity-85 pointer-events-none">
          <img
            src="/assets/world/bush.png"
            alt=""
            className="h-6 w-auto pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="absolute bottom-6 left-[45%] z-0 opacity-80 pointer-events-none hidden sm:block">
          <img
            src="/assets/world/flower_pink.png"
            alt=""
            className="h-4 w-auto pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="absolute bottom-5 left-[62%] z-0 opacity-85 pointer-events-none">
          <img
            src="/assets/world/rock.png"
            alt=""
            className="h-5 w-auto pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Right Landmark: Milestone Treasure Chest */}
        <div className="absolute bottom-4 right-3 sm:right-6 z-10 flex flex-col items-center">
          <img
            src={isAllDone ? '/assets/world/chest_open.png' : '/assets/world/chest_closed.png'}
            alt="Treasure Chest"
            className={`h-8 sm:h-9 w-auto pixel-art transition-transform ${isAllDone ? 'scale-110' : ''}`}
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-[10px] font-mono text-text-secondary mt-1">
            {isAllDone ? 'Goal Reached!' : 'Goal Chest'}
          </span>
        </div>

        {/* Dynamic Avatar Traveler */}
        <motion.div
          className="absolute bottom-6 z-20 -translate-x-1/2 flex flex-col items-center"
          initial={false}
          animate={{ left: `${avatarLeft}%` }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 85, damping: 18 }}
        >
          {/* Active quest exclamation mark if not yet finished */}
          {!isAllDone && (
            <motion.img
              src="/assets/world/quest.png"
              alt=""
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="w-3.5 h-3.5 mb-0.5 pixel-art"
              style={{ imageRendering: 'pixelated' }}
            />
          )}

          {/* Hero Sprite: Shield when streak > 0, otherwise standard front idle */}
          <img
            src={hasStreak ? '/assets/avatar/char1_shield_front.png' : '/assets/avatar/char1_front.png'}
            alt="Hero Avatar"
            className="h-8 sm:h-9 w-auto pixel-art drop-shadow-md"
            style={{ imageRendering: 'pixelated' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
