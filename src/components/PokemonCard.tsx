'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import TypeBadge from './TypeBadge';
import { TYPE_COLORS } from '@/types/pokemon';
import { formatPokemonName, padId } from '@/utils/helpers';
import { PokemonEntry } from '@/hooks/usePokemonList';

interface PokemonCardProps {
  pokemon: PokemonEntry;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onSelect: (id: number) => void;
  index: number;
}

export default function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onSelect,
  index,
}: PokemonCardProps) {
  const [imgError, setImgError] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const primaryType = pokemon.types[0] ?? 'normal';
  const typeColor = TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal;

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(pokemon.id);
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 300);
    },
    [onToggleFavorite, pokemon.id]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: (index % 24) * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(pokemon.id)}
      className="group relative cursor-pointer"
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-sm clip-corner transition-all duration-300"
        style={{
          background: `linear-gradient(145deg, #0D0D14 0%, #111120 100%)`,
          border: `1px solid #1E1E2E`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${typeColor.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Top bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${typeColor.border}, transparent)`,
          }}
        />

        {/* Pokemon ID */}
        <div className="absolute top-3 left-3 z-10">
          <span className="font-mono-jb text-[10px] text-white/25 tracking-widest">
            {padId(pokemon.id)}
          </span>
        </div>

        {/* Favorite button */}
        <motion.button
          onClick={handleFavorite}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            background: isFavorite ? 'rgba(255,23,68,0.15)' : 'rgba(255,255,255,0.04)',
            border: isFavorite ? '1px solid rgba(255,23,68,0.4)' : '1px solid rgba(255,255,255,0.08)',
          }}
          animate={heartPop ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.3 }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 transition-all duration-200"
            fill={isFavorite ? '#FF1744' : 'none'}
            stroke={isFavorite ? '#FF1744' : 'rgba(255,255,255,0.4)'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.button>

        {/* Image area */}
        <div className="relative pt-8 pb-2 flex justify-center items-center h-40">
          {/* Background pokeball watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="4" />
              <path d="M 2 50 H 98" stroke="white" strokeWidth="4" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="4" />
            </svg>
          </div>

          {!imgError ? (
            <motion.div
              className="relative w-28 h-28"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: (index * 0.3) % 2 }}
            >
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                fill
                className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] transition-all duration-300"
                onError={() => setImgError(true)}
                sizes="112px"
              />
            </motion.div>
          ) : (
            <div className="w-28 h-28 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-20">
                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4" />
                <path d="M 5 50 H 95" stroke="white" strokeWidth="4" />
                <circle cx="50" cy="50" r="12" fill="none" stroke="white" strokeWidth="4" />
              </svg>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="px-4 pb-4 pt-1 space-y-2.5">
          {/* Name */}
          <h3 className="font-orbitron font-semibold text-sm text-white tracking-wide capitalize truncate text-center">
            {formatPokemonName(pokemon.name)}
          </h3>

          {/* Types */}
          <div className="flex gap-1.5 justify-center flex-wrap">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
        </div>

        {/* Bottom scan line */}
        <motion.div
          className="absolute bottom-0 left-0 h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${typeColor.border}, transparent)`,
          }}
        />

        {/* Corner accents */}
        <div className="absolute bottom-0 right-0 w-4 h-4 opacity-30"
          style={{ borderTop: `1px solid ${typeColor.border}`, borderLeft: `1px solid ${typeColor.border}` }}
        />
      </div>
    </motion.div>
  );
}
