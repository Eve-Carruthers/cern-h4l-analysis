"use client";

import { motion } from "framer-motion";
import { Channel } from "@/types";
import {
  Users,
  Target,
  Gauge,
  Activity
} from "lucide-react";

interface ChannelCardProps {
  channel: Channel;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function ChannelCard({ channel, index, isSelected, onSelect }: ChannelCardProps) {
  const signalToBackground = channel.signal / channel.background;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-2xl p-6 transition-all duration-300
        ${isSelected
          ? "bg-gradient-to-br from-slate-800 to-slate-900 border-2 scale-105 shadow-xl"
          : "bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
        }
      `}
      style={{
        borderColor: isSelected ? channel.color : undefined,
        boxShadow: isSelected ? `0 0 30px ${channel.color}20` : undefined
      }}
    >
      {/* Channel indicator */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: channel.color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ backgroundColor: `${channel.color}20`, color: channel.color }}
          >
            {channel.name}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {channel.id === "4mu" && "Four Muons"}
              {channel.id === "4e" && "Four Electrons"}
              {channel.id === "2e2mu" && "Mixed Channel"}
            </h3>
            <p className="text-sm text-slate-400">
              H → ZZ* → {channel.name}
            </p>
          </div>
        </div>

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: channel.color }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatItem
          icon={<Users className="w-4 h-4" />}
          label="Observed"
          value={channel.observed.toString()}
          color={channel.color}
        />
        <StatItem
          icon={<Target className="w-4 h-4" />}
          label="Expected Signal"
          value={channel.signal.toFixed(1)}
          color={channel.color}
        />
        <StatItem
          icon={<Gauge className="w-4 h-4" />}
          label="Efficiency"
          value={`${(channel.efficiency * 100).toFixed(0)}%`}
          color={channel.color}
        />
        <StatItem
          icon={<Activity className="w-4 h-4" />}
          label="Resolution"
          value={`${channel.resolution} GeV`}
          color={channel.color}
        />
      </div>

      {/* S/B Ratio Bar */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Signal / Background</span>
          <span className="font-mono font-semibold" style={{ color: channel.color }}>
            {signalToBackground.toFixed(1)}
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: channel.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(signalToBackground * 10, 100)}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          />
        </div>
      </div>

      {/* Channel characteristics */}
      <div className="mt-4 flex flex-wrap gap-2">
        {channel.id === "4mu" && (
          <>
            <Tag color={channel.color}>Best Resolution</Tag>
            <Tag color={channel.color}>Highest Efficiency</Tag>
          </>
        )}
        {channel.id === "4e" && (
          <>
            <Tag color={channel.color}>More Bremsstrahlung</Tag>
            <Tag color={channel.color}>Wider Mass Peak</Tag>
          </>
        )}
        {channel.id === "2e2mu" && (
          <>
            <Tag color={channel.color}>Highest Yield</Tag>
            <Tag color={channel.color}>Good Compromise</Tag>
          </>
        )}
      </div>
    </motion.div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="px-2 py-1 text-xs rounded-full"
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`
      }}
    >
      {children}
    </span>
  );
}
