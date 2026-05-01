'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';
import { TYPE_COLORS, STAT_COLORS } from '@/types/pokemon';
import { fetchPokemonById } from '@/lib/api';
import { formatPokemonName, padId, formatStatName } from '@/utils/helpers';
import TypeBadge from './TypeBadge';

interface PokemonModalProps {
  pokemonId: number | null;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

type Tab = 'stats' | 'abilities' | 'moves';

export default function PokemonModal({
  pokemonId,
  isFavorite,
  onToggleFavorite,
  onClose,
  onPrev,
  onNext,
}: PokemonModalProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('stats');
  const [shiny, setShiny] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    if (!pokemonId) {
      setPokemon(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPokemon(null);
    setStatsVisible(false);
    setShiny(false);
    setTab('stats');

    fetchPokemonById(pokemonId)
      .then((p) => {
        if (!cancelled) {
          setPokemon(p);
          setLoading(false);
          setTimeout(() => setStatsVisible(true), 400);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [pokemonId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  const primaryType = pokemon?.types[0]?.type.name ?? 'normal';
  const typeColor = TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal;

  const getImage = () => {
    if (!pokemon) return null;
    if (shiny) return pokemon.sprites.other['official-artwork'].front_shiny ?? pokemon.sprites.front_shiny;
    return pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default;
  };

  const maxStat = 255;

  return (
    <AnimatePresence>
      {pokemonId !== null && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 modal-backdrop"
            style={{ background: 'rgba(5,5,8,0.85)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-sm pointer-events-auto"
              style={{
                background: 'linear-gradient(160deg, #0D0D18 0%, #080810 100%)',
                border: `1px solid #1E1E2E`,
                boxShadow: `0 24px 80px rgba(0,0,0,0.9), 0 0 60px ${typeColor.glow}`,
              }}
            >
              {/* Top color bar */}
              <div
                className="h-0.5 w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${typeColor.border}, ${typeColor.border}, transparent)` }}
              />

              {/* Animated background type glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${typeColor.glow} 0%, transparent 60%)`,
                  opacity: 0.4,
                }}
              />

              {/* Header */}
              <div className="relative flex items-start justify-between p-6 pb-0">
                <div className="space-y-1">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-4 w-16 rounded skeleton" />
                      <div className="h-7 w-40 rounded skeleton" />
                    </div>
                  ) : pokemon ? (
                    <>
                      <span className="font-mono-jb text-xs text-white/30 tracking-widest">{padId(pokemon.id)}</span>
                      <h2 className="font-orbitron font-bold text-2xl text-white tracking-wide capitalize leading-tight">
                        {formatPokemonName(pokemon.name)}
                      </h2>
                      <div className="flex gap-2 pt-1">
                        {pokemon.types.map((t) => (
                          <TypeBadge key={t.type.name} type={t.type.name} size="md" />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  {/* Shiny toggle */}
                  {pokemon && (
                    <button
                      onClick={() => setShiny((s) => !s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-orbitron text-[9px] tracking-widest transition-all duration-200"
                      style={{
                        background: shiny ? 'rgba(255,214,0,0.15)' : 'rgba(30,30,46,0.8)',
                        border: shiny ? '1px solid rgba(255,214,0,0.4)' : '1px solid #1E1E2E',
                        color: shiny ? '#FFD600' : 'rgba(255,255,255,0.3)',
                        boxShadow: shiny ? '0 0 16px rgba(255,214,0,0.3)' : 'none',
                      }}
                    >
                      ✦ {shiny ? 'SHINY' : 'SHINY'}
                    </button>
                  )}

                  {/* Favorite */}
                  {pokemon && (
                    <motion.button
                      onClick={() => onToggleFavorite(pokemon.id)}
                      whileTap={{ scale: 0.85 }}
                      className="w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-200"
                      style={{
                        background: isFavorite ? 'rgba(255,23,68,0.15)' : 'rgba(30,30,46,0.8)',
                        border: `1px solid ${isFavorite ? 'rgba(255,23,68,0.4)' : '#1E1E2E'}`,
                      }}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4"
                        fill={isFavorite ? '#FF1744' : 'none'}
                        stroke={isFavorite ? '#FF1744' : 'rgba(255,255,255,0.4)'}
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </motion.button>
                  )}

                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-200 hover:bg-white/5"
                    style={{ border: '1px solid #1E1E2E' }}
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="relative overflow-y-auto max-h-[calc(90vh-80px)]" style={{ scrollbarWidth: 'thin' }}>
                <div className="flex flex-col sm:flex-row gap-0">
                  {/* Left — Image + vitals */}
                  <div className="sm:w-56 flex-shrink-0 flex flex-col items-center p-6 pt-4 gap-4">
                    {/* Pokemon Image */}
                    <div className="relative w-44 h-44">
                      {/* Rotating ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full opacity-20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        style={{ border: `1px dashed ${typeColor.border}` }}
                      />
                      <motion.div
                        className="absolute inset-3 rounded-full opacity-10"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        style={{ border: `1px dashed ${typeColor.border}` }}
                      />

                      {/* Glow backdrop */}
                      <div
                        className="absolute inset-4 rounded-full blur-2xl opacity-30"
                        style={{ background: typeColor.glow }}
                      />

                      {loading ? (
                        <div className="absolute inset-8 rounded-full skeleton" />
                      ) : getImage() ? (
                        <motion.div
                          key={`${pokemon?.id}-${shiny}`}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={getImage()!}
                            alt={pokemon?.name ?? ''}
                            fill
                            className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)]"
                            sizes="176px"
                          />
                        </motion.div>
                      ) : null}
                    </div>

                    {/* Vitals */}
                    {pokemon && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full grid grid-cols-2 gap-2"
                      >
                        {[
                          { label: 'HEIGHT', value: `${(pokemon.height / 10).toFixed(1)} m` },
                          { label: 'WEIGHT', value: `${(pokemon.weight / 10).toFixed(1)} kg` },
                          { label: 'BASE XP', value: String(pokemon.base_experience ?? '—') },
                          { label: 'MOVES', value: String(pokemon.moves.length) },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="p-2 rounded-sm text-center"
                            style={{ background: 'rgba(30,30,46,0.5)', border: '1px solid #1E1E2E' }}
                          >
                            <div className="font-mono-jb text-[8px] text-white/30 tracking-widest">{label}</div>
                            <div className="font-orbitron text-xs text-white/90 mt-0.5">{value}</div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Right — Tabs */}
                  <div className="flex-1 p-6 pt-4 border-t sm:border-t-0 sm:border-l" style={{ borderColor: '#1E1E2E' }}>
                    {/* Tab bar */}
                    <div className="flex gap-1 mb-5">
                      {(['stats', 'abilities', 'moves'] as Tab[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTab(t)}
                          className="relative px-3 py-1.5 font-orbitron text-[10px] tracking-widest uppercase transition-all duration-200 rounded-sm"
                          style={{
                            color: tab === t ? typeColor.text === '#000' ? '#000' : '#fff' : 'rgba(255,255,255,0.3)',
                            background: tab === t ? typeColor.bg : 'transparent',
                            border: `1px solid ${tab === t ? typeColor.border : 'transparent'}`,
                            boxShadow: tab === t ? `0 0 12px ${typeColor.glow}` : 'none',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Tab content */}
                    <AnimatePresence mode="wait">
                      {/* STATS */}
                      {tab === 'stats' && (
                        <motion.div
                          key="stats"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="space-y-1">
                                <div className="h-3 w-20 rounded skeleton" />
                                <div className="h-2 w-full rounded skeleton" />
                              </div>
                            ))
                          ) : pokemon?.stats.map((s, i) => {
                            const pct = Math.round((s.base_stat / maxStat) * 100);
                            const color = STAT_COLORS[s.stat.name] ?? '#888';
                            return (
                              <div key={s.stat.name}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-mono-jb text-[10px] text-white/40 tracking-widest">
                                    {formatStatName(s.stat.name)}
                                  </span>
                                  <span className="font-orbitron text-xs" style={{ color }}>
                                    {s.base_stat}
                                  </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30,30,46,0.8)' }}>
                                  <motion.div
                                    className="h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: statsVisible ? `${pct}%` : 0 }}
                                    transition={{ duration: 0.8, delay: i * 0.07, ease: 'easeOut' }}
                                    style={{
                                      background: `linear-gradient(90deg, ${color}88, ${color})`,
                                      boxShadow: `0 0 6px ${color}66`,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}

                      {/* ABILITIES */}
                      {tab === 'abilities' && (
                        <motion.div
                          key="abilities"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-14 rounded-sm skeleton" />
                              ))
                            : pokemon?.abilities.map((a, i) => (
                                <motion.div
                                  key={a.ability.name}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.08 }}
                                  className="p-3 rounded-sm"
                                  style={{
                                    background: 'rgba(30,30,46,0.5)',
                                    border: `1px solid ${a.is_hidden ? 'rgba(255,214,0,0.2)' : '#1E1E2E'}`,
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-orbitron text-xs text-white/90 capitalize tracking-wide">
                                      {a.ability.name.replace('-', ' ')}
                                    </span>
                                    {a.is_hidden && (
                                      <span className="font-mono-jb text-[8px] px-1.5 py-0.5 rounded"
                                        style={{ background: 'rgba(255,214,0,0.1)', color: '#FFD600', border: '1px solid rgba(255,214,0,0.2)' }}>
                                        HIDDEN
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-rajdhani text-xs text-white/30 mt-0.5">Slot {a.slot}</div>
                                </motion.div>
                              ))}
                        </motion.div>
                      )}

                      {/* MOVES */}
                      {tab === 'moves' && (
                        <motion.div
                          key="moves"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-1 max-h-64 overflow-y-auto pr-1"
                        >
                          {loading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-8 rounded skeleton" />
                              ))
                            : pokemon?.moves.slice(0, 40).map((m, i) => (
                                <motion.div
                                  key={m.move.name}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: i * 0.015 }}
                                  className="px-3 py-1.5 rounded-sm font-rajdhani text-sm text-white/60 capitalize hover:text-white/90 transition-colors"
                                  style={{ border: '1px solid transparent' }}
                                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1E1E2E')}
                                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                                >
                                  {m.move.name.replace(/-/g, ' ')}
                                </motion.div>
                              ))}
                          {pokemon && pokemon.moves.length > 40 && (
                            <p className="font-mono-jb text-[9px] text-white/20 text-center pt-2 tracking-widest">
                              +{pokemon.moves.length - 40} MORE MOVES
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Footer nav */}
              <div className="flex items-center justify-between px-6 py-3 border-t" style={{ borderColor: '#1E1E2E' }}>
                <button
                  onClick={onPrev}
                  className="flex items-center gap-2 font-orbitron text-[10px] tracking-widest text-white/30 hover:text-white/70 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  PREV
                </button>
                <span className="font-mono-jb text-[9px] text-white/15 tracking-[0.3em]">ESC TO CLOSE</span>
                <button
                  onClick={onNext}
                  className="flex items-center gap-2 font-orbitron text-[10px] tracking-widest text-white/30 hover:text-white/70 transition-colors"
                >
                  NEXT
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
