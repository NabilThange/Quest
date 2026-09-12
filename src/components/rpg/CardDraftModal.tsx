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

const ELEMENT_INK_STYLES: Record<string, { badge: string; text: string; icon: any }> = {
  Water: {
    badge: 'bg-[#20639b]/15 text-[#0f3d63] border-[#185080]/30',
    text: 'text-[#0f3d63]',
    icon: Droplets,
  },
  Fire: {
    badge: 'bg-[#c84b31]/15 text-[#8b2500] border-[#a03018]/30',
    text: 'text-[#8b2500]',
    icon: Flame,
  },
  Electric: {
    badge: 'bg-[#d49a00]/15 text-[#7a5000] border-[#9e6b00]/30',
    text: 'text-[#7a5000]',
    icon: Zap,
  },
  Grass: {
    badge: 'bg-[#38761d]/15 text-[#1e4a10] border-[#2d6015]/30',
    text: 'text-[#1e4a10]',
    icon: Shield,
  },
  Earth: {
    badge: 'bg-[#795548]/15 text-[#4e342e] border-[#5d4037]/30',
    text: 'text-[#4e342e]',
    icon: Shield,
  },
  Psychic: {
    badge: 'bg-[#673ab7]/15 text-[#3f1f7d] border-[#53289e]/30',
    text: 'text-[#3f1f7d]',
    icon: Sparkles,
  },
  Normal: {
    badge: 'bg-[#607d8b]/15 text-[#37474f] border-[#455a64]/30',
    text: 'text-[#37474f]',
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

          {/* Cards 3-Column Grid using Authentic Paper UI Assets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
            {cards.map((card, idx) => {
              const ink = ELEMENT_INK_STYLES[card.element] ?? ELEMENT_INK_STYLES.Normal;
              const isSelected = selectedCardId === card.id;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => handlePick(card)}
                  style={{
                    backgroundImage: "url('/assets/paper/BackgroundSettingsMenu.png')",
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                  className={cn(
                    'relative flex flex-col justify-between p-7 sm:p-8 pt-9 pb-8 transition-all duration-200 cursor-pointer select-none text-left drop-shadow-xl font-serif',
                    isSelected && 'ring-4 ring-brand-gold scale-105 filter brightness-105'
                  )}
                >
                  {/* Top stamp row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border tracking-wide shadow-sm',
                        ink.badge
                      )}
                    >
                      <span>{card.icon}</span>
                      <span>{card.element}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-[#e4cfb6]/70 text-[#24140b] border border-[#b8956e]/40 shadow-sm">
                      +{card.charges} {card.charges === 1 ? 'Charge' : 'Charges'}
                    </span>
                  </div>

                  {/* Card Title & Category in Dark Antique Ink */}
                  <div className="space-y-1 mb-3">
                    <h3 className="text-xl font-bold font-serif text-[#24140b] tracking-tight leading-tight">
                      {card.name}
                    </h3>
                    <p className="text-[11px] font-serif uppercase tracking-wider text-[#7a5230] font-semibold">
                      {card.category}
                    </p>
                  </div>

                  {/* Power Stat Stamped Parchment Block */}
                  <div className="rounded-xl bg-[#e4cfb6]/50 border border-[#b8956e]/40 p-2.5 mb-3 flex items-center justify-between shadow-inner">
                    <span className="text-xs font-semibold text-[#5c4028]">Base Power</span>
                    <span className={cn('text-lg font-bold font-mono', ink.text)}>
                      {card.basePower} DMG
                    </span>
                  </div>

                  {/* Pros & Cons with Distinct Ink Colors */}
                  <div className="space-y-1.5 mb-5 flex-1">
                    <div className="text-xs text-[#145a27] leading-snug font-semibold">
                      {card.pro}
                    </div>
                    {card.con && (
                      <div className="text-xs text-[#8a1c14] leading-snug font-semibold">
                        {card.con}
                      </div>
                    )}
                    <p className="text-[11px] text-[#4a3525] leading-relaxed italic pt-1 border-t border-[#b8956e]/30 mt-2">
                      {card.description}
                    </p>
                  </div>

                  {/* Action CTA Button Styled like an Ink Stamp */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePick(card);
                    }}
                    className={cn(
                      'w-full py-2.5 px-4 rounded-xl text-sm font-serif font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md',
                      isSelected
                        ? 'bg-[#145a27] text-white'
                        : 'bg-[#24140b] text-[#fbf6ee] hover:bg-[#3d2314] active:scale-95'
                    )}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Claimed!</span>
                      </>
                    ) : (
                      <span>Select This Card</span>
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
