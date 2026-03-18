# ClimaSim

Interactive climate simulation platform for modeling temperature scenarios, sea level rise, carbon budgets, and extreme weather events.

<!-- Add screenshot here -->

## Features

- **Climate Simulator** — Adjust emissions scenarios and visualize temperature projections
- **Sea Level Rise Modeler** — Model sea level changes under different warming scenarios
- **Carbon Budget Tracker** — Track remaining carbon budgets against climate targets
- **Extreme Events Analyzer** — Analyze frequency and intensity of extreme weather events
- **3D Globe Visualization** — Interactive Mapbox-powered globe with climate data overlays
- **D3 Data Visualizations** — Custom D3.js charts for complex climate datasets
- **Scenario Comparison** — Compare multiple climate scenarios side-by-side

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Maps:** Mapbox GL
- **Data Visualization:** D3.js, Recharts
- **Database:** Supabase
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Mapbox API token
- Supabase project

### Installation

```bash
git clone <repo-url>
cd climasim
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/
│   ├── SimulatorPanel.tsx
│   ├── SeaLevelPanel.tsx
│   ├── CarbonBudgetPanel.tsx
│   ├── ExtremeEventPanel.tsx
│   └── GlobeView.tsx
├── lib/
│   └── store.ts      # Zustand state management
└── types/            # TypeScript type definitions
```

