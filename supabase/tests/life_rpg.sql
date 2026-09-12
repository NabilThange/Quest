-- Run against a disposable Supabase database after schema.sql and the RPG migration:
-- psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/life_rpg.sql
-- Fixtures and all game mutations are rolled back. No testing extension required.
begin;
set local plpgsql.check_asserts = on;

do $$
declare
 actor uuid := gen_random_uuid(); outsider uuid := gen_random_uuid();
 task_id uuid; daily_id uuid; habit_id uuid; foreign_task uuid;
 companion uuid; encounter uuid; card uuid; request uuid;
 captured_species int; quantity_before int; hp_before int;
 reply jsonb; replay jsonb; expired_id uuid; item_id uuid; other_item uuid;
begin
 assert public.rpg_xp_needed(1) = 100, 'Level one threshold';
 assert public.rpg_xp_needed(2) = 283, 'Nonlinear level two threshold';
 assert public.rpg_damage(18,1,'Strength','Discipline',1) = 29, 'Super-effective damage';
 assert public.rpg_damage(18,1,'Discipline','Strength',1) = 15, 'Resisted damage';
 assert public.rpg_damage(10,1,'Energy','Intellect',1) = 11, 'Neutral Energy damage';
 assert public.rpg_damage(18,1,'Strength','Strength',0.9) <= public.rpg_damage(18,1,'Strength','Strength',1.1), 'Damage roll bounds';

 insert into auth.users(id,email,raw_user_meta_data) values
  (actor, actor::text || '@example.invalid',jsonb_build_object('username','test_' || actor::text)),
  (outsider, outsider::text || '@example.invalid',jsonb_build_object('username','test_' || outsider::text));
 perform set_config('request.jwt.claim.sub',actor::text,true);
 perform set_config('request.jwt.claims',jsonb_build_object('sub',actor,'role','authenticated')::text,true);
 perform set_config('test.rpg_actor',actor::text,true);

 reply := public.life_rpg('choose',p_species => 1);
 companion := (reply #>> '{state,profile,active_pokemon_id}')::uuid;
 encounter := (reply #>> '{state,encounter,id}')::uuid;
 assert companion is not null and encounter is not null, 'Starter selection spawns first encounter';
 assert (select current_hp = 50 and max_hp = 50 from public.user_pokemon where id = companion), 'Starter growth formula';
 perform public.life_rpg('refresh');
 assert (select count(*) = 1 from public.wild_encounters where user_id = actor), 'Refresh cannot reroll encounter';
 begin
  perform public.life_rpg('choose',p_species => 2);
  raise exception 'Expected duplicate starter rejection';
 exception when raise_exception then
  if sqlerrm not like 'You already chose%' then raise; end if;
 end;

 insert into public.tasks(user_id,title,type,difficulty,attribute) values(actor,'Study','todo','hard','Intellect') returning id into task_id;
 reply := public.life_rpg('complete',p_id => task_id);
 assert reply #>> '{reward,cardName}' = 'Energy', 'Unknown matching move falls back to Energy';
 assert (reply #>> '{reward,cardsGained}')::int = 3, 'Hard quests earn three cards';
 assert (select xp = 30 from public.user_pokemon where id = companion), 'Companion earns task XP';
 assert (select currency = 15 from public.users where id = actor), 'Task gold accounting';
 select id into card from public.move_cards where pokemon_id = companion and move_id = 12;
 begin
  perform public.life_rpg('complete',p_id => task_id);
  raise exception 'Expected duplicate completion rejection';
 exception when raise_exception then
  if sqlerrm not like 'This quest has already%' then raise; end if;
 end;
 assert (select count(*) = 1 from public.task_logs where user_id = actor), 'Completion logged exactly once';

 insert into public.tasks(user_id,title,type,difficulty,attribute) values(actor,'Exercise','daily','easy','Strength') returning id into daily_id;
 reply := public.life_rpg('complete',p_id => daily_id);
 assert reply #>> '{reward,cardName}' = 'Tackle', 'Known matching move earned';
 insert into public.tasks(user_id,title,type,difficulty,attribute) values(actor,'Walk','habit','medium','Strength') returning id into habit_id;
 perform public.life_rpg('complete',p_id => habit_id);
 begin
  perform public.life_rpg('complete',p_id => habit_id);
  raise exception 'Expected same-day habit rejection';
 exception when raise_exception then
  if sqlerrm not like 'This quest has already%' then raise; end if;
 end;
 assert (select streak_count = 1 from public.users where id = actor), 'Multiple same-day tasks do not inflate streak';
 insert into public.tasks(user_id,title,type) values(outsider,'Not your task','todo') returning id into foreign_task;
 begin
  perform public.life_rpg('complete',p_id => foreign_task);
  raise exception 'Expected foreign task rejection';
 exception when raise_exception then
  if sqlerrm <> 'Task not found.' then raise; end if;
 end;

 request := gen_random_uuid();
 select quantity into quantity_before from public.move_cards where id = card;
 reply := public.life_rpg('attack',p_id => card,p_request => request,p_encounter => encounter);
 select current_hp into hp_before from public.wild_encounters where id = encounter;
 replay := public.life_rpg('attack',p_id => card,p_request => request,p_encounter => encounter);
 assert reply->'turn' = replay->'turn', 'Lost-response retry returns the original turn';
 assert (select current_hp = hp_before from public.wild_encounters where id = encounter), 'Retry does not deal more damage';
 assert (select quantity = quantity_before-1 from public.move_cards where id = card), 'Retry consumes only one card';
 assert (select count(*) = 1 from public.battle_logs where user_id = actor), 'Turn logged once';

 update public.move_cards set quantity = 0 where id = card;
 begin
  perform public.life_rpg('attack',p_id => card,p_request => gen_random_uuid(),p_encounter => encounter);
  raise exception 'Expected empty-card rejection';
 exception when raise_exception then
  if sqlerrm <> 'No charges left for that card.' then raise; end if;
 end;
 assert (select current_hp = hp_before from public.wild_encounters where id = encounter), 'Rejected turn changes no HP';
 update public.move_cards set quantity = 2 where id = card;
 update public.user_pokemon set current_hp = 1 where id = companion;
 perform public.life_rpg('attack',p_id => card,p_request => gen_random_uuid(),p_encounter => encounter);
 assert (select current_hp = 0 and status = 'fainted' from public.user_pokemon where id = companion), 'Counter damage causes fainting';
 begin
  perform public.life_rpg('attack',p_id => card,p_request => gen_random_uuid(),p_encounter => encounter);
  raise exception 'Expected fainted rejection';
 exception when raise_exception then
  if sqlerrm <> 'Your companion needs rest or a Potion.' then raise; end if;
 end;
 perform public.life_rpg('rest',p_id => companion);
 assert (select current_hp = max_hp and status = 'active' from public.user_pokemon where id = companion), 'Free rest revives selected companion';
 update public.user_pokemon set current_hp = 1 where id = companion;
 begin
  perform public.life_rpg('rest',p_id => companion);
  raise exception 'Expected daily rest limit';
 exception when raise_exception then
  if sqlerrm <> 'Free rest returns at midnight UTC.' then raise; end if;
 end;
 update public.users set currency = 0 where id = actor;
 begin
  perform public.life_rpg('potion',p_id => companion);
  raise exception 'Expected insufficient gold rejection';
 exception when raise_exception then
  if sqlerrm <> 'A Potion costs 20 gold.' then raise; end if;
 end;
 update public.users set currency = 20 where id = actor;
 perform public.life_rpg('potion',p_id => companion);
 assert (select currency = 0 from public.users where id = actor), 'Potion charges exactly 20 gold';
 assert (select current_hp = max_hp from public.user_pokemon where id = companion), 'Potion fully heals';

 update public.wild_encounters set current_hp = 1 where id = encounter;
 request := gen_random_uuid();
 reply := public.life_rpg('attack',p_id => card,p_request => request,p_encounter => encounter);
 perform public.life_rpg('attack',p_id => card,p_request => request,p_encounter => encounter);
 assert (reply #>> '{turn,captured}')::boolean, 'Lethal turn captures';
 assert (reply #>> '{turn,counter_damage}')::int = 0, 'Captured opponents cannot counter';
 assert (select count(*) = 2 from public.user_pokemon where user_id = actor), 'Capture replay does not duplicate companion';
 assert (select currency = 15 from public.users where id = actor), 'Capture bounty is paid once';
 select species_id into captured_species from public.wild_encounters where id = encounter;
 assert (select status = 'caught' from public.pokedex_entries where user_id = actor and species_id = captured_species), 'Capture updates dex';

 insert into public.shop_items(name,cost,type) values('Test badge',10,'badge') returning id into item_id;
 insert into public.shop_items(name,cost,type) values('Second badge',10,'badge') returning id into other_item;
 perform public.life_rpg('purchase',p_id => item_id);
 assert (select currency = 5 from public.users where id = actor), 'Shop charges atomically';
 begin
  perform public.life_rpg('purchase',p_id => other_item);
  raise exception 'Expected shop insufficient gold';
 exception when raise_exception then
  if sqlerrm <> 'Insufficient currency.' then raise; end if;
 end;
 assert not exists(select 1 from public.user_inventory where user_id = actor and item_id = other_item), 'Failed purchase creates no inventory';

 insert into public.wild_encounters(user_id,species_id,current_hp,max_hp,difficulty_tier,spawned_at,expires_at)
  values(actor,captured_species,20,20,1,now()-interval '25 hours',now()-interval '1 hour') returning id into expired_id;
 reply := public.life_rpg('attack',p_id => card,p_request => gen_random_uuid(),p_encounter => expired_id);
 assert reply->>'error' = 'This encounter has ended.', 'Expired attack rejected';
 assert (select status = 'fled' from public.wild_encounters where id = expired_id), 'Expiry persists even on rejected attack';
 assert (select status = 'caught' from public.pokedex_entries where user_id = actor and species_id = captured_species), 'Expiry never downgrades caught dex entries';

 perform public.rpg_award_xp(companion,500);
 assert (select level >= 3 and xp < public.rpg_xp_needed(level) from public.user_pokemon where id = companion), 'XP can cross multiple nonlinear levels';
 assert (select max_hp = 45+level*5 from public.user_pokemon where id = companion), 'Level-up HP growth';

 -- Simulate the first visit on a new UTC day and the seven-day milestone.
 insert into public.tasks(user_id,title,type,created_at) values(actor,'Yesterday daily','daily',now()-interval '2 days');
 update public.users set last_active_date = (now() at time zone 'UTC')::date-1,
   last_rollover_date = (now() at time zone 'UTC')::date-1, streak_count = 6, level = 8, xp = 0 where id = actor;
 insert into public.tasks(user_id,title,type,difficulty) values(actor,'Milestone task','todo','easy') returning id into task_id;
 reply := public.life_rpg('complete',p_id => task_id);
 assert (reply #>> '{reward,milestone}')::boolean, 'Seven-day milestone triggers';
 assert (reply #>> '{reward,cardsGained}')::int = 2, 'Milestone grants an extra guaranteed card';
 assert (reply #>> '{reward,currencyGained}')::int = 55, 'Milestone gold bonus';
 assert (select missed_dailies from public.users where id = actor), 'Missed yesterday daily is recorded';
 insert into public.tasks(user_id,title,type,difficulty) values(actor,'Another task','todo','easy') returning id into task_id;
 reply := public.life_rpg('complete',p_id => task_id);
 assert not (reply #>> '{reward,milestone}')::boolean, 'Milestone cannot repeat on the same day';
 update public.wild_encounters set status = 'fled', spawned_at = now()-interval '25 hours', expires_at = now()-interval '1 hour' where user_id = actor;
 reply := public.life_rpg('refresh');
 assert (reply #>> '{state,encounter,difficulty_tier}')::int = 3, 'Missed daily adds a difficulty tier';
 assert (select count(*) = 1 from public.wild_encounters where user_id = actor and status = 'active'), 'Higher levels fall back to available roster';
 update public.users set missed_dailies = false where id = actor;
 update public.wild_encounters set status = 'fled', spawned_at = now()-interval '13 hours', expires_at = now()+interval '11 hours' where user_id = actor;
 perform public.life_rpg('refresh');
 assert (select count(*) = 1 from public.wild_encounters where user_id = actor and status = 'active'), 'Hot streak allows a bounded 12-hour bonus spawn';
 perform public.life_rpg('refresh');
 assert (select count(*) = 1 from public.wild_encounters where user_id = actor and status = 'active'), 'Bonus spawn still obeys one-active rule';

 assert not has_column_privilege('authenticated','public.tasks','is_completed','UPDATE'), 'Direct completion writes disabled';
 assert not has_column_privilege('authenticated','public.tasks','last_rewarded_at','INSERT'), 'Direct reward timestamp writes disabled';
 assert has_column_privilege('authenticated','public.tasks','title','UPDATE'), 'Task editing remains available';
 assert not has_table_privilege('authenticated','public.move_cards','UPDATE'), 'Card quantities are server-owned';
 assert not has_table_privilege('authenticated','public.users','UPDATE'), 'Economy is server-owned';
 assert not has_function_privilege('authenticated','public.rpg_snapshot(uuid)','EXECUTE'), 'Private snapshot helper inaccessible';
 assert not has_function_privilege('anon','public.life_rpg(text,uuid,integer,uuid,uuid)','EXECUTE'), 'Anonymous game actions disabled';
 raise notice 'RPG lifecycle assertions completed.';
end $$;

-- Exercise actual RLS as the authenticated role, not just the function owner.
set local role authenticated;
do $$
begin
 assert not exists(select 1 from public.tasks where user_id <> auth.uid()), 'Foreign tasks hidden by RLS';
 assert not exists(select 1 from public.user_pokemon where user_id <> auth.uid()), 'Foreign companions hidden by RLS';
 assert (public.life_rpg('refresh') #>> '{state,profile,id}')::uuid = auth.uid(), 'RPC snapshot belongs to authenticated user';
end $$;
reset role;
rollback;
