# Quest — UX Page Architecture & Chronological Section Breakdown

> **Audience:** UX / Product Design Team  
> **Purpose:** A complete, top-to-bottom visual and functional breakdown of every page in **Quest**.  
> **Goal for the UX Team:** Evaluate and re-order the chronological sections on each page to make the application simpler, more minimal, and frictionless to use. **Do not delete components or remove the game aspect** — simply re-sequence the sections to put primary habit and to-do actions first while keeping the RPG rewards reinforcing and delightful.

---

## Table of Contents
1. [Global App Navigation & Shell](#global-app-navigation--shell)
2. [Page 1: Landing Page (`/`)](#page-1-landing-page-)
3. [Page 2: Dashboard / Lodge (`/app`)](#page-2-dashboard--lodge-app)
4. [Page 3: Quests (`/app/todos`)](#page-3-quests-apptodos)
5. [Page 4: Habits (`/app/habits`)](#page-4-habits-apphabits)
6. [Page 5: Battle Arena (`/app/battle`)](#page-5-battle-arena-appbattle)
7. [Page 6: Team & Companions (`/app/team`)](#page-6-team--companions-appteam)
8. [Page 7: Pokédex & Collection (`/app/pokedex`)](#page-7-pokédex--collection-apppokedex)
9. [Page 8: Calendar (`/app/calendar`)](#page-8-calendar-appcalendar)
10. [Page 9: Shop & Rewards (`/app/rewards`)](#page-9-shop--rewards-apprewards)
11. [Page 10: Leaderboard (`/app/leaderboard`)](#page-10-leaderboard-appleaderboard)
12. [Page 11: Character Sheet / Profile (`/app/profile`)](#page-11-character-sheet--profile-appprofile)
13. [Page 12: AI Habit Coach Onboarding (`/onboarding`)](#page-12-ai-habit-coach-onboarding-onboarding)
14. [Page 13: Authentication Pages (`/login` & `/signup`)](#page-13-authentication-pages-login--signup)

---

## Global App Navigation & Shell

The application shell frames all inner `/app/*` routes.

### A. Desktop Sidebar (`lg:flex`, persistent left column)
Chronological Order (Top to Bottom):
1. **Brand Header**: Sword icon + `"Quest"` brand mark (links to `/app`).
2. **User Character Mini-Card**:
   - User avatar initial circle.
   - Username and Level Badge (`Lv. X`).
   - XP Progress Bar (`--xp-fill` with XP needed to next level).
   - HP Vital Bar (color-coded green/yellow/red with current HP / max HP).
3. **Primary Navigation Menu (Visual Chunking into 3 Clusters)**:
   - **Core Loop**:
     - `Lodge` (`/app`, exact match)
     - `Quests` (`/app/todos`)
     - `Habits` (`/app/habits`)
   - **Adventures**:
     - `Battle` (`/app/battle`)
     - `Team` (`/app/team`)
     - `Pokédex` (`/app/pokedex`)
   - **Overview**:
     - `Calendar` (`/app/ca
     lendar`)
     - `Shop` (`/app/rewards`)
     - `Leaderboard` (`/app/leaderboard`)
     - `Profile` (`/app/profile`)
4. **Bottom Footer Actions**:
   - Sign Out Button (`LogOut` icon + action).

### B. Mobile Navigation (`lg:hidden`)
Chronological Order / Visual Hierarchy:
1. **Sticky Top Header**:
   - Left: Home link with sword icon + `"Quest"`.
   - Right: Currency counter badge (`💰 X`) + Hamburger menu trigger button (`Menu` / `X`).
2. **Fixed Bottom Dock (4 high-frequency items)**:
   - `Lodge` (`/app`)
   - `Quests` (`/app/todos`)
   - `Battle` (`/app/battle`)
   - `Team` (`/app/team`)
3. **Slide-Out Drawer (Full Overlay on Menu Click)**:
   - Top: User Character Vitals mini-card (Avatar, Level, XP Bar, HP Bar, Currency).
   - Middle: Secondary Navigation Items (`Pokédex`, `Shop`, `Habits`, `Calendar`, `Leaderboard`, `Profile` with sub-descriptions).
   - Bottom: Sign Out button.

---

## Page 1: Landing Page (`/`)

*Mental Model:* Dark monochrome aesthetic (pure black background `#000`, white foreground, liquid-glass cards, video ambient backgrounds, Inter + Instrument Serif typography).

### Chronological Section Order:

```
[ Section 1: Fixed Transparent Navbar ]
               ↓
[ Section 2: Full-Height Hero Section ]
               ↓
[ Section 3: "Search Has Changed" / Problem Section ]
               ↓
[ Section 4: Philosophy / Mission Section (Word Reveal) ]
               ↓
[ Section 5: The System / Solution Section ]
               ↓
[ Section 6: Final CTA Section (HLS Video Streaming) ]
               ↓
[ Section 7: Minimalist Footer ]
```

### Detailed Elements in Each Section:
1. **Section 1: Navbar (Fixed, Top-0)**
   - Left: Concentric circles logo mark + `"Quest"` bold title.
   - Center: Nav link pills (`Overview • The Problem • Consistency • The System`).
   - Right: Sign in text button + 3 liquid-glass circular social icon buttons (`Instagram`, `LinkedIn`, `Twitter`).
2. **Section 2: Hero Section (Full Viewport Height)**
   - Background: Autoplaying looping muted video with bottom fade-to-black gradient.
   - Overlapping 3-avatar social proof row (`10,000+ daily quests conquered`).
   - H1 Headline: `Order Your Life. Become Great.` (with *"Life."* in Instrument Serif italic).
   - Subtitle: Explaining the focused to-do list + habit tracking system for building calm consistency.
   - Action: Liquid-glass capsule input form with email field + high-contrast `"START QUEST"` button (routes to signup with email parameter).
3. **Section 3: The Problem Section ("From Scrambled Days to Mastery")**
   - H2 Headline: `Stop living a scrambled life.`
   - Narrative paragraph about how lack of structure and forgotten routines stall ambitions.
   - 3 Feature Grid Cards (Liquid-glass, each with a 200×200 monochrome graphic):
     - Card A: **The Focus To-Do List** (cutting noise, prioritizing today).
     - Card B: **The Habit Engine** (atomic routines, streak compounding).
     - Card C: **Tangible Evolution** (stat growth in Strength, Intellect, Discipline).
   - Bottom Tagline: *"If you don't take control of your habits, your habits will take control of you."*
4. **Section 4: Philosophy Section (Scroll-Driven Word Reveal)**
   - Centerpiece: 800×800 rounded looping ambient video.
   - Scroll Text Block 1: Scroll-driven opacity reveal (0.15 → 1.0) highlighting *daily*, *habits*, *relentless*, *consistency*, *greatness*.
   - Scroll Text Block 2: Secondary reveal emphasizing *goals*, *routines*, and *momentum*.
5. **Section 5: The System Section**
   - Tracking uppercase label: `THE SYSTEM`.
   - H2 Headline: `The framework for consistent achievement`.
   - Wide 3:1 aspect ratio looping product video.
   - 4-column feature card grid (`Focused Quests`, `Streak Discipline`, `AI Habit Coach`, `RPG Progression`).
6. **Section 6: CTA Section**
   - Background: Mux HLS `.m3u8` video stream via `hls.js` with Safari native fallback.
   - Concentric circles logo icon.
   - Heading: `Begin Your Quest Today`.
   - Subtitle encouraging immediate action.
   - Action Buttons: Primary `"Start Your Quest"` (`/signup`) + Liquid-glass `"Sign In"` (`/login`).
7. **Section 7: Footer**
   - Left: Copyright string (`© 2026 Quest. All rights reserved.`).
   - Right: Links for `Privacy`, `Terms`, `Contact`.

---

## Page 2: Dashboard / Lodge (`/app`)

*Mental Model:* The daily command center. Blends real-world daily task execution with the RPG companion lodge.

### Chronological Section Order (Utility First, Peak-End):

```
[ Section 1: Daily Progress Overworld Banner ]
               ↓
[ Section 2: Today's Daily Quests Section ]
               ↓
[ Section 3: "On Your Path Today" (Due Todos Section) ]
               ↓
[ Section 4: Game Lodge Section (GameSection view="lodge") ]
```

### Detailed Elements in Each Section:
1. **Section 1: Daily Progress Overworld Banner (`OverworldBanner.tsx`)**
   - Pixel art landscape banner.
   - Numerical counter: `X of Y daily quests completed`.
   - Progress bar showing daily completion percentage.
   - Streak counter badge (`🔥 X day streak`).
2. **Section 2: Today's Daily Quests (`TaskList.tsx`)**
   - Header: `"Small steps, real progress."` + `"Add quest"` link (routes to `/app/todos`).
   - Instructional subtext: *"Finish a quest to earn companion XP, gold, and a move card."*
   - List of Dailies: Each item has checkbox (completion trigger with audio fanfare), quest title, attribute badge (`Strength`, `Intellect`, `Discipline`, `Creativity`), difficulty badge, and edit/delete actions.
   - Empty state if no dailies exist.
3. **Section 3: "On Your Path Today" (Due Todos)**
   - *Conditional*: Renders only if user has one-off todos due today or overdue.
   - Header: `"On your path today"`.
   - List of up to 5 prioritized todos (`TaskList.tsx`).
4. **Section 4: Game Lodge (`GamePanel.tsx`)**
   - Header bar: Title (`The Lodge`), subtitle (`Rest companions and choose your active partner`), and **Music/SFX Mute Toggle Button** (`AudioController`).
   - Active Companion Showcase:
     - Companion pixel art sprite + nickname + species name.
     - Companion Level and Companion XP bar with numerical progress.
     - Companion HP vital bar.
     - Action button: `"Rest at Lodge"` (restores companion HP once per UTC day).
   - Wild Encounter Alert (conditional): If a wild Pokémon has appeared today, renders a quick-travel alert button: `"A wild creature appeared! Enter battle →"`.
   - Starter Selection (only shown for first-time users before companion selection).

---

## Page 3: Quests (`/app/todos`)

*Mental Model:* The comprehensive task management hub for all actionable items (To-dos, Dailies, and Habits).

### Chronological Section Order (Hick's & Jakob's Law):

```
[ Section 1: Page Header ]
               ↓
[ Section 2: QuestTabs - Filter Tabs Bar ]
               ↓
[ Section 3: Add Task Form (Contextual) ]
               ↓
[ Section 4: AI Habit Coach Promotion Banner ]
               ↓
[ Section 5: Active Quests Section ]
               ↓
[ Section 6: Completed Quests Section (Conditional) ]
```

### Detailed Elements in Each Section:
1. **Section 1: Page Header**
   - H1: `"Quests"`.
   - Subtitle: `"Daily intentions, habits, and one-off goals."`.
2. **Section 2: Filter Tabs Bar (`QuestTabs.tsx`)**
   - 4 filter pill buttons with live count badges:
     - `All (Total Count)`
     - `To-Dos (Count)`
     - `Dailies (Count)`
     - `Habits (Count)`
   - Switching tabs plays audio navigation feedback.
3. **Section 3: Add Task Form (`AddTaskForm.tsx`)**
   - Collapsed state: Full-width button `"+ Add quest"`.
   - Expanded state modal/card:
     - Quest Title input field.
     - Type dropdown: `Todo`, `Daily`, `Habit` (automatically defaults to currently selected tab).
     - Difficulty dropdown: `Easy (+10 XP)`, `Medium (+20 XP)`, `Hard (+30 XP)`.
     - Attribute dropdown: `None`, `Strength`, `Intellect`, `Discipline`, `Creativity`.
     - Due Date picker (visible when type is `Todo`).
     - Action buttons: `"Save"` and `"Cancel"`.
4. **Section 4: AI Habit Coach Promotion Banner**
   - Clickable card linking to `/onboarding`.
   - Text: `"AI Habit Coach — Answer a few questions, get a personalised quest list."` + chevron icon.
   - Sits right above active tasks as a progressive disclosure ramp.
5. **Section 5: Active Quests Section**
   - Header: `"Active (Count)"`.
   - Interactive list (`TaskList.tsx`):
     - Clickable circular check button (triggers completion celebration, XP, gold, move cards, and audio fanfare).
     - Title with strike-through on completion.
     - Badges row: Task Type (`daily`, `habit`, `todo`), Attribute, Difficulty, Habit streak count (if habit), Due date.
     - Edit button (inline editor) & Delete button.
6. **Section 6: Completed Quests Section**
   - *Conditional*: Renders when completed tasks exist.
   - Header: `"Completed (Count)"`.
   - List of completed tasks with checkmark state.

---

## Page 4: Habits (`/app/habits`)

*Mental Model:* Dedicated habit tracking page with consecutive day streak counters.

### Chronological Section Order (Recognition > Creation):

```
[ Section 1: Page Header ]
               ↓
[ Section 2: Your Habits List ]
               ↓
[ Section 3: Add Habit Form ]
```

### Detailed Elements in Each Section:
1. **Section 1: Page Header**
   - H1: `"Habits"`.
   - Subtitle: `"Earn cards once per habit per UTC day. Your streak grows with consecutive daily completions."`.
2. **Section 2: Your Habits List (`TaskList.tsx`)**
   - Header: `"Your habits"`.
   - Items sorted by longest streak count first.
   - Displays flame icon + streak count (`🔥 X`).
   - Displays daily reset badge: `"Reward earned · resets at midnight UTC"`.
3. **Section 3: Add Habit Form (`AddTaskForm.tsx`)**
   - Pre-configured with `defaultType="habit"`. Sits beneath existing habits to prioritize daily check-ins.

---

## Page 5: Battle Arena (`/app/battle`)

*Mental Model:* Interactive tactical battle arena where tasks provide combat power.

### Current Chronological Order:

```
[ Section 1: Battle Header & Music Controller ]
               ↓
[ Section 2: Battle Arena Canvas ]
    ├── Upper Arena: Wild Encounter Area
    └── Lower Arena: Active Companion Area
               ↓
[ Section 3: Action Deck / Move Cards Hand ]
               ↓
[ Section 4: Battle Log / Turn Narrative Feedback ]
```

### Detailed Elements in Each Section:
1. **Section 1: Header & Audio Controller**
   - Title: `"Battle Arena"`.
   - Subtitle: `"Use move cards earned from finishing quests to challenge wild creatures."`.
   - Mute / Audio Controller button.
2. **Section 2: Battle Arena (`BattleArena.tsx`)**
   - **Wild Opponent (Top Right)**:
     - Opponent creature sprite (pixel animated).
     - Opponent species name & difficulty tier badge.
     - Opponent HP Vital Bar (current HP / max HP).
   - **Player Companion (Bottom Left)**:
     - Companion pixel sprite.
     - Companion name, level, and current HP Vital Bar.
3. **Section 3: Move Cards Hand**
   - Grid of available move cards earned by completing to-dos:
     - Physical / Strength cards (e.g. `Tackle`, `Slam`).
     - Electric / Intellect cards (e.g. `Shock`, `Overload`).
     - Earth / Discipline cards (e.g. `Quake`, `Guard Break`).
     - Wind / Creativity cards (e.g. `Confuse`, `Flash`).
     - Energy cards (e.g. `Energy`).
   - Card details: Move name, base power, quantity badge (`x3`).
   - Clicking a card triggers the move animation and elemental SFX.
4. **Section 4: Battle Log & Feedback**
   - Turn narrative: Damage dealt, counter-damage taken, or capture announcement.
   - Capture victory fanfare + announcer voiceover when opponent is defeated.

---

## Page 6: Team & Companions (`/app/team`)

*Mental Model:* Party management and companion progression.

### Current Chronological Order:

```
[ Section 1: Page Header & Sound Control ]
               ↓
[ Section 2: Active Companion Primary Card ]
               ↓
[ Section 3: Companion Roster (Caught Team Members) ]
               ↓
[ Section 4: Known Move Cards Inventory ]
```

### Detailed Elements in Each Section:
1. **Section 1: Header**
   - Title: `"Companions & Cards"`.
   - Subtitle: `"Grow together, one day at a time."`.
2. **Section 2: Active Companion Showcase**
   - Pixel sprite with elemental aura.
   - Level, total XP, current HP bar, and status badge (`Active`).
3. **Section 3: Roster Grid**
   - Cards for all captured creatures.
   - Stats for each creature (Level, HP, Base Attack).
   - `"Switch Active Companion"` button.
4. **Section 4: Move Cards Inventory**
   - Inventory list of all move cards in the player's deck grouped by species.

---

## Page 7: Pokédex & Collection (`/app/pokedex`)

*Mental Model:* Lore, creature discovery, and encyclopedia.

### Current Chronological Order:

```
[ Section 1: Header & Discovery Metric Counter ]
               ↓
[ Section 2: Dex Species Grid (Unlocked & Shadow Silhouettes) ]
               ↓
[ Section 3: Selected Species Lore Modal / Drawer ]
```

### Detailed Elements in Each Section:
1. **Section 1: Header**
   - Title: `"Pokédex"`.
   - Metric pill: `"Caught: X / Total"`.
2. **Section 2: Dex Grid**
   - Grid of species cards (1 to 8):
     - Unlocked creatures show full pixel art, species name, and elemental type.
     - Undiscovered creatures show silhouette and `???`.
     - Capture timestamp for caught species.
3. **Section 3: Species Detail View**
   - Lore description, base stats (Base HP, Base Attack, Rarity, Tier), and associated elemental attribute.

---

## Page 8: Calendar (`/app/calendar`)

*Mental Model:* Schedule planning and milestone overview.

### Current Chronological Order:

```
[ Section 1: Page Header ]
               ↓
[ Section 2: Month Navigation Controls ]
               ↓
[ Section 3: Monthly Calendar Grid ]
               ↓
[ Section 4: Day Agenda / Selected Date Task Sidebar ]
```

### Detailed Elements in Each Section:
1. **Section 1: Header**
   - Title: `"Calendar"`.
   - Subtitle: `"Your dailies and todos laid out by date."`.
2. **Section 2: Month Navigation**
   - Previous Month (`<`), Current Month Name & Year, Next Month (`>`).
3. **Section 3: Monthly Grid**
   - 7-day columns (Mon–Sun).
   - Date cells with task indicator dots colored by task difficulty/attribute.
   - Highlight for current date.
4. **Section 4: Selected Date Agenda**
   - Expanded list of tasks due on the clicked day.

---

## Page 9: Shop & Rewards (`/app/rewards`)

*Mental Model:* Intrinsic reward redemption. Spend currency earned from completing tasks on badges, themes, and lodge items.

### Chronological Section Order (Endowment Effect First):

```
[ Section 1: Header & Currency Balance Badge ]
               ↓
[ Section 2: Game Shop Atmosphere Banner (GameSection view="shop") ]
               ↓
[ Section 3: Grouped Shop Items Grid ]
    ├── Category A: Badges
    ├── Category B: Themes
    └── Category C: Cosmetics
```

### Detailed Elements in Each Section:
1. **Section 1: Header & Currency Balance**
   - Title: `"Little rewards for the journey"`.
   - Subtitle: `"Spend your hard-earned currency on cosmetics and badges."`.
   - Gold Balance Pill: `💰 [Currency Amount]`. Visible before purchase targets to anchor spending.
2. **Section 2: Game Shop Atmosphere Banner**
   - Apothecary and companion item status.
3. **Section 3: Grouped Shop Items Grid (`ShopGrid.tsx`)**
   - **Badges**: Sword (`Cyber Warrior`), Bow (`Shadow Rogue`), Orb (`Arcane Scholar`), Shield (`Iron Will`).
   - **Themes & Cosmetics**: `Gold Frame`, `Dragon Aura`.
   - Item Cards: Icon image, Item name, Description, Cost in gold, and `"Buy"` button (or `"✓ Owned"` badge).

---

## Page 10: Leaderboard (`/app/leaderboard`)

*Mental Model:* Social proof, competitive motivation, and ranking.

### Current Chronological Order:

```
[ Section 1: Page Header ]
               ↓
[ Section 2: Top 50 Ranked Adventurers List ]
```

### Detailed Elements in Each Section:
1. **Section 1: Header**
   - Title: `"Leaderboard"`.
   - Subtitle: `"Top 50 adventurers ranked by level and XP."`.
2. **Section 2: Rankings List**
   - Top 3 highlighted with special medal icons (`🥇`, `🥈`, `🥉`) and gold/silver/bronze text.
   - Current user highlighted with cyan border and `(you)` badge.
   - Row elements: Rank number, User avatar initial, Username, Level Badge (`Lv. X`), Total XP, Trophy icon.

---

## Page 11: Character Sheet / Profile (`/app/profile`)

*Mental Model:* Identity, comprehensive vitals, account statistics, and personal inventory.

### Chronological Section Order (4-Chunk Limit / Glance-then-Dig):

```
[ Section 1: Page Title ]
               ↓
[ Section 2: Quick Stats 4-Card Grid ]
               ↓
[ Section 3: Primary Character Card (Avatar + Levels + Vitals) ]
               ↓
[ Section 4: Acquired Inventory Grid ]
               ↓
[ Section 5: Account Actions (Sign Out) ]
```

### Detailed Elements in Each Section:
1. **Section 1: Title**
   - `"Character Sheet"`.
2. **Section 2: Stats Grid (4 Cards)**
   - Card 1: `Level` (Zap icon + level number).
   - Card 2: `Currency` (Coin icon + gold amount).
   - Card 3: `HP` (Shield icon + current / max HP).
   - Card 4: `Streak` (Flame icon + streak days).
   - *Provides an instant 4-chunk working memory summary before deep inspection.*
3. **Section 3: Primary Character Card**
   - Large avatar initial circle.
   - Username, Level Badge, and Title rank (`Novice`, `Apprentice`, `Journeyman`, `Expert`, `Master`).
   - Full XP Bar + numerical `"X XP to next level"`.
   - Full HP Vital Bar (`Current HP / Max HP`).
3. **Section 3: Stats Grid (4 Cards)**
   - Card 1: `Level` (Zap icon + level number).
   - Card 2: `Currency` (Coin icon + gold amount).
   - Card 3: `HP` (Shield icon + ratio).
   - Card 4: `Streak` (Flame icon + streak days).
4. **Section 4: Inventory Section**
   - Grid of unlocked badges and cosmetic items owned by the user.
5. **Section 5: Account Actions**
   - Sign Out button (`signOut` server action).

---

## Page 12: AI Habit Coach Onboarding (`/onboarding`)

*Mental Model:* Multi-step structured questionnaire that generates personalized starter quests using AI.

### Chronological Step Order:

```
[ Step Indicator: 1 • 2 • 3 • 4 ]
               ↓
[ Step 1: Core Focus Areas (Multi-select) ]
               ↓
[ Step 2: Energy Window & Time Budget (Single-select) ]
               ↓
[ Step 3: Blockers & Open Intentions (Multi-select + Text) ]
               ↓
[ Step 4: AI Recommendations Review & Commit ]
```

### Detailed Elements in Each Step:
1. **Top Bar**:
   - Step indicator dots / pill indicators (`Step X of 4`).
   - Skip to app link button (`"Skip"`).
2. **Step 1: Focus Areas**
   - Header: `"What areas of your life need attention?"`.
   - Multi-select chips: `Fitness`, `Study / Learning`, `Career`, `Creativity`, `Sleep`, `Social`, `Finances`.
3. **Step 2: Rhythm & Budget**
   - Energy window selector: `Morning`, `Afternoon`, `Evening`, `Flexible`.
   - Daily time budget selector: `<30m`, `30-60m`, `1-2h`, `2h+`.
4. **Step 3: Friction & Goals**
   - Multi-select blockers: `Forget`, `Lose motivation`, `Too busy`, `Don't know where to start`, `Perfectionism`.
   - Textarea: Primary 3-month goal.
   - Textarea: Habits currently working.
5. **Step 4: AI Quest List Review**
   - Header: `"Your starter quest list"`.
   - Select all / Clear controls.
   - Suggestion Cards: Checkbox, Quest title, Type badge (`daily`, `habit`, `todo`), Attribute badge, Difficulty badge, and Rationale note.
   - Action buttons: `"Skip"` and `"Add X quests"` (commits to Supabase and navigates to `/app/todos`).

---

## Page 13: Authentication Pages (`/login` & `/signup`)

### A. Login (`/login`)
Chronological Order (Top to Bottom):
1. Logo & Brand: Sword icon + `"Quest"`.
2. Heading & Subtitle: `"Welcome back, adventurer"` / `"Sign in to continue your quest"`.
3. Form Card:
   - Email input.
   - Password input.
   - `"Sign In"` button.
4. Switch Link: `"Don't have an account? Create one"`.

### B. Sign Up (`/signup`)
Chronological Order (Top to Bottom):
1. Logo & Brand: Sword icon + `"Quest"`.
2. Heading & Subtitle: `"Create your character"` / `"Begin your adventure today"`.
3. Form Card:
   - Username input.
   - Email input.
   - Password input.
   - Starting Attribute Radio Choice (`Strength`, `Intellect`, `Discipline`, `Creativity`).
   - `"Begin Adventure"` submit button.
4. Switch Link: `"Already have an account? Sign in"`.

---

## UX Team Guidance & Prompts for Re-Ordering

When reviewing this architecture to improve simplicity, minimalism, and focus:

1. **Dashboard (`/app`)**:
   - *Question for UX:* Should **Today's Daily Quests** and **Due Today Todos** appear *above* or *below* the **Game Lodge / Battle Banner**?
   - *Consideration:* Placing the task list first allows busy users to check off items immediately upon opening the app, while keeping the lodge below as a rewarding destination.
2. **Quests Hub (`/app/todos`)**:
   - *Question for UX:* Should the **Filter Tabs** appear directly at the top above the AI banner, so tab switching is the very first interactive touchpoint?
3. **Character Sheet (`/app/profile`)**:
   - *Question for UX:* Should the **4-Card Quick Stats Grid** sit above the large character vitals card to provide an instant glanceable summary on mobile screens?
4. **Consistency**:
   - Keeping the same order across similar pages (`Header → Primary Action/Form → Active Content → Completed/History`) creates muscle memory across the entire app.
