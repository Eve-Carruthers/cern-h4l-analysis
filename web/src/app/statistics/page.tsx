"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Calculator, RefreshCw, BookOpen, Beaker } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { SignificanceGauge } from "@/components/charts/SignificanceGauge";
import { ResultsDisplay } from "@/components/statistics/ResultsDisplay";
import { HistoricalComparison } from "@/components/statistics/HistoricalComparison";
import { calculateSignificance } from "@/lib/physics";
import { getTotalStats } from "@/lib/data";

// Default values from H4l analysis
const DEFAULT_VALUES = {
  observed: 12,
  background: 2.5,
  signal: 10.0,
  lookElsewhereFactor: 1,
};

export default function StatisticsPage() {
  const [observed, setObserved] = useState(DEFAULT_VALUES.observed);
  const [background, setBackground] = useState(DEFAULT_VALUES.background);
  const [signal, setSignal] = useState(DEFAULT_VALUES.signal);
  const [lookElsewhereFactor, setLookElsewhereFactor] = useState(DEFAULT_VALUES.lookElsewhereFactor);
  const [showEducation, setShowEducation] = useState(false);

  // Calculate significance
  const result = useMemo(() => {
    return calculateSignificance(observed, background, signal, lookElsewhereFactor);
  }, [observed, background, signal, lookElsewhereFactor]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    setObserved(DEFAULT_VALUES.observed);
    setBackground(DEFAULT_VALUES.background);
    setSignal(DEFAULT_VALUES.signal);
    setLookElsewhereFactor(DEFAULT_VALUES.lookElsewhereFactor);
  }, []);

  // Load H4l values
  const loadH4lValues = useCallback(() => {
    const stats = getTotalStats();
    setObserved(stats.totalObserved);
    setBackground(stats.totalBackground);
    setSignal(stats.totalSignal);
    setLookElsewhereFactor(1);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calculator className="w-8 h-8 text-blue-400" />
            Significance Calculator
          </h1>
          <p className="text-slate-400 mt-2">
            Calculate the statistical significance of observed excesses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEducation(!showEducation)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${showEducation
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }
            `}
          >
            <BookOpen className="w-4 h-4" />
            Learn
          </button>
          <button
            onClick={loadH4lValues}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            title="Load H to 4l analysis values"
          >
            <Beaker className="w-4 h-4" />
            H4l
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            title="Reset to defaults"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Educational Panel */}
      {showEducation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-400 mb-4">
            Understanding Statistical Significance
          </h3>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">What is a p-value?</h4>
                <p>
                  The p-value is the probability of observing data at least as extreme
                  as what was observed, assuming only background processes (no signal).
                  A smaller p-value means the observation is less likely to be a
                  statistical fluctuation.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">What is significance (σ)?</h4>
                <p>
                  Significance is the p-value converted to standard deviations of a
                  normal distribution. In particle physics, 5σ corresponds to a p-value
                  of about 3x10^-7, or roughly 1 in 3.5 million chance.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Why 5σ for discovery?</h4>
                <p>
                  The 5σ threshold is a convention in particle physics, chosen to account
                  for unknown systematic effects and the look-elsewhere effect. It
                  ensures that claimed discoveries have an extremely low probability of
                  being false positives.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Look-Elsewhere Effect</h4>
                <p>
                  When searching across multiple mass values or channels, the chance of
                  finding a random fluctuation somewhere increases. The look-elsewhere
                  factor corrects for this by multiplying the local p-value.
                </p>
              </div>
            </div>
          </div>

          {/* Threshold table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-400">Significance</th>
                  <th className="text-left py-2 text-slate-400">p-value</th>
                  <th className="text-left py-2 text-slate-400">Odds</th>
                  <th className="text-left py-2 text-slate-400">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-2 font-mono">1σ</td>
                  <td className="py-2 font-mono">0.16</td>
                  <td className="py-2">1 in 6</td>
                  <td className="py-2 text-slate-400">Not significant</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 font-mono">2σ</td>
                  <td className="py-2 font-mono">0.023</td>
                  <td className="py-2">1 in 44</td>
                  <td className="py-2 text-slate-400">Interesting</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 font-mono text-yellow-400">3σ</td>
                  <td className="py-2 font-mono">1.3x10^-3</td>
                  <td className="py-2">1 in 740</td>
                  <td className="py-2 text-yellow-400">Evidence</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 font-mono">4σ</td>
                  <td className="py-2 font-mono">3.2x10^-5</td>
                  <td className="py-2">1 in 31,500</td>
                  <td className="py-2 text-slate-400">Strong evidence</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-green-400">5σ</td>
                  <td className="py-2 font-mono">2.9x10^-7</td>
                  <td className="py-2">1 in 3.5 million</td>
                  <td className="py-2 text-green-400 font-semibold">Discovery!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>
              Adjust values to calculate significance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Slider
              label="Observed Events"
              value={observed}
              onChange={setObserved}
              min={0}
              max={50}
              step={1}
              color="bg-white"
            />

            <Slider
              label="Expected Background"
              value={background}
              onChange={setBackground}
              min={0}
              max={20}
              step={0.1}
              color="bg-blue-500"
            />

            <Slider
              label="Expected Signal"
              value={signal}
              onChange={setSignal}
              min={0}
              max={30}
              step={0.1}
              color="bg-red-500"
            />

            <Slider
              label="Look-Elsewhere Factor"
              value={lookElsewhereFactor}
              onChange={setLookElsewhereFactor}
              min={1}
              max={100}
              step={1}
              color="bg-purple-500"
            />

            {/* Quick preset buttons */}
            <div className="pt-4 border-t border-slate-700 space-y-2">
              <p className="text-sm text-slate-400">Quick Presets:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setObserved(12);
                    setBackground(2.5);
                    setSignal(10);
                  }}
                  className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  H4l (2012)
                </button>
                <button
                  onClick={() => {
                    setObserved(5);
                    setBackground(5);
                    setSignal(0);
                  }}
                  className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  No Excess
                </button>
                <button
                  onClick={() => {
                    setObserved(20);
                    setBackground(3);
                    setSignal(15);
                  }}
                  className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Strong Signal
                </button>
                <button
                  onClick={() => {
                    setObserved(8);
                    setBackground(5);
                    setSignal(3);
                  }}
                  className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Weak Signal
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Significance Gauge */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Significance Result</CardTitle>
            <CardDescription>
              Visual representation of statistical significance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignificanceGauge significance={result.localSignificance} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
          <CardDescription>
            Complete statistical breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResultsDisplay result={result} />
        </CardContent>
      </Card>

      {/* Historical Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Context</CardTitle>
          <CardDescription>
            Compare your result to famous particle physics discoveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistoricalComparison currentSignificance={result.localSignificance} />
        </CardContent>
      </Card>

      {/* Formula Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Formulas Used</CardTitle>
          <CardDescription>
            Mathematical basis for the calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Poisson p-value</h4>
              <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
                <p className="text-blue-400">p = P(X &gt;= n_obs | lambda = n_bg)</p>
                <p className="text-slate-400 mt-2">
                  = 1 - sum(k=0 to n_obs-1) [e^(-lambda) x lambda^k / k!]
                </p>
              </div>
              <p className="text-sm text-slate-400">
                Probability of observing n_obs or more events when expecting n_bg from background.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white">Significance (Gaussian)</h4>
              <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
                <p className="text-blue-400">Z = phi^-1(1 - p)</p>
                <p className="text-slate-400 mt-2">
                  ~ (n_obs - n_bg) / sqrt(n_bg)
                </p>
              </div>
              <p className="text-sm text-slate-400">
                Converts p-value to number of standard deviations using inverse normal CDF.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
