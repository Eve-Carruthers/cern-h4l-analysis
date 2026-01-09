"use client";

import { motion } from "framer-motion";

interface Discovery {
  name: string;
  year: number;
  significance: number;
  experiment: string;
  color: string;
}

const historicalDiscoveries: Discovery[] = [
  {
    name: "Higgs Boson",
    year: 2012,
    significance: 5.0,
    experiment: "CMS & ATLAS",
    color: "#ef4444",
  },
  {
    name: "Top Quark",
    year: 1995,
    significance: 4.8,
    experiment: "CDF & D0",
    color: "#8b5cf6",
  },
  {
    name: "W Boson",
    year: 1983,
    significance: 6.0,
    experiment: "UA1 & UA2",
    color: "#3b82f6",
  },
  {
    name: "Z Boson",
    year: 1983,
    significance: 5.2,
    experiment: "UA1 & UA2",
    color: "#22c55e",
  },
  {
    name: "Gravitational Waves",
    year: 2016,
    significance: 5.1,
    experiment: "LIGO",
    color: "#f59e0b",
  },
];

interface HistoricalComparisonProps {
  currentSignificance: number;
}

export function HistoricalComparison({ currentSignificance }: HistoricalComparisonProps) {
  const maxSigma = 7;

  // Sort by significance for display
  const sortedDiscoveries = [...historicalDiscoveries].sort(
    (a, b) => b.significance - a.significance
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Compare to Historic Discoveries</h3>

      <div className="space-y-4">
        {/* Current result */}
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="w-32 text-right">
              <span className="font-semibold text-white">Your Result</span>
            </div>
            <div className="flex-1 h-8 bg-slate-800 rounded-full overflow-hidden relative">
              {/* 5σ marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-green-500/50 z-10"
                style={{ left: `${(5 / maxSigma) * 100}%` }}
              />

              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(currentSignificance / maxSigma, 1) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="w-16 text-left">
              <span className="font-mono text-cyan-400">{currentSignificance.toFixed(1)}σ</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-4" />

        {/* Historical discoveries */}
        {sortedDiscoveries.map((discovery, index) => (
          <motion.div
            key={discovery.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="text-sm text-slate-300">{discovery.name}</span>
                <span className="text-xs text-slate-500 block">{discovery.year}</span>
              </div>
              <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden relative">
                {/* 5σ marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-green-500/30 z-10"
                  style={{ left: `${(5 / maxSigma) * 100}%` }}
                />

                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: discovery.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(discovery.significance / maxSigma) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + index * 0.1 }}
                />
              </div>
              <div className="w-16 text-left">
                <span className="font-mono text-sm" style={{ color: discovery.color }}>
                  {discovery.significance.toFixed(1)}σ
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-slate-400 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-500" />
          <span>5σ Discovery Threshold</span>
        </div>
      </div>
    </div>
  );
}
