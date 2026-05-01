import { Pokemon, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  return res.json();
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon: ${name}`);
  return res.json();
}

export async function fetchPokemonById(id: number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon #${id}`);
  return res.json();
}

export async function fetchPokemonByType(type: string): Promise<{ pokemon: Array<{ pokemon: { name: string; url: string } }> }> {
  const res = await fetch(`${BASE_URL}/type/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch type: ${type}`);
  return res.json();
}

export async function fetchMultiplePokemon(names: string[]): Promise<Pokemon[]> {
  const results = await Promise.allSettled(names.map((n) => fetchPokemonByName(n)));
  return results
    .filter((r): r is PromiseFulfilledResult<Pokemon> => r.status === 'fulfilled')
    .map((r) => r.value);
}
