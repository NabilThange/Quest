export interface AttackCardDef {
  id: string;
  name: string;
  element: 'Water' | 'Fire' | 'Grass' | 'Electric' | 'Earth' | 'Psychic' | 'Normal';
  attribute: 'Strength' | 'Intellect' | 'Discipline' | 'Creativity' | 'Energy';
  basePower: number;
  icon: string;
  charges: number;
  category: 'Physical Strike' | 'Special Ray' | 'Tactical Guard' | 'Swift Flurry';
  pro: string;
  con?: string;
  description: string;
}

export const CARD_CATALOG: AttackCardDef[] = [
  // ─── Water Moves ────────────────────────────────────────────────────────────
  {
    id: 'aqua_jet',
    name: 'Aqua Jet',
    element: 'Water',
    attribute: 'Creativity',
    basePower: 20,
    icon: '🌊',
    charges: 2,
    category: 'Swift Flurry',
    pro: '✦ Swift Priority: Grants 2 card charges upon selection',
    description: 'A high-speed torrent that strikes before the enemy can react.',
  },
  {
    id: 'hydro_cannon',
    name: 'Hydro Cannon',
    element: 'Water',
    attribute: 'Strength',
    basePower: 36,
    icon: '💧',
    charges: 1,
    category: 'Special Ray',
    pro: '✦ Colossal Torrent: Deals massive Water burst damage',
    con: '⚠ Recoil: Takes +2 chip damage from opponent retaliation',
    description: 'Unleashes a devastating deluge with overwhelming pressure.',
  },
  {
    id: 'bubble_shield',
    name: 'Bubble Shield',
    element: 'Water',
    attribute: 'Discipline',
    basePower: 15,
    icon: '🫧',
    charges: 1,
    category: 'Tactical Guard',
    pro: '✦ Iron Shell: Halves counter-damage received this turn',
    description: 'Envelops your companion in a pressurized sphere of resilient foam.',
  },
  {
    id: 'tidal_wave',
    name: 'Tidal Wave',
    element: 'Water',
    attribute: 'Intellect',
    basePower: 28,
    icon: '🌊',
    charges: 1,
    category: 'Physical Strike',
    pro: '✦ Elemental Advantage: Deals 1.5× damage vs Strength enemies',
    description: 'Rears up a massive crest of water to batter the opponent.',
  },

  // ─── Fire / Strength Moves ──────────────────────────────────────────────────
  {
    id: 'flame_fang',
    name: 'Flame Fang',
    element: 'Fire',
    attribute: 'Strength',
    basePower: 25,
    icon: '🔥',
    charges: 1,
    category: 'Physical Strike',
    pro: '✦ Critical Edge: +25% increased critical strike chance',
    description: 'Bites with jaws cloaked in searing, focused dragonfire.',
  },
  {
    id: 'blaze_impact',
    name: 'Blaze Impact',
    element: 'Fire',
    attribute: 'Strength',
    basePower: 35,
    icon: '💥',
    charges: 1,
    category: 'Physical Strike',
    pro: '✦ Overpowering Force: Maximum base damage output',
    con: '⚠ Heavy Recoil: Takes +2 chip damage on counter',
    description: 'Throws full body weight forward into a blazing explosive crash.',
  },
  {
    id: 'ember_swipe',
    name: 'Ember Swipe',
    element: 'Fire',
    attribute: 'Creativity',
    basePower: 18,
    icon: '✨',
    charges: 2,
    category: 'Swift Flurry',
    pro: '✦ Fast Claws: Grants 2 card charges upon selection',
    description: 'Slashes in quick succession, leaving trails of glowing embers.',
  },
  {
    id: 'molten_guard',
    name: 'Molten Guard',
    element: 'Fire',
    attribute: 'Discipline',
    basePower: 16,
    icon: '🛡️',
    charges: 1,
    category: 'Tactical Guard',
    pro: '✦ Fire Ward: Reduces incoming counter-damage by 50%',
    description: 'Raises a wall of molten heat to deter physical counter-attacks.',
  },

  // ─── Electric / Intellect Moves ─────────────────────────────────────────────
  {
    id: 'thunder_shock',
    name: 'Thunder Shock',
    element: 'Electric',
    attribute: 'Intellect',
    basePower: 24,
    icon: '⚡',
    charges: 1,
    category: 'Special Ray',
    pro: '✦ Arc Pierce: Bypasses opponent elemental resistance',
    description: 'Channels concentrated static voltage directly into enemy weak points.',
  },
  {
    id: 'overcharge',
    name: 'Overcharge',
    element: 'Electric',
    attribute: 'Intellect',
    basePower: 36,
    icon: 'ϟ',
    charges: 1,
    category: 'Special Ray',
    pro: '✦ Superconductive Burst: Highest single-target special power',
    con: '⚠ Voltage Drain: Companion takes 2 HP feedback shock',
    description: 'Discharges the companion’s entire capacitor in one blinding flash.',
  },
  {
    id: 'volt_dart',
    name: 'Volt Dart',
    element: 'Electric',
    attribute: 'Creativity',
    basePower: 17,
    icon: '⚡',
    charges: 2,
    category: 'Swift Flurry',
    pro: '✦ High Frequency: Grants 2 card charges upon selection',
    description: 'Fires pinpoint electrical needles with rapid-fire speed.',
  },
  {
    id: 'plasma_ward',
    name: 'Plasma Ward',
    element: 'Electric',
    attribute: 'Discipline',
    basePower: 14,
    icon: '🌐',
    charges: 1,
    category: 'Tactical Guard',
    pro: '✦ Stun Disruption: Absorbs 50% counter damage',
    description: 'Forms an ionized magnetic barrier that dampens retaliation.',
  },

  // ─── Grass & Earth / Discipline Moves ────────────────────────────────────────
  {
    id: 'vine_whip',
    name: 'Vine Whip',
    element: 'Grass',
    attribute: 'Discipline',
    basePower: 22,
    icon: '🍃',
    charges: 1,
    category: 'Physical Strike',
    pro: '✦ Life Sap: Restores +2 HP to your companion on hit',
    description: 'Slender, thorned tendrils whip forward and siphon vitality.',
  },
  {
    id: 'root_quake',
    name: 'Root Quake',
    element: 'Earth',
    attribute: 'Discipline',
    basePower: 32,
    icon: '🌿',
    charges: 1,
    category: 'Physical Strike',
    pro: '✦ Earth Shatter: +40% bonus damage against Electric foes',
    description: 'Summons subterranean roots that rupture the earth beneath the enemy.',
  },
  {
    id: 'spore_burst',
    name: 'Spore Burst',
    element: 'Grass',
    attribute: 'Creativity',
    basePower: 18,
    icon: '🍄',
    charges: 2,
    category: 'Swift Flurry',
    pro: '✦ Spore Cloud: Grants 2 card charges upon selection',
    description: 'Releases a blossoming cloud of irritating pollen.',
  },
  {
    id: 'shell_bastion',
    name: 'Shell Bastion',
    element: 'Earth',
    attribute: 'Discipline',
    basePower: 12,
    icon: '🌰',
    charges: 1,
    category: 'Tactical Guard',
    pro: '✦ Hardened Aegis: Reduces opponent counter damage by 70%',
    description: 'Withdraws into petrified bark armor to withstand brutal blows.',
  },

  // ─── Psychic & Wind / Creativity Moves ──────────────────────────────────────
  {
    id: 'mind_warp',
    name: 'Mind Warp',
    element: 'Psychic',
    attribute: 'Creativity',
    basePower: 26,
    icon: '🔮',
    charges: 1,
    category: 'Special Ray',
    pro: '✦ Confusion: Disorients opponent counter-attack damage',
    description: 'Distorts space-time perception to leave the target reeling.',
  },
  {
    id: 'prism_beam',
    name: 'Prism Beam',
    element: 'Psychic',
    attribute: 'Intellect',
    basePower: 33,
    icon: '🌈',
    charges: 1,
    category: 'Special Ray',
    pro: '✦ Spectral Radiance: High damage with variable color flare',
    description: 'Refracts light into a concentrated laser of rainbow energy.',
  },
  {
    id: 'gale_flurry',
    name: 'Gale Flurry',
    element: 'Normal',
    attribute: 'Creativity',
    basePower: 19,
    icon: '💨',
    charges: 2,
    category: 'Swift Flurry',
    pro: '✦ Tailwind Momentum: Grants 2 card charges upon selection',
    description: 'Generates swirling localized squalls that buff your battle rhythm.',
  },
  {
    id: 'mirage_veil',
    name: 'Mirage Veil',
    element: 'Psychic',
    attribute: 'Discipline',
    basePower: 15,
    icon: '👁️',
    charges: 1,
    category: 'Tactical Guard',
    pro: '✦ Phantom Form: 50% chance opponent counter misses entirely',
    description: 'Leaves a flickering holographic double while slipping into shadow.',
  },
];

/**
 * Generate 3 distinct, compelling cards tailored to companion element and task attribute.
 */
export function generateCardDraft(options: {
  companionType?: string | null;
  taskAttribute?: string | null;
}): AttackCardDef[] {
  const comp = (options.companionType ?? 'Strength').toLowerCase();
  const task = (options.taskAttribute ?? 'Energy').toLowerCase();

  // Normalize mapping for companion element
  let compElement: AttackCardDef['element'] = 'Fire';
  if (comp.includes('water') || comp.includes('aqu')) compElement = 'Water';
  else if (comp.includes('intellect') || comp.includes('volt') || comp.includes('elec')) compElement = 'Electric';
  else if (comp.includes('discipline') || comp.includes('moss') || comp.includes('grass')) compElement = 'Grass';
  else if (comp.includes('creativity') || comp.includes('prism') || comp.includes('psychic')) compElement = 'Psychic';
  else compElement = 'Fire';

  // 1. Companion element match
  const compPool = CARD_CATALOG.filter((c) => c.element === compElement);
  const card1 = compPool[Math.floor(Math.random() * compPool.length)] || CARD_CATALOG[0];

  // 2. Task attribute match (e.g. Strength task gets heavy strike, Intellect gets ray, Discipline gets guard)
  let taskPool = CARD_CATALOG.filter((c) => {
    if (c.id === card1.id) return false;
    if (task.includes('strength')) return c.attribute === 'Strength' || c.category === 'Physical Strike';
    if (task.includes('intellect')) return c.attribute === 'Intellect' || c.category === 'Special Ray';
    if (task.includes('discipline')) return c.attribute === 'Discipline' || c.category === 'Tactical Guard';
    if (task.includes('creativity')) return c.attribute === 'Creativity' || c.category === 'Swift Flurry';
    return true;
  });
  if (taskPool.length === 0) taskPool = CARD_CATALOG.filter((c) => c.id !== card1.id);
  const card2 = taskPool[Math.floor(Math.random() * taskPool.length)] || CARD_CATALOG[1];

  // 3. Tactical / Wildcard pick (Shield/Guard or Swift multi-charge)
  let tacticalPool = CARD_CATALOG.filter(
    (c) => c.id !== card1.id && c.id !== card2.id && (c.charges > 1 || c.category === 'Tactical Guard')
  );
  if (tacticalPool.length === 0) {
    tacticalPool = CARD_CATALOG.filter((c) => c.id !== card1.id && c.id !== card2.id);
  }
  const card3 = tacticalPool[Math.floor(Math.random() * tacticalPool.length)] || CARD_CATALOG[2];

  return [card1, card2, card3];
}
