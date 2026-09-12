'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControllerProps {
  play: boolean;
  src?: string;
}

export function AudioController({ play, src = '/assets/audio/battle-music.ogg' }: AudioControllerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('life_rpg_audio_muted');
    if (saved !== null) {
      setMuted(saved === 'true');
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.2;

    if (play && !muted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser prevented autoplay before user interaction
        });
      }
    } else {
      audio.pause();
    }
  }, [play, muted]);

  const toggleMute = () => {
    setHasInteracted(true);
    const nextMuted = !muted;
    setMuted(nextMuted);
    localStorage.setItem('life_rpg_audio_muted', String(nextMuted));
    const audio = audioRef.current;
    if (!audio) return;
    if (nextMuted) {
      audio.pause();
    } else if (play) {
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="flex items-center">
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        type="button"
        onClick={toggleMute}
        title={muted ? 'Unmute music' : 'Mute music'}
        aria-label={muted ? 'Unmute music' : 'Mute music'}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
      >
        {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-brand-gold animate-pulse" />}
        <span className="font-mono">{muted ? 'Muted' : 'Music On'}</span>
      </button>
    </div>
  );
}
