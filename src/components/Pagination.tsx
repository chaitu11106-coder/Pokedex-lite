'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  totalCount: number;
}

export default function Pagination({ page, totalPages, onPage, totalCount }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Count indicator */}
      <p className="font-mono-jb text-[11px] text-white/25 tracking-widest">
        PAGE {page} / {totalPages} — {totalCount} POKÉMON
      </p>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Prev */}
        <motion.button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          whileHover={page > 1 ? { scale: 1.05 } : {}}
          whileTap={page > 1 ? { scale: 0.95 } : {}}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-sm font-orbitron text-xs tracking-widest transition-all duration-200',
            page === 1
              ? 'opacity-20 cursor-not-allowed text-white/30'
              : 'text-poke-red hover:glow-red'
          )}
          style={{
            background: page === 1 ? 'rgba(30,30,46,0.4)' : 'rgba(255,23,68,0.1)',
            border: `1px solid ${page === 1 ? '#1E1E2E' : 'rgba(255,23,68,0.3)'}`,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          PREV
        </motion.button>

        {/* Page numbers */}
        <div className="flex gap-1">
          {pages.map((p, i) => (
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 py-2 text-white/20 font-mono-jb text-xs flex items-end">···</span>
            ) : (
              <motion.button
                key={p}
                onClick={() => onPage(p as number)}
                whileHover={p !== page ? { scale: 1.1 } : {}}
                whileTap={{ scale: 0.9 }}
                className="relative w-9 h-9 rounded-sm font-orbitron text-xs transition-all duration-200 flex items-center justify-center overflow-hidden"
                style={{
                  background: p === page ? 'rgba(255,23,68,0.2)' : 'rgba(30,30,46,0.6)',
                  border: `1px solid ${p === page ? 'rgba(255,23,68,0.5)' : '#1E1E2E'}`,
                  color: p === page ? '#FF1744' : 'rgba(255,255,255,0.4)',
                  boxShadow: p === page ? '0 0 16px rgba(255,23,68,0.3)' : 'none',
                }}
              >
                {p === page && (
                  <motion.div
                    layoutId="active-page"
                    className="absolute inset-0 rounded-sm"
                    style={{ background: 'rgba(255,23,68,0.1)' }}
                  />
                )}
                <span className="relative z-10">{p}</span>
              </motion.button>
            )
          ))}
        </div>

        {/* Next */}
        <motion.button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          whileHover={page < totalPages ? { scale: 1.05 } : {}}
          whileTap={page < totalPages ? { scale: 0.95 } : {}}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-sm font-orbitron text-xs tracking-widest transition-all duration-200',
            page === totalPages
              ? 'opacity-20 cursor-not-allowed text-white/30'
              : 'text-poke-red hover:glow-red'
          )}
          style={{
            background: page === totalPages ? 'rgba(30,30,46,0.4)' : 'rgba(255,23,68,0.1)',
            border: `1px solid ${page === totalPages ? '#1E1E2E' : 'rgba(255,23,68,0.3)'}`,
          }}
        >
          NEXT
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
