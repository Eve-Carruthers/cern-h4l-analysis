"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, BarChart3, Table, BookOpen } from "lucide-react";
import { channels } from "@/lib/data";
import { ChannelCard } from "@/components/channels/ChannelCard";
import { ChannelCharts } from "@/components/channels/ChannelCharts";
import { ChannelTable } from "@/components/channels/ChannelTable";
import { ChannelPhysics } from "@/components/channels/ChannelPhysics";

type ViewMode = "cards" | "charts" | "table";

export default function ChannelsPage() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [showPhysics, setShowPhysics] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-purple-400" />
            Channel Comparison
          </h1>
          <p className="text-slate-400 mt-2">
            Compare the three H-&gt;4l decay channels: 4mu, 4e, and 2e2mu
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("cards")}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${viewMode === "cards"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
                }
              `}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("charts")}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1
                ${viewMode === "charts"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
                }
              `}
            >
              <BarChart3 className="w-4 h-4" />
              Charts
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1
                ${viewMode === "table"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
                }
              `}
            >
              <Table className="w-4 h-4" />
              Table
            </button>
          </div>

          {/* Physics Toggle */}
          <button
            onClick={() => setShowPhysics(!showPhysics)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${showPhysics
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }
            `}
          >
            <BookOpen className="w-4 h-4" />
            Physics
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Observed"
          value={channels.reduce((sum, ch) => sum + ch.observed, 0).toString()}
          sublabel="events in signal region"
        />
        <SummaryCard
          label="Total Background"
          value={channels.reduce((sum, ch) => sum + ch.background, 0).toFixed(1)}
          sublabel="expected events"
        />
        <SummaryCard
          label="Total Signal"
          value={channels.reduce((sum, ch) => sum + ch.signal, 0).toFixed(1)}
          sublabel="expected from Higgs"
        />
        <SummaryCard
          label="Combined S/B"
          value={(
            channels.reduce((sum, ch) => sum + ch.signal, 0) /
            channels.reduce((sum, ch) => sum + ch.background, 0)
          ).toFixed(1)}
          sublabel="signal to background"
        />
      </div>

      {/* Physics Explanation */}
      {showPhysics && <ChannelPhysics />}

      {/* Main Content */}
      {viewMode === "cards" && (
        <div className="space-y-6">
          {/* Channel Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((channel, index) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                index={index}
                isSelected={selectedChannel === channel.id}
                onSelect={() => setSelectedChannel(
                  selectedChannel === channel.id ? null : channel.id
                )}
              />
            ))}
          </div>

          {/* Selected Channel Detail */}
          {selectedChannel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
            >
              <SelectedChannelDetail
                channel={channels.find(c => c.id === selectedChannel)!}
              />
            </motion.div>
          )}

          {/* Charts below cards */}
          <ChannelCharts
            channels={channels}
            selectedChannel={selectedChannel}
          />
        </div>
      )}

      {viewMode === "charts" && (
        <ChannelCharts
          channels={channels}
          selectedChannel={selectedChannel}
        />
      )}

      {viewMode === "table" && (
        <ChannelTable channels={channels} />
      )}

      {/* Channel Selection Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-800">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setSelectedChannel(
              selectedChannel === channel.id ? null : channel.id
            )}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${selectedChannel === channel.id
                ? "bg-slate-800 ring-2"
                : "hover:bg-slate-800/50"
              }
            `}
            style={
              selectedChannel === channel.id
                ? { ["--tw-ring-color" as string]: channel.color }
                : undefined
            }
          >
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: channel.color }}
            />
            <span className="text-sm text-slate-300">{channel.name}</span>
          </button>
        ))}
        {selectedChannel && (
          <button
            onClick={() => setSelectedChannel(null)}
            className="text-sm text-slate-500 hover:text-white transition-colors"
          >
            Clear selection
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sublabel
}: {
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sublabel}</p>
    </div>
  );
}

function SelectedChannelDetail({ channel }: { channel: typeof channels[0] }) {
  const excess = channel.observed - channel.background;
  const significance = excess / Math.sqrt(channel.background);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: `${channel.color}20`, color: channel.color }}
        >
          {channel.name}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">
            {channel.id === "4mu" && "Four Muon Channel"}
            {channel.id === "4e" && "Four Electron Channel"}
            {channel.id === "2e2mu" && "Mixed Lepton Channel"}
          </h3>
          <p className="text-slate-400">
            H -&gt; ZZ* -&gt; {channel.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DetailStat label="Observed" value={channel.observed.toString()} />
        <DetailStat label="Background" value={channel.background.toFixed(2)} />
        <DetailStat label="Signal" value={channel.signal.toFixed(2)} />
        <DetailStat
          label="Local Significance"
          value={`${significance.toFixed(1)}sigma`}
          highlight={significance > 2}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-400 mb-2">Strengths</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            {channel.id === "4mu" && (
              <>
                <li>- Excellent mass resolution (1.5 GeV)</li>
                <li>- Highest reconstruction efficiency</li>
                <li>- Clean muon identification</li>
              </>
            )}
            {channel.id === "4e" && (
              <>
                <li>- Good calorimeter coverage</li>
                <li>- Important for cross-checks</li>
                <li>- Different systematics than muon channels</li>
              </>
            )}
            {channel.id === "2e2mu" && (
              <>
                <li>- Highest expected signal yield</li>
                <li>- 2x branching ratio of same-flavor</li>
                <li>- Good balance of resolution and yield</li>
              </>
            )}
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-400 mb-2">Challenges</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            {channel.id === "4mu" && (
              <>
                <li>- Lower branching ratio</li>
                <li>- Muon system acceptance limits</li>
              </>
            )}
            {channel.id === "4e" && (
              <>
                <li>- Bremsstrahlung energy loss</li>
                <li>- Worse mass resolution (2.5 GeV)</li>
                <li>- More challenging electron ID</li>
              </>
            )}
            {channel.id === "2e2mu" && (
              <>
                <li>- Mixed systematics from both leptons</li>
                <li>- Z assignment ambiguity possible</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DetailStat({
  label,
  value,
  highlight = false
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${highlight ? "text-green-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
