"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, Award, BarChart3 } from "lucide-react";
import { channels, getTotalStats, HIGGS_MASS } from "@/lib/data";
import { calculateSignificance, formatSignificance, formatPValue } from "@/lib/physics";

export function ResultsSummary() {
  const stats = getTotalStats();
  const result = calculateSignificance(
    stats.totalObserved,
    stats.totalBackground,
    stats.totalSignal
  );

  return (
    <div className="space-y-6">
      {/* Key Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ResultCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Observed Events"
          value={stats.totalObserved.toString()}
          sublabel="Signal region"
          color="blue"
        />
        <ResultCard
          icon={<Target className="w-5 h-5" />}
          label="Expected Background"
          value={stats.totalBackground.toFixed(1)}
          sublabel="ZZ + reducible"
          color="slate"
        />
        <ResultCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Excess"
          value={`+${(stats.totalObserved - stats.totalBackground).toFixed(1)}`}
          sublabel="Over background"
          color="green"
        />
        <ResultCard
          icon={<Award className="w-5 h-5" />}
          label="Local Significance"
          value={formatSignificance(result.localSignificance)}
          sublabel={`p = ${formatPValue(result.localPValue)}`}
          color={result.localSignificance >= 5 ? "green" : "yellow"}
        />
      </div>

      {/* Measured Values */}
      <div className="bg-slate-800/50 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-xl p-6">
        <h4 className="font-semibold text-white print:text-black mb-4">Measured Values</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-400 print:text-gray-600 mb-2">Higgs Boson Mass</p>
            <p className="text-2xl font-bold text-white print:text-black font-mono">
              {HIGGS_MASS} ± 0.4 <span className="text-base font-normal text-slate-400">GeV</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Statistical uncertainty only
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 print:text-gray-600 mb-2">Signal Strength (μ)</p>
            <p className="text-2xl font-bold text-white print:text-black font-mono">
              1.0 ± 0.3
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Relative to Standard Model prediction
            </p>
          </div>
        </div>
      </div>

      {/* Channel Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 print:border-gray-300">
              <th className="text-left py-3 px-4 text-slate-400 print:text-gray-600">Channel</th>
              <th className="text-center py-3 px-4 text-slate-400 print:text-gray-600">Observed</th>
              <th className="text-center py-3 px-4 text-slate-400 print:text-gray-600">Background</th>
              <th className="text-center py-3 px-4 text-slate-400 print:text-gray-600">Signal</th>
              <th className="text-center py-3 px-4 text-slate-400 print:text-gray-600">S/B</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr key={channel.id} className="border-b border-slate-800 print:border-gray-200">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: channel.color }}
                    />
                    <span className="font-medium text-white print:text-black">{channel.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center text-white print:text-black font-mono">
                  {channel.observed}
                </td>
                <td className="py-3 px-4 text-center text-slate-300 print:text-gray-700 font-mono">
                  {channel.background.toFixed(1)}
                </td>
                <td className="py-3 px-4 text-center text-red-400 print:text-red-600 font-mono">
                  {channel.signal.toFixed(1)}
                </td>
                <td className="py-3 px-4 text-center text-slate-300 print:text-gray-700 font-mono">
                  {(channel.signal / channel.background).toFixed(1)}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-800/50 print:bg-gray-100 font-semibold">
              <td className="py-3 px-4 text-white print:text-black">Combined</td>
              <td className="py-3 px-4 text-center text-white print:text-black font-mono">
                {stats.totalObserved}
              </td>
              <td className="py-3 px-4 text-center text-slate-300 print:text-gray-700 font-mono">
                {stats.totalBackground.toFixed(1)}
              </td>
              <td className="py-3 px-4 text-center text-red-400 print:text-red-600 font-mono">
                {stats.totalSignal.toFixed(1)}
              </td>
              <td className="py-3 px-4 text-center text-slate-300 print:text-gray-700 font-mono">
                {(stats.totalSignal / stats.totalBackground).toFixed(1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: "blue" | "slate" | "green" | "yellow";
}) {
  const colors = {
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 print:bg-blue-50 print:border-blue-200",
    slate: "from-slate-500/20 to-slate-500/5 border-slate-500/30 print:bg-gray-50 print:border-gray-200",
    green: "from-green-500/20 to-green-500/5 border-green-500/30 print:bg-green-50 print:border-green-200",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 print:bg-yellow-50 print:border-yellow-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}
    >
      <div className="flex items-center gap-2 text-slate-400 print:text-gray-600 mb-2">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white print:text-black">{value}</p>
      <p className="text-xs text-slate-500 print:text-gray-500 mt-1">{sublabel}</p>
    </motion.div>
  );
}
