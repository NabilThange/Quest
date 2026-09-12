import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function getXpProgress(xp: number, level: number): number {
  const needed = Math.round(100 * Math.pow(level, 1.5));
  return Math.min((xp / needed) * 100, 100);
}

export function xpToNextLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5));
}

export function getLevelTitle(level: number): string {
  if (level < 5) return 'Novice';
  if (level < 10) return 'Apprentice';
  if (level < 20) return 'Journeyman';
  if (level < 35) return 'Expert';
  if (level < 50) return 'Master';
  return 'Grandmaster';
}

export function getHpColor(hp: number, maxHp: number): string {
  const pct = (hp / maxHp) * 100;
  if (pct > 60) return 'bg-green-500';
  if (pct > 30) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}
