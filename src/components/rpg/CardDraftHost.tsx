'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CardDraftModal } from './CardDraftModal';
import { subscribeCardDraft, type CardDraftPayload } from '@/lib/rpg/cardEvents';
import type { AttackCardDef } from '@/lib/rpg/cardCatalog';

export function CardDraftHost() {
  const router = useRouter();
  const [draft, setDraft] = useState<CardDraftPayload | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeCardDraft((payload) => {
      setDraft(payload);
    });

    const handleCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent<CardDraftPayload>).detail;
      if (detail) setDraft(detail);
    };

    window.addEventListener('quest:card-draft', handleCustomEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('quest:card-draft', handleCustomEvent);
    };
  }, []);

  const handleSelectCard = (card: AttackCardDef) => {
    toast.success(`Acquired: ${card.name} (${card.element}) added to your Battle Deck!`, {
      icon: card.icon,
      duration: 4000,
    });
    setDraft(null);
    router.refresh();
  };

  const handleClose = () => {
    setDraft(null);
    router.refresh();
  };

  if (!draft) return null;

  return (
    <CardDraftModal
      isOpen={true}
      cards={draft.cards}
      taskTitle={draft.taskTitle}
      taskAttribute={draft.taskAttribute}
      onSelectCard={handleSelectCard}
      onClose={handleClose}
    />
  );
}
