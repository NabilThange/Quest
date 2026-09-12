import type { Attribute, User } from '@/types';

export interface Species {
  id: number;
  name: string;
  sprite_url: string | null;
  elemental_type: Attribute;
  base_hp: number;
  base_attack: number;
  rarity: number;
  tier: number;
  starter: boolean;
}
export interface Move {
  id: number;
  species_id: number;
  name: string;
  type: Attribute | 'Energy';
  base_power: number;
  icon: string;
  unlock_level: number;
}
export interface Pokemon {
  id: string;
  species_id: number;
  nickname: string | null;
  level: number;
  xp: number;
  current_hp: number;
  max_hp: number;
  status: 'active' | 'fainted' | 'boxed';
}
export interface MoveCard {
  id: string;
  pokemon_id: string;
  move_id: number;
  quantity: number;
}
export interface Encounter {
  id: string;
  species_id: number;
  current_hp: number;
  max_hp: number;
  difficulty_tier: number;
  spawned_at: string;
  expires_at: string;
  status: 'active' | 'captured' | 'fled';
}
export interface BattleTurn {
  id: string;
  encounter_id: string;
  card_id: string;
  damage_dealt: number;
  counter_damage: number;
  captured: boolean;
  timestamp: string;
}
export interface GameState {
  profile: User & { active_pokemon_id: string | null; last_rest_date: string | null; missed_dailies: boolean };
  species: Species[];
  moves: Move[];
  team: Pokemon[];
  cards: MoveCard[];
  encounter: Encounter | null;
  dex: { species_id: number; status: 'seen' | 'caught'; caught_at: string | null }[];
  attributes: { attribute: Attribute; xp: number }[];
  logs: BattleTurn[];
}
export interface TaskReward {
  xpGained: number;
  currencyGained: number;
  cardsGained: number;
  cardName: string;
  leveledUp: boolean;
  newLevel: number;
  companionLevel: number;
  companionLeveledUp: boolean;
  milestone: boolean;
}
export interface GameResult {
  state?: GameState;
  error?: string;
  reward?: TaskReward;
  turn?: BattleTurn;
}
export type GameAction = 'refresh' | 'choose' | 'attack' | 'switch' | 'rest' | 'potion';
