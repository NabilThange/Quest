export type TaskType = 'daily' | 'todo' | 'habit';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Attribute = 'Strength' | 'Intellect' | 'Discipline' | 'Creativity';
export type ShopItemType = 'cosmetic' | 'theme' | 'badge';

export interface User {
  id: string;
  username: string;
  level: number;
  xp: number;
  hp: number;
  max_hp: number;
  currency: number;
  streak_count: number;
  last_active_date: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  type: TaskType;
  title: string;
  attribute: Attribute | null;
  difficulty: Difficulty;
  due_date: string | null;
  recurrence_rule: string | null;
  is_completed: boolean;
  habit_streak: number;
  last_rewarded_at?: string | null;
  created_at: string;
}

export interface TaskLog {
  id: string;
  task_id: string | null;
  user_id: string;
  completed_at: string;
  xp_awarded: number;
  currency_awarded: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  cost: number;
  type: ShopItemType;
  icon: string | null;
  created_at: string;
}

export interface UserInventory {
  id: string;
  user_id: string;
  item_id: string;
  acquired_at: string;
  shop_items?: ShopItem;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  level: number;
  xp: number;
}

// XP formula: non-linear leveling
export function xpToNextLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5));
}

// XP and currency rewards by difficulty
export const XP_REWARDS: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30,
};

export const CURRENCY_REWARDS: Record<Difficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 15,
};

export const ATTRIBUTE_COLORS: Record<Attribute, string> = {
  Strength: 'text-red-400 bg-red-400/10 border-red-400/30',
  Intellect: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Discipline: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Creativity: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
};

export const ATTRIBUTE_ICONS: Record<Attribute, string> = {
  Strength: '⚔️',
  Intellect: '📚',
  Discipline: '🛡️',
  Creativity: '✨',
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'text-green-400 bg-green-400/10 border-green-400/30',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  hard: 'text-red-400 bg-red-400/10 border-red-400/30',
};
