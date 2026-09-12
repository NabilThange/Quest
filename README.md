# Life RPG ⚔️

> Turn your daily habits and tasks into an epic RPG adventure.

A full-stack gamified productivity app built for the Mumbai University Hackathon.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Next.js Server Actions
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security)
- **Icons**: Lucide React

## Features

- ⚔️ **Daily Quests** — repeating tasks that reset each day
- ✅ **Todos** — one-off tasks with optional due dates
- 🔥 **Habits** — tap-to-log with streak tracking
- ⭐ **XP & Leveling** — non-linear progression system
- ❤️ **HP System** — miss dailies and lose HP
- 💰 **Currency & Shop** — earn and spend on cosmetics/badges
- 🏆 **Leaderboard** — compete with other adventurers
- 📅 **Calendar** — week/month view of tasks
- 📱 **Responsive** — mobile-first with bottom nav

## Setup

### 1. Clone the repo

```bash
git clone <repo-url>
cd life-rpg
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL editor, run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key

### 3. Set environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    actions/        # Server actions (auth, tasks, shop, rollover)
    app/            # Protected /app/* pages
    login/          # Auth pages
    signup/
  components/
    app/            # App-specific components (Sidebar, TaskList, etc.)
    ui/             # Reusable UI (XpBar, HpBar, LevelBadge, etc.)
  lib/
    supabase/       # Supabase client (browser, server, middleware)
    utils.ts        # Shared utilities
  types/            # TypeScript types + constants
supabase/
  schema.sql        # Full DB schema, RLS policies, trigger, seed data
```

## Deployment

Deploy to [Vercel](https://vercel.com) — connect the repo and add the environment variables in the Vercel dashboard.
