"use client";

import { motion } from "framer-motion";
import { SignificanceResult } from "@/types";
import { formatPValue, formatSignificance } from "@/lib/physics";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface ResultsDisplayProps {
  result: SignificanceResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const isExcess = result.excess > 0;

  return (
    <div className="space-y-6">
      {/* Primary Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ResultCard
          label="Observed"
          value={result.observed.toString()}
          sublabel="events"
          icon={<div className="w-3 h-3 rounded-full bg-white" />}
        />
        <ResultCard
          label="Expected Background"
          value={result.background.toFixed(2)}
          sublabel="events"
          icon={<div className="w-3 h-3 rounded-sm bg-blue-500" />}
        />
        <ResultCard
          label="Excess"
          value={(isExcess ? "+" : "") + result.excess.toFixed(2)}
          sublabel="events"
          icon={isExcess ?
            <TrendingUp className="w-4 h-4 text-green-400" /> :
            <TrendingDown className="w-4 h-4 text-red-400" />
          }
          highlight={isExcess}
        />
        <ResultCard
          label="Expected Signal"
          value={result.signal.toFixed(2)}
          sublabel="events"
          icon={<div className="w-3 h-3 rounded-sm bg-red-500" />}
        />
      </div>

      {/* Statistical Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Local Significance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold">Local Significance</h4>
            <InfoTooltip text="Probability that the observed excess is a statistical fluctuation of the background" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">p-value</span>
              <span className="font-mono text-xl text-white">
                {formatPValue(result.localPValue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Significance</span>
              <span className="font-mono text-xl text-white">
                {formatSignificance(result.localSignificance)}
              </span>
            </div>
          </div>

          <PValueExplanation pvalue={result.localPValue} />
        </motion.div>

        {/* Global Significance (if applicable) */}
        {result.globalPValue !== undefined && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">Global Significance</h4>
              <InfoTooltip text="Accounts for the 'look-elsewhere effect' - the fact that we searched multiple mass ranges" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">p-value</span>
                <span className="font-mono text-xl text-white">
                  {formatPValue(result.globalPValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Significance</span>
                <span className="font-mono text-xl text-white">
                  {formatSignificance(result.globalSignificance!)}
                </span>
              </div>
            </div>

            <div className="text-sm text-slate-400 bg-slate-700/50 rounded-lg p-3">
              <Info className="w-4 h-4 inline mr-2" />
              Global significance is typically ~1σ lower than local due to trial factor
            </div>
          </motion.div>
        )}
      </div>

      {/* Interpretation */}
      <InterpretationPanel significance={result.localSignificance} />
    </div>
  );
}

function ResultCard({
  label,
  value,
  sublabel,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-4 rounded-xl border
        ${highlight
          ? "bg-green-500/10 border-green-500/30"
          : "bg-slate-800/50 border-slate-700"
        }
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${highlight ? "text-green-400" : "text-white"}`}>
        {value}
      </p>
      <p className="text-xs text-slate-500">{sublabel}</p>
    </motion.div>
  );
}

function PValueExplanation({ pvalue }: { pvalue: number }) {
  // Convert to "1 in X" format
  const oneInX = Math.round(1 / pvalue);

  let explanation = "";
  let color = "";

  if (pvalue < 3e-7) {
    explanation = "Extremely unlikely to be a fluctuation";
    color = "text-green-400";
  } else if (pvalue < 1e-3) {
    explanation = "Very unlikely to be a fluctuation";
    color = "text-yellow-400";
  } else if (pvalue < 0.05) {
    explanation = "Possibly a real effect";
    color = "text-orange-400";
  } else {
    explanation = "Could easily be a fluctuation";
    color = "text-red-400";
  }

  return (
    <div className="text-sm space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-slate-400">Meaning:</span>
        <span className={color}>{explanation}</span>
      </div>
      {oneInX > 1 && isFinite(oneInX) && (
        <div className="text-slate-500">
          ~ 1 in {oneInX.toLocaleString()} chance of random fluctuation
        </div>
      )}
    </div>
  );
}

function InterpretationPanel({ significance }: { significance: number }) {
  let icon: React.ReactNode;
  let title: string;
  let description: string;
  let bgColor: string;
  let borderColor: string;

  if (significance >= 5) {
    icon = <CheckCircle className="w-6 h-6 text-green-400" />;
    title = "Discovery Threshold Exceeded";
    description = "The observed excess meets the gold standard for particle physics discoveries. This level of significance means there is less than a 1 in 3.5 million chance that the observed signal is merely a statistical fluctuation of the background.";
    bgColor = "bg-green-500/10";
    borderColor = "border-green-500/30";
  } else if (significance >= 3) {
    icon = <AlertTriangle className="w-6 h-6 text-yellow-400" />;
    title = "Strong Evidence";
    description = "The data shows strong evidence for an excess, but does not yet meet the 5σ discovery threshold. More data would be needed to confirm or rule out a genuine signal. This is often reported as 'evidence for' a new phenomenon.";
    bgColor = "bg-yellow-500/10";
    borderColor = "border-yellow-500/30";
  } else if (significance >= 2) {
    icon = <Info className="w-6 h-6 text-orange-400" />;
    title = "Moderate Excess";
    description = "There is a hint of an excess above background expectations. However, fluctuations of this size occur relatively frequently by chance. This would typically be reported as a 'hint' or 'indication' pending more data.";
    bgColor = "bg-orange-500/10";
    borderColor = "border-orange-500/30";
  } else {
    icon = <TrendingDown className="w-6 h-6 text-slate-400" />;
    title = "No Significant Excess";
    description = "The observed data is consistent with background expectations within statistical uncertainties. There is no evidence for a signal above background at this level of sensitivity.";
    bgColor = "bg-slate-500/10";
    borderColor = "border-slate-500/30";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} border ${borderColor} rounded-xl p-6`}
    >
      <div className="flex items-start gap-4">
        {icon}
        <div>
          <h4 className="font-semibold text-white mb-2">{title}</h4>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative">
      <Info className="w-4 h-4 text-slate-500 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-sm text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 text-center z-10">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
      </div>
    </div>
  );
}
