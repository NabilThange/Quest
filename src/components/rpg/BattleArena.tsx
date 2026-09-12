'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CreatureSprite } from './CreatureSprite';
import { AudioController } from '@/components/ui/AudioController';
import type { BattleTurn, GameState, Move } from '@/types/rpg';
import { CARD_CATALOG } from '@/lib/rpg/cardCatalog';

export function VitalBar({ value, max, label }: { value: number; max: number; label: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between items-center gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <img src="/assets/items/heart.png" alt="" className="w-3 h-3 pixel-art inline" style={{ imageRendering: 'pixelated' }} />
          {label}
        </span>
        <span className="font-mono">{value} / {max}</span>
      </div>
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
      {/* ─── Battle Clearing Arena with Authentic Pixel Tilesets ─── */}
      <section aria-label="Battle clearing" className="relative isolate overflow-hidden rounded-3xl border border-border bg-[#d6dfc3]/20 dark:bg-card p-5 sm:p-8 select-none">
        {/* Sky & Horizon Atmosphere */}
        <div className="absolute inset-0 -z-30 bg-gradient-to-b from-[#87b5c7]/50 via-[#cedde3]/30 to-[#9ab382]/20 dark:from-[#131e24] dark:via-[#1a2318] dark:to-[#0f140e] pointer-events-none" />

        {/* Midground Grass Tileset Strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-44 -z-20 opacity-90 border-t border-[#5c7a42]/30"
          style={{
            backgroundImage: 'url(/assets/world/grass.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '192px 96px',
            imageRendering: 'pixelated',
          }}
        />

        {/* Foreground Dirt Path Strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 -z-10 border-t border-[#7a6442]/30 opacity-95"
          style={{
            backgroundImage: 'url(/assets/world/path.png)',
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 32px',
            imageRendering: 'pixelated',
          }}
        />

        {/* Decorative Pixel Flora & Scenery from Assets */}
        <img src="/assets/world/bush.png" alt="" className="absolute -z-10 left-3 bottom-14 w-8 h-8 pixel-art opacity-90 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
        <img src="/assets/world/rock.png" alt="" className="absolute -z-10 left-16 bottom-6 w-6 h-6 pixel-art opacity-80 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
        <img src="/assets/world/flower_blue.png" alt="" className="absolute -z-10 left-28 bottom-12 w-5 h-5 pixel-art opacity-90 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
        <img src="/assets/world/bush.png" alt="" className="absolute -z-10 right-3 bottom-14 w-8 h-8 pixel-art opacity-90 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
        <img src="/assets/world/flower_pink.png" alt="" className="absolute -z-10 right-20 bottom-8 w-5 h-5 pixel-art opacity-90 pointer-events-none" style={{ imageRendering: 'pixelated' }} />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest text-text-secondary">
          <span className="font-semibold">The quiet clearing · Tier {encounter.difficulty_tier}</span>
          <div className="flex items-center gap-3">
            <AudioController play={!ended} />
            <span className="px-2 py-0.5 rounded-full bg-card/80 border border-border text-[11px] font-mono">{opponent.elemental_type}</span>
          </div>
        </div>

        <div className="my-8 grid grid-cols-2 items-end gap-4 sm:gap-12">
          {/* Player Companion Pod */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex flex-col items-center">
              <motion.div animate={!reduced && turn && turn.counter_damage > 0 ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                <CreatureSprite species={ally} />
              </motion.div>
              <img
                src="/assets/ui/battle-spot.png"
                alt=""
                className="w-28 sm:w-36 -mt-3 opacity-90 pixel-art pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <AnimatePresence>
              {turn && turn.counter_damage > 0 && (
                <motion.div
                  key={`counter-${turn.id}`}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: reduced ? 0 : -45 }}
                  transition={{ duration: 1.8 }}
                  className="pointer-events-none absolute -top-3 rounded-full bg-red-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-md"
                  aria-hidden="true"
                >
                  −{turn.counter_damage} HP
                </motion.div>
              )}
            </AnimatePresence>
            <div className="w-full max-w-64 rounded-2xl bg-card/90 p-3 shadow-sm border border-border/60 backdrop-blur-sm">
              <h2 className="mb-3 font-semibold">{companion.nickname ?? ally.name} <span className="text-xs text-text-secondary">Lv. {companion.level}</span></h2>
              <VitalBar value={companion.current_hp} max={companion.max_hp} label="Companion HP" />
            </div>
          </div>

          {/* Wild Opponent Pod */}
          <div className="relative flex flex-col items-center gap-2">
            <div className="relative flex flex-col items-center">
              <motion.div key={turn?.id ?? 'idle'} animate={!reduced && turn ?
                lastMove?.type === 'Discipline' ? { y: [0, -6, 3, -3, 0] } :
                lastMove?.type === 'Creativity' ? { rotate: [0, -6, 6, 0] } :
                { x: [0, -8, 8, -4, 0] } : { x: 0 }}>
                <CreatureSprite species={opponent} silhouette={encounter.status === 'fled' || expired} />
              </motion.div>
              <img
                src="/assets/ui/battle-spot.png"
                alt=""
                className="w-28 sm:w-36 -mt-3 opacity-90 pixel-art pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            {!reduced && turn && <div key={`sparks-${turn.id}`} className="pointer-events-none absolute left-1/2 top-12" aria-hidden="true">
              {[[0,-60],[45,-40],[60,0],[35,40],[-35,40],[-60,-15]].map(([x,y], index) =>
                <motion.span key={index} className="absolute text-2xl text-primary" initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 0, x, y, scale: 1.5 }} transition={{ duration: 0.8, delay: index * 0.03 }}>
                  {symbols[lastMove?.type ?? 'Energy']}
                </motion.span>)}
            </div>}
            <AnimatePresence>
              {turn && <motion.div key={turn.id} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: reduced ? 0 : -55 }}
                transition={{ duration: 1.8 }} className="pointer-events-none absolute -top-3 rounded-full bg-primary px-4 py-2 font-mono font-bold text-primary-foreground shadow-md" aria-hidden="true">
                {symbols[lastMove?.type ?? 'Energy']} −{turn.damage_dealt} DMG
              </motion.div>}
            </AnimatePresence>
            <div className="w-full max-w-64 rounded-2xl bg-card/90 p-3 shadow-sm border border-border/60 backdrop-blur-sm">
              <h2 className="mb-3 font-semibold">{opponent.name} <span className="text-xs text-text-secondary">Wild</span></h2>
              <VitalBar value={encounter.current_hp} max={encounter.max_hp} label="Opponent HP" />
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-text-secondary">Scenery crafted with authentic pixel tilesets · Your real-world effort powers every turn.</p>
      </section>

      {/* ─── Turn Narrative Summary ─── */}
      {turn && !ended && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card/95 p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">⚔️</span>
            <span className="font-semibold text-text-primary">Turn Outcome:</span>
            <span className="text-text-secondary">
              {companion.nickname ?? ally.name} struck with <strong className="text-text-primary">{lastMove?.name ?? 'Attack'}</strong> for <strong className="text-emerald-400 font-mono font-bold">{turn.damage_dealt} DMG</strong>!
            </span>
          </div>
          <div className="text-xs">
            {turn.counter_damage > 0 ? (
              <span className="text-amber-400 font-medium">Wild {opponent.name} retaliated for <strong className="font-mono">{turn.counter_damage} HP</strong> counter damage.</span>
            ) : (
              <span className="text-emerald-400 font-semibold">Wild opponent defeated!</span>
            )}
          </div>
        </motion.div>
      )}

      {ended ? (
        <section className="card-elevated py-8 text-center space-y-3" role="status">
          {encounter.status === 'captured' ? (
            <div className="flex justify-center">
              <img
                src="/assets/items/pokeball.png"
                alt="Captured in Pokéball"
                className="w-12 h-12 pixel-art animate-bounce"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          ) : (
            <p className="text-3xl" aria-hidden="true">☁</p>
          )}
          <h2 className="font-serif text-3xl">{encounter.status === 'captured' ? `${opponent.name} joins your story.` : 'A visitor, for another day.'}</h2>
          <p className="text-text-secondary">{encounter.status === 'captured' ? 'Caught! Your companion earns 25 XP and you receive 15 gold.' : 'This encounter has ended. Its silhouette remains in your collection.'}</p>
          <Link href="/app/pokedex" className="btn-primary inline-block">Open Pokédex</Link>
        </section>
      ) : (
        <section aria-label="Move card hand" className="space-y-4">
          <div className="flex flex-wrap justify-between gap-2"><h2 className="font-serif text-2xl">Your next move</h2><p className="text-sm text-text-secondary">One card. One turn. At your pace.</p></div>
          {companion.current_hp <= 0 && <p role="status" className="card">Your companion has fainted. <Link className="underline" href="/app/team">Rest or use a Potion</Link> before returning.</p>}
          {hand.length === 0 ? <div className="card text-center py-8"><p className="mb-4">Your hand is empty. The encounter stays until its expiry.</p><Link className="btn-primary" href="/app/todos">Earn cards with quests</Link></div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {hand.map(card => {
                const move = game.moves.find(m => m.id === card.move_id);
                if (!move) return null;
                const catalogMatch = CARD_CATALOG.find(c => c.name.toLowerCase() === move.name.toLowerCase() || c.attribute === move.type);
                const tag = catalogMatch?.category ?? (move.type === 'Energy' ? 'Neutral Energy' : `${move.type} Strike`);
                const pro = catalogMatch?.pro ?? `${move.type} elemental power`;

                return <motion.button key={card.id} whileHover={reduced ? undefined : { y: -4 }} whileTap={reduced ? undefined : { scale: 0.97 }}
                  onClick={() => onAttack(card.id)} disabled={busy || companion.current_hp <= 0} className="move-card text-left p-4 rounded-2xl border border-border bg-card hover:border-foreground/40 transition-all shadow-sm"
                  aria-label={`Play ${move.name}, ${card.quantity} charges remaining`}>
                  <div className="flex justify-between items-center text-text-secondary mb-2">
                    <span className="text-2xl" aria-hidden="true">{move.icon}</span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs font-mono bg-secondary">×{card.quantity}</span>
                  </div>
                  <span className="block font-bold text-base text-foreground">{move.name}</span>
                  <span className="mt-0.5 block text-xs text-brand-cyan font-medium">{tag}</span>
                  <span className="mt-1 block text-xs text-text-secondary font-mono">{move.base_power} Base Power</span>
                  <span className="mt-2 block text-[11px] text-emerald-400 font-medium leading-tight truncate">{pro}</span>
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
