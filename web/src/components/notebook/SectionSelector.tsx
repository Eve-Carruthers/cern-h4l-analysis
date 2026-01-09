'use client';

import { NotebookSection, notebookSections } from '@/lib/notebook';

interface SectionSelectorProps {
  selectedSections: string[];
  onSectionToggle: (sectionId: string) => void;
  onSelectAll: () => void;
  onSelectRequired: () => void;
}

const categoryLabels: Record<string, string> = {
  intro: 'Introduction',
  data: 'Data',
  analysis: 'Analysis',
  visualization: 'Visualization',
  results: 'Results',
};

const categoryColors: Record<string, string> = {
  intro: 'bg-purple-500/20 border-purple-500/50',
  data: 'bg-blue-500/20 border-blue-500/50',
  analysis: 'bg-green-500/20 border-green-500/50',
  visualization: 'bg-orange-500/20 border-orange-500/50',
  results: 'bg-red-500/20 border-red-500/50',
};

export function SectionSelector({
  selectedSections,
  onSectionToggle,
  onSelectAll,
  onSelectRequired,
}: SectionSelectorProps) {
  // Group sections by category
  const sectionsByCategory = notebookSections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {} as Record<string, NotebookSection[]>);

  const categories = ['intro', 'data', 'analysis', 'visualization', 'results'];

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex gap-2">
        <button
          onClick={onSelectAll}
          className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          Select All
        </button>
        <button
          onClick={onSelectRequired}
          className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          Required Only
        </button>
        <span className="ml-auto text-sm text-gray-400">
          {selectedSections.length} / {notebookSections.length} sections
        </span>
      </div>

      {/* Section groups */}
      {categories.map((category) => (
        <div key={category} className={`rounded-lg border p-4 ${categoryColors[category]}`}>
          <h3 className="text-sm font-semibold text-white mb-3">
            {categoryLabels[category]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sectionsByCategory[category]?.map((section) => {
              const isSelected = selectedSections.includes(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionToggle(section.id)}
                  disabled={section.required}
                  className={`flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-white/20 ring-1 ring-white/30'
                      : 'bg-black/20 hover:bg-black/30'
                  } ${section.required ? 'opacity-75' : ''}`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-cyan-500' : 'bg-white/20'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {section.title}
                      </span>
                      {section.required && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-cyan-500/30 text-cyan-300 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {section.description}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      ~{section.estimatedCells} cells
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
