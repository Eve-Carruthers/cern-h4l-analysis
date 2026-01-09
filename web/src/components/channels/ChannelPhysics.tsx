"use client";

import { motion } from "framer-motion";
import { Atom, Zap, Target, Waves } from "lucide-react";

export function ChannelPhysics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800/50 border border-slate-800 rounded-xl p-6"
    >
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Atom className="w-5 h-5 text-blue-400" />
        Why Different Channels?
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 4mu Channel */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 font-bold">4mu</span>
            </div>
            <h4 className="font-semibold text-white">Four Muons</h4>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-white font-medium">Best mass resolution</span> —
                Muons leave clean tracks in the detector with minimal energy loss
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-white font-medium">Highest efficiency</span> —
                Muons are easier to identify and trigger on
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Waves className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>
                Muons are ~200x heavier than electrons, so they don&apos;t radiate as much
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              sigma(m4l) ~ 1.5 GeV — Sharpest peak
            </p>
          </div>
        </div>

        {/* 4e Channel */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400 font-bold">4e</span>
            </div>
            <h4 className="font-semibold text-white">Four Electrons</h4>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-white font-medium">Wider mass peak</span> —
                Electrons lose energy via bremsstrahlung radiation
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-white font-medium">Lower efficiency</span> —
                Electron ID and energy measurement more challenging
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Waves className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p>
                Energy recovery algorithms help compensate for radiation losses
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              sigma(m4l) ~ 2.5 GeV — Broader peak
            </p>
          </div>
        </div>

        {/* 2e2mu Channel */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <span className="text-purple-400 font-bold text-sm">2e2mu</span>
            </div>
            <h4 className="font-semibold text-white">Mixed Channel</h4>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-white font-medium">Intermediate resolution</span> —
                Combines properties of both lepton types
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <p>
                <span className="text-white font-medium">Highest signal yield</span> —
                2x the rate of same-flavor channels
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Waves className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <p>
                Each Z boson decays to a different lepton flavor
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              sigma(m4l) ~ 1.8 GeV — Good compromise
            </p>
          </div>
        </div>
      </div>

      {/* Decay diagram */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        <h4 className="font-semibold text-white mb-4">Decay Chain</h4>
        <div className="flex items-center justify-center gap-4 text-sm font-mono overflow-x-auto py-4">
          <span className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg">H</span>
          <span className="text-slate-500">-&gt;</span>
          <span className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg">Z</span>
          <span className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg">Z*</span>
          <span className="text-slate-500">-&gt;</span>
          <span className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg">l+l-</span>
          <span className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg">l+l-</span>
        </div>
        <p className="text-center text-sm text-slate-400 mt-2">
          The Higgs decays to two Z bosons (one virtual, Z*), each decaying to a lepton pair
        </p>
      </div>
    </motion.div>
  );
}
