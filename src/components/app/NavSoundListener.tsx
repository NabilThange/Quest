'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { playNavSound, preloadCriticalSfx } from '@/lib/sound';

export function NavSoundListener() {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      preloadCriticalSfx(); // warm up Audio objects so first sound has no latency
      return;
    }
    playNavSound();
  }, [pathname]);

  return null;
}
