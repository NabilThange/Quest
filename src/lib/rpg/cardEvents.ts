import type { AttackCardDef } from './cardCatalog';

export interface CardDraftPayload {
  cards: AttackCardDef[];
  taskTitle: string;
  taskAttribute?: string | null;
}

type CardDraftListener = (payload: CardDraftPayload) => void;

const listeners = new Set<CardDraftListener>();

export function triggerCardDraft(payload: CardDraftPayload): void {
  for (const listener of listeners) {
    try {
      listener(payload);
    } catch {
      // Ignore listener errors
    }
  }

  // Also dispatch DOM event if in browser
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('quest:card-draft', { detail: payload }));
  }
}

export function subscribeCardDraft(listener: CardDraftListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
