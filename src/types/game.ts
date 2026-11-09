export type WorldId = 
  | 'strawberry_village'
  | 'cloudy_kingdom'
  | 'sakura_forest'
  | 'candy_ocean'
  | 'forgotten_dreamland'
  | 'cottage_interior'
  | 'the_forgotten_room';

export interface WorldInfo {
  id: WorldId;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  skyColor: string;
  fogColor: string;
  unlocked: boolean;
  unlockRequirement?: string;
  isSecret?: boolean;
}

export type DreamieSpecies = 
  | 'mochi_bun'
  | 'starry_bear'
  | 'cloud_kitten'
  | 'ribbon_deer'
  | 'candy_pup'
  | 'antique_doll'
  | 'cloud_unicorn'
  | 'sakura_fox';

export interface Dreamie {
  id: string;
  species: DreamieSpecies;
  name: string;
  customName?: string;
  title: string;
  emoji: string;
  homeWorld: WorldId;
  favoriteFood: string;
  personality: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  unlocked: boolean;
  adopted: boolean;
  isFollowing: boolean;
  happiness: number; // 0 - 100
  hunger: number; // 0 - 100
  cleanliness: number; // 0 - 100
  friendshipLevel: number; // 1 - 5
  timesPetted: number;
  accessory?: string;
  learnedTricks: string[];
  isLegendary?: boolean;
}

export type SeedType = 'strawberry' | 'sakura_blossom' | 'star_lily' | 'marshmallow_bloom';

export interface GardenPlot {
  id: number;
  plantedSeed: SeedType | null;
  plantedAt: number | null;
  watered: boolean;
  growthProgress: number;
  isReady: boolean;
}

export type RoomTheme = 'strawberry' | 'clouds' | 'sakura' | 'vintage' | 'starry';

export interface RoomCustomization {
  wallpaper: string; // wallpaper id or color/pattern
  flooring: string; // floor id
  theme: RoomTheme;
  lightingTone: 'warm' | 'pastel_pink' | 'cool_lavender' | 'candlelight';
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: 'bed' | 'seating' | 'rug' | 'table' | 'decor' | 'lighting' | 'pet_bed';
  emoji: string;
  description: string;
  placed: boolean;
  position: [number, number, number];
  rotationY: number;
  unlocked: boolean;
  costEssence: number;
  theme?: RoomTheme;
}

export interface OutfitConfig {
  hairStyle: 'twintails' | 'bob' | 'fluffy' | 'hime_cut' | 'messy_buns';
  hairColor: string;
  headwear: 'bunny_ears' | 'strawberry_beret' | 'sakura_bow' | 'star_halo' | 'antique_bonnet' | 'none';
  dress: 'strawberry_lolita' | 'cloud_overalls' | 'sakura_kimono' | 'pastel_sailor' | 'vintage_pinafore' | 'fairy_tulle';
  dressColor: string;
  wings: 'fairy_wings' | 'angel_wings' | 'star_wand' | 'backpack' | 'ribbon_cape' | 'none';
  makeup: 'heart_blush' | 'star_freckles' | 'glitter_cheeks' | 'bunny_nose' | 'natural';
  paletteTheme: 'sakura' | 'cloud' | 'lavender' | 'peach' | 'antique';
}

export type JobType = 'cafe' | 'bakery' | 'florist' | 'plushie_shop' | 'vet';

export interface JobInfo {
  id: JobType;
  title: string;
  emoji: string;
  description: string;
  level: number;
  xp: number;
  rewardsClaimed: number;
  shiftsDone: number;
}

export type MinigameId = 'star_fishing' | 'dessert_cooking' | 'bunny_race' | 'pastel_puzzle' | 'rhythm_dance';

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  category: 'decor' | 'pets' | 'farming' | 'fashion' | 'jobs' | 'secret';
}

export interface DiaryPhoto {
  id: string;
  timestamp: number;
  title: string;
  location: string;
  filter: string;
  caption: string;
  stickers: string[];
}

export interface Letter {
  id: string;
  sender: string;
  avatarEmoji: string;
  subject: string;
  body: string;
  attachedItem?: { name: string; emoji: string; count: number };
  read: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  theme: 'dreamy' | 'music_box' | 'bossa' | 'waltz';
  unlocked: boolean;
}


export interface Quest {
  id: string;
  npcId: string;
  title: string;
  description: string;
  requirementType: 'harvest' | 'pet' | 'decorate' | 'explore' | 'secret';
  targetCount: number;
  currentCount: number;
  rewardEssence: number;
  rewardColorMagic: number;
  rewardItem?: string;
  completed: boolean;
  claimed: boolean;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  worldId: WorldId;
  emoji: string;
  dialogueIntro: string[];
  dialogueChat: string[];
  dialogueQuestDone: string[];
  avatarColors: {
    fur: string;
    clothes: string;
  };
}

export interface DiaryEntry {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  discovered: boolean;
}
