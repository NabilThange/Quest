import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCardDraft, CARD_CATALOG } from './cardCatalog';
import { triggerCardDraft, subscribeCardDraft, type CardDraftPayload } from './cardEvents';

test('generateCardDraft returns 3 distinct attack cards with valid properties', () => {
  const cards = generateCardDraft({
    taskAttribute: 'Strength',
    companionType: 'Water',
  });

  assert.equal(cards.length, 3, 'Must produce exactly 3 drafted cards');
  const ids = new Set(cards.map((c) => c.id));
  assert.equal(ids.size, 3, 'All 3 drafted cards must have unique IDs');

  for (const card of cards) {
    assert.ok(card.name, 'Card must have a name');
    assert.ok(card.element, 'Card must have an element');
    assert.ok(card.category, 'Card must have a category');
    assert.ok(card.basePower > 0, 'Card basePower must be positive');
    assert.ok(card.pro, 'Card must have a pro feature description');
    assert.ok(card.charges >= 1, 'Card must grant at least 1 charge');
  }
});

test('generateCardDraft biases toward companion element for card 1', () => {
  const cards = generateCardDraft({
    companionType: 'Water',
    taskAttribute: 'Intellect',
  });

  // Card 1 should match water element
  assert.equal(cards[0].element, 'Water', 'First card should match companion element Water');
});

test('cardEvents triggers and notifies subscribers with draft payload', () => {
  let received: CardDraftPayload | null = null;
  const unsubscribe = subscribeCardDraft((payload) => {
    received = payload;
  });

  const payload: CardDraftPayload = {
    cards: generateCardDraft({ taskAttribute: 'Discipline' }),
    taskTitle: 'Finish daily workout',
    taskAttribute: 'Discipline',
  };

  triggerCardDraft(payload);
  assert.deepEqual(received, payload, 'Subscriber should receive triggered draft payload');

  // After unsubscribe, further triggers are ignored
  received = null;
  unsubscribe();
  triggerCardDraft(payload);
  assert.equal(received, null, 'Unsubscribed listener should not receive events');
});
