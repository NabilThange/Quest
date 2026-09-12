'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AttackCardDef } from '@/lib/rpg/cardCatalog';
import { playLevelUpSound, playNavSound } from '@/lib/sound';
import { cn } from '@/lib/utils';
import { Sparkles, Shield, Zap, Flame, Droplets, Wind, Check } from 'lucide-react';

interface CardDraftModalProps {
  isOpen: boolean;
  cards: AttackCardDef[];
  taskTitle: string;
  taskAttribute?: string | null;
  onSelectCard: (card: AttackCardDef) => void;
  onClose?: () => void;
}

const ELEMENT_STYLES: Record<string, { bg: string; border: string; badge: string; text: string; icon: any }> = {
  Water: {
    bg: 'bg-blue-950/40 hover:bg-blue-900/50',
    border: 'border-blue-500/40 hover:border-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    text: 'text-blue-400',
    icon: Droplets,
  },
  Fire: {
    bg: 'bg-red-950/40 hover:bg-red-900/50',
    border: 'border-red-500/40 hover:border-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    text: 'text-red-400',
    icon: Flame,
  },
  Electric: {
    bg: 'bg-amber-950/40 hover:bg-amber-900/50',
    border: 'border-amber-500/40 hover:border-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    text: 'text-amber-400',
    icon: Zap,
  },
  Grass: {
    bg: 'bg-emerald-950/40 hover:bg-emerald-900/50',
    border: 'border-emerald-500/40 hover:border-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    text: 'text-emerald-400',
    icon: Shield,
  },
  Earth: {
    bg: 'bg-stone-900/60 hover:bg-stone-800/70',
    border: 'border-stone-500/40 hover:border-stone-400',
    badge: 'bg-stone-500/20 text-stone-300 border-stone-500/30',
    text: 'text-stone-300',
    icon: Shield,
  },
  Psychic: {
    bg: 'bg-purple-950/40 hover:bg-purple-900/50',
    border: 'border-purple-500/40 hover:border-purple-400',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    text: 'text-purple-400',
    icon: Sparkles,
  },
  Normal: {
    bg: 'bg-zinc-900/60 hover:bg-zinc-800/70',
    border: 'border-zinc-500/40 hover:border-zinc-400',
    badge: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
    text: 'text-zinc-300',
    icon: Wind,
  },
};

export function CardDraftModal({
  isOpen,
  cards,
  taskTitle,
  taskAttribute,
  onSelectCard,
  onClose,
}: CardDraftModalProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);

  if (!isOpen || cards.length === 0) return null;

  const handlePick = (card: AttackCardDef) => {
    if (isClaimed) return;
    setSelectedCardId(card.id);
    setIsClaimed(true);
    playLevelUpSound();

    setTimeout(() => {
      onSelectCard(card);
      setIsClaimed(false);
      setSelectedCardId(null);
    }, 450);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 my-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quest Conquered · Card Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
              Choose Your Move Card
            </h2>
            <p className="text-sm text-text-secondary max-w-lg mx-auto">
              Your real-life effort on <span className="font-semibold text-text-primary">"{taskTitle}"</span>{' '}
              {taskAttribute && <span className="text-brand-cyan">({taskAttribute})</span>} forged three tactical
              combat techniques. Pick one to add to your battle deck.
            </p>
          </div>

          {/* Cards 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
            {cards.map((card, idx) => {
              const style = ELEMENT_STYLES[card.element] ?? ELEMENT_STYLES.Normal;
              const isSelected = selectedCardId === card.id;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => handlePick(card)}
                  className={cn(
                    'relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 cursor-pointer select-none text-left',
                    style.bg,
                    style.border,
                    isSelected && 'ring-2 ring-foreground scale-105 shadow-xl bg-card'
                  )}
                >
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border',
                        style.badge
                      )}
                    >
                      <span>{card.icon}</span>
                      <span>{card.element}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-xs font-mono bg-secondary text-text-secondary border border-border">
                      +{card.charges} {card.charges === 1 ? 'Charge' : 'Charges'}
                    </span>
                  </div>

                  {/* Card Title & Category */}
                  <div className="space-y-1 mb-4">
                    <h3 className="text-lg font-bold text-foreground">{card.name}</h3>
                    <p className="text-xs text-text-muted font-medium">{card.category}</p>
                  </div>

                  {/* Power Stat */}
                  <div className="rounded-xl bg-background/60 border border-border/50 p-3 mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-text-secondary">Base Power</span>
                    <span className={cn('text-lg font-bold font-mono', style.text)}>
                      {card.basePower} DMG
                    </span>
                  </div>

                  {/* Pros & Cons */}
                  <div className="space-y-2 mb-5 flex-1">
                    <div className="text-xs text-emerald-400 leading-snug font-medium">
                      {card.pro}
                    </div>
                    {card.con && (
                      <div className="text-xs text-amber-400/90 leading-snug font-medium">
                        {card.con}
                      </div>
                    )}
                    <p className="text-[11px] text-text-muted leading-relaxed italic pt-1">
                      {card.description}
                    </p>
                  </div>

                  {/* Action CTA */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePick(card);
                    }}
                    className={cn(
                      'w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors',
                      isSelected
                        ? 'bg-foreground text-background'
                        : 'bg-secondary text-text-primary hover:bg-foreground hover:text-background'
                    )}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Claimed!</span>
                      </>
                    ) : (
                      <span>Select Card</span>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="text-center pt-2">
            <p className="text-xs text-text-muted">
              Move cards can be deployed in the <span className="text-text-secondary font-medium">Battle Arena</span> against wild creatures.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
