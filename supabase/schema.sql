-- ============================================================
-- Life RPG — Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- 1. Users profile table (extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  level int not null default 1,
  xp int not null default 0,
  hp int not null default 100,
  max_hp int not null default 100,
  currency int not null default 0,
  streak_count int not null default 0,
  last_active_date date,
  created_at timestamptz not null default now()
);

-- 2. Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('daily', 'todo', 'habit')),
  title text not null,
  attribute text check (attribute in ('Strength', 'Intellect', 'Discipline', 'Creativity')),
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  due_date date,
  recurrence_rule text,
  is_completed boolean not null default false,
  habit_streak int not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Task logs (historical record)
create table if not exists public.task_logs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references public.tasks(id) on delete set null,
  user_id uuid not null references public.users(id) on delete cascade,
  completed_at timestamptz not null default now(),
  xp_awarded int not null default 0,
  currency_awarded int not null default 0
);

-- 4. Shop items
create table if not exists public.shop_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cost int not null default 0,
  type text not null check (type in ('cosmetic', 'theme', 'badge')),
  icon text,
  created_at timestamptz not null default now()
);

-- 5. User inventory
create table if not exists public.user_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  item_id uuid not null references public.shop_items(id) on delete cascade,
  acquired_at timestamptz not null default now(),
  unique(user_id, item_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.users enable row level security;
alter table public.tasks enable row level security;
alter table public.task_logs enable row level security;
alter table public.user_inventory enable row level security;
alter table public.shop_items enable row level security;

-- Users: can only read/update own row
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);

-- Tasks: full CRUD on own tasks
create policy "tasks_select_own" on public.tasks for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update using (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete using (auth.uid() = user_id);

-- Task logs: read/insert own
create policy "task_logs_select_own" on public.task_logs for select using (auth.uid() = user_id);
create policy "task_logs_insert_own" on public.task_logs for insert with check (auth.uid() = user_id);

-- Shop items: everyone can read
create policy "shop_items_select_all" on public.shop_items for select using (true);

-- User inventory: own rows
create policy "inventory_select_own" on public.user_inventory for select using (auth.uid() = user_id);
create policy "inventory_insert_own" on public.user_inventory for insert with check (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create user profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Seed: Shop items
-- ============================================================

insert into public.shop_items (name, description, cost, type, icon) values
  ('Cyber Warrior Badge', 'Awarded to those who conquer the digital frontier.', 50, 'badge', '⚔️'),
  ('Shadow Rogue Badge', 'For those who move unseen through the darkness.', 75, 'badge', '🗡️'),
  ('Arcane Scholar Badge', 'Knowledge is the greatest power.', 60, 'badge', '📚'),
  ('Iron Will Badge', 'Unbreakable. Unstoppable.', 100, 'badge', '🛡️'),
  ('Neon Theme', 'Unlock the neon pink color scheme.', 200, 'theme', '🌸'),
  ('Matrix Theme', 'Go full green-on-black hacker mode.', 200, 'theme', '💚'),
  ('Gold Frame', 'A golden profile frame for your character.', 150, 'cosmetic', '🏆'),
  ('Dragon Aura', 'Surround your profile with dragon fire.', 300, 'cosmetic', '🐉')
on conflict do nothing;
