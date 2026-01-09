"use client";

import { Settings, Sliders, AlertTriangle } from "lucide-react";

interface ConfigurationDisplayProps {
  config: {
    dataset: Record<string, string>;
    selection: Record<string, string>;
    systematics: Record<string, string>;
  };
}

export function ConfigurationDisplay({ config }: ConfigurationDisplayProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Dataset Configuration */}
      <div className="bg-slate-800/50 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-blue-400 print:text-blue-600" />
          <h4 className="font-semibold text-white print:text-black">Dataset</h4>
        </div>
        <dl className="space-y-2 text-sm">
          {Object.entries(config.dataset).map(([key, value]) => (
            <div key={key}>
              <dt className="text-slate-500 print:text-gray-500 text-xs">
                {formatConfigKey(key)}
              </dt>
              <dd className="text-white print:text-black font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Selection Criteria */}
      <div className="bg-slate-800/50 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-purple-400 print:text-purple-600" />
          <h4 className="font-semibold text-white print:text-black">Selection</h4>
        </div>
        <dl className="space-y-2 text-sm">
          {Object.entries(config.selection).map(([key, value]) => (
            <div key={key}>
              <dt className="text-slate-500 print:text-gray-500 text-xs">
                {formatConfigKey(key)}
              </dt>
              <dd className="text-white print:text-black font-medium font-mono text-xs">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Systematic Uncertainties */}
      <div className="bg-slate-800/50 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400 print:text-yellow-600" />
          <h4 className="font-semibold text-white print:text-black">Systematics</h4>
        </div>
        <dl className="space-y-2 text-sm">
          {Object.entries(config.systematics).map(([key, value]) => (
            <div key={key}>
              <dt className="text-slate-500 print:text-gray-500 text-xs">
                {formatConfigKey(key)}
              </dt>
              <dd className="text-white print:text-black font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function formatConfigKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
