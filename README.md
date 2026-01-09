# CERN H->4l Analysis

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Author:** Eve Carruthers

A Python CLI tool that automates the reproduction of the historic Higgs boson discovery analysis using CMS Open Data. This project reconstructs the 4-lepton invariant mass spectrum that revealed the Higgs boson at ~125 GeV.

---

## Table of Contents

- [The Physics](#the-physics-higgs-to-four-leptons-h4l)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Commands](#cli-commands)
- [Analysis Levels](#analysis-levels)
- [Web Dashboard](#web-dashboard)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Understanding the Output](#understanding-the-output)
- [Data Source](#data-source)
- [References](#references)
- [License](#license)
- [Contributing](#contributing)

---

## The Physics: Higgs to Four Leptons (H->4l)

### The Higgs Boson Discovery

On July 4, 2012, CERN announced the discovery of a new particle consistent with the Higgs boson - the quantum excitation of the Higgs field that gives mass to fundamental particles. This discovery was made independently by both the ATLAS and CMS experiments at the Large Hadron Collider (LHC).

### Why Four Leptons?

The Higgs boson is unstable and decays almost immediately after being produced. One of its cleanest decay signatures is:

```
H -> ZZ* -> 4l (four leptons)
```

Where:
- **H** is the Higgs boson
- **Z** and **Z*** are Z bosons (one may be "off-shell", meaning virtual)
- **4l** represents four leptons: electrons (e) or muons (μ)

The possible final states are:
- 4 electrons (4e)
- 4 muons (4μ)
- 2 electrons + 2 muons (2e2μ)

### Why Is This Channel Special?

| Property | Benefit |
|----------|---------|
| Clean signature | Leptons leave clear tracks with precise momentum measurements |
| Low background | Few other processes produce four isolated high-energy leptons |
| Full reconstruction | All decay products are detected (unlike channels with neutrinos) |
| Mass resolution | The invariant mass of the 4-lepton system can be precisely reconstructed |

### The Invariant Mass

The invariant mass of the four-lepton system is calculated using special relativity:

```
M_4l = sqrt[(E1+E2+E3+E4)^2 - (p1+p2+p3+p4)^2]
```

When a Higgs boson decays to four leptons, this invariant mass equals the Higgs mass (~125 GeV). The analysis plots this distribution and looks for a "bump" (excess of events) above the smooth background.

### Background Processes

The main backgrounds that can mimic the Higgs signal:

| Background | Description |
|------------|-------------|
| ZZ continuum | Direct production of two Z bosons (irreducible) |
| Z + jets | Z boson with jets misidentified as leptons |
| tt-bar | Top quark pair production with leptonic decays |

---

## Installation

### Prerequisites

| Tool | Purpose | Installation |
|------|---------|--------------|
| Python 3.10+ | Core runtime | [python.org](https://www.python.org/downloads/) |
| Git | Clone repositories | [git-scm.com](https://git-scm.com/) |
| ROOT | Level 2 analysis | [root.cern/install](https://root.cern/install/) |
| Docker | Level 3 analysis | [docker.com](https://docs.docker.com/get-docker/) |

### Install the Package

```bash
# Clone this repository
git clone https://github.com/Eve-Carruthers/cern-h4l-analysis.git
cd cern-h4l-analysis

# Install in development mode
pip install -e .

# Or install with development dependencies
pip install -e ".[dev]"
```

---

## Quick Start

```bash
# 1. Initialize the project (clones CMS Open Data example)
h4l init

# 2. Check your setup
h4l status

# 3. Run the Level 2 analysis (requires ROOT)
h4l run level2

# 4. Or run Level 3 analysis (requires Docker)
h4l run level3
```

---

## CLI Commands

### `h4l init`

Initializes the project by cloning the upstream CMS HiggsExample repository.

```bash
h4l init           # Clone upstream repository
h4l init --force   # Re-clone even if already exists
```

### `h4l status`

Shows the current project status:
- Upstream repository clone status
- Output directory status
- Available tools (git, ROOT, Docker)
- Current configuration

```bash
h4l status
```

### `h4l run`

Runs the H->4l analysis at the specified complexity level.

```bash
h4l run level2                # Run Level 2 analysis
h4l run level3                # Run Level 3 analysis
h4l run level2 --dry-run      # Show commands without executing
h4l run level2 --no-metadata  # Skip saving run metadata
```

### `h4l clean`

Removes output files and optionally the upstream repository.

```bash
h4l clean                   # Clean all output directories
h4l clean level2            # Clean only Level 2 outputs
h4l clean --all             # Also remove upstream repo and logs
h4l clean --force           # Don't ask for confirmation
```

### `h4l config`

Displays the current configuration settings.

```bash
h4l config
```

---

## Analysis Levels

This project supports two complexity levels from the CMS Open Data example:

### Level 2: Simplified Analysis

**Requirements:** ROOT installed locally

Level 2 uses pre-processed ROOT files containing reconstructed physics objects:

1. Reads pre-made ntuples with lepton 4-vectors
2. Applies selection cuts (pT, eta, isolation)
3. Reconstructs Z boson candidates
4. Combines to form Higgs candidates
5. Plots the 4-lepton invariant mass distribution

**Output:** `outputs/level2/m4l_level2.pdf`

### Level 3: Full Reconstruction

**Requirements:** Docker (uses CMSSW container)

Level 3 performs the complete analysis chain starting from AOD (Analysis Object Data) files:

| Step | Description |
|------|-------------|
| Data Analysis | Processes real collision data from CMS |
| Monte Carlo | Processes simulated events for signal and background |
| Combination | Runs ROOT macro to combine data and MC |

This level demonstrates real CMS analysis techniques:
- Event reconstruction from detector hits
- Object identification (electrons, muons)
- Trigger selection
- Systematic uncertainties (simplified)

**Output:** `outputs/level3/m4l_level3.pdf`

---

## Web Dashboard

This project includes an interactive web dashboard for visualizing the analysis results. Built with Next.js, React, and Recharts.

### Quick Start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Features

| Page | Description |
|------|-------------|
| `/` | Dashboard home with overview statistics |
| `/mass-plot` | Interactive 4-lepton invariant mass distribution |
| `/channels` | Decay channel breakdown (4e, 4mu, 2e2mu) |
| `/statistics` | Interactive statistical significance calculator |
| `/event-display` | 3D interactive particle collision event display |
| `/report` | Analysis report |
| `/notebook` | Jupyter notebook generator for H->4l analysis |

### Statistical Significance Calculator

The `/statistics` page provides an interactive calculator for understanding statistical significance in particle physics:

- **Interactive Sliders**: Adjust observed events, expected background, expected signal, and look-elsewhere factor
- **Real-time Calculations**: Significance updates instantly as you modify parameters
- **Visual Gauge**: Color-coded gauge showing 0-7σ with threshold markers (2σ, 3σ, 5σ discovery)
- **Results Display**: Complete breakdown of p-values, significance, and excess events
- **Historical Comparison**: Compare your result to famous discoveries (Higgs, W/Z bosons, gravitational waves)
- **Educational Content**: Toggle-able panel explaining p-values, sigma notation, and the 5σ convention
- **Quick Presets**: Pre-configured scenarios including the actual H→4ℓ discovery values
- **Formula Reference**: Mathematical formulas used for Poisson statistics and significance conversion

### Interactive Mass Plot

The centerpiece visualization at `/mass-plot` includes:

- **Stacked Bar Chart**: ZZ background, other backgrounds, and Higgs signal
- **Data Points with Error Bars**: CMS observed data with Poisson uncertainties
- **Zoom Controls**: Presets for Full Range, Higgs Region, Z Peak, and custom zoom
- **Layer Toggles**: Show/hide individual data components
- **Rich Tooltips**: Detailed breakdown on hover
- **Reference Lines**: Z boson (91.2 GeV) and Higgs (125 GeV) mass markers
- **Signal Region Highlight**: 120-130 GeV region shaded

### 3D Event Display

The `/event-display` page provides an interactive 3D visualization of H->ZZ*->4l candidate events:

- **3D CMS Detector**: Simplified visualization of the CMS detector with toggleable layers (Tracker, ECAL, HCAL, Muon system)
- **Particle Tracks**: Helical trajectories showing muon and electron paths through the detector with charge-based color coding
- **5 Higgs Candidate Events**: Sample events across all three decay channels (4mu, 4e, 2e2mu) with masses around 125 GeV
- **Interactive Controls**: Orbit, zoom, and pan the 3D view with mouse controls
- **Track Selection**: Click tracks to view detailed kinematics (pT, eta, phi, energy)
- **Reconstructed Masses**: Display of 4-lepton invariant mass and Z boson pair masses
- **Detector Opacity**: Adjustable transparency for better track visibility
- **Event Metadata**: Run number, event number, luminosity section, and date for each event

### Jupyter Notebook Generator

The `/notebook` page allows you to create customized Jupyter notebooks for the H->ZZ*->4l analysis:

- **18 Customizable Sections**: Choose from Introduction, Data Loading, Analysis, Visualization, and Results sections
- **Required Sections**: Core analysis sections (Title, Imports, Data Loading, etc.) auto-selected
- **Configurable Options**:
  - Python version (3.9, 3.10, 3.11, 3.12)
  - Data source (CSV, ROOT, or both)
  - Plotting library (Matplotlib, Seaborn, or Plotly)
- **Real-time Preview**: See notebook structure and estimated cell count before download
- **Direct Download**: Generate and download .ipynb file without server processing
- **Comprehensive Content**: Physics explanations, LaTeX equations, complete analysis code
- **Compatible With**: Jupyter Lab, Google Colab, VS Code notebooks

Section categories include:
- **Introduction**: Title/Abstract, Physics Introduction, Theoretical Background
- **Data**: Library Imports, Data Loading, Data Exploration
- **Analysis**: Event Selection, Lepton Selection, Z Reconstruction, Mass Calculation, Background Estimation
- **Visualization**: Mass Distribution Plot, Channel Comparison, Kinematic Distributions
- **Results**: Statistical Significance, Mass Peak Fitting, Conclusions, References

For full documentation, see [web/README.md](web/README.md).

---

## Project Structure

```
cern-h4l-analysis/
|-- src/h4l/
|   |-- __init__.py      # Package version
|   |-- cli.py           # CLI commands (Typer-based)
|   +-- config.py        # Configuration dataclasses
|-- tests/               # Unit tests
|   |-- __init__.py
|   +-- test_config.py
|-- configs/
|   +-- config.yaml      # Analysis configuration
|-- outputs/             # Generated analysis outputs
|   |-- level2/          # Level 2 results
|   +-- level3/          # Level 3 results
|-- logs/                # Run logs
|-- third_party/
|   +-- upstream/        # Cloned CMS example repository
|-- web/                 # Interactive web dashboard
|   |-- src/
|   |   |-- app/         # Next.js pages
|   |   |-- components/  # React components
|   |   |-- lib/         # Data and utilities
|   |   +-- types/       # TypeScript types
|   +-- README.md        # Web dashboard documentation
|-- pyproject.toml       # Project metadata
|-- LICENSE              # MIT License
+-- README.md
```

---

## Configuration

The analysis is configured via `configs/config.yaml`:

```yaml
# Upstream CMS Open Data repository settings
upstream:
  repo_url: "https://github.com/cms-opendata-analyses/HiggsExample20112012.git"
  local_path: "third_party/upstream"
  pinned_commit: null  # Use specific commit for reproducibility

# Output and working directories
paths:
  outputs:
    level2: "outputs/level2"
    level3: "outputs/level3"
  logs: "logs"
  third_party: "third_party"

# Level 2 analysis settings
level2:
  macro_name: "M4Lnormdatall.cc"
  output_plot: "mass4l_combine_user.pdf"
  final_plot_name: "m4l_level2.pdf"

# Level 3 analysis settings
level3:
  docker_image: "cmsopendata/cmssw_5_3_32"
  cmssw_version: "CMSSW_5_3_32"
  data_config: "demoanalyzer_cfg_level3data.py"
  mc_config: "demoanalyzer_cfg_level3MC.py"
  macro_name: "M4Lnormdatall_lvl3.cc"
  output_plot: "mass4l_combine_userlvl3.pdf"
  final_plot_name: "m4l_level3.pdf"

# Run metadata settings
metadata:
  include_host_info: true
  include_timestamps: true
  include_commands: true
```

### Configuration Options

| Section | Key | Description |
|---------|-----|-------------|
| `upstream` | `repo_url` | URL of the CMS Open Data example repository |
| `upstream` | `local_path` | Where to clone the upstream repository |
| `upstream` | `pinned_commit` | Specific commit hash for reproducibility |
| `paths` | `outputs` | Output directories for each analysis level |
| `paths` | `logs` | Directory for run logs |
| `paths` | `third_party` | Directory for external dependencies |
| `level2/3` | `macro_name` | ROOT macro filename |
| `level2/3` | `output_plot` | Original output filename from macro |
| `level2/3` | `final_plot_name` | Renamed output in outputs directory |
| `metadata` | `include_*` | Control what metadata is saved |

---

## Understanding the Output

The final output is a histogram showing:

| Element | Description |
|---------|-------------|
| X-axis | 4-lepton invariant mass (M_4l) in GeV |
| Y-axis | Number of events |
| Data points | Real collision events from CMS (black points with error bars) |
| Colored histograms | Stacked Monte Carlo predictions for backgrounds |
| Signal | The excess around 125 GeV is the Higgs boson signal |

A successful analysis will show a clear peak around 125 GeV above the expected background, demonstrating the Higgs boson discovery.

---

## Data Source

This analysis uses CMS Open Data from 2011-2012 LHC runs:

| Parameter | Value |
|-----------|-------|
| Collision energy | 7 TeV (2011) and 8 TeV (2012) |
| Integrated luminosity | ~5 fb^-1 (2011) + ~20 fb^-1 (2012) |
| Source | [CERN Open Data Portal](http://opendata.cern.ch/) |

---

## References

- [CMS Higgs Discovery Paper (Physics Letters B, 2012)](https://doi.org/10.1016/j.physletb.2012.08.021)
- [CMS Open Data HiggsExample](https://github.com/cms-opendata-analyses/HiggsExample20112012)
- [CERN Open Data Portal](http://opendata.cern.ch/)
- [The Higgs Boson - CERN](https://home.cern/science/physics/higgs-boson)

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
