"use client";

import { MassPlot } from "@/components/charts/MassPlot";
import { Info, Download, Share2 } from "lucide-react";
import { useState } from "react";

export default function MassPlotPage() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invariant Mass Distribution</h1>
          <p className="text-slate-400 mt-2">
            Four-lepton invariant mass spectrum showing the Higgs boson signal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`
              p-2 rounded-lg transition-colors
              ${
                showInfo
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }
            `}
            title="Show Info"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            className="p-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            title="Download Plot"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            className="p-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-blue-400">
            Understanding This Plot
          </h3>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div className="space-y-3">
              <h4 className="font-medium text-white">What You&apos;re Looking At</h4>
              <p>
                This histogram shows the reconstructed four-lepton invariant
                mass (m4l) from CMS collision data. Each bin represents events
                where four leptons (electrons or muons) were detected and their
                combined mass was calculated.
              </p>
              <p>
                The{" "}
                <span className="text-red-400 font-medium">
                  red shaded region
                </span>{" "}
                (120-130 GeV) is the signal region where we expect Higgs boson
                events to appear.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-white">Key Features</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-3 h-3 mt-1 rounded-sm bg-blue-500 flex-shrink-0" />
                  <span>
                    <strong>ZZ Background:</strong> Irreducible background from
                    Z boson pair production
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-3 h-3 mt-1 rounded-sm bg-purple-500 flex-shrink-0" />
                  <span>
                    <strong>Other Background:</strong> Reducible backgrounds
                    (Z+jets, tt)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-3 h-3 mt-1 rounded-sm bg-red-500 flex-shrink-0" />
                  <span>
                    <strong>Higgs Signal:</strong> Expected contribution from
                    H-&gt;ZZ*-&gt;4l
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-3 h-3 mt-1 rounded-full bg-white flex-shrink-0" />
                  <span>
                    <strong>Data Points:</strong> Observed events with
                    statistical uncertainties
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-500/20">
            <h4 className="font-medium text-white mb-2">The Discovery</h4>
            <p className="text-sm text-slate-300">
              The excess of events around 125 GeV above the expected background
              is the signature of the Higgs boson. This excess has a statistical
              significance of approximately 5 sigma, exceeding the threshold required to
              claim a discovery in particle physics.
            </p>
          </div>
        </div>
      )}

      {/* Main Chart */}
      <MassPlot />

      {/* Physics Notes */}
      <div className="grid md:grid-cols-3 gap-4">
        <PhysicsNote
          title="Invariant Mass"
          formula="m4l = sqrt[(Sum E)^2 - (Sum p)^2]"
          description="Calculated from the four-momenta of all four leptons"
        />
        <PhysicsNote
          title="Signal Region"
          formula="120 < m4l < 130 GeV"
          description="Window around the Higgs mass where signal is expected"
        />
        <PhysicsNote
          title="Discovery Criterion"
          formula="Significance >= 5 sigma"
          description="Less than 1 in 3.5 million chance of background fluctuation"
        />
      </div>

      {/* Data Source */}
      <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-800">
        <p>
          Data from CMS Open Data (2011-2012) | sqrt(s) = 7-8 TeV | L = 24.8
          fb^-1
        </p>
        <p className="mt-1">
          Based on{" "}
          <a
            href="https://github.com/cms-opendata-analyses/HiggsExample20112012"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            cms-opendata-analyses/HiggsExample20112012
          </a>
        </p>
      </div>
    </div>
  );
}

function PhysicsNote({
  title,
  formula,
  description,
}: {
  title: string;
  formula: string;
  description: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <h4 className="font-medium text-white mb-2">{title}</h4>
      <p className="font-mono text-blue-400 text-lg mb-2">{formula}</p>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
