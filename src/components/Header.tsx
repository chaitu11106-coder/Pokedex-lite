'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  favoritesCount: number;
  onShowFavorites: () => void;
}

export default function Header({ favoritesCount, onShowFavorites }: HeaderProps) {
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP scan animation on the title
    let frame: number;
    let pos = -100;
    const el = scanRef.current;
    if (!el) return;

    const animate = () => {
      pos += 0.4;
      if (pos > 100) pos = -100;
      el.style.backgroundPosition = `${pos}% 50%`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="relative z-10 border-b" style={{ borderColor: '#1E1E2E' }}>
      {/* Top accent line */}
      <div className="h-0.5 w-full" style={{
        background: 'linear-gradient(90deg, transparent, #FF1744 20%, #FF1744 80%, transparent)',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo / Title */}
        <div className="flex items-center gap-4">
          {/* Pokéball icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex-shrink-0"
          >
            <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-[0_0_8px_rgba(255,23,68,0.6)]">
              <path d="M 2 20 A 18 18 0 0 1 38 20 Z" fill="#FF1744" />
              <path d="M 2 20 A 18 18 0 0 0 38 20 Z" fill="#f0f0f0" />
              <line x1="2" y1="20" x2="38" y2="20" stroke="#111" strokeWidth="2.5" />
              <circle cx="20" cy="20" r="6" fill="#111" />
              <circle cx="20" cy="20" r="3.5" fill="#333" />
              <circle cx="20" cy="20" r="1.8" fill="#f0f0f0" />
              <circle cx="20" cy="20" r="18" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
            </svg>
          </motion.div>

          <div>
            {/* Main title with shimmer effect */}
            <div
              ref={scanRef}
              className="font-orbitron font-black text-xl sm:text-2xl tracking-widest"
              style={{
                background: 'linear-gradient(90deg, #FF1744 0%, #ffffff 30%, #FF1744 50%, #FFD600 70%, #FF1744 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              POKÉDEX
            </div>
            <div className="font-mono-jb text-[9px] text-white/20 tracking-[0.35em] uppercase">
              Generation I — VI Scanner
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-poke-green"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono-jb text-[9px] text-white/25 tracking-widest">ONLINE</span>
          </div>

          {/* Favorites button */}
          <motion.button
            onClick={onShowFavorites}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 px-4 py-2 rounded-sm font-orbitron text-[10px] tracking-widest transition-all duration-200"
            style={{
              background: favoritesCount > 0 ? 'rgba(255,23,68,0.1)' : 'rgba(30,30,46,0.8)',
              border: `1px solid ${favoritesCount > 0 ? 'rgba(255,23,68,0.3)' : '#1E1E2E'}`,
              color: favoritesCount > 0 ? '#FF1744' : 'rgba(255,255,255,0.3)',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5"
              fill={favoritesCount > 0 ? '#FF1744' : 'none'}
              stroke="currentColor" strokeWidth={2}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="hidden sm:inline">FAVORITES</span>
            {favoritesCount > 0 && (
              <motion.span
                key={favoritesCount}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white"
                style={{ background: '#FF1744' }}
              >
                {favoritesCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
