'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Pokemon } from '@/types/pokemon';
import { fetchPokemonList, fetchMultiplePokemon, fetchPokemonByType } from '@/lib/api';
import { getPokemonId, getPokemonImageUrl } from '@/utils/helpers';

export interface PokemonEntry {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const PAGE_SIZE = 24;

export function usePokemonList() {
  const [allPokemon, setAllPokemon] = useState<PokemonEntry[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonEntry[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<PokemonEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const cacheRef = useRef<Map<string, PokemonEntry>>(new Map());

  // Load initial bulk pokemon
  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        // Fetch first 300 for good UX
        const listRes = await fetchPokemonList(300, 0);
        if (cancelled) return;

        const names = listRes.results.map((p) => p.name);
        // batch fetch in chunks
        const CHUNK = 50;
        const entries: PokemonEntry[] = [];

        for (let i = 0; i < names.length; i += CHUNK) {
          if (cancelled) return;
          const chunk = names.slice(i, i + CHUNK);
          const pokemons = await fetchMultiplePokemon(chunk);
          for (const p of pokemons) {
            const entry: PokemonEntry = {
              id: p.id,
              name: p.name,
              image: p.sprites.other['official-artwork'].front_default ?? getPokemonImageUrl(p.id),
              types: p.types.map((t) => t.type.name),
            };
            cacheRef.current.set(p.name, entry);
            entries.push(entry);
          }
          if (!cancelled) {
            const sorted = [...entries].sort((a, b) => a.id - b.id);
            setAllPokemon(sorted);
            setLoading(false);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load Pokémon');
          setLoading(false);
        }
      }
    }
    loadAll();
    return () => { cancelled = true; };
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...allPokemon];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) => p.name.includes(q) || String(p.id).includes(q)
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter((p) =>
        selectedTypes.every((t) => p.types.includes(t))
      );
    }

    setFilteredPokemon(result);
    setPage(1);
  }, [search, selectedTypes, allPokemon]);

  // Paginate
  useEffect(() => {
    const total = Math.max(1, Math.ceil(filteredPokemon.length / PAGE_SIZE));
    setTotalPages(total);
    const start = (page - 1) * PAGE_SIZE;
    setDisplayedPokemon(filteredPokemon.slice(start, start + PAGE_SIZE));
  }, [filteredPokemon, page]);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setSelectedTypes([]);
  }, []);

  return {
    allPokemon,
    displayedPokemon,
    filteredPokemon,
    loading,
    error,
    search,
    setSearch,
    selectedTypes,
    toggleType,
    clearFilters,
    page,
    setPage,
    totalPages,
    totalCount: filteredPokemon.length,
  };
}
