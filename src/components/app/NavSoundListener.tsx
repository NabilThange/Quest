'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { playNavSound } from '@/lib/sound';

export function NavSoundListener() {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    playNavSound();
  }, [pathname]);

  return null;
}
