import { gameAction } from '@/app/actions/rpg';
import { GamePanel } from './GamePanel';

export type GameView = 'lodge' | 'battle' | 'pokedex' | 'team' | 'shop';

export async function GameSection({ view }: { view: GameView }) {
  const result = await gameAction('refresh');
  if (!result.state) return <section className="card space-y-3" role="alert">
    <h2 className="font-serif text-2xl">The lodge could not load.</h2>
    <p className="text-text-secondary">Try refreshing. If this is the first deployment, apply the Quest database migration first.</p>
    <p className="text-sm">{result.error ?? 'Game state unavailable.'}</p>
  </section>;
  return <GamePanel initial={result.state} view={view} />;
}
