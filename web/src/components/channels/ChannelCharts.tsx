"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import { Channel } from "@/types";

interface ChannelChartsProps {
  channels: Channel[];
  selectedChannel: string | null;
}

export function ChannelCharts({ channels, selectedChannel }: ChannelChartsProps) {
  // Prepare data for bar chart
  const barChartData = useMemo(() => {
    return channels.map(ch => ({
      name: ch.name,
      observed: ch.observed,
      background: ch.background,
      signal: ch.signal,
      color: ch.color,
    }));
  }, [channels]);

  // Prepare data for radar chart (normalized metrics)
  const radarData = useMemo(() => {
    const maxEfficiency = Math.max(...channels.map(c => c.efficiency));
    const maxResolution = Math.max(...channels.map(c => c.resolution));
    const maxSignal = Math.max(...channels.map(c => c.signal));
    const maxSB = Math.max(...channels.map(c => c.signal / c.background));
    const maxObserved = Math.max(...channels.map(c => c.observed));

    return [
      {
        metric: "Efficiency",
        ...Object.fromEntries(
          channels.map(c => [c.name, (c.efficiency / maxEfficiency) * 100])
        ),
      },
      {
        metric: "Resolution",
        ...Object.fromEntries(
          channels.map(c => [(c.name), (1 - c.resolution / maxResolution) * 100 + 20]) // Inverted - smaller is better
        ),
      },
      {
        metric: "Signal Yield",
        ...Object.fromEntries(
          channels.map(c => [c.name, (c.signal / maxSignal) * 100])
        ),
      },
      {
        metric: "S/B Ratio",
        ...Object.fromEntries(
          channels.map(c => [c.name, ((c.signal / c.background) / maxSB) * 100])
        ),
      },
      {
        metric: "Observed",
        ...Object.fromEntries(
          channels.map(c => [c.name, (c.observed / maxObserved) * 100])
        ),
      },
    ];
  }, [channels]);

  // Prepare pie chart data
  const pieData = useMemo(() => {
    return channels.map(ch => ({
      name: ch.name,
      value: ch.observed,
      color: ch.color,
    }));
  }, [channels]);

  // Mass distribution data (simulated Gaussian peaks)
  const massDistributionData = useMemo(() => {
    const masses = [];
    for (let m = 110; m <= 140; m += 0.5) {
      const point: Record<string, number> = { mass: m };
      channels.forEach(ch => {
        // Gaussian signal + flat background
        const signal = ch.signal * 2 * Math.exp(-0.5 * Math.pow((m - 125) / ch.resolution, 2));
        const bg = ch.background * 0.1;
        point[ch.name] = signal + bg;
      });
      masses.push(point);
    }
    return masses;
  }, [channels]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Event Counts Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Event Counts by Channel</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Bar
                dataKey="background"
                name="Background"
                fill="#64748b"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="signal"
                name="Expected Signal"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="observed"
                name="Observed"
                radius={[4, 4, 0, 0]}
              >
                {barChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Radar Chart - Channel Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Channel Performance Comparison</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 10 }}
              />
              {channels.map((ch) => (
                <Radar
                  key={ch.id}
                  name={ch.name}
                  dataKey={ch.name}
                  stroke={ch.color}
                  fill={ch.color}
                  fillOpacity={selectedChannel === ch.id ? 0.4 : 0.15}
                  strokeWidth={selectedChannel === ch.id ? 3 : 1.5}
                />
              ))}
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart - Event Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Observed Event Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                labelLine={{ stroke: "#64748b" }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    stroke={selectedChannel === channels[index].id ? "#fff" : "transparent"}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${value} events`, "Observed"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <p className="text-2xl font-bold text-white">
            {channels.reduce((sum, ch) => sum + ch.observed, 0)}
          </p>
          <p className="text-sm text-slate-400">Total Observed Events</p>
        </div>
      </motion.div>

      {/* Mass Distribution by Channel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Mass Distribution Shape</h3>
        <p className="text-sm text-slate-400 mb-4">
          Showing signal shape differences due to mass resolution
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={massDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="mass"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                label={{
                  value: "m4l [GeV]",
                  position: "bottom",
                  fill: "#94a3b8",
                  offset: -5
                }}
                domain={[110, 140]}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                label={{
                  value: "Events / 0.5 GeV",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8"
                }}
              />
              {channels.map((ch) => (
                <Line
                  key={ch.id}
                  type="monotone"
                  dataKey={ch.name}
                  stroke={ch.color}
                  strokeWidth={selectedChannel === ch.id ? 3 : 1.5}
                  dot={false}
                  opacity={selectedChannel && selectedChannel !== ch.id ? 0.3 : 1}
                />
              ))}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => `m4l = ${value} GeV`}
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
