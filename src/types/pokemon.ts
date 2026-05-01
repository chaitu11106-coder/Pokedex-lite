export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
    home: {
      front_default: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonCardData {
  id: number;
  name: string;
  image: string;
  types: string[];
  isFavorite: boolean;
}

export const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  normal:   { bg: '#6D6D4E', text: '#fff', border: '#9D9D6E', glow: 'rgba(109,109,78,0.5)' },
  fire:     { bg: '#C62828', text: '#fff', border: '#FF5252', glow: 'rgba(255,82,82,0.5)' },
  water:    { bg: '#1565C0', text: '#fff', border: '#448AFF', glow: 'rgba(68,138,255,0.5)' },
  electric: { bg: '#F9A825', text: '#000', border: '#FFD740', glow: 'rgba(255,215,64,0.5)' },
  grass:    { bg: '#2E7D32', text: '#fff', border: '#69F0AE', glow: 'rgba(105,240,174,0.5)' },
  ice:      { bg: '#006064', text: '#fff', border: '#80DEEA', glow: 'rgba(128,222,234,0.5)' },
  fighting: { bg: '#BF360C', text: '#fff', border: '#FF6E40', glow: 'rgba(255,110,64,0.5)' },
  poison:   { bg: '#6A1B9A', text: '#fff', border: '#CE93D8', glow: 'rgba(206,147,216,0.5)' },
  ground:   { bg: '#4E342E', text: '#fff', border: '#A1887F', glow: 'rgba(161,136,127,0.5)' },
  flying:   { bg: '#283593', text: '#fff', border: '#82B1FF', glow: 'rgba(130,177,255,0.5)' },
  psychic:  { bg: '#880E4F', text: '#fff', border: '#F48FB1', glow: 'rgba(244,143,177,0.5)' },
  bug:      { bg: '#33691E', text: '#fff', border: '#B2FF59', glow: 'rgba(178,255,89,0.5)' },
  rock:     { bg: '#37474F', text: '#fff', border: '#90A4AE', glow: 'rgba(144,164,174,0.5)' },
  ghost:    { bg: '#311B92', text: '#fff', border: '#B388FF', glow: 'rgba(179,136,255,0.5)' },
  dragon:   { bg: '#1A237E', text: '#fff', border: '#536DFE', glow: 'rgba(83,109,254,0.5)' },
  dark:     { bg: '#212121', text: '#fff', border: '#757575', glow: 'rgba(117,117,117,0.5)' },
  steel:    { bg: '#37474F', text: '#fff', border: '#B0BEC5', glow: 'rgba(176,190,197,0.5)' },
  fairy:    { bg: '#880E4F', text: '#fff', border: '#F8BBD9', glow: 'rgba(248,187,217,0.5)' },
};

export const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export const STAT_COLORS: Record<string, string> = {
  hp: '#FF5252',
  attack: '#FF6D00',
  defense: '#FFAB40',
  'special-attack': '#7C4DFF',
  'special-defense': '#00BCD4',
  speed: '#69F0AE',
};
