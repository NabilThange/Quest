'use client';

import { useState } from 'react';
import type { Species } from '@/types/rpg';

const colors = {
  Strength: 'bg-[#edd2bd] text-[#793d27]',
  Intellect: 'bg-[#cedde3] text-[#285269]',
  Discipline: 'bg-[#d6dfc3] text-[#415730]',
  Creativity: 'bg-[#e1d4e5] text-[#65466f]',
};
const symbols = { Strength: '✦', Intellect: 'ϟ', Discipline: '❧', Creativity: '✧' };

export function CreatureSprite({ species, silhouette = false, size = 'large' }: {
  species: Species; silhouette?: boolean; size?: 'small' | 'large';
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const label = silhouette ? 'Unidentified creature silhouette' : species.name;
  return (
    <div className={`creature-sprite ${size === 'large' ? 'h-24 w-24 sm:h-36 sm:w-36' : 'h-16 w-16'} ${silhouette ? 'bg-secondary text-muted-foreground' : colors[species.elemental_type]}`}>
      {species.sprite_url && failed !== species.sprite_url ? (
        // URLs are catalog data; native images allow later art swaps without Next host configuration.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={species.sprite_url} alt={label} onError={() => setFailed(species.sprite_url)}
          className={`h-full w-full object-contain p-2 ${silhouette ? 'brightness-0 opacity-40' : ''}`} />
      ) : (
        <span role="img" aria-label={label} className="flex flex-col items-center">
          <span aria-hidden="true" className={size === 'large' ? 'text-5xl' : 'text-2xl'}>{silhouette ? '?' : symbols[species.elemental_type]}</span>
          {!silhouette && <span aria-hidden="true" className="mt-1 text-xs font-semibold tracking-[0.2em]">{species.name.slice(0, 1)}</span>}
        </span>
      )}
    </div>
  );
}
