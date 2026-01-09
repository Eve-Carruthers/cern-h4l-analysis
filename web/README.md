# H->4l Analysis Dashboard

Interactive web dashboard for visualizing the CMS Higgs boson discovery analysis. Built with Next.js 16, React 19, and Recharts.

## Overview

This dashboard provides an interactive visualization of the historic Higgs boson discovery using CMS Open Data from 2011-2012. It complements the Python CLI analysis tool by offering a modern, interactive web interface to explore the analysis results.

## Features

### Interactive Mass Plot (`/mass-plot`)

The centerpiece visualization showing the four-lepton invariant mass distribution with the Higgs boson excess.

**Chart Features:**
- **Stacked Bar Chart**: Visualizes ZZ background, other backgrounds (Z+jets, tt), and Higgs signal
- **Data Points with Error Bars**: Observed CMS data with Poisson statistical uncertainties
- **Reference Lines**: Vertical dashed lines marking Z boson (91.2 GeV) and Higgs (125 GeV) masses
- **Signal Region Highlight**: Red shaded area (120-130 GeV) where Higgs events are expected

**Interactive Controls:**
- **Zoom Presets**: Quick buttons for Full Range, Higgs Region, Z Peak, Low Mass, High Mass
- **Manual Zoom**: Zoom in/out buttons with reset functionality
- **Layer Toggles**: Show/hide individual data layers (Data, ZZ Background, Other Background, Higgs Signal, Total Expected)
- **Rich Tooltips**: Hover over any bin to see detailed breakdown of observed vs expected events

**Live Statistics:**
- Total observed events in current view
- Expected background count
- Expected signal count
- Updates dynamically with zoom range

### Channel Comparison (`/channels`)

Detailed comparison of the three H->4l decay channels with interactive visualizations.

**View Modes:**
- **Cards**: Interactive channel cards with selection states, showing key metrics and characteristics
- **Charts**: Four visualization types for comparing channel performance
- **Table**: Complete data table with metric rankings

**Interactive Charts:**
- **Bar Chart**: Event counts (observed, background, signal) by channel
- **Radar Chart**: Multi-metric performance comparison (efficiency, resolution, S/B ratio, etc.)
- **Pie Chart**: Observed event distribution across channels
- **Line Chart**: Mass distribution shape showing resolution differences

**Features:**
- Channel selection with detailed view showing strengths/challenges
- Physics explanation panel with decay chain diagram
- Summary statistics banner
- Color-coded channels (4mu: green, 4e: blue, 2e2mu: purple)
- Ranking indicators in table view

**Components:**
```
src/components/channels/
├── ChannelCard.tsx    # Interactive channel cards
├── ChannelCharts.tsx  # Bar, radar, pie, line charts
├── ChannelTable.tsx   # Data table with rankings
└── ChannelPhysics.tsx # Physics explanation panel
```

### Reproducibility Report (`/report`)

A comprehensive, printable analysis report demonstrating commitment to CERN's open science standards.

**Report Sections:**
1. **Abstract**: Summary of the analysis and key findings
2. **Software Environment**: Complete list of software packages with versions
3. **Data Sources**: All data sources with locations and descriptions
4. **Analysis Pipeline**: Step-by-step workflow with commands and inputs/outputs
5. **Configuration**: Dataset parameters, selection criteria, and systematic uncertainties
6. **Results**: Key findings including observed events, significance, and channel breakdown
7. **Reproducibility Information**: Timestamps, report ID, and reproduction instructions

**Features:**
- **Editable Metadata**: Click "Edit" to customize author, institution, date, and version
- **Print/PDF Export**: Professional print-optimized layout with proper page breaks
- **Text Export**: Download a plain text summary of the report
- **Unique Report ID**: Auto-generated identifier for tracking
- **Table of Contents**: Automatically included in print view

**Components:**
```
src/components/report/
├── ReportHeader.tsx        # CERN-style header with metadata
├── ReportSection.tsx       # Collapsible numbered sections
├── SoftwareTable.tsx       # Software versions with links
├── DataSourcesTable.tsx    # Data sources with icons
├── AnalysisPipeline.tsx    # Visual step-by-step pipeline
├── ConfigurationDisplay.tsx # Config parameters grid
└── ResultsSummary.tsx      # Results with channel breakdown
```

### Additional Pages

- `/` - Dashboard home with overview statistics
- `/statistics` - Statistical significance calculations
- `/event-display` - Event visualization

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [Recharts](https://recharts.org/) | Charting library |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Lucide React](https://lucide.dev/) | Icons |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── mass-plot/          # Interactive mass plot page
│   │   ├── channels/           # Decay channels page
│   │   ├── statistics/         # Statistics page
│   │   ├── event-display/      # Event display page
│   │   └── report/             # Report page
│   ├── components/
│   │   ├── charts/             # Chart components
│   │   │   ├── MassPlot.tsx    # Main mass distribution chart
│   │   │   └── SignificanceGauge.tsx
│   │   ├── channels/           # Channel comparison components
│   │   │   ├── ChannelCard.tsx
│   │   │   ├── ChannelCharts.tsx
│   │   │   ├── ChannelTable.tsx
│   │   │   └── ChannelPhysics.tsx
│   │   ├── report/             # Report components
│   │   │   ├── ReportHeader.tsx
│   │   │   ├── ReportSection.tsx
│   │   │   ├── SoftwareTable.tsx
│   │   │   ├── DataSourcesTable.tsx
│   │   │   ├── AnalysisPipeline.tsx
│   │   │   ├── ConfigurationDisplay.tsx
│   │   │   └── ResultsSummary.tsx
│   │   ├── layout/
│   │   │   └── Navbar.tsx      # Navigation bar
│   │   ├── statistics/         # Statistics components
│   │   └── ui/                 # UI primitives
│   ├── lib/
│   │   ├── data.ts             # Physics data (mass bins, channels)
│   │   ├── physics.ts          # Physics calculations
│   │   ├── report.ts           # Report data types and constants
│   │   ├── utils.ts            # Utility functions
│   │   └── animations.ts       # Framer Motion variants
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── public/                     # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Data

The dashboard uses representative data based on CMS Open Data results:

### Mass Distribution Data

41 bins from 70-150 GeV containing:
- `mass`: Bin center in GeV
- `observed`: Observed event count
- `zzBackground`: ZZ continuum background
- `otherBackground`: Z+jets, tt backgrounds
- `signal`: Expected Higgs signal (125 GeV)

### Physics Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `HIGGS_MASS` | 125.0 GeV | Higgs boson mass |
| `Z_MASS` | 91.2 GeV | Z boson mass |
| `DISCOVERY_THRESHOLD` | 5.0 sigma | Statistical discovery threshold |

### Decay Channels

| Channel | Leptons | Color |
|---------|---------|-------|
| 4mu | 4 muons | Green |
| 4e | 4 electrons | Blue |
| 2e2mu | 2 electrons + 2 muons | Purple |

## Components

### MassPlot Component

The main chart component (`src/components/charts/MassPlot.tsx`) provides:

```tsx
import { MassPlot } from "@/components/charts/MassPlot";

// Usage
<MassPlot />
```

**Internal State:**
- `visibility`: Controls which data layers are shown
- `zoomRange`: Current min/max mass range
- `hoveredBin`: Currently hovered data point for enhanced display

**Customization:**
The component uses predefined zoom presets that can be extended:

```typescript
const ZOOM_PRESETS = {
  full: { min: 70, max: 150 },
  higgs: { min: 115, max: 135 },
  zPeak: { min: 80, max: 102 },
  lowMass: { min: 70, max: 110 },
  highMass: { min: 110, max: 150 },
};
```

## Physics Background

### The Higgs Discovery

The chart visualizes the key evidence for the Higgs boson discovery:

1. **Background Expectation**: ZZ continuum and reducible backgrounds form a smooth distribution
2. **Signal Expectation**: Higgs events appear as an excess at ~125 GeV
3. **Observed Data**: CMS collision data shows a clear excess matching the signal prediction
4. **Statistical Significance**: The excess exceeds 5 sigma, the particle physics discovery threshold

### Invariant Mass Formula

```
m_4l = sqrt[(E1+E2+E3+E4)^2 - (p1+p2+p3+p4)^2]
```

The four-lepton invariant mass is calculated from the energy and momentum of all four detected leptons.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Data Source

- **Dataset**: CMS Open Data (2011-2012)
- **Collision Energy**: 7-8 TeV
- **Integrated Luminosity**: 24.8 fb^-1
- **Reference**: [cms-opendata-analyses/HiggsExample20112012](https://github.com/cms-opendata-analyses/HiggsExample20112012)

## License

MIT License - See [LICENSE](../LICENSE) for details.
