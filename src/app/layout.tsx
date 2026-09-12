import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AgentationProvider } from '@/components/AgentationProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const APP_URL = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://doquest.vercel.app';

// Viewport must be a separate export in Next.js 14+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Quest — Gamified Habit Tracker & RPG Productivity App',
    template: '%s | Quest',
  },
  description:
    'Quest turns your daily habits and to-dos into an RPG adventure. Build streaks, level up companions, battle enemies, and achieve real-life goals — one quest at a time.',
  keywords: [
    'habit tracker', 'gamified productivity', 'rpg habit app', 'daily goals app',
    'quest habit tracker', 'level up productivity', 'habit streak', 'gamification',
    'todo rpg', 'life rpg', 'productivity game',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Quest',
    title: 'Quest — Gamified Habit Tracker & RPG Productivity App',
    description:
      'Turn your daily habits into an RPG adventure. Build streaks, level up, and achieve real goals.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1512,
        height: 755,
        alt: 'Quest — Gamified Habit Tracker',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quest — Gamified Habit Tracker & RPG Productivity App',
    description:
      'Turn your daily habits into an RPG adventure. Build streaks, level up, and achieve real goals.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${APP_URL}/#webapp`,
        name: 'Quest',
        url: APP_URL,
        description:
          'Quest is a gamified habit tracker and RPG productivity app. Complete daily tasks, build habit streaks, level up companions, and battle enemies to stay motivated.',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Daily habit tracking',
          'RPG companion system',
          'Streak tracking',
          'Battle arena mini-game',
          'XP and leveling system',
          'Reward shop',
          'Leaderboard',
        ],
      },
      {
        '@type': 'Organization',
        '@id': `${APP_URL}/#organization`,
        name: 'Quest',
        url: APP_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${APP_URL}/og-image.jpg`,
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
        <AgentationProvider />
      </body>
    </html>
  );
}
