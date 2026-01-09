// Jupyter Notebook format types and generation utilities

export interface NotebookCell {
  cell_type: 'markdown' | 'code';
  source: string[];
  metadata: Record<string, unknown>;
  execution_count?: number | null;
  outputs?: NotebookOutput[];
}

export interface NotebookOutput {
  output_type: 'stream' | 'execute_result' | 'display_data' | 'error';
  name?: string;
  text?: string[];
  data?: Record<string, string[]>;
  metadata?: Record<string, unknown>;
  execution_count?: number | null;
}

export interface NotebookMetadata {
  kernelspec: {
    display_name: string;
    language: string;
    name: string;
  };
  language_info: {
    name: string;
    version: string;
    mimetype: string;
    file_extension: string;
  };
}

export interface Notebook {
  nbformat: number;
  nbformat_minor: number;
  metadata: NotebookMetadata;
  cells: NotebookCell[];
}

// Section definitions for the notebook
export interface NotebookSection {
  id: string;
  title: string;
  description: string;
  category: 'intro' | 'data' | 'analysis' | 'visualization' | 'results';
  required: boolean;
  estimatedCells: number;
}

export const notebookSections: NotebookSection[] = [
  {
    id: 'title',
    title: 'Title & Abstract',
    description: 'Notebook title, author info, and analysis abstract',
    category: 'intro',
    required: true,
    estimatedCells: 1,
  },
  {
    id: 'introduction',
    title: 'Physics Introduction',
    description: 'Explanation of the Higgs boson and H->ZZ*->4l decay channel',
    category: 'intro',
    required: false,
    estimatedCells: 3,
  },
  {
    id: 'theory',
    title: 'Theoretical Background',
    description: 'Standard Model context, Higgs mechanism, and decay physics',
    category: 'intro',
    required: false,
    estimatedCells: 4,
  },
  {
    id: 'imports',
    title: 'Library Imports',
    description: 'Python package imports (numpy, pandas, matplotlib, etc.)',
    category: 'data',
    required: true,
    estimatedCells: 1,
  },
  {
    id: 'data_loading',
    title: 'Data Loading',
    description: 'Load CMS Open Data from ROOT files or CSV',
    category: 'data',
    required: true,
    estimatedCells: 2,
  },
  {
    id: 'data_exploration',
    title: 'Data Exploration',
    description: 'Initial data inspection, statistics, and quality checks',
    category: 'data',
    required: false,
    estimatedCells: 4,
  },
  {
    id: 'event_selection',
    title: 'Event Selection',
    description: 'Apply physics cuts and selection criteria',
    category: 'analysis',
    required: true,
    estimatedCells: 3,
  },
  {
    id: 'lepton_selection',
    title: 'Lepton Selection',
    description: 'Muon and electron identification and quality cuts',
    category: 'analysis',
    required: false,
    estimatedCells: 4,
  },
  {
    id: 'z_reconstruction',
    title: 'Z Boson Reconstruction',
    description: 'Pair leptons to reconstruct Z and Z* bosons',
    category: 'analysis',
    required: true,
    estimatedCells: 3,
  },
  {
    id: 'mass_calculation',
    title: 'Invariant Mass Calculation',
    description: 'Calculate 4-lepton invariant mass (m4l)',
    category: 'analysis',
    required: true,
    estimatedCells: 2,
  },
  {
    id: 'background_estimation',
    title: 'Background Estimation',
    description: 'Estimate ZZ continuum and other backgrounds',
    category: 'analysis',
    required: false,
    estimatedCells: 4,
  },
  {
    id: 'mass_plot',
    title: 'Mass Distribution Plot',
    description: 'Histogram of m4l showing the Higgs peak',
    category: 'visualization',
    required: true,
    estimatedCells: 3,
  },
  {
    id: 'channel_comparison',
    title: 'Channel Comparison',
    description: 'Compare 4mu, 4e, and 2e2mu channels',
    category: 'visualization',
    required: false,
    estimatedCells: 3,
  },
  {
    id: 'kinematic_plots',
    title: 'Kinematic Distributions',
    description: 'pT, eta, phi distributions for leptons',
    category: 'visualization',
    required: false,
    estimatedCells: 4,
  },
  {
    id: 'significance',
    title: 'Statistical Significance',
    description: 'Calculate local significance and p-value',
    category: 'results',
    required: false,
    estimatedCells: 3,
  },
  {
    id: 'mass_fit',
    title: 'Mass Peak Fitting',
    description: 'Fit Gaussian + background to extract Higgs mass',
    category: 'results',
    required: false,
    estimatedCells: 4,
  },
  {
    id: 'conclusions',
    title: 'Conclusions',
    description: 'Summary of results and physics conclusions',
    category: 'results',
    required: true,
    estimatedCells: 2,
  },
  {
    id: 'references',
    title: 'References',
    description: 'Citations to CMS papers and Open Data documentation',
    category: 'results',
    required: false,
    estimatedCells: 1,
  },
];

export interface NotebookOptions {
  title: string;
  author: string;
  date: string;
  includeOutputs: boolean;
  pythonVersion: '3.9' | '3.10' | '3.11' | '3.12';
  dataSource: 'csv' | 'root' | 'both';
  plotStyle: 'matplotlib' | 'seaborn' | 'plotly';
  selectedSections: string[];
}

export const defaultOptions: NotebookOptions = {
  title: 'Higgs Boson Discovery: H->ZZ*->4l Analysis',
  author: '',
  date: new Date().toISOString().split('T')[0],
  includeOutputs: false,
  pythonVersion: '3.11',
  dataSource: 'csv',
  plotStyle: 'matplotlib',
  selectedSections: notebookSections.filter(s => s.required).map(s => s.id),
};

// Helper to create a markdown cell
export function markdownCell(source: string | string[]): NotebookCell {
  const lines = Array.isArray(source) ? source : source.split('\n');
  return {
    cell_type: 'markdown',
    source: lines.map((line, i) => i < lines.length - 1 ? line + '\n' : line),
    metadata: {},
  };
}

// Helper to create a code cell
export function codeCell(source: string | string[], outputs: NotebookOutput[] = []): NotebookCell {
  const lines = Array.isArray(source) ? source : source.split('\n');
  return {
    cell_type: 'code',
    source: lines.map((line, i) => i < lines.length - 1 ? line + '\n' : line),
    metadata: {},
    execution_count: null,
    outputs,
  };
}

// Create base notebook structure
export function createNotebook(options: NotebookOptions): Notebook {
  return {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: {
        display_name: `Python ${options.pythonVersion}`,
        language: 'python',
        name: 'python3',
      },
      language_info: {
        name: 'python',
        version: options.pythonVersion,
        mimetype: 'text/x-python',
        file_extension: '.py',
      },
    },
    cells: [],
  };
}

// Download notebook as .ipynb file
export function downloadNotebook(notebook: Notebook, filename: string): void {
  const json = JSON.stringify(notebook, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ipynb') ? filename : `${filename}.ipynb`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
