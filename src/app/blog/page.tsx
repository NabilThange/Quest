import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Habit Science, Gamification & Productivity',
  description:
    'Evidence-based articles on habit formation, gamification psychology, streak science, and productivity systems. Learn how to build lasting routines with Quest.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Quest Blog — Habit Science & Gamification',
    description: 'Evidence-based articles on habit formation, gamification, and daily routines.',
    url: '/blog',
    images: [{ url: '/og-image.jpg', width: 1512, height: 755, alt: 'Quest Blog' }],
  },
};

const posts = [
  {
    slug: 'how-to-build-daily-habits-that-stick',
    title: 'How to Build Daily Habits That Actually Stick',
    description:
      'The science-backed formula for forming habits that survive the motivation dip — and why gamification makes it dramatically easier.',
    date: '2026-09-01',
    readTime: '6 min',
    tag: 'Habit Science',
  },
  {
    slug: 'gamification-productivity-science',
    title: 'Why Gamification Makes You More Productive (The Science)',
    description:
      'Dopamine loops, variable reward schedules, and XP bars: how game mechanics map onto real psychology to drive behavior change.',
    date: '2026-09-05',
    readTime: '8 min',
    tag: 'Gamification',
  },
  {
    slug: 'rpg-habit-tracker-app-review',
    title: 'RPG Habit Tracker Apps: What Works, What Doesn\'t',
    description:
      'An honest breakdown of the gamified productivity app landscape — and why the companion + battle system creates stronger accountability than points alone.',
    date: '2026-09-08',
    readTime: '5 min',
    tag: 'App Review',
  },
  {
    slug: 'habit-streak-psychology-motivation',
    title: 'The Psychology of Streaks: Why "Don\'t Break the Chain" Works',
    description:
      'Loss aversion, commitment devices, and the sunk-cost effect — the cognitive forces that make streak tracking one of the most powerful habit tools.',
    date: '2026-09-10',
    readTime: '7 min',
    tag: 'Psychology',
  },
];

export default function BlogPage() {
  const APP_URL = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://doquest.vercel.app';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Quest Blog',
    description: 'Evidence-based articles on habit formation, gamification, and productivity.',
    url: `${APP_URL}/blog`,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${APP_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <header className="mb-12">
          <p className="text-sm font-mono text-text-secondary mb-2 tracking-widest uppercase">Quest Blog</p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4">Habit Science & Gamification</h1>
          <p className="text-text-secondary text-lg max-w-xl">
            Evidence-based articles on building lasting habits, the psychology of motivation, and how gamification changes the game.
          </p>
        </header>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border border-border rounded-xl p-6 hover:border-brand-gold/40 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono bg-card border border-border px-2 py-0.5 rounded-full text-text-secondary">
                  {post.tag}
                </span>
                <time className="text-xs text-text-secondary" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <span className="text-xs text-text-secondary">· {post.readTime} read</span>
              </div>
              <h2 className="font-serif text-xl mb-2 group-hover:text-brand-gold transition-colors">
                <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 relative">
                  {post.title}
                </Link>
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">{post.description}</p>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
