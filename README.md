# CERN H→4l Analysis

A Python CLI tool that automates the reproduction of the historic Higgs boson discovery analysis using CMS Open Data. This project reconstructs the 4-lepton invariant mass spectrum that revealed the Higgs boson at ~125 GeV.

## The Physics: Higgs to Four Leptons (H→4l)

### The Higgs Boson Discovery

On July 4, 2012, CERN announced the discovery of a new particle consistent with the Higgs boson—the quantum excitation of the Higgs field that gives mass to fundamental particles. This discovery was made independently by both the ATLAS and CMS experiments at the Large Hadron Collider (LHC).

### Why Four Leptons?

The Higgs boson is unstable and decays almost immediately after being produced. One of its cleanest decay signatures is:

```
H → ZZ* → 4l (four leptons)
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

1. **Clean signature**: Leptons leave clear tracks in the detector with precise momentum measurements
2. **Low background**: Few other processes produce four isolated high-energy leptons
3. **Full reconstruction**: All decay products are detected (unlike channels with neutrinos)
4. **Mass resolution**: The invariant mass of the 4-lepton system can be precisely reconstructed

### The Invariant Mass

The invariant mass of the four-lepton system is calculated using special relativity:

```
M₄ₗ = √[(E₁+E₂+E₃+E₄)² - (p₁+p₂+p₃+p₄)²]
```

When a Higgs boson decays to four leptons, this invariant mass equals the Higgs mass (~125 GeV). The analysis plots this distribution and looks for a "bump" (excess of events) above the smooth background from other processes.

### Background Processes

The main backgrounds that can mimic the Higgs signal include:
- **ZZ continuum**: Direct production of two Z bosons (irreducible background)
- **Z + jets**: Z boson production with jets misidentified as leptons
- **tt̄**: Top quark pair production with leptonic decays

## Installation

### Prerequisites

- **Python 3.10+**
- **Git** (for cloning the upstream CMS example repository)
- **ROOT** (for Level 2 analysis) - [Install ROOT](https://root.cern/install/)
- **Docker** (for Level 3 analysis) - [Install Docker](https://docs.docker.com/get-docker/)

### Install the Package

```bash
# Clone this repository
git clone https://github.com/yourusername/cern-h4l-analysis.git
cd cern-h4l-analysis

# Install in development mode
pip install -e .

# Or install with development dependencies
pip install -e ".[dev]"
```

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

## CLI Commands

### `h4l init`

Initializes the project by cloning the upstream CMS HiggsExample repository.

```bash
h4l init           # Clone upstream repository
h4l init --force   # Re-clone even if already exists
```

### `h4l status`

Shows the current project status, including:
- Whether the upstream repository is cloned
- Output directory status
- Available tools (git, ROOT, Docker)
- Current configuration

```bash
h4l status
```

### `h4l run`

Runs the H→4l analysis at the specified complexity level.

```bash
h4l run level2              # Run Level 2 analysis
h4l run level3              # Run Level 3 analysis
h4l run level2 --dry-run    # Show commands without executing
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

## Analysis Levels

This project supports two complexity levels from the CMS Open Data example:

### Level 2: Simplified Analysis

**Requirements**: ROOT installed locally

Level 2 uses pre-processed ROOT files containing reconstructed physics objects. The analysis:

1. Reads pre-made ntuples with lepton 4-vectors
2. Applies selection cuts (pT, η, isolation)
3. Reconstructs Z boson candidates
4. Combines to form Higgs candidates
5. Plots the 4-lepton invariant mass distribution

**Output**: `outputs/level2/m4l_level2.pdf` - The invariant mass plot showing the Higgs peak

### Level 3: Full Reconstruction

**Requirements**: Docker (uses CMSSW container)

Level 3 performs the complete analysis chain starting from AOD (Analysis Object Data) files:

1. **Data Analysis**: Processes real collision data from CMS
2. **Monte Carlo Analysis**: Processes simulated events for signal and background
3. **Combination**: Runs ROOT macro to combine data and MC, producing the final plot

This level demonstrates how real CMS analyses work, including:
- Event reconstruction from detector hits
- Object identification (electrons, muons)
- Trigger selection
- Systematic uncertainties (simplified)

**Output**: `outputs/level3/m4l_level3.pdf` - The full analysis result

## Project Structure

```
cern-h4l-analysis/
├── src/h4l/
│   ├── __init__.py      # Package version
│   ├── cli.py           # CLI commands (Typer-based)
│   └── config.py        # Configuration dataclasses
├── configs/
│   └── config.yaml      # Analysis configuration
├── outputs/             # Generated analysis outputs
│   ├── level2/          # Level 2 results
│   └── level3/          # Level 3 results
├── logs/                # Run logs
├── third_party/
│   └── upstream/        # Cloned CMS example repository
├── pyproject.toml       # Project metadata
└── README.md
```

## Configuration

The analysis is configured via `configs/config.yaml`:

```yaml
upstream:
  repo_url: "https://github.com/cms-opendata-analyses/HiggsExample20112012.git"
  local_path: "third_party/upstream"
  pinned_commit: null  # Use specific commit for reproducibility

paths:
  outputs:
    level2: "outputs/level2"
    level3: "outputs/level3"
  logs: "logs"

level2:
  macro_name: "M4Lnormdatall.cc"
  output_plot: "mass4l_combine_user.pdf"
  final_plot_name: "m4l_level2.pdf"

level3:
  docker_image: "cmsopendata/cmssw_5_3_32"
  cmssw_version: "CMSSW_5_3_32"
  data_config: "demoanalyzer_cfg_level3data.py"
  mc_config: "demoanalyzer_cfg_level3MC.py"
  macro_name: "M4Lnormdatall_lvl3.cc"

metadata:
  include_host_info: true
  include_timestamps: true
  include_commands: true
```

## Understanding the Output

The final output is a histogram showing:

- **X-axis**: 4-lepton invariant mass (M₄ₗ) in GeV
- **Y-axis**: Number of events
- **Data points**: Real collision events from CMS (black points with error bars)
- **Colored histograms**: Stacked Monte Carlo predictions for backgrounds
- **Signal**: The excess around 125 GeV is the Higgs boson signal

A successful analysis will show a clear peak around 125 GeV above the expected background, demonstrating the Higgs boson discovery.

## Data Source

This analysis uses CMS Open Data from 2011-2012 LHC runs:
- **Collision energy**: 7 TeV (2011) and 8 TeV (2012)
- **Integrated luminosity**: ~5 fb⁻¹ (2011) + ~20 fb⁻¹ (2012)
- **Source**: [CERN Open Data Portal](http://opendata.cern.ch/)

## References

- [CMS Higgs Discovery Paper (Physics Letters B, 2012)](https://doi.org/10.1016/j.physletb.2012.08.021)
- [CMS Open Data HiggsExample](https://github.com/cms-opendata-analyses/HiggsExample20112012)
- [CERN Open Data Portal](http://opendata.cern.ch/)
- [The Higgs Boson - CERN](https://home.cern/science/physics/higgs-boson)

## License

MIT License - See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
