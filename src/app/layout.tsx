import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AgentationProvider } from '@/components/AgentationProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Life RPG — Turn Your Life Into an Adventure',
  description:
    'Life RPG gamifies your daily habits and tasks. Earn XP, level up your character, build streaks, and unlock rewards — all by completing real-world goals.',
  keywords: ['productivity', 'habit tracker', 'RPG', 'gamification', 'tasks', 'life goals'],
  openGraph: {
    title: 'Life RPG — Turn Your Life Into an Adventure',
    description:
      'Gamify your habits and tasks. Earn XP, level up, and unlock rewards by completing real-world goals.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life RPG — Turn Your Life Into an Adventure',
    description: 'Gamify your habits and tasks. Earn XP, level up, and unlock rewards.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
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
