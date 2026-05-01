'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { PokemonEntry } from '@/hooks/usePokemonList';
import { formatPokemonName, padId } from '@/utils/helpers';
import { TYPE_COLORS } from '@/types/pokemon';

interface FavoritesPanelProps {
  isOpen: boolean;
  favorites: Set<number>;
  allPokemon: PokemonEntry[];
  onClose: () => void;
  onSelect: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function FavoritesPanel({
  isOpen,
  favorites,
  allPokemon,
  onClose,
  onSelect,
  onToggle,
}: FavoritesPanelProps) {
  const favPokemon = allPokemon.filter((p) => favorites.has(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(5,5,8,0.6)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 z-40 flex flex-col"
            style={{
              background: '#080810',
              borderLeft: '1px solid #1E1E2E',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.8)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#1E1E2E' }}>
              <div>
                <h2 className="font-orbitron font-bold text-sm text-white tracking-widest">FAVORITES</h2>
                <p className="font-mono-jb text-[9px] text-white/25 mt-0.5 tracking-widest">
                  {favPokemon.length} CAPTURED
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors"
                style={{ border: '1px solid #1E1E2E' }}
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {favPokemon.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-20">
                  <div className="opacity-10">
                    <svg viewBox="0 0 100 100" className="w-20 h-20">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4" />
                      <path d="M 5 50 H 95" stroke="white" strokeWidth="4" />
                      <circle cx="50" cy="50" r="12" fill="none" stroke="white" strokeWidth="4" />
                    </svg>
                  </div>
                  <p className="font-orbitron text-xs text-white/20 tracking-[0.2em]">NO FAVORITES YET</p>
                  <p className="font-rajdhani text-sm text-white/15">Tap the ♥ on any Pokémon to save it here</p>
                </div>
              ) : (
                favPokemon.map((p, i) => {
                  const primaryType = p.types[0] ?? 'normal';
                  const color = TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-sm cursor-pointer group transition-all duration-200"
                      style={{
                        background: 'rgba(13,13,20,0.8)',
                        border: '1px solid #1E1E2E',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color.border)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1E1E2E')}
                      onClick={() => { onSelect(p.id); onClose(); }}
                    >
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-contain"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono-jb text-[8px] text-white/25">{padId(p.id)}</div>
                        <div className="font-orbitron text-xs text-white/90 truncate capitalize">{formatPokemonName(p.name)}</div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggle(p.id); }}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="#FF1744" stroke="#FF1744" strokeWidth={2}>
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
