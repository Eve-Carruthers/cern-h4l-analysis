export interface AnalysisMetadata {
  title: string;
  author: string;
  institution: string;
  date: string;
  version: string;
}

export interface SoftwareVersion {
  name: string;
  version: string;
  url?: string;
  description: string;
}

export interface DataSource {
  name: string;
  type: string;
  location: string;
  size?: string;
  checksum?: string;
  description: string;
}

export interface AnalysisStep {
  id: number;
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
  command?: string;
  duration?: string;
  status: "completed" | "pending" | "skipped";
}

// Default analysis metadata
export const defaultMetadata: AnalysisMetadata = {
  title: "CMS H→ZZ*→4ℓ Open Data Analysis",
  author: "Analysis Author",
  institution: "Institution",
  date: new Date().toISOString().split("T")[0],
  version: "1.0.0",
};

// Software versions used
export const softwareVersions: SoftwareVersion[] = [
  {
    name: "Python",
    version: "3.10+",
    url: "https://python.org",
    description: "Core programming language for analysis automation",
  },
  {
    name: "ROOT",
    version: "6.26+",
    url: "https://root.cern",
    description: "CERN's data analysis framework for particle physics",
  },
  {
    name: "CMSSW",
    version: "5_3_32",
    url: "https://cms-sw.github.io",
    description: "CMS Software framework for event reconstruction",
  },
  {
    name: "Docker",
    version: "20.10+",
    url: "https://docker.com",
    description: "Container runtime for reproducible environment",
  },
  {
    name: "h4l-analysis",
    version: "0.1.0",
    url: "https://github.com/cms-opendata-analyses/HiggsExample20112012",
    description: "Analysis automation CLI tool",
  },
  {
    name: "Next.js",
    version: "14+",
    url: "https://nextjs.org",
    description: "React framework for the analysis dashboard",
  },
];

// Data sources
export const dataSources: DataSource[] = [
  {
    name: "CMS Primary Datasets",
    type: "Collision Data",
    location: "CERN Open Data Portal",
    size: "~2 TB (full dataset)",
    description: "Proton-proton collision data from 2011-2012 LHC runs",
  },
  {
    name: "DoubleElectron",
    type: "Primary Dataset",
    location: "/DoubleElectron/Run2012*-*AOD",
    description: "Events with two or more electrons",
  },
  {
    name: "DoubleMu",
    type: "Primary Dataset",
    location: "/DoubleMu/Run2012*-*AOD",
    description: "Events with two or more muons",
  },
  {
    name: "MuEG",
    type: "Primary Dataset",
    location: "/MuEG/Run2012*-*AOD",
    description: "Events with electron-muon combinations",
  },
  {
    name: "Monte Carlo Samples",
    type: "Simulation",
    location: "CMS Open Data Portal",
    description: "Simulated signal and background events",
  },
  {
    name: "HiggsExample20112012",
    type: "Analysis Code",
    location: "github.com/cms-opendata-analyses/HiggsExample20112012",
    description: "Official CMS Open Data analysis example repository",
  },
];

// Analysis steps
export const analysisSteps: AnalysisStep[] = [
  {
    id: 1,
    name: "Environment Setup",
    description: "Clone repository and set up analysis environment",
    inputs: ["Git repository URL", "Configuration file"],
    outputs: ["Local repository clone", "Directory structure"],
    command: "h4l init",
    status: "completed",
  },
  {
    id: 2,
    name: "Level 2 Analysis",
    description: "Run simplified analysis using pre-processed ntuples",
    inputs: ["Pre-processed ROOT ntuples", "Analysis macro"],
    outputs: ["Invariant mass histogram", "Event yields"],
    command: "h4l run level2",
    duration: "~30 seconds",
    status: "completed",
  },
  {
    id: 3,
    name: "Level 3 Analysis",
    description: "Full reconstruction from AOD files using CMSSW",
    inputs: ["AOD data files", "MC simulation files", "CMSSW configuration"],
    outputs: ["Reconstructed events", "Final mass plot"],
    command: "h4l run level3",
    duration: "~2-4 hours",
    status: "completed",
  },
  {
    id: 4,
    name: "Statistical Analysis",
    description: "Calculate significance and p-values",
    inputs: ["Event yields", "Background estimates"],
    outputs: ["Local p-value", "Significance (σ)", "CLs limits"],
    status: "completed",
  },
  {
    id: 5,
    name: "Visualization",
    description: "Generate interactive plots and reports",
    inputs: ["Analysis results", "Channel breakdown"],
    outputs: ["Interactive dashboard", "Reproducibility report"],
    status: "completed",
  },
];

// Analysis configuration
export const analysisConfig = {
  dataset: {
    year: "2011-2012",
    centerOfMassEnergy: "7-8 TeV",
    integratedLuminosity: "24.8 fb⁻¹",
    luminosityUncertainty: "2.6%",
  },
  selection: {
    leptonPtThreshold: "20/10 GeV (leading/subleading)",
    leptonEtaRange: "|η| < 2.5 (e), |η| < 2.4 (μ)",
    isolation: "PF-based relative isolation < 0.4",
    massWindow: "40 < m_Z1 < 120 GeV, 12 < m_Z2 < 120 GeV",
    signalRegion: "120 < m_4ℓ < 130 GeV",
  },
  systematics: {
    leptonEfficiency: "1-2%",
    energyScale: "0.5-1%",
    backgroundNormalization: "10-30%",
    luminosity: "2.6%",
  },
};

// Generate timestamp
export function generateTimestamp(): string {
  return new Date().toISOString();
}

// Generate report ID
export function generateReportId(): string {
  return `H4L-${Date.now().toString(36).toUpperCase()}`;
}
