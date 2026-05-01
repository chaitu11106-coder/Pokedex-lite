'use client';

import { motion } from 'framer-motion';

interface LoaderProps {
  message?: string;
  progress?: number;
}

export default function PokeLoader({ message = 'Scanning Pokémon...', progress }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-8">
      {/* Pokéball SVG */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="relative w-20 h-20"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,23,68,0.6)]">
          {/* Top half (red) */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50 Z"
            fill="#FF1744"
          />
          {/* Bottom half (white) */}
          <path
            d="M 10 50 A 40 40 0 0 0 90 50 Z"
            fill="#f0f0f0"
          />
          {/* Center line */}
          <line x1="10" y1="50" x2="90" y2="50" stroke="#111" strokeWidth="6" />
          {/* Center circle ring */}
          <circle cx="50" cy="50" r="14" fill="#111" />
          <circle cx="50" cy="50" r="9" fill="#333" />
          <circle cx="50" cy="50" r="5" fill="#f0f0f0" />
          {/* Outer ring */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="5" />
        </svg>
      </motion.div>

      <div className="text-center space-y-2">
        <p className="font-orbitron text-sm text-poke-red tracking-[0.2em] uppercase">{message}</p>
        {progress !== undefined && (
          <div className="w-48 h-1 bg-poke-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-poke-red to-poke-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </div>

      {/* Scanning dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-poke-red"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
