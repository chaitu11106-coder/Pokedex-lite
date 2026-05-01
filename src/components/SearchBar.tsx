'use client';

import { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
}

export default function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div className="relative group">
      {/* Glow effect on focus */}
      <div className="absolute -inset-px rounded-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, rgba(255,23,68,0.4), rgba(255,214,0,0.2), rgba(255,23,68,0.4))', padding: '1px', borderRadius: '2px' }}
      />

      <div className="relative flex items-center gap-3 px-4 py-3 rounded-sm"
        style={{
          background: '#0D0D14',
          border: '1px solid #1E1E2E',
          transition: 'border-color 0.2s',
        }}
      >
        {/* Search icon */}
        <svg className="w-4 h-4 text-poke-red flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name or #ID..."
          className="flex-1 bg-transparent text-white placeholder-white/20 font-rajdhani text-base font-medium tracking-wide focus:outline-none"
          style={{ caretColor: '#FF1744' }}
        />

        {/* Result count */}
        <AnimatePresence>
          {value && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="font-mono-jb text-[10px] text-white/30 tracking-widest flex-shrink-0"
            >
              {resultCount} found
            </motion.span>
          )}
        </AnimatePresence>

        {/* Clear button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full transition-colors"
              style={{ background: 'rgba(255,23,68,0.2)' }}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-poke-red" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
