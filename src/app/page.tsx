import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Sword,
  Flame,
  Trophy,
  ShoppingBag,
  Zap,
  Shield,
  Star,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Life RPG — Turn Your Life Into an Adventure',
  description:
    'Stop treating your goals like chores. Life RPG turns your daily habits, tasks, and routines into an epic RPG adventure. Earn XP, level up, build streaks, and unlock rewards.',
  openGraph: {
    title: 'Life RPG — Turn Your Life Into an Adventure',
    description:
      'Stop treating your goals like chores. Life RPG turns your daily habits, tasks, and routines into an epic RPG adventure.',
    type: 'website',
  },
};

const features = [
  {
    icon: <Sword className="w-6 h-6" />,
    title: 'Daily Quests',
    description:
      'Transform your daily routines into repeating quests. Miss one and your HP drops — complete them all and your streak grows.',
    color: 'text-brand-cyan',
    bg: 'bg-brand-cyan/10 border-brand-cyan/20',
  },
  {
    icon: <Flame className="w-6 h-6" />,
    title: 'Habit Streaks',
    description:
      'Track positive habits with a tap. Watch your streak counter climb and your character attributes grow stronger every day.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/20',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Leaderboard',
    description:
      'Compete with other adventurers. Climb the global leaderboard ranked by level and XP — prove your dedication.',
    color: 'text-brand-gold',
    bg: 'bg-brand-gold/10 border-brand-gold/20',
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: 'Rewards Shop',
    description:
      'Spend your hard-earned currency on cosmetics, themes, and badges. Real effort, real rewards.',
    color: 'text-brand-purple',
    bg: 'bg-brand-purple/10 border-brand-purple/20',
  },
];

const stats = [
  { value: '4', label: 'Attributes to level up' },
  { value: '3x', label: 'Task difficulty tiers' },
  { value: '∞', label: 'Levels to climb' },
  { value: '100%', label: 'Your progress' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary bg-grid">
      {/* Nav */}
      <nav className="border-b border-border bg-bg-primary/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <span className="font-bold text-lg text-brand-cyan">Life RPG</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Start your quest
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full px-4 py-1.5 text-sm text-brand-cyan mb-8">
            <Zap className="w-3.5 h-3.5" />
            <span>Your life. Gamified.</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
            Turn Your Life Into
            <br />
            <span className="text-brand-cyan neon-text">an Adventure</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop treating your goals like chores. Life RPG transforms your daily habits,
            tasks, and routines into an epic progression system — with real XP, real levels,
            and real rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3">
              Start your quest
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn-secondary inline-flex items-center gap-2 text-base px-6 py-3">
              Sign in
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold font-mono text-brand-cyan">{s.value}</div>
                <div className="text-sm text-text-secondary mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to level up</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              A full RPG progression system built around your real-world goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <article
                key={f.title}
                className={`card border ${f.bg} hover:scale-105 transition-transform duration-200`}
              >
                <div className={`${f.color} mb-4`}>{f.icon}</div>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Star className="w-8 h-8 text-brand-cyan" />,
                title: 'Create your quests',
                desc: 'Add daily habits, one-off todos, and recurring tasks. Assign them an attribute — Strength, Intellect, Discipline, or Creativity.',
              },
              {
                step: '02',
                icon: <Zap className="w-8 h-8 text-brand-gold" />,
                title: 'Complete & earn XP',
                desc: 'Check off tasks to earn XP and currency. Harder tasks reward more. Watch your XP bar fill and your level climb.',
              },
              {
                step: '03',
                icon: <Shield className="w-8 h-8 text-brand-purple" />,
                title: 'Level up your life',
                desc: 'Spend currency in the shop, climb the leaderboard, and build streaks. Your character grows as you do.',
              },
            ].map((item) => (
              <div key={item.step} className="card text-center">
                <div className="text-xs font-mono text-text-muted mb-4">{item.step}</div>
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="card-elevated text-center py-16 glow-cyan">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to start your quest?
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Join adventurers turning their daily grind into an epic journey.
            </p>
            <Link href="/signup" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
              Create your character
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-text-muted text-sm">
        <p>© {new Date().getFullYear()} Life RPG. Built for the Mumbai University Hackathon.</p>
      </footer>
    </div>
  );
}
