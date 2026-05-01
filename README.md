# 🔴 Pokédex Lite

A high-fidelity, production-grade Pokédex web application built with cutting-edge frontend technologies. Retro-futuristic aesthetic meets modern animation engineering.

---

## ✨ Features

### Mandatory
- **Data Fetching** — PokéAPI integration with loading spinners and error states
- **Responsive Grid** — 2→3→4→5→6 column layout (mobile → desktop)
- **Search** — Real-time name/ID search with result count
- **Type Filtering** — Animated collapsible filter panel for all 18 types
- **Pagination** — Smart page controls with ellipsis, 24 Pokémon per page
- **Favorites** — Heart toggle with localStorage persistence
- **Detail Modal** — Stats bars, abilities, moves, shiny toggle, keyboard navigation

### Bonus
- **Animations** — GSAP entrance sequences + Framer Motion throughout
- **SSR Ready** — Built on Next.js 14 App Router
- **Aceternity UI** — Custom Spotlight effect component
- **Keyboard nav** — ESC, ←, → in the modal

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | SSR-ready React framework, App Router |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS** | Utility-first styling with custom theme |
| **Framer Motion** | Card animations, modals, page transitions, staggered reveals |
| **GSAP** | Hero section entrance animation, shimmer effects |
| **PokéAPI** | Pokémon data source |

### Design choices
- **Orbitron** display font — futuristic, techy, unmistakable
- **Rajdhani** body font — clean military/tech aesthetic  
- **JetBrains Mono** — monospaced for IDs and stats
- Dark (#050508) background with electric red (#FF1744) accents
- Grid line background texture, scan-line overlay, glow effects
- Clip-path corner cuts on cards for a sci-fi feel

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Install & Run

```bash
# Clone the repository
git clone <your-repo-url>
cd pokedex-lite

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata
│   ├── page.tsx            # Main page (orchestrator)
│   └── globals.css         # Global styles, custom fonts, animations
├── components/
│   ├── Header.tsx          # Logo, GSAP shimmer, favorites button
│   ├── PokemonCard.tsx     # Animated card with float, glow, type colors
│   ├── PokemonModal.tsx    # Detail view (stats/abilities/moves + shiny toggle)
│   ├── SearchBar.tsx       # Real-time search with clear button
│   ├── TypeFilter.tsx      # Collapsible 18-type filter grid
│   ├── Pagination.tsx      # Smart page controls with Framer Motion
│   ├── FavoritesPanel.tsx  # Slide-in panel from right
│   ├── PokeLoader.tsx      # Animated Pokéball spinner
│   ├── Spotlight.tsx       # Aceternity-inspired mouse spotlight effect
│   └── TypeBadge.tsx       # Type chip with per-type colors + glow
├── hooks/
│   ├── usePokemonList.ts   # Bulk fetch, filter, paginate logic
│   └── useFavorites.ts     # localStorage persistence
├── lib/
│   └── api.ts              # PokéAPI fetch wrappers
├── types/
│   └── pokemon.ts          # Full type definitions + color maps
└── utils/
    └── helpers.ts          # cn, formatName, padId, etc.
```

---

## 🎨 Design System

### Colors
- `--poke-red: #FF1744` — primary accent
- `--poke-dark: #050508` — background
- `--poke-card: #0D0D14` — card background
- `--poke-gold: #FFD600` — shiny/secondary accent

### Animation Patterns
- **Staggered entry** — Cards animate in with 40ms delay increments
- **Float** — Pokemon sprites gently bob up and down
- **Spotlight** — Mouse-tracking radial glow on filter panel
- **Stat bars** — Fill from 0% with staggered delays on modal open
- **Spring panels** — Favorites panel uses spring physics

---

## 🧩 Challenges & Solutions

**1. Batch fetching without rate-limiting**  
PokéAPI is public but has no bulk endpoint for details. Solution: chunk 300 names into groups of 50 and `Promise.allSettled` each batch, updating the UI progressively.

**2. Type filtering + search = O(n²)**  
Solution: single `useEffect` that runs both filters in sequence on `allPokemon`, producing a clean `filteredPokemon` array that pagination consumes.

**3. GSAP in Next.js App Router**  
Server components can't run GSAP. Solution: mark the page `'use client'` and run `gsap.fromTo()` inside a `useEffect` with refs.

**4. Framer Motion `AnimatePresence` with page changes**  
Keying the grid on `page-${page}-${search}-${types}` triggers clean exit/enter transitions on any filter change.

---

## 🌐 Deployment

Deploy instantly to Vercel:

```bash
npx vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deployments.

---

## 📝 License

MIT — educational use only. Pokémon © Nintendo/Game Freak.
