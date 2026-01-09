"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface SignificanceGaugeProps {
  significance: number;
  maxSigma?: number;
}

export function SignificanceGauge({
  significance,
  maxSigma = 7
}: SignificanceGaugeProps) {
  const cappedSignificance = Math.min(significance, maxSigma);
  const percentage = (cappedSignificance / maxSigma) * 100;

  // Determine color based on significance level
  const color = useMemo(() => {
    if (significance >= 5) return { main: "#22c55e", bg: "#22c55e20" }; // Green - Discovery
    if (significance >= 3) return { main: "#eab308", bg: "#eab30820" }; // Yellow - Evidence
    if (significance >= 2) return { main: "#f97316", bg: "#f9731620" }; // Orange - Hint
    return { main: "#ef4444", bg: "#ef444420" }; // Red - Not significant
  }, [significance]);

  // Significance level label
  const levelLabel = useMemo(() => {
    if (significance >= 5) return "DISCOVERY";
    if (significance >= 3) return "Strong Evidence";
    if (significance >= 2) return "Moderate Evidence";
    return "Not Significant";
  }, [significance]);

  return (
    <div className="space-y-4">
      {/* Main gauge */}
      <div className="relative">
        {/* Background track */}
        <div className="h-8 bg-slate-800 rounded-full overflow-hidden relative">
          {/* Threshold markers */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-600 z-10"
            style={{ left: `${(2 / maxSigma) * 100}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">2σ</span>
          </div>
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-600 z-10"
            style={{ left: `${(3 / maxSigma) * 100}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">3σ</span>
          </div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-green-500 z-10"
            style={{ left: `${(5 / maxSigma) * 100}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-green-400 font-semibold whitespace-nowrap">
              5σ Discovery
            </span>
          </div>

          {/* Filled portion */}
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color.main }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>0σ</span>
          <span>1σ</span>
          <span>2σ</span>
          <span>3σ</span>
          <span>4σ</span>
          <span>5σ</span>
          <span>6σ</span>
          <span>7σ</span>
        </div>
      </div>

      {/* Result display */}
      <div className="flex items-center justify-between">
        <div>
          <motion.span
            className="text-5xl font-bold"
            style={{ color: color.main }}
            key={significance}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {significance.toFixed(2)}σ
          </motion.span>
        </div>

        <motion.div
          className="px-4 py-2 rounded-full text-sm font-semibold"
          style={{ backgroundColor: color.bg, color: color.main }}
          key={levelLabel}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {levelLabel}
        </motion.div>
      </div>

      {/* Discovery celebration */}
      {significance >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
        >
          <span className="text-2xl">🎉</span>
          <p className="text-green-400 font-semibold mt-2">
            Discovery-level significance achieved!
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Less than 1 in 3.5 million chance this is a fluctuation
          </p>
        </motion.div>
      )}
    </div>
  );
}
