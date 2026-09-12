import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const APP_URL = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://doquest.vercel.app';

// ─── Post Content Database ────────────────────────────────────────────────────
const posts: Record<string, {
  title: string;
  description: string;
  date: string;
  dateModified: string;
  readTime: string;
  tag: string;
  content: string;
}> = {
  'how-to-build-daily-habits-that-stick': {
    title: 'How to Build Daily Habits That Actually Stick',
    description:
      'The science-backed formula for forming habits that survive the motivation dip — and why gamification makes it dramatically easier.',
    date: '2026-09-01',
    dateModified: '2026-09-01',
    readTime: '6 min',
    tag: 'Habit Science',
    content: `
## The Habit Problem Nobody Talks About

Most habit advice focuses on starting. Run every morning. Meditate daily. Read 10 pages.

The real problem isn't starting — it's surviving the motivation dip. That window between days 7 and 21 when the novelty fades and the grind begins.

## The Three-Part Habit Loop

Charles Duhigg popularized the cue-routine-reward loop in *The Power of Habit*. Modern neuroscience has refined it, but the core remains:

1. **Cue** — a trigger that initiates the behavior (alarm, location, time, emotion)
2. **Routine** — the habit itself
3. **Reward** — what your brain gets in return

The critical insight: **the reward must be immediate.** Long-term rewards (health, wealth, skill) are real, but your brain's dopamine system responds to *now*. This is exactly why habit apps that give you XP, streaks, and visual feedback outperform paper journals.

## Why 21 Days Is a Myth

The "21 days to form a habit" claim traces to a misread of Dr. Maxwell Maltz's 1960 book on plastic surgery recovery. A 2010 study from University College London found the actual average is **66 days** — with a range of 18 to 254 days depending on complexity.

**What this means for you:** Don't quit on day 22 thinking you failed. The neurological groove is still forming.

## The Minimum Viable Habit

Behavior scientist BJ Fogg's research at Stanford shows that making habits *tiny* dramatically increases follow-through. Instead of "exercise for 30 minutes," start with "put on workout clothes."

The psychological principle: **action generates motivation, not the reverse.**

In Quest, this maps directly to daily quests. Set one dead-simple daily — even "drink a glass of water" — and let the XP and streak dopamine do the heavy lifting.

## Gamification's Secret Weapon: Variable Rewards

Slot machines are the most addictive devices ever invented, and it's not random. They use **variable reward schedules** — intermittent reinforcement that Skinner discovered produces the most persistent behavior.

Quest's battle card system applies this directly: completing a quest earns you a random move card from a pool, making each completion a small surprise. Variable rewards keep engagement high when fixed rewards plateau.

## The Implementation Intention

Research by psychologist Peter Gollwitzer found that writing "I will do X at Y time in Z place" doubles follow-through compared to "I want to do X."

**Practical application:** When adding a daily quest in Quest, attach a specific time ("morning coffee") and location ("desk"). The app becomes the external cue.

## The Streak as a Commitment Device

Loss aversion — the psychological principle that losses hurt ~2.5x more than equivalent gains feel good — is what makes streak tracking so effective. Once you're on a 10-day streak, missing a day *hurts*. That pain is a feature, not a bug.

Quest's streak system, combined with companion XP loss on missed days, creates a powerful commitment device that's psychologically aligned with how human motivation actually works.

## What to Do When You Miss a Day

You will miss a day. The research on habit resilience (Phillippa Lally, UCL) shows that **a single missed day has no statistically significant impact on habit formation** — but missing two consecutive days doubles the risk of abandonment.

The rule: **never miss twice.** One day off is a pause. Two days off is a pattern.

## Getting Started

1. Pick one habit you actually want, not one you think you should want
2. Make it embarrassingly small to start
3. Attach it to an existing daily anchor (coffee, lunch, brushing teeth)
4. Track it visibly — streaks work because they're visual
5. Add a tiny immediate reward (the XP notification, the quest complete sound)

The habit isn't built in the motivation. It's built in the repetition.
    `,
  },
  'gamification-productivity-science': {
    title: 'Why Gamification Makes You More Productive (The Science)',
    description:
      'Dopamine loops, variable reward schedules, and XP bars: how game mechanics map onto real psychology to drive behavior change.',
    date: '2026-09-05',
    dateModified: '2026-09-05',
    readTime: '8 min',
    tag: 'Gamification',
    content: `
## Gamification Isn't a Gimmick

When habit apps started adding points and badges in the 2010s, critics called it infantilizing. "Just do the work," they said. "You don't need a gold star."

They were wrong. And the neuroscience explains why.

## Dopamine Is the Anticipation Chemical

Most people think dopamine = pleasure. The actual science is more interesting. Neuroscientist Wolfram Schultz's landmark research in the 1990s showed that dopamine neurons fire in response to **anticipated rewards**, not just received ones.

This is why progress bars feel satisfying when they move. Your brain sees the progress, anticipates the reward, and releases dopamine *before* you get there. The bar itself becomes motivating.

## The Flow State Window

Psychologist Mihaly Csikszentmihalyi identified that optimal experience (flow) occurs when **challenge matches skill**. Too easy = boredom. Too hard = anxiety. The sweet spot is just at your edge.

Games are engineered to keep you in this window — dynamically adjusting difficulty as you level up. Quest's XP leveling system does this implicitly: harder tasks earn more XP, creating a self-calibrating challenge system.

## Self-Determination Theory and Intrinsic Motivation

Edward Deci and Richard Ryan's Self-Determination Theory identifies three core psychological needs that drive intrinsic motivation:

1. **Autonomy** — feeling in control of your choices
2. **Competence** — feeling effective and skilled
3. **Relatedness** — feeling connected to others

Gamification, done well, serves all three: you choose your quests (autonomy), you see your stats improve (competence), and leaderboards create connection (relatedness).

Done poorly — mandatory points, coercive streaks — it undermines autonomy and becomes demotivating. The key is that game elements should feel like *tools you use*, not systems imposed on you.

## Variable Rewards and the Dopamine Loop

B.F. Skinner's variable interval reinforcement schedules produce the most persistent behavior of any reward pattern. This is why slot machines and social media feeds are so engaging — you don't know exactly when the reward will come.

Quest's battle card system is an explicit application of this principle. Complete a quest and you draw a random move card from a pool. You always get *something* — but what you get is unpredictable, which keeps the anticipation loop active.

## The SAPS Framework

Game designer Gabe Zichermann identified four types of rewards in gamification, ordered by effectiveness:

1. **Status** — rank, titles, visible achievement (most motivating)
2. **Access** — exclusive features or areas
3. **Power** — ability to do things others can't
4. **Stuff** — physical or virtual goods (least motivating)

Points and badges alone are Stuff — they're the weakest motivator. Status (leaderboard rank, visible level) and Power (unlocking companions, earning rare cards) are far more effective. Quest is designed around Status and Power, not just point accumulation.

## Why XP Outperforms Checkboxes

A plain checkbox gives binary feedback: done or not done. XP introduces **magnitude** — a hard task gives more than an easy one. This matters because:

- It signals that effort has differential value
- It gives you something to optimize (take harder challenges for bigger gains)
- Progress feels nonlinear and exciting when you level up

## The Social Accountability Effect

A study from the Dominican University of California found that writing down goals increases follow-through by 42%. Sharing them with someone increases it further. The leaderboard in Quest is a passive accountability system — even if you're not competing, the visibility of others' progress creates ambient social pressure.

## When Gamification Backfires

Overjustification effect (Deci, 1971): adding external rewards for intrinsically motivated behavior can *reduce* intrinsic motivation over time. If you already love running and you gamify it, there's a risk you start running *for points* and stop when the points stop.

The mitigation: use game mechanics to build habits you don't yet have. Once the behavior is automatic, the system fades into the background. The habit remains.

## Practical Application

Use Quest for behaviors you want but struggle to start: exercise, reading, learning, journaling. Don't gamify things you already love. Let the XP and streaks build the bridge from "I should" to "I do" — then the behavior becomes its own reward.
    `,
  },
  'rpg-habit-tracker-app-review': {
    title: 'RPG Habit Tracker Apps: What Works, What Doesn\'t',
    description:
      'An honest breakdown of the gamified productivity app landscape — and why the companion + battle system creates stronger accountability than points alone.',
    date: '2026-09-08',
    dateModified: '2026-09-08',
    readTime: '5 min',
    tag: 'App Review',
    content: `
## The RPG Productivity Space in 2026

Gamified habit tracking has evolved significantly. Early apps like Habitica (2013) proved the concept. A new generation is going deeper — better graphics, more nuanced game mechanics, tighter habit science integration.

Here's an honest look at what distinguishes effective RPG habit apps from gimmicky ones.

## What Actually Drives Habit Formation (The Benchmark)

Before comparing apps, establish the psychological criteria that matter:

1. **Immediate reward feedback** — does completing a task feel good *right now*?
2. **Streak mechanics** — loss aversion is a powerful motivator
3. **Variable rewards** — unpredictable rewards maintain engagement longer than fixed ones
4. **Social accountability** — visibility creates ambient pressure
5. **Difficulty calibration** — tasks should feel appropriately challenging, not arbitrary

## The Companion System: Why It Works

Most RPG habit apps give you a character that levels up. Quest goes a step further — your companion is a creature that develops its own skills, moves, and battle capabilities.

This matters psychologically because of **endowment effect**: once you feel ownership over something (your companion), you work harder to protect and develop it. Missing a habit day doesn't just break your streak — it affects your companion's development. That's a qualitatively stronger motivator.

## Battle System: Accountability Through Consequence

The battle arena is where Quest's approach diverges most. Daily habits generate battle cards. Battles require cards. This creates a direct, tangible link between completing real-world tasks and in-game capability.

The design principle: consequences should be proportional and meaningful, not punitive. You don't *lose* your character when you miss days — your companion becomes weaker relative to where it could be. That asymmetry is important for long-term retention.

## What Good RPG Habit Apps Share

After examining the landscape, effective gamified habit apps share:

- **Clear XP economy** — you know exactly what you earn and how
- **Visible progress** — stats, levels, and graphs that show real change
- **Flexible difficulty** — hard tasks earn more, encouraging ambition
- **No pay-to-win** — the game should reflect real-world effort, not purchases
- **Low friction** — completing a habit should take seconds

## The Minimalism Trap

Some habit apps strip gamification down to almost nothing — a clean checkbox and a graph. These work for already-motivated people but fail at building new habits. The friction of *not* having an immediate reward is exactly the problem they fail to solve.

Conversely, apps that pile on complexity (crafting systems, story quests, gear optimization) often become mini-games that distract from the actual goal: building real habits.

## The Quest Design Philosophy

Quest's design sits in the middle: game mechanics are meaningful and engaging, but they're always *downstream* of real-world action. The game responds to your life, not the other way around.

The goal: you should be able to explain why you did something in Quest by pointing to something you actually did in real life. That transparency keeps the system honest.

## Who RPG Habit Apps Work Best For

Based on user psychology research, gamified habit tracking works particularly well for:

- People who already play games (familiar reward language)
- People who struggle with abstract future rewards (XP is concrete)
- People with ADHD (novelty and variety in the reward system)
- Students and young professionals (high tolerance for system-learning)

They work less well for people who find the game layer condescending or distracting. For those users, simpler streak-based apps may be a better fit.

## The Bottom Line

An RPG habit tracker is only as good as its habit science. The best ones use game mechanics not as decoration, but as a delivery mechanism for psychological principles that are proven to drive behavior change. Immediate rewards. Variable reinforcement. Loss aversion. Social proof.

Quest is built on these foundations — the game is a skin for the science.
    `,
  },
  'habit-streak-psychology-motivation': {
    title: 'The Psychology of Streaks: Why "Don\'t Break the Chain" Works',
    description:
      'Loss aversion, commitment devices, and the sunk-cost effect — the cognitive forces that make streak tracking one of the most powerful habit tools.',
    date: '2026-09-10',
    dateModified: '2026-09-10',
    readTime: '7 min',
    tag: 'Psychology',
    content: `
## The Chain Jerry Seinfeld Never Endorsed

The "Seinfeld Method" — mark an X on a calendar each day you write jokes, don't break the chain — has become one of the most cited productivity techniques of the last decade.

Jerry Seinfeld claims he never actually said this. Doesn't matter. The technique works, and the psychology behind it is well-documented.

## Loss Aversion: The Engine Behind Streaks

Daniel Kahneman and Amos Tversky's Prospect Theory (Nobel Prize, 2002) established that losses feel approximately **2.5x more painful** than equivalent gains feel good.

This asymmetry is what makes streaks so effective. Once you're on a 14-day streak, the prospect of losing it hurts far more than the pleasure of maintaining it. Your brain is effectively working *against* the decision to skip a day.

Streak apps didn't invent this mechanism — they discovered it already existed in human psychology and built a UI around it.

## The Commitment Device

Economist Richard Thaler (Nobel Prize, 2017) popularized commitment devices: mechanisms that lock you into a future behavior by making the cost of deviation immediate and salient.

A visible streak is a commitment device. The number itself creates a psychological contract with your future self. Breaking it isn't just a missed day — it's a broken promise.

Ulysses chained himself to the mast before hearing the sirens. A streak is a chain you forge in advance.

## Sunk Cost as a Feature

Sunk cost fallacy — continuing an investment because of past resources rather than future value — is usually a cognitive bias to avoid. In habit formation, it's a feature.

"I've done this for 47 days, I'm not stopping now" is economically irrational but psychologically adaptive. The investment protects the behavior. Rational actors quit when motivation dips; committed actors don't.

## The Critical Gap: Day 7 to Day 21

Most habit failures occur not on day 1, but in the window between days 7 and 21. The initial novelty has worn off; the behavior hasn't yet automated. Neurologically, the basal ganglia is still forming the procedural memory.

Streak counters make this period visible. You can see "Day 12" and know you're in the hard part — but also know you're past the halfway point to automation. That visibility changes behavior.

## Why the Streak Number Has to Be Big Enough to Hurt

A 2-day streak has low loss aversion. A 30-day streak has high loss aversion. This is why Quest shows streaks prominently and celebrates milestones explicitly — you need the number to feel significant for the psychology to work.

The milestone itself (7 days, 30 days, 100 days) creates a secondary goal: not just maintaining the streak, but reaching the next checkpoint. Destination motivation overlaid on loss aversion.

## The Recovery Problem: Never Miss Twice

The consistent finding in habit resilience research (Phillippa Lally, UCL, 2010) is that **a single missed day doesn't significantly impact habit formation** — but two consecutive missed days does.

This suggests the right mental model: streaks shouldn't be treated as binary (alive or dead) but as *mostly intact until you miss twice*. Quest's streak system is strict (a missed day resets the counter) which arguably increases loss aversion — but users benefit from knowing the psychological rule: the streak breaks at *two consecutive misses*, not one.

## Variable Streak Goals

Research from Harvard Business School (Keinan & Kivetz, 2011) found that effort feels more rewarding when it's on a defined path to completion. "Almost there" is more motivating than "in progress."

Design implication: set milestone targets (7-day, 30-day, 100-day) and celebrate them visibly. The intermediate goal activates the endowment effect — you feel ownership of the streak you're about to reach.

## When Streaks Backfire

Streaks can become anxiety-inducing if the stakes feel too high. Users who feel genuine stress about breaking a streak are in a loss-aversion spiral that's counterproductive.

The mitigation: frame streaks as positive accomplishment, not punitive compliance. "You've done this 30 days" rather than "don't lose your 30-day streak." Quest uses the positive framing throughout the UI.

## The Long Game

Streaks eventually stop mattering — in a good way. At some point, the behavior becomes automatic. You don't run because of the streak; you run because you're a runner. The streak was the scaffolding, not the building.

The goal of every streak-based system is to make itself unnecessary. When you no longer need the external accountability, the habit has fully formed. The counter can go to zero and it won't matter.

Until then, don't break the chain.
    `,
  },
};

// ─── Static Generation ────────────────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts[params.slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.dateModified,
      url: `/blog/${params.slug}`,
      images: [{ url: '/og-image.jpg', width: 1512, height: 755, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/og-image.jpg'],
    },
  };
}

// ─── Render ───────────────────────────────────────────────────────────────────
export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.dateModified,
    author: { '@type': 'Organization', name: 'Quest' },
    publisher: {
      '@type': 'Organization',
      name: 'Quest',
      logo: { '@type': 'ImageObject', url: `${APP_URL}/og-image.jpg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${APP_URL}/blog/${params.slug}` },
    image: `${APP_URL}/og-image.jpg`,
  };

  // Convert markdown-like content to simple HTML
  const paragraphs = post.content.trim().split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="font-serif text-2xl mt-10 mb-4">{line.replace('## ', '')}</h2>;
    if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
      return <li key={i} className="ml-4 text-text-secondary leading-relaxed">{line.replace(/^\d+\. /, '')}</li>;
    }
    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-text-secondary leading-relaxed list-disc">{line.replace('- ', '')}</li>;
    if (line === '') return <br key={i} />;
    // Handle **bold**
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="text-text-secondary leading-relaxed mb-4">
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-text-primary font-semibold">{part}</strong> : part)}
      </p>
    );
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <nav className="mb-8">
          <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-mono">
            ← All posts
          </Link>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono bg-card border border-border px-2 py-0.5 rounded-full text-text-secondary">
              {post.tag}
            </span>
            <time className="text-xs text-text-secondary" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span className="text-xs text-text-secondary">· {post.readTime} read</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl leading-tight mb-4">{post.title}</h1>
          <p className="text-text-secondary text-lg leading-relaxed">{post.description}</p>
          <div className="border-t border-border mt-8" />
        </header>

        <article className="prose-custom">
          {paragraphs}
        </article>

        <footer className="mt-16 border-t border-border pt-8">
          <p className="text-text-secondary text-sm mb-4">Ready to put this into practice?</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-brand-gold text-black font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Start your first quest →
          </Link>
        </footer>
      </main>
    </>
  );
}
