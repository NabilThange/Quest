'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { XpBar } from '@/components/ui/XpBar';
import { HpBar } from '@/components/ui/HpBar';
import { signOut } from '@/app/actions/auth';
import type { User as UserProfile } from '@/types';
import { playNavSound } from '@/lib/sound';

// All desktop nav items
const desktopNavItems = [
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

// 4 core daily loop items in the mobile bottom dock
const mobileDockItems = [
  { href: '/app', label: 'Lodge', icon: LayoutDashboard, exact: true },
  { href: '/app/todos', label: 'Quests', icon: CheckSquare },
  { href: '/app/battle', label: 'Battle', icon: Sword },
  { href: '/app/team', label: 'Team', icon: PawPrint },
];

// Secondary items accessible via the mobile drawer
const mobileDrawerItems = [
  { href: '/app/pokedex', label: 'Pokédex', icon: BookOpen, desc: 'Stories & collection' },
  { href: '/app/rewards', label: 'Shop', icon: ShoppingBag, desc: 'Apothecary & badges' },
  { href: '/app/habits', label: 'Habits', icon: Flame, desc: 'Daily routines & streaks' },
  { href: '/app/calendar', label: 'Calendar', icon: Calendar, desc: 'Schedule & milestones' },
  { href: '/app/leaderboard', label: 'Leaderboard', icon: Trophy, desc: 'Global rankings' },
  { href: '/app/profile', label: 'Profile', icon: User, desc: 'Settings & inventory' },
];

interface SidebarProps {
  profile: UserProfile | null;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    if (drawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [drawerOpen]);

  function isPathActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR (lg:flex)                                             */}
      {/* ========================================================================= */}
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
              <div className="ml-auto text-xs font-mono text-brand-gold flex items-center gap-1">
                <img
                  src="/assets/items/coin.png"
                  alt=""
                  className="w-3.5 h-3.5 pixel-art"
                  style={{ imageRendering: 'pixelated' }}
                />
                {profile.currency}
              </div>
            </div>
            <XpBar xp={profile.xp} level={profile.level} className="mb-2" />
            <HpBar hp={profile.hp} maxHp={profile.max_hp} />
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1" aria-label="App sections">
          {desktopNavItems.map((item) => {
            const active = isPathActive(item.href, item.exact);
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

      {/* ========================================================================= */}
      {/* 2. MOBILE FIXED TOP BAR (lg:hidden)                                       */}
      {/* ========================================================================= */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-bg-secondary/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4"
        aria-label="Mobile top bar"
      >
        {/* Left: Avatar & Level -> Profile link */}
        <Link
          href="/app/profile"
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 rounded-lg p-1 -ml-1"
          aria-label="View user profile"
        >
          <div className="w-7 h-7 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan text-xs font-bold">
            {profile ? profile.username[0].toUpperCase() : 'U'}
          </div>
          {profile && (
            <span className="text-xs font-mono bg-secondary/80 border border-border px-1.5 py-0.5 rounded text-text-secondary">
              Lv.{profile.level}
            </span>
          )}
        </Link>

        {/* Center: Brand title */}
        <Link href="/app" className="flex items-center gap-1.5">
          <Sword className="w-4 h-4 text-brand-cyan" />
          <span className="font-bold text-sm text-brand-cyan tracking-tight">Life RPG</span>
        </Link>

        {/* Right: Currency badge & Menu trigger */}
        <div className="flex items-center gap-2">
          {profile && (
            <div className="flex items-center gap-1 text-xs font-mono text-brand-gold bg-card border border-border/80 px-2 py-1 rounded-full">
              <img
                src="/assets/items/coin.png"
                alt=""
                className="w-3.5 h-3.5 pixel-art"
                style={{ imageRendering: 'pixelated' }}
              />
              <span>{profile.currency}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              playNavSound();
              setDrawerOpen(!drawerOpen);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 transition-colors"
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
          >
            {drawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MOBILE SLIDE-OUT DRAWER OVERLAY (lg:hidden)                           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-bg-secondary border-l border-border flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation drawer"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-serif text-lg">Menu & Overview</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Character Vitals (Mobile mini-card) */}
              {profile && (
                <div className="p-4 border-b border-border bg-card/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan text-sm font-bold">
                        {profile.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-tight">{profile.username}</p>
                        <p className="text-xs text-text-muted font-mono">Level {profile.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-brand-gold bg-card border border-border px-2 py-0.5 rounded-full">
                      <img
                        src="/assets/items/coin.png"
                        alt=""
                        className="w-3.5 h-3.5 pixel-art"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      {profile.currency}
                    </div>
                  </div>
                  <XpBar xp={profile.xp} level={profile.level} />
                  <HpBar hp={profile.hp} maxHp={profile.max_hp} />
                </div>
              )}

              {/* Secondary Navigation List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <p className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-text-muted">
                  Explore & Manage
                </p>
                {mobileDrawerItems.map((item) => {
                  const active = isPathActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                        active
                          ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 font-medium'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm leading-tight">{item.label}</p>
                        <p className="text-[11px] text-text-muted leading-tight mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer: Sign Out */}
              <div className="p-4 border-t border-border bg-bg-secondary">
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-400/20 bg-red-400/5 hover:bg-red-400/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. MOBILE BOTTOM DOCK (lg:hidden, 4 core items)                          */}
      {/* ========================================================================= */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile navigation dock"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
          {mobileDockItems.map((item) => {
            const active = isPathActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-all select-none',
                  'focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 rounded-xl',
                  active ? 'text-brand-cyan' : 'text-text-muted hover:text-text-secondary'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5 transition-transform" />
                <span className="text-[11px] font-medium tracking-tight leading-none">{item.label}</span>

                {/* Subtle active pill indicator */}
                {active && (
                  <motion.div
                    layoutId="dock-indicator"
                    className="absolute top-1 w-6 h-0.5 rounded-full bg-brand-cyan"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
