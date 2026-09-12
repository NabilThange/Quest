'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Linkedin, Twitter, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Animation Pattern ────────────────────────────────────────────────────────
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

// ─── Word-by-word Reveal Component ────────────────────────────────────────────
function WordSpan({
  word,
  progress,
  range,
  isHighlight,
  highlightColor,
  baseColor,
}: {
  word: string;
  progress: any;
  range: [number, number];
  isHighlight: boolean;
  highlightColor: string;
  baseColor: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.25em] transition-colors ${
        isHighlight ? highlightColor : baseColor
      }`}
    >
      {word}
    </motion.span>
  );
}

function ScrollWordReveal({
  text,
  highlightWords = [],
  highlightColor = 'text-foreground',
  baseColor = 'text-hero-subtitle',
  className = '',
}: {
  text: string;
  highlightWords?: string[];
  highlightColor?: string;
  baseColor?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 45%'],
  });

  const words = text.split(' ');

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord
        );
        return (
          <WordSpan
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
            isHighlight={isHighlight}
            highlightColor={highlightColor}
            baseColor={baseColor}
          />
        );
      })}
    </p>
  );
}

// ─── HLS Video Background Component ───────────────────────────────────────────
function HlsVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: any = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = src;
      video.play().catch(() => {});
    } else {
      // hls.js for Chrome / Firefox / Edge
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
        }
      });
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
    />
  );
}

// ─── Quest Landing Page ───────────────────────────────────────────────────────
export default function QuestLandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleStartQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      toast.success('Your adventure begins. Welcome to Quest.');
      router.push(`/signup?email=${encodeURIComponent(email)}`);
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="quest-theme min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
      {/* ── 1. Navbar (fixed, transparent) ─────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 md:px-28 py-4 flex items-center justify-between bg-transparent">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-full border-2 border-foreground/60 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-3 h-3 rounded-full border border-foreground/60" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Quest
          </span>
        </Link>

        {/* Center-left: Nav links */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-4 text-sm text-muted-foreground"
        >
          <a href="#home" className="hover:text-foreground transition-colors">
            Overview
          </a>
          <span className="text-muted-foreground/40 text-xs">•</span>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            The Problem
          </a>
          <span className="text-muted-foreground/40 text-xs">•</span>
          <a href="#philosophy" className="hover:text-foreground transition-colors">
            Consistency
          </a>
          <span className="text-muted-foreground/40 text-xs">•</span>
          <a href="#system" className="hover:text-foreground transition-colors">
            The System
          </a>
        </nav>

        {/* Right: Social icons & Sign In */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-block text-xs font-medium text-text-secondary hover:text-foreground px-3 py-1.5 transition-colors"
          >
            Sign in
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </header>

      <main>
        {/* ── 2. Hero Section (full viewport height) ────────────────────────── */}
        <section
          id="home"
          className="min-h-screen relative flex items-center justify-center overflow-hidden"
        >
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          >
            <source src="/hero-bg.webm" type="video/webm" />
          </video>

          {/* Bottom Gradient Fade to Black */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent pointer-events-none z-[2]" />

          {/* Content */}
          <div className="relative z-10 pt-28 md:pt-32 text-center max-w-4xl mx-auto px-6">
            {/* Avatar Row */}
            <motion.div
              {...fadeUp(0.1)}
              className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-xl"
            >
              <div className="flex -space-x-2">
                <img
                  src="/avatar-1.png"
                  alt="Adventurer 1"
                  className="w-7 h-7 rounded-full border-2 border-background object-cover"
                />
                <img
                  src="/avatar-2.png"
                  alt="Adventurer 2"
                  className="w-7 h-7 rounded-full border-2 border-background object-cover"
                />
                <img
                  src="/avatar-3.png"
                  alt="Adventurer 3"
                  className="w-7 h-7 rounded-full border-2 border-background object-cover"
                />
              </div>
              <span className="text-zinc-200 text-xs sm:text-sm font-medium tracking-wide">
                Build consistency, one quest at a time
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              {...fadeUp(0.2)}
              className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] mb-6 text-foreground leading-[1.05]"
            >
              Order Your{' '}
              <span className="font-serif italic font-normal">Life.</span>{' '}
              Become Great.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.3)}
              className="text-lg max-w-2xl mx-auto mb-10 text-[hsl(var(--hero-subtitle))] font-normal leading-relaxed"
            >
              A focused to-do list and daily habit tracker built to bring your scrambled life into calm, consistent rhythm. Follow through every day, build unstoppable momentum, and achieve greatness.
            </motion.p>

            {/* Email Form */}
            <motion.form
              {...fadeUp(0.4)}
              onSubmit={handleStartQuest}
              className="liquid-glass rounded-full p-2 max-w-lg mx-auto flex items-center gap-2 border border-white/10"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to start your quest"
                className="bg-transparent border-none outline-none px-6 py-3 text-foreground placeholder:text-muted-foreground text-sm flex-1 focus:ring-0"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-foreground text-background font-semibold rounded-full px-8 py-3 text-sm tracking-wider uppercase transition-colors shrink-0"
              >
                START QUEST
              </motion.button>
            </motion.form>
          </div>
        </section>

        {/* ── 3. "From Scrambled Days to Mastery" Section ──────────────────── */}
        <section
          id="how-it-works"
          className="pt-52 md:pt-64 pb-6 md:pb-9 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.h2
            {...fadeUp(0.1)}
            className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] mb-6 text-foreground leading-[1.05]"
          >
            Stop living a{' '}
            <span className="font-serif italic font-normal">scrambled</span> life.
          </motion.h2>

          <motion.p
            {...fadeUp(0.2)}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-24 font-normal leading-relaxed"
          >
            Most people don't fail from lack of ambition. They fail because their days are fragmented, habits are left to chance, and tasks pile up without direction. Quest brings calm, deliberate structure to your days.
          </motion.p>

          {/* 3 Pillars Cards */}
          <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-20">
            {/* 1: To-Do Focus */}
            <motion.div
              {...fadeUp(0.3)}
              className="flex flex-col items-center text-center p-6 rounded-2xl liquid-glass border border-border/20"
            >
              <div className="w-[200px] h-[200px] flex items-center justify-center mb-6">
                <img
                  src="/icon-chatgpt.png"
                  alt="The Focus To-Do List"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-2">
                The Focus To-Do List
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Cut through mental clutter. Capture one-off goals, schedule due dates, and prioritize only what must move forward today.
              </p>
            </motion.div>

            {/* 2: Habit Engine */}
            <motion.div
              {...fadeUp(0.4)}
              className="flex flex-col items-center text-center p-6 rounded-2xl liquid-glass border border-border/20"
            >
              <div className="w-[200px] h-[200px] flex items-center justify-center mb-6">
                <img
                  src="/icon-perplexity.png"
                  alt="The Habit Engine"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-2">
                The Habit Engine
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Anchor daily routines that compound over months. Visual streak counters make consistency a non-negotiable personal standard.
              </p>
            </motion.div>

            {/* 3: Real Growth */}
            <motion.div
              {...fadeUp(0.5)}
              className="flex flex-col items-center text-center p-6 rounded-2xl liquid-glass border border-border/20"
            >
              <div className="w-[200px] h-[200px] flex items-center justify-center mb-6">
                <img
                  src="/icon-google.png"
                  alt="Character Evolution"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-2">
                Tangible Evolution
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Turn your effort into observable progress. Level up Strength, Intellect, and Discipline as you cross the finish line every evening.
              </p>
            </motion.div>
          </div>

          {/* Bottom Tagline */}
          <motion.p
            {...fadeUp(0.6)}
            className="text-muted-foreground text-sm text-center tracking-wide"
          >
            If you don't take control of your habits, your habits will take control of you.
          </motion.p>
        </section>

        {/* ── 4. Mission Section ────────────────────────────────────────────── */}
        <section
          id="philosophy"
          className="pt-0 pb-32 md:pb-44 max-w-5xl mx-auto px-6 text-center"
        >
          {/* Large 800x800 Video */}
          <motion.div
            {...fadeUp(0.1)}
            className="w-full max-w-[800px] aspect-square mx-auto mb-20 overflow-hidden rounded-3xl border border-border/30 relative"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
            />
          </motion.div>

          {/* Scroll-driven word-by-word reveal */}
          <div className="max-w-4xl mx-auto">
            {/* Paragraph 1 */}
            <ScrollWordReveal
              text="We're building a system where daily habits meet relentless consistency — where scattered days turn into order, tasks become personal victories, and every small step compounds toward greatness."
              highlightWords={['daily', 'habits', 'relentless', 'consistency', 'greatness', 'order']}
              highlightColor="text-foreground"
              baseColor="text-hero-subtitle"
              className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-tight"
            />

            {/* Paragraph 2 */}
            <ScrollWordReveal
              text="A calm sanctuary for your goals, routines, and ambitions — with zero noise, zero overwhelm, and continuous momentum for who you want to become."
              highlightWords={['goals', 'routines', 'momentum', 'calm']}
              highlightColor="text-foreground"
              baseColor="text-muted-foreground"
              className="text-xl md:text-2xl lg:text-3xl font-medium mt-10 leading-relaxed"
            />
          </div>
        </section>

        {/* ── 5. Solution Section ───────────────────────────────────────────── */}
        <section
          id="system"
          className="py-32 md:py-44 border-t border-border/30 max-w-6xl mx-auto px-6"
        >
          {/* Label */}
          <motion.div
            {...fadeUp(0.1)}
            className="text-center mb-4"
          >
            <span className="text-xs tracking-[3px] uppercase text-muted-foreground">
              THE SYSTEM
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            {...fadeUp(0.2)}
            className="text-4xl md:text-6xl font-medium tracking-tight mb-16 text-center text-foreground leading-tight"
          >
            The framework for{' '}
            <span className="font-serif italic font-normal">consistent</span>{' '}
            achievement
          </motion.h2>

          {/* Video (aspect 3/1) */}
          <motion.div
            {...fadeUp(0.3)}
            className="rounded-2xl overflow-hidden aspect-[3/1] w-full mb-20 border border-border/30 shadow-2xl relative"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
            />
          </motion.div>

          {/* 4-column feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              {...fadeUp(0.3)}
              className="p-6 rounded-xl border border-border/30 liquid-glass"
            >
              <h3 className="font-semibold text-base text-foreground mb-2">
                Focused Quests
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Streamlined to-do management engineered for follow-through. Set attributes, assign difficulties, and conquer tasks one by one.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp(0.4)}
              className="p-6 rounded-xl border border-border/30 liquid-glass"
            >
              <h3 className="font-semibold text-base text-foreground mb-2">
                Streak Discipline
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Daily repeating routines that reset at midnight. Watch your streaks climb as showing up becomes second nature.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp(0.5)}
              className="p-6 rounded-xl border border-border/30 liquid-glass"
            >
              <h3 className="font-semibold text-base text-foreground mb-2">
                AI Habit Coach
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Stuck or overwhelmed? Answer a single intake form and receive tailored, achievable quest suggestions tailored to your routine.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp(0.6)}
              className="p-6 rounded-xl border border-border/30 liquid-glass"
            >
              <h3 className="font-semibold text-base text-foreground mb-2">
                RPG Progression
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Earn gold, collect cards, and raise companions with every completed task. Make self-improvement genuinely thrilling.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── 6. CTA Section ────────────────────────────────────────────────── */}
        <section className="py-32 md:py-44 border-t border-border/30 overflow-hidden relative flex items-center justify-center">
          {/* Background HLS Video */}
          <HlsVideoPlayer src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8" />

          {/* Overlay */}
          <div className="absolute inset-0 bg-background/45 z-[1]" />

          {/* Content */}
          <div className="z-10 relative text-center max-w-3xl mx-auto px-6">
            <motion.div
              {...fadeUp(0.1)}
              className="w-10 h-10 rounded-full border-2 border-foreground/70 flex items-center justify-center mx-auto mb-6"
            >
              <div className="w-5 h-5 rounded-full border border-foreground/70" />
            </motion.div>

            <motion.h2
              {...fadeUp(0.2)}
              className="text-4xl md:text-6xl font-medium mb-4 text-foreground tracking-tight"
            >
              <span className="font-serif italic font-normal">
                Begin Your Quest Today
              </span>
            </motion.h2>

            <motion.p
              {...fadeUp(0.3)}
              className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto"
            >
              Bring order to your scrambled days. Stay consistent, build powerful habits, and unlock your true potential in life.
            </motion.p>

            <motion.div
              {...fadeUp(0.4)}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/signup"
                className="bg-foreground text-background font-medium rounded-lg px-8 py-3.5 hover:bg-foreground/90 transition-colors text-sm"
              >
                Start Your Quest
              </Link>
              <Link
                href="/login"
                className="liquid-glass rounded-lg px-8 py-3.5 text-foreground font-medium hover:bg-white/5 transition-colors border border-white/20 text-sm"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── 7. Footer ──────────────────────────────────────────────────────── */}
      <footer className="py-12 px-8 md:px-28 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          © 2026 Quest. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-muted-foreground text-sm">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
