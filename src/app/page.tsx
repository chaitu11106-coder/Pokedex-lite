'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import Header from '@/components/Header';
import PokemonCard from '@/components/PokemonCard';
import PokemonModal from '@/components/PokemonModal';
import SearchBar from '@/components/SearchBar';
import TypeFilter from '@/components/TypeFilter';
import Pagination from '@/components/Pagination';
import PokeLoader from '@/components/PokeLoader';
import FavoritesPanel from '@/components/FavoritesPanel';
import Spotlight from '@/components/Spotlight';
import { usePokemonList } from '@/hooks/usePokemonList';
import { useFavorites } from '@/hooks/useFavorites';

export default function Home() {
  const {
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
    totalCount,
  } = usePokemonList();

  const { favorites, toggleFavorite, isFavorite, loaded: favLoaded } = useFavorites();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // GSAP entrance animation for the hero section
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(
      heroRef.current.querySelectorAll('.gsap-hero-item'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
    );
  }, []);

  // Modal navigation through filtered list
  const selectedIndex = filteredPokemon.findIndex((p) => p.id === selectedId);

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedId(filteredPokemon[selectedIndex - 1].id);
    }
  }, [selectedIndex, filteredPokemon]);

  const handleNext = useCallback(() => {
    if (selectedIndex < filteredPokemon.length - 1) {
      setSelectedId(filteredPokemon[selectedIndex + 1].id);
    }
  }, [selectedIndex, filteredPokemon]);

  const handlePageChange = useCallback(
    (p: number) => {
      setPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPage]
  );

  const hasActiveFilters = search.trim() || selectedTypes.length > 0;

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#FF1744' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
          style={{ background: '#FF1744' }}
        />
      </div>

      <div className="relative z-10">
        <Header
          favoritesCount={favorites.size}
          onShowFavorites={() => setShowFavorites(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Hero section */}
          <div ref={heroRef} className="space-y-1 overflow-hidden">
            <motion.div className="gsap-hero-item" style={{ opacity: 0 }}>
              <h1 className="font-orbitron font-black text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
                Scan the{' '}
                <span
                  className="text-glow-red"
                  style={{ color: '#FF1744' }}
                >
                  Pokédex
                </span>
              </h1>
            </motion.div>
            <p className="gsap-hero-item font-rajdhani text-base text-white/35 tracking-wide" style={{ opacity: 0 }}>
              {allPokemon.length > 0
                ? `${allPokemon.length} Pokémon catalogued and ready for analysis`
                : 'Initializing database...'}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="gsap-hero-item space-y-4" style={{ opacity: 0 }}>
            <Spotlight className="rounded-sm">
              <div
                className="p-4 sm:p-5 rounded-sm space-y-4"
                style={{
                  background: 'rgba(13,13,20,0.8)',
                  border: '1px solid #1E1E2E',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  resultCount={totalCount}
                />
                <TypeFilter
                  selected={selectedTypes}
                  onToggle={toggleType}
                  onClear={clearFilters}
                />

                {/* Active filter summary */}
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between pt-1"
                  >
                    <span className="font-mono-jb text-[10px] text-white/30 tracking-widest">
                      {totalCount} RESULT{totalCount !== 1 ? 'S' : ''} FOUND
                    </span>
                    <button
                      onClick={clearFilters}
                      className="font-rajdhani text-xs text-poke-red/60 hover:text-poke-red transition-colors tracking-wide"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </div>
            </Spotlight>
          </div>

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-sm text-center space-y-3"
              style={{ background: 'rgba(255,23,68,0.05)', border: '1px solid rgba(255,23,68,0.2)' }}
            >
              <div className="font-orbitron text-sm text-poke-red tracking-widest">SCAN ERROR</div>
              <p className="font-rajdhani text-white/60">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 font-orbitron text-xs tracking-widest rounded-sm transition-all"
                style={{
                  background: 'rgba(255,23,68,0.15)',
                  border: '1px solid rgba(255,23,68,0.3)',
                  color: '#FF1744',
                }}
              >
                RETRY
              </button>
            </motion.div>
          )}

          {/* Loading state (initial) */}
          {loading && allPokemon.length === 0 && !error && (
            <PokeLoader message="Initializing Pokédex..." />
          )}

          {/* Grid */}
          {allPokemon.length > 0 && (
            <>
              {/* Loading overlay for subsequent loads */}
              {loading && (
                <div className="flex justify-center py-4">
                  <PokeLoader message="Loading more data..." />
                </div>
              )}

              {/* Empty state */}
              {displayedPokemon.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 space-y-4"
                >
                  <div className="opacity-10">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4" />
                      <path d="M 5 50 H 95" stroke="white" strokeWidth="4" />
                      <circle cx="50" cy="50" r="12" fill="none" stroke="white" strokeWidth="4" />
                    </svg>
                  </div>
                  <p className="font-orbitron text-sm text-white/20 tracking-[0.2em]">NO POKÉMON FOUND</p>
                  <button
                    onClick={clearFilters}
                    className="font-rajdhani text-sm text-poke-red/60 hover:text-poke-red transition-colors"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}

              {/* Pokemon Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`page-${page}-${search}-${selectedTypes.join(',')}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                >
                  {displayedPokemon.map((p, i) => (
                    <PokemonCard
                      key={p.id}
                      pokemon={p}
                      isFavorite={favLoaded && isFavorite(p.id)}
                      onToggleFavorite={toggleFavorite}
                      onSelect={setSelectedId}
                      index={i}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              <Pagination
                page={page}
                totalPages={totalPages}
                onPage={handlePageChange}
                totalCount={totalCount}
              />
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t py-8 mt-8 text-center space-y-1" style={{ borderColor: '#1E1E2E' }}>
          <p className="font-mono-jb text-[9px] text-white/15 tracking-[0.3em]">
            POWERED BY POKÉAPI · BUILT WITH NEXT.JS
          </p>
          <p className="font-mono-jb text-[9px] text-white/10 tracking-[0.2em]">
            Pokémon and Pokémon character names are trademarks of Nintendo.
          </p>
        </footer>
      </div>

      {/* Pokemon Detail Modal */}
      <PokemonModal
        pokemonId={selectedId}
        isFavorite={selectedId !== null && isFavorite(selectedId)}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedId(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Favorites Panel */}
      <FavoritesPanel
        isOpen={showFavorites}
        favorites={favorites}
        allPokemon={allPokemon}
        onClose={() => setShowFavorites(false)}
        onSelect={setSelectedId}
        onToggle={toggleFavorite}
      />
    </div>
  );
}
