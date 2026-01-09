'use client';

import { NotebookOptions } from '@/lib/notebook';

interface OptionsPanelProps {
  options: NotebookOptions;
  onOptionsChange: (options: Partial<NotebookOptions>) => void;
}

export function OptionsPanel({ options, onOptionsChange }: OptionsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Notebook Title
        </label>
        <input
          type="text"
          value={options.title}
          onChange={(e) => onOptionsChange({ title: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Analysis title..."
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Author
        </label>
        <input
          type="text"
          value={options.author}
          onChange={(e) => onOptionsChange({ author: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Your name..."
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Date
        </label>
        <input
          type="date"
          value={options.date}
          onChange={(e) => onOptionsChange({ date: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Python Version */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Python Version
        </label>
        <select
          value={options.pythonVersion}
          onChange={(e) => onOptionsChange({ pythonVersion: e.target.value as NotebookOptions['pythonVersion'] })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="3.9">Python 3.9</option>
          <option value="3.10">Python 3.10</option>
          <option value="3.11">Python 3.11</option>
          <option value="3.12">Python 3.12</option>
        </select>
      </div>

      {/* Data Source */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Data Source
        </label>
        <div className="space-y-2">
          {[
            { value: 'csv', label: 'CSV Files', desc: 'Pre-processed data in CSV format' },
            { value: 'root', label: 'ROOT Files', desc: 'Native CMS data format (requires uproot)' },
            { value: 'both', label: 'Both', desc: 'Include code for both formats' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                options.dataSource === opt.value
                  ? 'bg-cyan-500/20 ring-1 ring-cyan-500/50'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <input
                type="radio"
                name="dataSource"
                value={opt.value}
                checked={options.dataSource === opt.value}
                onChange={(e) => onOptionsChange({ dataSource: e.target.value as NotebookOptions['dataSource'] })}
                className="mt-1 accent-cyan-500"
              />
              <div>
                <div className="text-sm font-medium text-white">{opt.label}</div>
                <div className="text-xs text-gray-400">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Plot Style */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Plotting Library
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'matplotlib', label: 'Matplotlib' },
            { value: 'seaborn', label: 'Seaborn' },
            { value: 'plotly', label: 'Plotly' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onOptionsChange({ plotStyle: opt.value as NotebookOptions['plotStyle'] })}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                options.plotStyle === opt.value
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Include Outputs */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeOutputs}
            onChange={(e) => onOptionsChange({ includeOutputs: e.target.checked })}
            className="w-5 h-5 rounded accent-cyan-500"
          />
          <div>
            <div className="text-sm font-medium text-white">Include Example Outputs</div>
            <div className="text-xs text-gray-400">
              Add sample outputs to code cells (increases file size)
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
