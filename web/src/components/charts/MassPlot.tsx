"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Scatter,
} from "recharts";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from "lucide-react";
import { massData, HIGGS_MASS, Z_MASS } from "@/lib/data";
import { MassBin } from "@/types";

interface DataVisibility {
  observed: boolean;
  zzBackground: boolean;
  otherBackground: boolean;
  signal: boolean;
  totalExpected: boolean;
}

interface ZoomRange {
  min: number;
  max: number;
}

const ZOOM_PRESETS: Record<string, ZoomRange> = {
  full: { min: 70, max: 150 },
  higgs: { min: 115, max: 135 },
  zPeak: { min: 80, max: 102 },
  lowMass: { min: 70, max: 110 },
  highMass: { min: 110, max: 150 },
};

export function MassPlot() {
  const [visibility, setVisibility] = useState<DataVisibility>({
    observed: true,
    zzBackground: true,
    otherBackground: true,
    signal: true,
    totalExpected: false,
  });

  const [zoomRange, setZoomRange] = useState<ZoomRange>(ZOOM_PRESETS.full);
  const [isAnimating, setIsAnimating] = useState(true);
  const [hoveredBin, setHoveredBin] = useState<number | null>(null);

  // Process data for stacked bar chart
  const chartData = useMemo(() => {
    return massData
      .filter((d) => d.mass >= zoomRange.min && d.mass <= zoomRange.max)
      .map((d) => ({
        ...d,
        totalBackground: d.zzBackground + d.otherBackground,
        totalExpected: d.zzBackground + d.otherBackground + d.signal,
        error: Math.sqrt(Math.max(d.observed, 1)), // Poisson error
      }));
  }, [zoomRange]);

  // Calculate stats for current view
  const viewStats = useMemo(() => {
    const inRange = massData.filter(
      (d) => d.mass >= zoomRange.min && d.mass <= zoomRange.max
    );
    return {
      totalObserved: inRange.reduce((sum, d) => sum + d.observed, 0),
      totalBackground: inRange.reduce(
        (sum, d) => sum + d.zzBackground + d.otherBackground,
        0
      ),
      totalSignal: inRange.reduce((sum, d) => sum + d.signal, 0),
    };
  }, [zoomRange]);

  const toggleVisibility = useCallback((key: keyof DataVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleZoomPreset = useCallback((preset: keyof typeof ZOOM_PRESETS) => {
    setIsAnimating(true);
    setZoomRange(ZOOM_PRESETS[preset]);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomRange((prev) => {
      const range = prev.max - prev.min;
      const center = (prev.min + prev.max) / 2;
      const newRange = Math.max(range * 0.7, 10);
      return {
        min: Math.max(70, center - newRange / 2),
        max: Math.min(150, center + newRange / 2),
      };
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomRange((prev) => {
      const range = prev.max - prev.min;
      const center = (prev.min + prev.max) / 2;
      const newRange = Math.min(range * 1.4, 80);
      return {
        min: Math.max(70, center - newRange / 2),
        max: Math.min(150, center + newRange / 2),
      };
    });
  }, []);

  const handleReset = useCallback(() => {
    setZoomRange(ZOOM_PRESETS.full);
    setVisibility({
      observed: true,
      zzBackground: true,
      otherBackground: true,
      signal: true,
      totalExpected: false,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
        {/* Zoom Presets */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 mr-2">Quick Zoom:</span>
          {Object.entries(ZOOM_PRESETS).map(([key]) => (
            <button
              key={key}
              onClick={() =>
                handleZoomPreset(key as keyof typeof ZOOM_PRESETS)
              }
              className={`
                px-3 py-1.5 text-sm rounded-lg transition-colors
                ${
                  zoomRange.min ===
                    ZOOM_PRESETS[key as keyof typeof ZOOM_PRESETS].min &&
                  zoomRange.max ===
                    ZOOM_PRESETS[key as keyof typeof ZOOM_PRESETS].max
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }
              `}
            >
              {key === "full" && "Full Range"}
              {key === "higgs" && "Higgs Region"}
              {key === "zPeak" && "Z Peak"}
              {key === "lowMass" && "Low Mass"}
              {key === "highMass" && "High Mass"}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Data Layer Toggles */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
        <span className="text-sm text-slate-400">Show/Hide:</span>

        <LayerToggle
          label="Data"
          color="#ffffff"
          active={visibility.observed}
          onClick={() => toggleVisibility("observed")}
        />
        <LayerToggle
          label="ZZ Background"
          color="#3b82f6"
          active={visibility.zzBackground}
          onClick={() => toggleVisibility("zzBackground")}
        />
        <LayerToggle
          label="Other Background"
          color="#8b5cf6"
          active={visibility.otherBackground}
          onClick={() => toggleVisibility("otherBackground")}
        />
        <LayerToggle
          label="Higgs Signal"
          color="#ef4444"
          active={visibility.signal}
          onClick={() => toggleVisibility("signal")}
        />
        <LayerToggle
          label="Total Expected"
          color="#22c55e"
          active={visibility.totalExpected}
          onClick={() => toggleVisibility("totalExpected")}
          dashed
        />
      </div>

      {/* Main Chart */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              onMouseMove={(e) => {
                const event = e as unknown as { activePayload?: Array<{ payload: { mass: number } }> };
                if (event?.activePayload?.[0]) {
                  setHoveredBin(event.activePayload[0].payload.mass);
                }
              }}
              onMouseLeave={() => setHoveredBin(null)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />

              <XAxis
                dataKey="mass"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={{ stroke: "#94a3b8" }}
                domain={[zoomRange.min, zoomRange.max]}
                label={{
                  value: "m4l [GeV]",
                  position: "bottom",
                  offset: 0,
                  fill: "#94a3b8",
                  fontSize: 14,
                }}
              />

              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={{ stroke: "#94a3b8" }}
                label={{
                  value: "Events / 2 GeV",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                  fontSize: 14,
                }}
              />

              {/* Reference lines for Z and Higgs masses */}
              <ReferenceLine
                x={Z_MASS}
                stroke="#3b82f6"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `Z (${Z_MASS} GeV)`,
                  position: "top",
                  fill: "#3b82f6",
                  fontSize: 11,
                }}
              />

              <ReferenceLine
                x={HIGGS_MASS}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `H (${HIGGS_MASS} GeV)`,
                  position: "top",
                  fill: "#ef4444",
                  fontSize: 11,
                }}
              />

              {/* Signal region highlight */}
              <ReferenceArea
                x1={120}
                x2={130}
                fill="#ef4444"
                fillOpacity={0.1}
                stroke="#ef4444"
                strokeOpacity={0.3}
              />

              {/* Stacked backgrounds */}
              {visibility.zzBackground && (
                <Bar
                  dataKey="zzBackground"
                  stackId="background"
                  fill="#3b82f6"
                  fillOpacity={0.8}
                  name="ZZ -> 4l"
                  animationDuration={isAnimating ? 800 : 0}
                  animationBegin={0}
                />
              )}

              {visibility.otherBackground && (
                <Bar
                  dataKey="otherBackground"
                  stackId="background"
                  fill="#8b5cf6"
                  fillOpacity={0.8}
                  name="Z+jets, tt"
                  animationDuration={isAnimating ? 800 : 0}
                  animationBegin={100}
                />
              )}

              {visibility.signal && (
                <Bar
                  dataKey="signal"
                  stackId="background"
                  fill="#ef4444"
                  fillOpacity={0.8}
                  name="H -> 4l (125 GeV)"
                  animationDuration={isAnimating ? 800 : 0}
                  animationBegin={200}
                />
              )}

              {/* Total expected line */}
              {visibility.totalExpected && (
                <Line
                  type="stepAfter"
                  dataKey="totalExpected"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Total Expected"
                  animationDuration={isAnimating ? 800 : 0}
                />
              )}

              {/* Data points with error bars */}
              {visibility.observed && (
                <Scatter
                  dataKey="observed"
                  fill="#ffffff"
                  name="CMS Data"
                  shape={(props: unknown) => {
                    const { cx, cy, payload } = props as ScatterPointProps;
                    if (cx === undefined || cy === undefined) return <g />;
                    const isHovered = payload.mass === hoveredBin;
                    return (
                      <g>
                        {/* Error bar */}
                        <line
                          x1={cx}
                          x2={cx}
                          y1={cy - payload.error * 15}
                          y2={cy + payload.error * 15}
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2 : 1.5}
                        />
                        {/* Top cap */}
                        <line
                          x1={cx - 4}
                          x2={cx + 4}
                          y1={cy - payload.error * 15}
                          y2={cy - payload.error * 15}
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2 : 1.5}
                        />
                        {/* Bottom cap */}
                        <line
                          x1={cx - 4}
                          x2={cx + 4}
                          y1={cy + payload.error * 15}
                          y2={cy + payload.error * 15}
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2 : 1.5}
                        />
                        {/* Data point */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 6 : 4}
                          fill="#ffffff"
                          stroke={isHovered ? "#3b82f6" : "none"}
                          strokeWidth={2}
                        />
                      </g>
                    );
                  }}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              <Legend
                verticalAlign="top"
                height={36}
                iconType="square"
                formatter={(value: string) => (
                  <span className="text-slate-300 text-sm">{value}</span>
                )}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Footer Stats */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">
              {viewStats.totalObserved}
            </p>
            <p className="text-sm text-slate-400">Observed Events</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-400">
              {viewStats.totalBackground.toFixed(1)}
            </p>
            <p className="text-sm text-slate-400">Expected Background</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">
              {viewStats.totalSignal.toFixed(1)}
            </p>
            <p className="text-sm text-slate-400">Expected Signal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Types for scatter point
interface ScatterPointProps {
  cx?: number;
  cy?: number;
  payload: MassBin & {
    totalBackground: number;
    totalExpected: number;
    error: number;
  };
}

// Custom Tooltip Component
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: MassBin & {
      totalBackground: number;
      totalExpected: number;
      error: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl"
    >
      <p className="font-semibold text-white mb-2">m4l = {data.mass} GeV</p>
      <div className="space-y-1 text-sm">
        <TooltipRow
          color="#ffffff"
          label="Observed"
          value={`${data.observed} +/- ${data.error.toFixed(1)}`}
        />
        <TooltipRow
          color="#3b82f6"
          label="ZZ background"
          value={data.zzBackground.toFixed(2)}
        />
        <TooltipRow
          color="#8b5cf6"
          label="Other background"
          value={data.otherBackground.toFixed(2)}
        />
        <TooltipRow
          color="#ef4444"
          label="Higgs signal"
          value={data.signal.toFixed(2)}
        />
        <hr className="border-slate-700 my-2" />
        <TooltipRow
          color="#22c55e"
          label="Total expected"
          value={data.totalExpected.toFixed(2)}
          bold
        />
        <TooltipRow
          color={data.observed > data.totalExpected ? "#22c55e" : "#ef4444"}
          label="Excess"
          value={(data.observed - data.totalExpected).toFixed(2)}
        />
      </div>
    </motion.div>
  );
}

function TooltipRow({
  color,
  label,
  value,
  bold = false,
}: {
  color: string;
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${bold ? "font-semibold" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-slate-300">{label}</span>
      </div>
      <span className="text-white font-mono">{value}</span>
    </div>
  );
}

// Layer Toggle Button
function LayerToggle({
  label,
  color,
  active,
  onClick,
  dashed = false,
}: {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
  dashed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
        transition-all duration-200
        ${active ? "bg-slate-800 text-white" : "bg-slate-900 text-slate-500"}
      `}
    >
      <div
        className={`w-4 h-3 rounded-sm ${dashed ? "border-2 border-dashed" : ""}`}
        style={{
          backgroundColor: dashed ? "transparent" : active ? color : "#475569",
          borderColor: dashed ? (active ? color : "#475569") : "transparent",
          opacity: active ? 1 : 0.5,
        }}
      />
      <span>{label}</span>
      {active ? (
        <Eye className="w-3 h-3 text-slate-400" />
      ) : (
        <EyeOff className="w-3 h-3 text-slate-500" />
      )}
    </button>
  );
}
