
export type Language = 'ru' | 'en';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'classic' | 'spicy' | 'vegan' | 'sweet';
  isNewYearSpecial?: boolean;
  modelUrl?: string; // URL to 3D model (glb/gltf) or placeholder
}

export interface User {
  id: string;
  name: string;
  points: number;
  rank: 'Novice' | 'Gamer' | 'Pro' | 'Pizza Legend';
}

export interface PurchaseItem {
  id: string;
  name: string;
  cost: number;
  date: string;
}

export interface InventoryItem {
  id: string;
  name: { ru: string, en: string };
  description: { ru: string, en: string };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'skin' | 'pet' | 'badge' | 'consumable';
  image: string; // Icon or Image URL
  obtainedAt: string;
  source?: { ru: string, en: string }; // Where did this come from?
}

export interface ShopItem {
  id: number;
  name: { ru: string, en: string };
  description: { ru: string, en: string };
  cost: number;
  iconType: 'food' | 'drink' | 'ticket' | 'cheese' | 'box' | 'star'; // String ID for icon
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'all' | 'food' | 'discount' | 'special';
}

export interface Achievement {
  id: string;
  title: { ru: string, en: string };
  desc: { ru: string, en: string };
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface PromoItem {
  id: number;
  title: { ru: string; en: string };
  desc: { ru: string; en: string };
  iconType: 'zap' | 'gamepad' | 'moon'; // String identifier for icon
  color: string;
  text: string;
  bg: string;
  delay: string;
  rotation: string;
}

export enum AppView {
  HOME = 'HOME',
  GAMES = 'GAMES',
  QUIZ = 'QUIZ',
  WHEEL = 'WHEEL',
  PUZZLE = 'PUZZLE',
  SCRATCH = 'SCRATCH',
  SEASONAL = 'SEASONAL',
  SHOP = 'SHOP',
  MENU = 'MENU',
  RANKINGS = 'RANKINGS',
  ADMIN = 'ADMIN',
  PROFILE = 'PROFILE'
}

export interface GameStats {
  plays: number;
  highScore: number;
  rank?: number;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export type GameId = 'runner' | 'jump' | 'snake' | 'stacker' | 'kitchen' | 'checkers' | 'quiz' | 'wheel' | 'puzzle' | 'scratch';

export type GamesConfig = Record<GameId, boolean>;
