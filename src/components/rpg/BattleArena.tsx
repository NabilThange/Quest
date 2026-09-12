'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CreatureSprite } from './CreatureSprite';
import type { BattleTurn, GameState, Move } from '@/types/rpg';
import background from '../../../ASSETS/AA_Catchimon_19_20_21_FREE/Battle Background Layer 01.png';

export function VitalBar({ value, max, label }: { value: number; max: number; label: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between gap-3 text-xs"><span>{label}</span><span className="font-mono">{value} / {max}</span></div>
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}
        className="h-2 overflow-hidden rounded-full bg-secondary">
        <motion.div initial={false} animate={{ width: `${Math.max(0, Math.min(100, value / Math.max(1, max) * 100))}%` }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 20 }}
          className={`h-full rounded-full ${value / max > 0.3 ? 'bg-[#637c50]' : 'bg-[#b34832]'}`} />
      </div>
    </div>
  );
}

export function BattleArena({ game, busy, turn, expired, onAttack }: {
  game: GameState; busy: boolean; turn: BattleTurn | null; expired: boolean;
  onAttack: (id: string) => void;
}) {
  const reduced = useReducedMotion();
  const encounter = game.encounter;
  const companion = game.team.find(p => p.id === game.profile.active_pokemon_id);
  const ally = game.species.find(s => s.id === companion?.species_id);
  const opponent = game.species.find(s => s.id === encounter?.species_id);
  const hand = game.cards.filter(c => c.pokemon_id === companion?.id && c.quantity > 0);
  const lastMove = game.moves.find(m => m.id === game.cards.find(c => c.id === turn?.card_id)?.move_id);
  const symbols: Record<Move['type'], string> = { Strength: '✦', Intellect: 'ϟ', Discipline: '◆', Creativity: '✧', Energy: '○' };

  if (!encounter || !opponent || !companion || !ally) return (
    <section className="card py-12 text-center space-y-4"><h2 className="text-2xl font-serif">The clearing is quiet.</h2>
      <p className="text-text-secondary">Complete a few quests and return to the lodge for your next encounter.</p>
      <Link href="/app" className="btn-primary inline-block">Back to the lodge</Link></section>
  );
  const ended = encounter.status !== 'active' || expired;
  return (
    <div className="space-y-6">
      <section aria-label="Battle clearing" className="relative isolate overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-8">
        <Image src={background} alt="" fill priority sizes="(max-width: 1024px) 100vw, 900px" className="-z-20 object-cover opacity-25 pixel-art" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/70 via-card/20 to-card" />
        <div className="flex flex-wrap justify-between gap-3 text-xs uppercase tracking-widest text-text-secondary">
          <span>The quiet clearing · Tier {encounter.difficulty_tier}</span>
          <span>{opponent.elemental_type}</span>
        </div>
        <div className="my-8 grid grid-cols-2 items-end gap-4 sm:gap-12">
          <div className="flex flex-col items-center gap-4">
            <CreatureSprite species={ally} />
            <div className="w-full max-w-64 rounded-2xl bg-card/90 p-3">
              <h2 className="mb-3 font-semibold">{companion.nickname ?? ally.name} <span className="text-xs text-text-secondary">Lv. {companion.level}</span></h2>
              <VitalBar value={companion.current_hp} max={companion.max_hp} label="Companion HP" />
            </div>
          </div>
          <div className="relative flex flex-col items-center gap-4">
            <motion.div key={turn?.id ?? 'idle'} animate={!reduced && turn ? { x: [0, -8, 8, -4, 0] } : { x: 0 }}>
              <CreatureSprite species={opponent} silhouette={encounter.status === 'fled' || expired} />
            </motion.div>
            <AnimatePresence>
              {turn && <motion.div key={turn.id} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: reduced ? 0 : -55 }}
                transition={{ duration: 1.8 }} className="pointer-events-none absolute -top-3 rounded-full bg-primary px-4 py-2 font-mono text-primary-foreground" aria-hidden="true">
                {symbols[lastMove?.type ?? 'Energy']} −{turn.damage_dealt}
              </motion.div>}
            </AnimatePresence>
            <div className="w-full max-w-64 rounded-2xl bg-card/90 p-3">
              <h2 className="mb-3 font-semibold">{opponent.name} <span className="text-xs text-text-secondary">Wild</span></h2>
              <VitalBar value={encounter.current_hp} max={encounter.max_hp} label="Opponent HP" />
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-text-secondary">Scenery by Asset Alliance · Your real-world effort powers every turn.</p>
      </section>

      {ended ? (
        <section className="card-elevated py-8 text-center space-y-3" role="status">
          <p className="text-3xl" aria-hidden="true">{encounter.status === 'captured' ? '✺' : '☁'}</p>
          <h2 className="font-serif text-3xl">{encounter.status === 'captured' ? `${opponent.name} joins your story.` : 'A visitor, for another day.'}</h2>
          <p className="text-text-secondary">{encounter.status === 'captured' ? 'Caught! Your companion earns 25 XP and you receive 15 gold.' : 'This encounter has ended. Its silhouette remains in your collection.'}</p>
          <Link href="/app/pokedex" className="btn-primary inline-block">Open Pokédex</Link>
        </section>
      ) : (
        <section aria-label="Move card hand" className="space-y-4">
          <div className="flex flex-wrap justify-between gap-2"><h2 className="font-serif text-2xl">Your next move</h2><p className="text-sm text-text-secondary">One card. One turn. At your pace.</p></div>
          {companion.current_hp <= 0 && <p role="status" className="card">Your companion has fainted. <Link className="underline" href="/app/team">Rest or use a Potion</Link> before returning.</p>}
          {hand.length === 0 ? <div className="card text-center py-8"><p className="mb-4">Your hand is empty. The encounter stays until its expiry.</p><Link className="btn-primary" href="/app/todos">Earn cards with quests</Link></div> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hand.map(card => {
                const move = game.moves.find(m => m.id === card.move_id);
                if (!move) return null;
                return <motion.button key={card.id} whileHover={reduced ? undefined : { y: -4 }} whileTap={reduced ? undefined : { scale: 0.97 }}
                  onClick={() => onAttack(card.id)} disabled={busy || companion.current_hp <= 0} className="move-card text-left"
                  aria-label={`Play ${move.name}, ${card.quantity} charges remaining`}>
                  <span className="flex justify-between text-text-secondary"><span className="text-3xl" aria-hidden="true">{move.icon}</span><span className="rounded-full border border-border px-2 py-1 text-xs">×{card.quantity}</span></span>
                  <span className="mt-6 block font-semibold">{move.name}</span>
                  <span className="mt-1 block text-xs text-text-secondary">{move.type} · {move.base_power} power</span>
                </motion.button>;
              })}
            </div>
          )}
          <p className="text-xs text-text-secondary">Strength → Discipline → Intellect → Creativity → Strength. Attacking the next type deals 1.5× damage; the reverse deals 0.75×. Energy is neutral.</p>
          <p className="text-xs text-text-secondary">Available until {new Date(encounter.expires_at).toISOString().replace('T', ' ').slice(0, 16)} UTC. Non-winning turns cost 5% companion HP.</p>
        </section>
      )}
      <details className="card text-sm"><summary className="cursor-pointer font-medium">Battle journal · latest 20 turns</summary>
        <ul className="mt-4 space-y-2">{game.logs.length ? game.logs.map(log => <li key={log.id} className="flex flex-wrap justify-between gap-2 border-b border-border py-2">
          <span>{game.moves.find(m => m.id === game.cards.find(c => c.id === log.card_id)?.move_id)?.name ?? 'Move'} · {log.damage_dealt} damage {log.captured ? '· Captured' : `· ${log.counter_damage} counter`}</span>
          <time className="text-xs text-text-secondary" dateTime={log.timestamp}>{new Date(log.timestamp).toISOString().slice(0, 16).replace('T', ' ')} UTC</time>
        </li>) : <li>No turns yet. Your story starts with a quest.</li>}</ul>
      </details>
    </div>
  );
}
