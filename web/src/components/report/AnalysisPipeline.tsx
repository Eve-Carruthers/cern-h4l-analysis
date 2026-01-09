"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, SkipForward, ChevronRight, Terminal } from "lucide-react";
import { AnalysisStep } from "@/lib/report";

interface AnalysisPipelineProps {
  steps: AnalysisStep[];
}

export function AnalysisPipeline({ steps }: AnalysisPipelineProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* Connection line */}
          {index < steps.length - 1 && (
            <div className="absolute left-5 top-14 bottom-0 w-0.5 bg-slate-700 print:bg-gray-300" />
          )}

          <div className="bg-slate-800/50 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-xl p-4 relative">
            <div className="flex items-start gap-4">
              {/* Status icon */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${step.status === "completed" ? "bg-green-500/20 print:bg-green-100" : ""}
                ${step.status === "pending" ? "bg-yellow-500/20 print:bg-yellow-100" : ""}
                ${step.status === "skipped" ? "bg-slate-600/50 print:bg-gray-200" : ""}
              `}>
                {step.status === "completed" && <CheckCircle className="w-5 h-5 text-green-400 print:text-green-600" />}
                {step.status === "pending" && <Clock className="w-5 h-5 text-yellow-400 print:text-yellow-600" />}
                {step.status === "skipped" && <SkipForward className="w-5 h-5 text-slate-400 print:text-gray-500" />}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 print:text-gray-500">Step {step.id}</span>
                  {step.duration && (
                    <span className="text-xs text-slate-500 print:text-gray-500">• {step.duration}</span>
                  )}
                </div>
                <h4 className="font-semibold text-white print:text-black mt-1">{step.name}</h4>
                <p className="text-sm text-slate-400 print:text-gray-600 mt-1">{step.description}</p>

                {/* Command */}
                {step.command && (
                  <div className="mt-3 flex items-center gap-2 bg-slate-900 print:bg-gray-900 rounded-lg px-3 py-2">
                    <Terminal className="w-4 h-4 text-slate-500" />
                    <code className="text-sm text-green-400 print:text-green-500 font-mono">
                      {step.command}
                    </code>
                  </div>
                )}

                {/* Inputs/Outputs */}
                <div className="mt-3 grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 print:text-gray-500 block mb-1">Inputs:</span>
                    <ul className="space-y-1">
                      {step.inputs.map((input, i) => (
                        <li key={i} className="flex items-center gap-1 text-slate-300 print:text-gray-700">
                          <ChevronRight className="w-3 h-3 text-slate-500" />
                          {input}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-slate-500 print:text-gray-500 block mb-1">Outputs:</span>
                    <ul className="space-y-1">
                      {step.outputs.map((output, i) => (
                        <li key={i} className="flex items-center gap-1 text-slate-300 print:text-gray-700">
                          <ChevronRight className="w-3 h-3 text-blue-500" />
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
