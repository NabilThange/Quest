-- Apply after supabase/schema.sql. All game mutations share a per-user row lock.
begin;

create table public.species (
  id int primary key,
  name text not null unique,
  sprite_url text,
  elemental_type text not null check (elemental_type in ('Strength','Intellect','Discipline','Creativity')),
  base_hp int not null check (base_hp > 0),
  base_attack int not null check (base_attack > 0),
  rarity int not null default 1 check (rarity > 0),
  tier int not null default 1 check (tier > 0),
  starter boolean not null default false
);
create table public.moves (
  id int primary key,
  species_id int not null references public.species(id),
  name text not null,
  type text not null check (type in ('Strength','Intellect','Discipline','Creativity','Energy')),
  base_power int not null check (base_power > 0),
  icon text not null,
  unlock_level int not null default 1 check (unlock_level > 0)
);
create table public.user_pokemon (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  species_id int not null references public.species(id),
  nickname text,
  level int not null default 1 check (level > 0),
  xp int not null default 0 check (xp >= 0),
  current_hp int not null check (current_hp >= 0),
  max_hp int not null check (max_hp > 0 and current_hp <= max_hp),
  status text not null check (status in ('active','fainted','boxed')),
  caught_at timestamptz not null default now()
);
create unique index one_active_companion on public.user_pokemon(user_id) where status = 'active';
create index team_by_user on public.user_pokemon(user_id);
create table public.move_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  move_id int not null references public.moves(id),
  pokemon_id uuid not null references public.user_pokemon(id) on delete cascade,
  quantity int not null default 0 check (quantity >= 0),
  unique(pokemon_id, move_id)
);
create index cards_by_user on public.move_cards(user_id);
create table public.wild_encounters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  species_id int not null references public.species(id),
  current_hp int not null check (current_hp >= 0),
  max_hp int not null check (max_hp > 0 and current_hp <= max_hp),
  difficulty_tier int not null check (difficulty_tier > 0),
  spawned_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  status text not null default 'active' check (status in ('active','captured','fled')),
  check (expires_at > spawned_at)
);
create unique index one_active_encounter on public.wild_encounters(user_id) where status = 'active';
create index encounters_by_user on public.wild_encounters(user_id, spawned_at desc);
create table public.pokedex_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  species_id int not null references public.species(id),
  status text not null check (status in ('seen','caught')),
  first_seen_at timestamptz not null default now(),
  caught_at timestamptz,
  unique(user_id, species_id)
);
create table public.battle_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  encounter_id uuid not null references public.wild_encounters(id),
  card_id uuid not null references public.move_cards(id),
  request_id uuid not null,
  damage_dealt int not null check (damage_dealt > 0),
  counter_damage int not null default 0,
  captured boolean not null default false,
  timestamp timestamptz not null default now(),
  unique(user_id, request_id)
);
create table public.user_attributes (
  user_id uuid not null references public.users(id) on delete cascade,
  attribute text not null check (attribute in ('Strength','Intellect','Discipline','Creativity')),
  xp int not null default 0 check (xp >= 0),
  primary key(user_id, attribute)
);
alter table public.users add column active_pokemon_id uuid references public.user_pokemon(id) on delete set null;
alter table public.users add column last_rollover_date date;
alter table public.users add column last_rest_date date;
alter table public.users add column missed_dailies boolean not null default false;
alter table public.tasks add column last_rewarded_at timestamptz;
create index task_reward_history on public.task_logs(user_id, task_id, completed_at);
update public.tasks t set last_rewarded_at = (select max(l.completed_at) from public.task_logs l where l.task_id = t.id);
update public.users u set last_rollover_date = coalesce(last_active_date, (created_at at time zone 'UTC')::date),
  last_active_date = (select (max(l.completed_at) at time zone 'UTC')::date from public.task_logs l where l.user_id = u.id);

insert into public.species(id,name,elemental_type,base_hp,base_attack,starter) values
 (1,'Emberpup','Strength',45,12,true), (2,'Voltling','Intellect',38,15,true),
 (3,'Mossling','Discipline',50,10,true), (4,'Prismling','Creativity',40,13,true),
 (5,'Rockjaw','Strength',55,14,false), (6,'Sparkbat','Intellect',42,17,false),
 (7,'Stonepaw','Discipline',58,11,false), (8,'Glimmox','Creativity',44,15,false);
insert into public.moves(id,species_id,name,type,base_power,icon,unlock_level)
select id*10, id,
 case elemental_type when 'Strength' then 'Tackle' when 'Intellect' then 'Shock' when 'Discipline' then 'Quake' else 'Confuse' end,
 elemental_type, 18,
 case elemental_type when 'Strength' then '✦' when 'Intellect' then 'ϟ' when 'Discipline' then '◆' else '✧' end, 1
from public.species;
insert into public.moves(id,species_id,name,type,base_power,icon,unlock_level)
select id*10+1, id,
 case elemental_type when 'Strength' then 'Slam' when 'Intellect' then 'Overload' when 'Discipline' then 'Guard Break' else 'Flash' end,
 elemental_type, 30, '✺', 3 from public.species;
insert into public.moves(id,species_id,name,type,base_power,icon,unlock_level)
select id*10+2,id,'Energy','Energy',10,'○',1 from public.species;

-- Clients read their game state; only the transactional RPC writes it.
do $$
declare t text;
begin
  foreach t in array array['species','moves','user_pokemon','move_cards','wild_encounters','pokedex_entries','battle_logs','user_attributes'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to authenticated', t);
    if t in ('species','moves') then
      execute format('create policy read_catalog on public.%I for select to authenticated using (true)', t);
    else
      execute format('create policy read_own on public.%I for select to authenticated using (auth.uid() = user_id)', t);
    end if;
  end loop;
end $$;
-- Preserve task CRUD but prevent direct edits to completion/reward fields.
revoke insert, update, delete on public.users from anon, authenticated;
revoke insert, update on public.tasks from anon, authenticated;
grant insert(user_id,title,type,difficulty,attribute,due_date,recurrence_rule) on public.tasks to authenticated;
grant update(title,difficulty,attribute,due_date,recurrence_rule) on public.tasks to authenticated;
revoke insert, update, delete on public.task_logs, public.user_inventory from anon, authenticated;

create function public.rpg_xp_needed(p_level int) returns int
language sql immutable strict set search_path = public
as $$ select round(100 * power(p_level::numeric, 1.5))::int $$;

-- A four-type cycle: Strength > Discipline > Intellect > Creativity > Strength.
create function public.rpg_damage(p_power int, p_level int, p_type text, p_defender text, p_roll numeric)
returns int language sql immutable strict set search_path = public
as $$
 select greatest(1, round(p_power * (1 + p_level * 0.08) * p_roll *
 case when (p_type,p_defender) in (('Strength','Discipline'),('Discipline','Intellect'),('Intellect','Creativity'),('Creativity','Strength')) then 1.5
 when (p_defender,p_type) in (('Strength','Discipline'),('Discipline','Intellect'),('Intellect','Creativity'),('Creativity','Strength')) then 0.75
 else 1 end)::int)
$$;

create function public.rpg_award_xp(p_id uuid, p_xp int) returns void
language plpgsql set search_path = public as $$
declare p public.user_pokemon; old_max int; base int;
begin
 select * into strict p from public.user_pokemon where id = p_id for update;
 old_max := p.max_hp;
 p.xp := p.xp + p_xp;
 while p.xp >= public.rpg_xp_needed(p.level) loop
   p.xp := p.xp - public.rpg_xp_needed(p.level); p.level := p.level + 1;
 end loop;
 select base_hp into base from public.species where id = p.species_id;
 p.max_hp := base + p.level * 5;
 update public.user_pokemon set xp = p.xp, level = p.level, max_hp = p.max_hp,
 current_hp = case when current_hp = 0 then 0 else least(p.max_hp, current_hp + p.max_hp - old_max) end where id = p.id;
end $$;

create function public.rpg_snapshot(p_user uuid) returns jsonb
language sql stable set search_path = public as $$
 select jsonb_build_object(
 'profile', (select to_jsonb(u) from public.users u where id = p_user),
 'species', (select coalesce(jsonb_agg(s order by s.id),'[]'::jsonb) from public.species s),
 'moves', (select coalesce(jsonb_agg(m order by m.id),'[]'::jsonb) from public.moves m),
 'team', (select coalesce(jsonb_agg(p order by p.caught_at),'[]'::jsonb) from public.user_pokemon p where user_id = p_user),
 'cards', (select coalesce(jsonb_agg(c order by c.move_id),'[]'::jsonb) from public.move_cards c where user_id = p_user),
 'encounter', (select to_jsonb(e) from public.wild_encounters e where user_id = p_user order by spawned_at desc limit 1),
 'dex', (select coalesce(jsonb_agg(d),'[]'::jsonb) from public.pokedex_entries d where user_id = p_user),
 'attributes', (select coalesce(jsonb_agg(a),'[]'::jsonb) from public.user_attributes a where user_id = p_user),
 'logs', (select coalesce(jsonb_agg(l order by l.timestamp desc),'[]'::jsonb) from
   (select * from public.battle_logs where user_id = p_user order by timestamp desc limit 20) l)
 )
$$;

create function public.life_rpg(p_action text default 'refresh', p_id uuid default null,
 p_species int default null, p_request uuid default null, p_encounter uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
 uid uuid := auth.uid(); u public.users; p public.user_pokemon; s public.species;
 e public.wild_encounters; c public.move_cards; m public.moves; t public.tasks; item public.shop_items;
 previous public.battle_logs;
 today date := (now() at time zone 'UTC')::date;
 reward jsonb := null; turn_result jsonb := null;
 xp_gain int; gold_gain int; cards_gain int; old_level int; damage int; chip int;
 chosen_move int; v_tier int; candidate_tier int; hp int; milestone boolean := false;
 last_spawn timestamptz; spawn_gap interval;
begin
 if uid is null then raise exception 'Please sign in again.'; end if;
 if p_action not in ('refresh','choose','complete','attack','switch','rest','potion','purchase') or p_action is null then
   raise exception 'Unknown game action.';
 end if;
 select * into u from public.users where id = uid for update;
 if not found then raise exception 'Profile not found.'; end if;

 if u.last_rollover_date is distinct from today then
   u.missed_dailies := exists (
     select 1 from public.tasks quest where quest.user_id = uid and quest.type = 'daily'
     and (quest.created_at at time zone 'UTC')::date < today
     and not exists (select 1 from public.task_logs l where l.task_id = quest.id
       and (l.completed_at at time zone 'UTC')::date = today - 1)
   );
   update public.tasks set is_completed = false where user_id = uid and type = 'daily';
   if u.last_active_date is null or u.last_active_date < today - 1 then u.streak_count := 0; end if;
   update public.users set last_rollover_date = today, missed_dailies = u.missed_dailies,
     streak_count = u.streak_count where id = uid;
 end if;
 update public.wild_encounters set status = 'fled' where user_id = uid and status = 'active' and expires_at <= now();

 if p_action = 'choose' then
   if exists (select 1 from public.user_pokemon where user_id = uid) then raise exception 'You already chose a starter.'; end if;
   select * into s from public.species where id = p_species and starter;
   if not found then raise exception 'Choose one of the four starters.'; end if;
   insert into public.user_pokemon(user_id,species_id,current_hp,max_hp,status)
     values(uid,s.id,s.base_hp+5,s.base_hp+5,'active') returning * into p;
   u.active_pokemon_id := p.id;
   update public.users set active_pokemon_id = p.id where id = uid;
   insert into public.pokedex_entries(user_id,species_id,status,caught_at) values(uid,s.id,'caught',now());
 end if;

 if p_action = 'complete' then
   select * into p from public.user_pokemon where id = u.active_pokemon_id and user_id = uid;
   if not found then raise exception 'Choose your starter at the lodge before earning cards.'; end if;
   select * into t from public.tasks where id = p_id and user_id = uid for update;
   if not found then raise exception 'Task not found.'; end if;
   if (t.type = 'todo' and (t.is_completed or t.last_rewarded_at is not null))
      or (t.type <> 'todo' and (t.last_rewarded_at at time zone 'UTC')::date = today) then
     raise exception 'This quest has already earned its reward. Daily quests and habits reset at midnight UTC.';
   end if;
   xp_gain := case t.difficulty when 'easy' then 10 when 'hard' then 30 else 20 end;
   gold_gain := xp_gain / 2;
   cards_gain := case t.difficulty when 'hard' then 3 else 1 end;
   if u.last_active_date is distinct from today then
     u.streak_count := case when u.last_active_date = today - 1 then u.streak_count + 1 else 1 end;
     milestone := u.streak_count in (7,30,100);
   end if;
   if milestone then xp_gain := xp_gain + 100; gold_gain := gold_gain + 50; cards_gain := cards_gain + 1; end if;
   old_level := u.level;
   u.xp := u.xp + xp_gain;
   while u.xp >= public.rpg_xp_needed(u.level) loop
     u.xp := u.xp - public.rpg_xp_needed(u.level); u.level := u.level + 1;
   end loop;
   perform public.rpg_award_xp(p.id, xp_gain);
   -- Use moves known before this completion; newly unlocked moves earn cards next time.
   select id into chosen_move from public.moves where species_id = p.species_id
     and type = coalesce(t.attribute,'Energy') and unlock_level <= p.level order by unlock_level desc, id limit 1;
   if chosen_move is null then
     select id into chosen_move from public.moves where species_id = p.species_id and type = 'Energy';
   end if;
   insert into public.move_cards(user_id,move_id,pokemon_id,quantity) values(uid,chosen_move,p.id,cards_gain)
     on conflict(pokemon_id,move_id) do update set quantity = public.move_cards.quantity + excluded.quantity;
   update public.tasks set is_completed = (type <> 'habit'), last_rewarded_at = now(),
     habit_streak = case when type = 'habit' then
       case when (last_rewarded_at at time zone 'UTC')::date = today-1 then habit_streak+1 else 1 end
       else habit_streak end where id = t.id;
   update public.users set xp = u.xp, level = u.level, currency = currency + gold_gain,
     streak_count = u.streak_count, last_active_date = today where id = uid;
   insert into public.task_logs(task_id,user_id,xp_awarded,currency_awarded) values(t.id,uid,xp_gain,gold_gain);
   if t.attribute is not null then
     insert into public.user_attributes(user_id,attribute,xp) values(uid,t.attribute,xp_gain)
       on conflict(user_id,attribute) do update set xp = public.user_attributes.xp + excluded.xp;
   end if;
   reward := jsonb_build_object('xpGained',xp_gain,'currencyGained',gold_gain,'cardsGained',cards_gain,
     'cardName',(select name from public.moves where id = chosen_move),'leveledUp',u.level > old_level,'newLevel',u.level,
     'milestone',milestone);
 end if;

 if p_action = 'attack' then
   if p_request is null or p_encounter is null then raise exception 'Missing turn identifier.'; end if;
   select * into previous from public.battle_logs where user_id = uid and request_id = p_request;
   if found then
     if previous.card_id <> p_id or previous.encounter_id <> p_encounter then raise exception 'Turn identifier already used.'; end if;
     return jsonb_build_object('state',public.rpg_snapshot(uid),'turn',to_jsonb(previous));
   end if;
   select * into e from public.wild_encounters where id = p_encounter and user_id = uid for update;
   if not found or e.status <> 'active' then
     return jsonb_build_object('state',public.rpg_snapshot(uid),'error','This encounter has ended.');
   end if;
   select * into p from public.user_pokemon where id = u.active_pokemon_id and user_id = uid for update;
   if not found or p.status <> 'active' or p.current_hp <= 0 then raise exception 'Your companion needs rest or a Potion.'; end if;
   select * into c from public.move_cards where id = p_id and user_id = uid and pokemon_id = p.id for update;
   if not found or c.quantity < 1 then raise exception 'No charges left for that card.'; end if;
   select * into m from public.moves where id = c.move_id and species_id = p.species_id and unlock_level <= p.level;
   if not found then raise exception 'Your companion does not know that move.'; end if;
   select * into s from public.species where id = e.species_id;
   damage := public.rpg_damage(m.base_power,p.level,m.type,s.elemental_type,(0.9 + random()*0.2)::numeric);
   e.current_hp := greatest(0,e.current_hp-damage);
   update public.move_cards set quantity = quantity-1 where id = c.id;
   chip := 0;
   if e.current_hp = 0 then
     update public.wild_encounters set current_hp = 0, status = 'captured' where id = e.id;
     insert into public.user_pokemon(user_id,species_id,current_hp,max_hp,status)
       values(uid,s.id,s.base_hp+5,s.base_hp+5,'boxed');
     insert into public.pokedex_entries(user_id,species_id,status,caught_at) values(uid,s.id,'caught',now())
       on conflict(user_id,species_id) do update set status = 'caught', caught_at = coalesce(public.pokedex_entries.caught_at,now());
     perform public.rpg_award_xp(p.id,25);
     update public.users set currency = currency + 15 where id = uid;
   else
     chip := least(p.current_hp,greatest(1,ceil(p.max_hp*0.05)::int));
     update public.wild_encounters set current_hp = e.current_hp where id = e.id;
     update public.user_pokemon set current_hp = current_hp-chip,
       status = case when current_hp-chip <= 0 then 'fainted' else 'active' end where id = p.id;
   end if;
   insert into public.battle_logs(user_id,encounter_id,card_id,request_id,damage_dealt,counter_damage,captured)
     values(uid,e.id,c.id,p_request,damage,chip,e.current_hp = 0) returning * into previous;
   turn_result := to_jsonb(previous);
 end if;

 if p_action in ('switch','rest','potion') then
   select * into p from public.user_pokemon where id = p_id and user_id = uid for update;
   if not found then raise exception 'Companion not found.'; end if;
   if p_action = 'switch' then
     if p.current_hp <= 0 then raise exception 'Heal this companion before making it active.'; end if;
     update public.user_pokemon set status = 'boxed' where user_id = uid and status = 'active';
     update public.user_pokemon set status = 'active' where id = p.id;
     update public.users set active_pokemon_id = p.id where id = uid;
   else
     if p.current_hp = p.max_hp then raise exception 'This companion is already fully rested.'; end if;
     if p_action = 'rest' then
       if u.last_rest_date = today then raise exception 'Free rest returns at midnight UTC.'; end if;
       update public.users set last_rest_date = today where id = uid;
     else
       if u.currency < 20 then raise exception 'A Potion costs 20 gold.'; end if;
       update public.users set currency = currency-20 where id = uid;
     end if;
     update public.user_pokemon set current_hp = max_hp,
       status = case when id = u.active_pokemon_id then 'active' else 'boxed' end where id = p.id;
   end if;
 end if;

 if p_action = 'purchase' then
   select * into item from public.shop_items where id = p_id;
   if not found or item.cost < 0 then raise exception 'Item not found.'; end if;
   if exists (select 1 from public.user_inventory where user_id = uid and item_id = p_id) then raise exception 'Already owned.'; end if;
   if u.currency < item.cost then raise exception 'Insufficient currency.'; end if;
   update public.users set currency = currency-item.cost where id = uid;
   insert into public.user_inventory(user_id,item_id) values(uid,p_id);
 end if;

 -- Spawn only on a lazy app refresh or starter selection, never in the middle of an attack.
 if p_action in ('refresh','choose') and u.active_pokemon_id is not null
   and not exists (select 1 from public.wild_encounters where user_id = uid and status = 'active') then
   select max(spawned_at) into last_spawn from public.wild_encounters where user_id = uid;
   -- A seven-day streak earns a bounded second daily opportunity, never unlimited rerolls.
   spawn_gap := case when u.streak_count >= 7 and not u.missed_dailies then interval '12 hours' else interval '24 hours' end;
   if last_spawn is null or now()-last_spawn >= spawn_gap then
     v_tier := greatest(1,1+(u.level-1)/4) + case when u.missed_dailies then 1 else 0 end;
     select max(candidate.tier) into candidate_tier from public.species candidate where not candidate.starter and candidate.tier <= v_tier;
     select * into s from public.species where not starter and species.tier = candidate_tier
       order by -ln(greatest(random(),0.000001)) * rarity limit 1;
     if found then
       hp := greatest(1,round(s.base_hp*(1+0.15*u.level)*(1+0.1*(v_tier-1)))::int);
       insert into public.wild_encounters(user_id,species_id,current_hp,max_hp,difficulty_tier)
         values(uid,s.id,hp,hp,v_tier);
       insert into public.pokedex_entries(user_id,species_id,status) values(uid,s.id,'seen')
         on conflict(user_id,species_id) do nothing;
     end if;
   end if;
 end if;
 return jsonb_build_object('state',public.rpg_snapshot(uid),'reward',reward,'turn',turn_result);
end $$;

revoke all on function public.rpg_xp_needed(int), public.rpg_damage(int,int,text,text,numeric),
 public.rpg_award_xp(uuid,int), public.rpg_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.life_rpg(text,uuid,int,uuid,uuid) from public, anon;
grant execute on function public.life_rpg(text,uuid,int,uuid,uuid) to authenticated;
commit;
