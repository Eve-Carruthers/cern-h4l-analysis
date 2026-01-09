'use client';

import { notebookSections } from '@/lib/notebook';

interface NotebookPreviewProps {
  selectedSections: string[];
}

export function NotebookPreview({ selectedSections }: NotebookPreviewProps) {
  const sections = notebookSections.filter((s) => selectedSections.includes(s.id));
  const totalCells = sections.reduce((sum, s) => sum + s.estimatedCells, 0);

  const categoryIcons: Record<string, string> = {
    intro: '📖',
    data: '💾',
    analysis: '🔬',
    visualization: '📊',
    results: '🎯',
  };

  return (
    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Notebook Preview</h3>
          <span className="text-xs text-gray-400">
            {sections.length} sections • ~{totalCells} cells
          </span>
        </div>
      </div>

      {/* Section list */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {sections.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Select sections to preview notebook structure
          </p>
        ) : (
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-start gap-3 p-2 rounded bg-white/5"
              >
                <span className="text-lg">{categoryIcons[section.category]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-white truncate">
                      {section.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {section.estimatedCells} cell{section.estimatedCells > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estimated stats */}
      <div className="px-4 py-3 border-t border-white/10 bg-white/5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-cyan-400">{totalCells}</div>
            <div className="text-xs text-gray-500">Total Cells</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyan-400">
              ~{Math.round(totalCells * 0.4)}
            </div>
            <div className="text-xs text-gray-500">Code Cells</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyan-400">
              ~{Math.round(totalCells * 1.5)} KB
            </div>
            <div className="text-xs text-gray-500">Est. Size</div>
          </div>
        </div>
      </div>
    </div>
  );
}
