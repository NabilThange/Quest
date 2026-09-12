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
  title: 'Quest — Master Your Habits & Goals',
  description:
    'Quest brings your scrambled life into organized focus. Track daily to-dos, build consistent habits, level up, and achieve greatness.',
  keywords: ['productivity', 'habit tracker', 'to-do list', 'consistency', 'tasks', 'life goals', 'quest'],
  openGraph: {
    title: 'Quest — Master Your Habits & Goals',
    description:
      'Organize your life, stay consistent, and turn daily habits into steady greatness.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quest — Master Your Habits & Goals',
    description: 'Organize your life, stay consistent, and turn daily habits into steady greatness.',
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
