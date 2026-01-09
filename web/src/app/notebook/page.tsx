'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  NotebookOptions,
  defaultOptions,
  notebookSections,
  createNotebook,
  downloadNotebook,
} from '@/lib/notebook';
import { sectionGenerators } from '@/lib/notebook-sections';
import { SectionSelector } from '@/components/notebook/SectionSelector';
import { OptionsPanel } from '@/components/notebook/OptionsPanel';
import { NotebookPreview } from '@/components/notebook/NotebookPreview';

export default function NotebookGeneratorPage() {
  const [options, setOptions] = useState<NotebookOptions>(defaultOptions);
  const [activeTab, setActiveTab] = useState<'sections' | 'options'>('sections');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOptionsChange = useCallback((changes: Partial<NotebookOptions>) => {
    setOptions((prev) => ({ ...prev, ...changes }));
  }, []);

  const handleSectionToggle = useCallback((sectionId: string) => {
    const section = notebookSections.find((s) => s.id === sectionId);
    if (section?.required) return; // Can't toggle required sections

    setOptions((prev) => ({
      ...prev,
      selectedSections: prev.selectedSections.includes(sectionId)
        ? prev.selectedSections.filter((id) => id !== sectionId)
        : [...prev.selectedSections, sectionId],
    }));
  }, []);

  const handleSelectAll = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      selectedSections: notebookSections.map((s) => s.id),
    }));
  }, []);

  const handleSelectRequired = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      selectedSections: notebookSections.filter((s) => s.required).map((s) => s.id),
    }));
  }, []);

  const generateNotebook = useCallback(() => {
    setIsGenerating(true);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        // Create base notebook
        const notebook = createNotebook(options);

        // Generate cells for each selected section in order
        const orderedSections = notebookSections.filter((s) =>
          options.selectedSections.includes(s.id)
        );

        for (const section of orderedSections) {
          const generator = sectionGenerators[section.id];
          if (generator) {
            const cells = generator(options);
            notebook.cells.push(...cells);
          }
        }

        // Generate filename
        const sanitizedTitle = options.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_|_$/g, '');
        const filename = `${sanitizedTitle}_${options.date}.ipynb`;

        // Download
        downloadNotebook(notebook, filename);
      } catch (error) {
        console.error('Error generating notebook:', error);
        alert('Error generating notebook. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, [options]);

  const estimatedCells = useMemo(() => {
    return notebookSections
      .filter((s) => options.selectedSections.includes(s.id))
      .reduce((sum, s) => sum + s.estimatedCells, 0);
  }, [options.selectedSections]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Notebook Generator</h1>
              <p className="text-gray-400 text-sm">
                Create a customized Jupyter notebook for H-&gt;ZZ*-&gt;4l analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={generateNotebook}
                disabled={isGenerating || options.selectedSections.length === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  isGenerating || options.selectedSections.length === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>Download .ipynb</>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setActiveTab('sections')}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  activeTab === 'sections'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sections
              </button>
              <button
                onClick={() => setActiveTab('options')}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  activeTab === 'options'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Options
              </button>
            </div>

            {/* Tab content */}
            <div className="min-h-[600px]">
              {activeTab === 'sections' ? (
                <SectionSelector
                  selectedSections={options.selectedSections}
                  onSectionToggle={handleSectionToggle}
                  onSelectAll={handleSelectAll}
                  onSelectRequired={handleSelectRequired}
                />
              ) : (
                <OptionsPanel
                  options={options}
                  onOptionsChange={handleOptionsChange}
                />
              )}
            </div>
          </div>

          {/* Right column: Preview */}
          <div className="space-y-6">
            <NotebookPreview selectedSections={options.selectedSections} />

            {/* Info card */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">
                About This Generator
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                This tool generates a complete Jupyter notebook for analyzing
                CMS Open Data to observe the Higgs boson. The notebook includes
                physics explanations, Python code, and visualizations.
              </p>
              <div className="mt-3 pt-3 border-t border-cyan-500/20">
                <p className="text-xs text-gray-500">
                  Compatible with Jupyter Lab, Google Colab, and VS Code notebooks.
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Current Selection
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sections:</span>
                  <span className="text-white">
                    {options.selectedSections.length} / {notebookSections.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Cells:</span>
                  <span className="text-white">~{estimatedCells}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plot Style:</span>
                  <span className="text-white capitalize">{options.plotStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Format:</span>
                  <span className="text-white uppercase">{options.dataSource}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
