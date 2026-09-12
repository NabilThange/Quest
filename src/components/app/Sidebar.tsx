'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Calendar,
  ShoppingBag,
  Trophy,
  User,
  LogOut,
  Sword,
  BookOpen,
  PawPrint,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { XpBar } from '@/components/ui/XpBar';
import { HpBar } from '@/components/ui/HpBar';
import { signOut } from '@/app/actions/auth';
import type { User as UserProfile } from '@/types';

const navItems = [
  { href: '/app', label: 'Lodge', icon: LayoutDashboard, exact: true },
  { href: '/app/todos', label: 'Quests', icon: CheckSquare },
  { href: '/app/battle', label: 'Battle', icon: Sword },
  { href: '/app/pokedex', label: 'Pokédex', icon: BookOpen },
  { href: '/app/team', label: 'Team', icon: PawPrint },
  { href: '/app/habits', label: 'Habits', icon: Flame },
  { href: '/app/calendar', label: 'Calendar', icon: Calendar },
  { href: '/app/rewards', label: 'Shop', icon: ShoppingBag },
  { href: '/app/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/app/profile', label: 'Profile', icon: User },
];

interface SidebarProps {
  profile: UserProfile | null;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 min-h-screen bg-bg-secondary border-r border-border sticky top-0"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/app" className="flex items-center gap-2">
            <Sword className="w-6 h-6 text-brand-cyan" />
            <span className="font-bold text-lg text-brand-cyan">Life RPG</span>
          </Link>
        </div>

        {/* Character mini-card */}
        {profile && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan font-bold">
                {profile.username[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{profile.username}</p>
                <p className="text-xs text-text-muted font-mono">Lv.{profile.level}</p>
              </div>
              <div className="ml-auto text-xs font-mono text-brand-gold">
                💰 {profile.currency}
              </div>
            </div>
            <XpBar xp={profile.xp} level={profile.level} className="mb-2" />
            <HpBar hp={profile.hp} maxHp={profile.max_hp} />
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1" aria-label="App sections">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-brand-cyan/50',
                  active
                    ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-cyan"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-border">
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-all w-full focus:outline-none focus:ring-2 focus:ring-red-400/50"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary border-t border-border"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center gap-1 overflow-x-auto px-2 py-2">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-brand-cyan/50',
                  active ? 'text-brand-cyan' : 'text-text-muted'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
