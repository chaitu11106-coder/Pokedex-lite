/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        poke: {
          red: '#FF1744',
          red2: '#D50000',
          dark: '#050508',
          card: '#0D0D14',
          border: '#1E1E2E',
          gold: '#FFD600',
          blue: '#00B0FF',
          green: '#00E676',
          purple: '#D500F9',
          cyan: '#00E5FF',
        },
      },
      animation: {
        'scan-line': 'scanLine 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(255,23,68,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,23,68,0.05) 1px, transparent 1px)`,
        'radial-glow': 'radial-gradient(ellipse at center, rgba(255,23,68,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        'poke-red': '0 0 20px rgba(255,23,68,0.4), 0 0 60px rgba(255,23,68,0.1)',
        'poke-gold': '0 0 20px rgba(255,214,0,0.4), 0 0 60px rgba(255,214,0,0.1)',
        'poke-blue': '0 0 20px rgba(0,176,255,0.4), 0 0 60px rgba(0,176,255,0.1)',
        'card': '0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(255,23,68,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
};
