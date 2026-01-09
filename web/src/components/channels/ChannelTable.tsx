"use client";

import { motion } from "framer-motion";
import { Channel } from "@/types";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface ChannelTableProps {
  channels: Channel[];
}

export function ChannelTable({ channels }: ChannelTableProps) {
  // Calculate totals
  const totals = {
    observed: channels.reduce((sum, ch) => sum + ch.observed, 0),
    background: channels.reduce((sum, ch) => sum + ch.background, 0),
    signal: channels.reduce((sum, ch) => sum + ch.signal, 0),
  };

  // Find best/worst for each metric
  const rankings = {
    efficiency: [...channels].sort((a, b) => b.efficiency - a.efficiency),
    resolution: [...channels].sort((a, b) => a.resolution - b.resolution), // Lower is better
    signalYield: [...channels].sort((a, b) => b.signal - a.signal),
    sOverB: [...channels].sort((a, b) => (b.signal / b.background) - (a.signal / a.background)),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                Channel
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                Observed
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                Background
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                Signal
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                Efficiency
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                Resolution
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                S/B Ratio
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                Excess
              </th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel, index) => {
              const excess = channel.observed - channel.background;
              const sOverB = channel.signal / channel.background;

              return (
                <motion.tr
                  key={channel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  {/* Channel Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: `${channel.color}20`,
                          color: channel.color
                        }}
                      >
                        {channel.name}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {channel.id === "4mu" && "Four Muons"}
                          {channel.id === "4e" && "Four Electrons"}
                          {channel.id === "2e2mu" && "Mixed"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {channel.latexName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Observed */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-xl font-bold text-white">
                      {channel.observed}
                    </span>
                  </td>

                  {/* Background */}
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-slate-300">
                      {channel.background.toFixed(1)}
                    </span>
                  </td>

                  {/* Signal */}
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-red-400">
                      {channel.signal.toFixed(1)}
                    </span>
                  </td>

                  {/* Efficiency */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-slate-300">
                        {(channel.efficiency * 100).toFixed(0)}%
                      </span>
                      <RankIndicator
                        rank={rankings.efficiency.findIndex(c => c.id === channel.id)}
                        total={channels.length}
                      />
                    </div>
                  </td>

                  {/* Resolution */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-slate-300">
                        {channel.resolution.toFixed(1)} GeV
                      </span>
                      <RankIndicator
                        rank={rankings.resolution.findIndex(c => c.id === channel.id)}
                        total={channels.length}
                      />
                    </div>
                  </td>

                  {/* S/B Ratio */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-slate-300">
                        {sOverB.toFixed(1)}
                      </span>
                      <RankIndicator
                        rank={rankings.sOverB.findIndex(c => c.id === channel.id)}
                        total={channels.length}
                      />
                    </div>
                  </td>

                  {/* Excess */}
                  <td className="px-6 py-4 text-center">
                    <span className={`font-mono font-semibold ${
                      excess > 0 ? "text-green-400" : excess < 0 ? "text-red-400" : "text-slate-400"
                    }`}>
                      {excess > 0 ? "+" : ""}{excess.toFixed(1)}
                    </span>
                  </td>
                </motion.tr>
              );
            })}

            {/* Totals Row */}
            <tr className="border-t-2 border-slate-700 bg-slate-800/50">
              <td className="px-6 py-4">
                <span className="font-semibold text-white">Combined</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-xl font-bold text-white">{totals.observed}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="font-mono font-semibold text-slate-300">
                  {totals.background.toFixed(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="font-mono font-semibold text-red-400">
                  {totals.signal.toFixed(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-center text-slate-500">—</td>
              <td className="px-6 py-4 text-center text-slate-500">—</td>
              <td className="px-6 py-4 text-center">
                <span className="font-mono font-semibold text-slate-300">
                  {(totals.signal / totals.background).toFixed(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="font-mono font-semibold text-green-400">
                  +{(totals.observed - totals.background).toFixed(1)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function RankIndicator({ rank, total }: { rank: number; total: number }) {
  if (rank === 0) {
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20">
        <ArrowUp className="w-3 h-3 text-green-400" />
      </span>
    );
  }
  if (rank === total - 1) {
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20">
        <ArrowDown className="w-3 h-3 text-red-400" />
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-700">
      <Minus className="w-3 h-3 text-slate-400" />
    </span>
  );
}
