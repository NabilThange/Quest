'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MotionConfig } from 'framer-motion';
import toast from 'react-hot-toast';
import { gameAction } from '@/app/actions/rpg';
import { xpToNextLevel } from '@/types';
import type { BattleTurn, GameAction, GameState } from '@/types/rpg';
import type { GameView } from './GameSection';
import { CreatureSprite } from './CreatureSprite';
import { BattleArena, VitalBar } from './BattleArena';
import { AudioController } from '@/components/ui/AudioController';
import { playAttackSound, playDamageSound, playVictorySound, playHealSound, playNavSound } from '@/lib/sound';

type ActionInput = { id?: string; species?: number; request?: string; encounter?: string };
const titles: Record<GameView, [string, string]> = {
  lodge: ['A little effort. A new adventure.', 'Your lodge'],
  battle: ['Make your next move.', 'The clearing'],
  pokedex: ['Every encounter leaves a story.', 'Your Pokédex'],
  team: ['Grow together, one day at a time.', 'Companions & cards'],
  shop: ['A moment to recover.', 'The apothecary'],
};

export function GamePanel({ initial, view }: { initial: GameState; view: GameView }) {
  const [game, setGame] = useState(initial);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const attempt = useRef<ActionInput | null>(null);
  const [retry, setRetry] = useState(false);
  const [turn, setTurn] = useState<BattleTurn | null>(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setGame(initial); }, [initial]);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  async function run(action: GameAction, input: ActionInput = {}) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const result = await gameAction(action, input);
      if (result.state) setGame(result.state);
      if (result.error) {
        toast.error(result.error);
        setMessage(result.error);
      } else {
        if (result.turn) {
          setTurn(result.turn);
          setMessage(result.turn.captured ? 'Captured! +25 companion XP and +15 gold.' : `${result.turn.damage_dealt} damage dealt. ${result.turn.counter_damage} counter damage.`);
          if (result.turn.captured) {
            playVictorySound();
          } else if (result.turn.counter_damage > 0) {
            setTimeout(() => playDamageSound(), 350);
          }
        } else if (action !== 'refresh') {
          if (action === 'rest') {
            playHealSound();
          } else {
            playNavSound();
          }
          setMessage(action === 'choose' ? 'Your journey begins. Complete a quest to earn your first card.' : 'Your companion is ready.');
          toast.success(action === 'switch' ? 'Active companion changed.' : action === 'choose' ? 'Welcome to your lodge!' : 'Fully healed.');
        }
      }
      if (action === 'attack') { attempt.current = null; setRetry(false); }
    } catch {
      setMessage('Connection interrupted. Your progress may already be saved. Retry to confirm it.');
      if (action === 'attack') setRetry(true);
      toast.error('Connection interrupted. Please try again.');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  function attack(cardId: string) {
    if (busyRef.current || retry || !game.encounter) return;
    const card = game.cards.find(c => c.id === cardId);
    const move = game.moves.find(m => m.id === card?.move_id);
    playAttackSound(move?.name || move?.type);
    const input = { id: cardId, encounter: game.encounter.id, request: crypto.randomUUID() };
    attempt.current = input;
    void run('attack', input);
  }

  const active = game.team.find(p => p.id === game.profile.active_pokemon_id);
  const activeSpecies = game.species.find(s => s.id === active?.species_id);
  const encounter = game.encounter;
  const opponent = game.species.find(s => s.id === encounter?.species_id);
  const caught = game.dex.filter(d => d.status === 'caught').length;
  const cardCount = game.cards.filter(c => c.pokemon_id === active?.id).reduce((sum, c) => sum + c.quantity, 0);
  const expired = Boolean(encounter && now !== null && new Date(encounter.expires_at).getTime() <= now && encounter.status === 'active');
  const today = now === null ? null : new Date(now).toISOString().slice(0, 10);
  const restUsed = today !== null && game.profile.last_rest_date === today;

  return (
    <MotionConfig reducedMotion="user">
      <div className={`space-y-6 ${view === 'lodge' || view === 'shop' ? '' : 'pb-24 lg:pb-0'}`}>
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="mb-2 text-xs uppercase tracking-[0.22em] text-text-secondary">{titles[view][1]}</p>
            <h1 className="font-serif text-3xl sm:text-4xl leading-tight">{titles[view][0]}</h1></div>
          <div className="flex items-center gap-3">
            {game.team.length === 0 && <AudioController play={true} />}
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-mono">
              <img src="/assets/items/coin.png" alt="" className="w-4 h-4 pixel-art" style={{ imageRendering: 'pixelated' }} />
              {game.profile.currency} gold
            </span>
          </div>
        </header>
        <nav aria-label="Creature adventure" className="flex flex-wrap gap-2 text-sm">
          {([['/app', 'Lodge'], ['/app/battle', 'Battle'], ['/app/pokedex', 'Pokédex'], ['/app/team', 'Team'], ['/app/rewards', 'Shop']] as const).map(([href, label]) => (
            <Link key={href} href={href} className="rounded-full border border-border bg-card px-4 py-2 hover:bg-secondary">{label}</Link>
          ))}
          <button className="rounded-full border border-border px-4 py-2" disabled={busy || retry} onClick={() => void run('refresh')}>Refresh</button>
        </nav>
        <p className="sr-only" role="status" aria-live="polite">{busy ? 'Saving your move…' : message}</p>
        {retry && <div role="alert" className="card space-y-3"><p>{message}</p><button className="btn-primary" disabled={busy}
          onClick={() => { if (attempt.current) void run('attack', attempt.current); }}>Retry the same turn</button></div>}

        {game.team.length === 0 ? (
          <section className="space-y-5">
            <div className="card-elevated p-6"><h2 className="font-serif text-2xl">Choose your first companion</h2>
              <p className="mt-2 text-text-secondary">Four small beginnings. No wrong choice. Matching quests earn signature moves; everything else becomes Energy.</p></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {game.species.filter(s => s.starter).map(species => {
                const symbols: Record<string, string> = { Strength: '✦', Intellect: 'ϟ', Discipline: '❧', Creativity: '✧' };
                return (
                  <button key={species.id} disabled={busy} onClick={() => void run('choose', { species: species.id })}
                    className="card flex flex-col items-center gap-3 py-6 text-center hover:-translate-y-1 transition-transform">
                    <CreatureSprite species={species} />
                    <div className="space-y-1">
                      <span className="font-serif text-xl flex items-center justify-center gap-1.5">
                        {species.name}
                        <span className="text-xs font-sans opacity-70" title={species.elemental_type}>
                          {symbols[species.elemental_type]}
                        </span>
                      </span>
                      <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium border border-border bg-secondary/60">
                        {symbols[species.elemental_type]} {species.elemental_type}
                      </span>
                    </div>
                    <span className="text-xs font-mono">{species.base_hp + 5} HP · {species.base_attack + 2} ATK</span>
                    <span className="text-sm underline underline-offset-4 mt-2">Choose companion</span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : <>
          {view === 'lodge' && active && activeSpecies && (
            <>
              <section className="lodge-scene grid gap-8 rounded-3xl border border-border p-6 sm:p-8 md:grid-cols-2">
                <div className="flex flex-col items-start gap-4">
                  <p className="text-xs uppercase tracking-widest text-text-secondary">A place to begin again</p>
                  <CreatureSprite species={activeSpecies} />
                  <h2 className="font-serif text-3xl">{active.nickname ?? activeSpecies.name}</h2>
                  <p className="text-sm text-text-secondary">Level {active.level} · {activeSpecies.elemental_type} · {active.status === 'fainted' ? 'Needs a little rest' : 'Ready for the day'}</p>
                  <VitalBar value={active.current_hp} max={active.max_hp} label="Companion HP" />
                  <VitalBar value={active.xp} max={xpToNextLevel(active.level)} label="Companion XP" />
                  <Link href="/app/team" className="text-sm underline underline-offset-4">Visit your team →</Link>
                </div>
                <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-card/70 p-6 text-center">
                  {encounter?.status === 'active' && !expired && opponent ? <>
                    <CreatureSprite species={opponent} silhouette />
                    <h2 className="font-serif text-2xl">Something’s approaching…</h2>
                    <p className="text-sm text-text-secondary">A visitor waits beyond the lodge. {cardCount} move {cardCount === 1 ? 'card' : 'cards'} in your hand.</p>
                    <Link href="/app/battle" className="btn-primary">Enter the clearing</Link>
                  </> : <><span className="text-5xl" aria-hidden="true">❧</span><h2 className="font-serif text-2xl">Room to breathe.</h2><p className="text-sm text-text-secondary">Build your hand with today’s quests. Check back for your next visitor.</p><Link href="/app/todos" className="btn-primary">Find a quest</Link></>}
                  {game.profile.missed_dailies && <p className="text-xs text-text-secondary">Yesterday was a little quiet. Your next encounter has an extra difficulty tier. A fresh start is always possible.</p>}
                </div>
              </section>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[['Move cards', cardCount], ['Caught', `${caught}/${game.species.length}`], ['Day streak', game.profile.streak_count]].map(([label, value]) => <div key={label} className="card"><p className="font-serif text-2xl">{value}</p><p className="mt-1 text-xs text-text-secondary">{label}</p></div>)}
              </div>
              <details className="card"><summary className="cursor-pointer text-sm">Your real-world attributes</summary>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">{(['Strength','Intellect','Discipline','Creativity'] as const).map(attribute => <p key={attribute} className="text-sm">{attribute}<span className="block font-mono text-text-secondary">{game.attributes.find(a => a.attribute === attribute)?.xp ?? 0} XP</span></p>)}</div>
              </details>
            </>
          )}
          {view === 'battle' && <BattleArena game={game} busy={busy || retry} turn={turn} expired={expired} onAttack={attack} />}
          {view === 'pokedex' && <section className="space-y-5">
            <div className="card-elevated flex flex-wrap items-center justify-between gap-4"><p className="font-serif text-2xl">{caught} of {game.species.length} stories collected</p>
              <div className="flex gap-2" aria-label="Collection filter">{['all','caught','seen'].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)} className={`rounded-full border border-border px-3 py-2 text-sm capitalize ${filter === value ? 'bg-primary text-primary-foreground' : ''}`}>{value}</button>)}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {game.species.filter(s => filter === 'all' || game.dex.find(d => d.species_id === s.id)?.status === filter).map(species => {
                const entry = game.dex.find(d => d.species_id === species.id);
                const owned = entry?.status === 'caught';
                return <details key={species.id} className="card self-start">
                  <summary className="flex cursor-pointer list-none flex-col items-center gap-4 text-center">
                    <span className="self-start text-xs font-mono text-text-secondary">NO. {String(species.id).padStart(3, '0')}</span>
                    <CreatureSprite species={species} silhouette={!owned} />
                    <span className="font-serif text-xl">{owned ? species.name : '???'}</span>
                    <span className="text-xs text-text-secondary flex items-center justify-center gap-1">
                      {owned ? (
                        <>
                          <img src="/assets/items/pokeball.png" alt="" className="w-3.5 h-3.5 pixel-art" style={{ imageRendering: 'pixelated' }} />
                          Caught · tap for stats
                        </>
                      ) : entry ? 'Seen, not caught' : 'Not yet encountered'}
                    </span>
                  </summary>
                  <div className="mt-4 border-t border-border pt-3 text-xs text-text-secondary">{owned ? <><p>{species.elemental_type} · Rarity {species.rarity}</p><p className="mt-2">Base HP {species.base_hp} · Base ATK {species.base_attack}</p><p className="mt-2">{game.moves.filter(m => m.species_id === species.id && m.type !== 'Energy').map(m => `${m.name} (Lv.${m.unlock_level})`).join(' · ')}</p></> : <p>A silhouette today. A companion tomorrow. Keep completing quests and visiting the clearing.</p>}</div>
                </details>;
              })}
            </div>
            {!game.species.some(s => filter === 'all' || game.dex.find(d => d.species_id === s.id)?.status === filter) && <p className="card text-center">No entries in this view yet.</p>}
          </section>}
          {(view === 'team' || view === 'shop') && <section className="space-y-4">
            <p className="text-sm text-text-secondary">One free full rest per UTC day, shared across your team. Potions cost 20 gold and heal immediately. Cards stay with the companion that earned them.</p>
            <div className="grid sm:grid-cols-2 gap-4">{game.team.map(pokemon => {
              const species = game.species.find(s => s.id === pokemon.species_id);
              if (!species) return null;
              const selected = pokemon.id === active?.id;
              const full = pokemon.current_hp === pokemon.max_hp;
              return <article key={pokemon.id} className="card space-y-4">
                <div className="flex items-center gap-4"><CreatureSprite species={species} size="small" /><div><h2 className="font-serif text-xl">{pokemon.nickname ?? species.name}</h2><p className="text-xs text-text-secondary">Lv. {pokemon.level} · {selected ? 'Selected companion' : pokemon.status} · {species.base_attack + pokemon.level * 2} ATK</p></div></div>
                <VitalBar value={pokemon.current_hp} max={pokemon.max_hp} label="HP" />
                <VitalBar value={pokemon.xp} max={xpToNextLevel(pokemon.level)} label="XP" />
                <div className="flex flex-wrap gap-2">
                  {view === 'team' && !selected && <button className="btn-primary text-sm" disabled={busy || pokemon.current_hp === 0} onClick={() => void run('switch', { id: pokemon.id })}>Make active</button>}
                  <button className="btn-secondary text-sm" disabled={busy || full || restUsed} onClick={() => void run('rest', { id: pokemon.id })}>{restUsed ? 'Rest used today' : 'Free rest'}</button>
                  <button className="btn-secondary text-sm flex items-center gap-1.5" disabled={busy || full || game.profile.currency < 20} onClick={() => void run('potion', { id: pokemon.id })}>
                    <img src="/assets/items/potion_red.png" alt="" className="w-4 h-4 pixel-art" style={{ imageRendering: 'pixelated' }} />
                    Potion · 20 gold
                  </button>
                </div>
                {view === 'team' && <ul className="space-y-2 border-t border-border pt-3 text-sm">{game.moves.filter(m => m.species_id === species.id).map(move => <li key={move.id} className="flex justify-between gap-2"><span>{move.icon} {move.name}</span><span className="text-text-secondary">{move.unlock_level > pokemon.level ? `Unlocks Lv.${move.unlock_level}` : `×${game.cards.find(c => c.pokemon_id === pokemon.id && c.move_id === move.id)?.quantity ?? 0}`}</span></li>)}</ul>}
              </article>;
            })}</div>
          </section>}
        </>}
      </div>
    </MotionConfig>
  );
}
