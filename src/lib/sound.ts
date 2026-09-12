/**
 * Life RPG Sound Engine
 * Handles tactile sound effects (SFX) with pooling, volume balancing, and mute support.
 */

const AUDIO_CACHE = new Map<string, HTMLAudioElement>();

function getAudio(src: string): HTMLAudioElement {
  let audio = AUDIO_CACHE.get(src);
  if (!audio) {
    audio = new Audio(src);
    audio.preload = 'auto';
    AUDIO_CACHE.set(src, audio);
  }
  return audio;
}

export function isAudioMuted(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('life_rpg_audio_muted') === 'true';
}

export function playSfx(src: string, volume = 0.4): void {
  if (typeof window === 'undefined') return;
  if (isAudioMuted()) return;

  try {
    // Clone or reuse audio instance so rapid triggers can overlap cleanly
    const audio = getAudio(src);
    const sound = audio.cloneNode() as HTMLAudioElement;
    sound.volume = Math.max(0, Math.min(1, volume));
    const promise = sound.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Autoplay policy or media interrupted
      });
    }
  } catch {
    // Graceful fallback if Web Audio is unsupported
  }
}

/** Navigation & UI click */
export function playNavSound(): void {
  playSfx('/assets/audio/sfx/nav.mp3', 0.25);
}

/** Quest / to-do completion */
export function playQuestCompleteSound(): void {
  playSfx('/assets/audio/sfx/quest-complete.mp3', 0.45);
}

/** Coin / gold drop */
export function playCoinSound(): void {
  playSfx('/assets/audio/sfx/coin.wav', 0.35);
}

/** Player or companion level up */
export function playLevelUpSound(): void {
  playSfx('/assets/audio/sfx/level-up.mp3', 0.5);
}

/** Attack moves based on species move name or element attribute */
export function playAttackSound(moveNameOrType?: string): void {
  if (!moveNameOrType) {
    playSfx('/assets/audio/sfx/attack-slash.mp3', 0.4);
    return;
  }

  const query = moveNameOrType.toLowerCase();

  if (query.includes('shock') || query.includes('overload') || query.includes('intellect') || query.includes('thunder')) {
    playSfx('/assets/audio/sfx/attack-thunder.wav', 0.45);
  } else if (query.includes('quake') || query.includes('guard break') || query.includes('discipline') || query.includes('earth')) {
    playSfx('/assets/audio/sfx/attack-earth.wav', 0.45);
  } else if (query.includes('confuse') || query.includes('flash') || query.includes('creativity') || query.includes('wind')) {
    playSfx('/assets/audio/sfx/attack-wind.wav', 0.4);
  } else if (query.includes('energy') || query.includes('charge')) {
    playSfx('/assets/audio/sfx/attack-charge.wav', 0.4);
  } else {
    // Tackle, Slam, Strength, physical
    playSfx('/assets/audio/sfx/attack-slash.mp3', 0.4);
  }
}

/** Counter damage / player hit */
export function playDamageSound(): void {
  playSfx('/assets/audio/sfx/damage.mp3', 0.4);
}

/** Wild encounter defeated / captured + announcer voiceover */
export function playVictorySound(): void {
  playSfx('/assets/audio/sfx/enemy-death.wav', 0.45);
  setTimeout(() => {
    playSfx('/assets/audio/sfx/you-win.ogg', 0.55);
  }, 450);
}

/** Rest at lodge / healed */
export function playHealSound(): void {
  playSfx('/assets/audio/sfx/heal.mp3', 0.4);
}

/** Shop item purchase */
export function playShopSound(): void {
  playSfx('/assets/audio/sfx/shop-buy.wav', 0.4);
}
