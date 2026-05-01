'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_TYPES, TYPE_COLORS } from '@/types/pokemon';

interface TypeFilterProps {
  selected: string[];
  onToggle: (type: string) => void;
  onClear: () => void;
}

export default function TypeFilter({ selected, onToggle, onClear }: TypeFilterProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex items-center gap-2 group"
        >
          <span className="font-orbitron text-xs text-white/50 tracking-[0.2em] uppercase group-hover:text-white/80 transition-colors">
            Type Filter
          </span>
          {selected.length > 0 && (
            <span className="font-mono-jb text-[9px] px-1.5 py-0.5 rounded-sm"
              style={{ background: 'rgba(255,23,68,0.2)', color: '#FF1744', border: '1px solid rgba(255,23,68,0.3)' }}>
              {selected.length}
            </span>
          )}
          <motion.svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 text-white/30"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </button>

        {selected.length > 0 && (
          <button
            onClick={onClear}
            className="font-rajdhani text-xs text-poke-red/70 hover:text-poke-red transition-colors tracking-wide"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selected types preview (always visible) */}
      {selected.length > 0 && !expanded && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((t) => {
            const c = TYPE_COLORS[t];
            return (
              <button
                key={t}
                onClick={() => onToggle(t)}
                className="font-orbitron text-[9px] px-2.5 py-1 rounded-sm capitalize tracking-widest flex items-center gap-1"
                style={{
                  background: c.bg,
                  color: c.text,
                  border: `1px solid ${c.border}`,
                  boxShadow: `0 0 8px ${c.glow}`,
                }}
              >
                {t}
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            );
          })}
        </div>
      )}

      {/* Full type grid */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 pt-2">
              {ALL_TYPES.map((type) => {
                const c = TYPE_COLORS[type];
                const isActive = selected.includes(type);
                return (
                  <motion.button
                    key={type}
                    onClick={() => onToggle(type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative font-orbitron text-[9px] px-2 py-1.5 rounded-sm capitalize tracking-widest transition-all duration-200 overflow-hidden"
                    style={{
                      background: isActive ? c.bg : 'rgba(30,30,46,0.8)',
                      color: isActive ? c.text : 'rgba(255,255,255,0.5)',
                      border: `1px solid ${isActive ? c.border : '#1E1E2E'}`,
                      boxShadow: isActive ? `0 0 12px ${c.glow}` : 'none',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={`type-active-${type}`}
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: `radial-gradient(circle at 50% 50%, ${c.glow} 0%, transparent 70%)` }}
                      />
                    )}
                    {type}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
