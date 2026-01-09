"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Printer,
  Edit3,
  Save,
  Clock,
  CheckCircle
} from "lucide-react";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportSection } from "@/components/report/ReportSection";
import { SoftwareTable } from "@/components/report/SoftwareTable";
import { DataSourcesTable } from "@/components/report/DataSourcesTable";
import { AnalysisPipeline } from "@/components/report/AnalysisPipeline";
import { ConfigurationDisplay } from "@/components/report/ConfigurationDisplay";
import { ResultsSummary } from "@/components/report/ResultsSummary";
import {
  defaultMetadata,
  softwareVersions,
  dataSources,
  analysisSteps,
  analysisConfig,
  generateReportId,
  generateTimestamp,
  AnalysisMetadata,
} from "@/lib/report";

export default function ReportPage() {
  const [metadata, setMetadata] = useState<AnalysisMetadata>(defaultMetadata);
  const [reportId] = useState(generateReportId);
  const [timestamp] = useState(generateTimestamp);
  const [isEditing, setIsEditing] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create a simple text export
    const content = `
CMS H→ZZ*→4l Open Data Analysis Report
Report ID: ${reportId}
Generated: ${timestamp}

Title: ${metadata.title}
Author: ${metadata.author}
Institution: ${metadata.institution}
Date: ${metadata.date}
Version: ${metadata.version}

=== RESULTS ===
Observed Events: 12
Expected Background: 2.5
Local Significance: ~5sigma

=== SOFTWARE VERSIONS ===
${softwareVersions.map(s => `${s.name}: ${s.version}`).join('\n')}

=== DATA SOURCES ===
${dataSources.map(d => `${d.name} (${d.type})`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `h4l-report-${reportId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between sticky top-20 z-40 bg-slate-950/90 backdrop-blur-sm py-4 -mx-4 px-4 print:hidden">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-orange-400" />
          <div>
            <h1 className="text-xl font-bold">Reproducibility Report</h1>
            <p className="text-sm text-slate-400">
              Generated {new Date(timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${isEditing
                ? "bg-green-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }
            `}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Done Editing
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Edit
              </>
            )}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-6 print:space-y-4">
        {/* Header */}
        <ReportHeader
          metadata={metadata}
          reportId={reportId}
          onMetadataChange={setMetadata}
          editable={isEditing}
        />

        {/* Table of Contents (print only) */}
        <div className="hidden print:block bg-white border border-gray-300 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
          <ol className="space-y-2 text-sm">
            <li><a href="#abstract">1. Abstract</a></li>
            <li><a href="#software">2. Software Environment</a></li>
            <li><a href="#data">3. Data Sources</a></li>
            <li><a href="#pipeline">4. Analysis Pipeline</a></li>
            <li><a href="#config">5. Configuration</a></li>
            <li><a href="#results">6. Results</a></li>
            <li><a href="#reproducibility">7. Reproducibility Information</a></li>
          </ol>
        </div>

        {/* Abstract */}
        <ReportSection id="abstract" number="1" title="Abstract">
          <div className="prose prose-invert print:prose max-w-none">
            <p className="text-slate-300 print:text-gray-700 leading-relaxed">
              This report documents the analysis of the H→ZZ*→4l decay channel using
              CMS Open Data from the 2011-2012 LHC proton-proton collision runs. The
              analysis searches for the Higgs boson in the four-lepton final state,
              where the four leptons are electrons or muons. Using {analysisConfig.dataset.integratedLuminosity} of
              integrated luminosity at √s = {analysisConfig.dataset.centerOfMassEnergy},
              we observe an excess of events consistent with the Higgs boson signal
              at a mass of approximately 125 GeV.
            </p>
            <p className="text-slate-300 print:text-gray-700 leading-relaxed mt-4">
              The observed local significance of the excess is approximately 5 standard
              deviations, meeting the discovery threshold in particle physics. This
              analysis serves as an educational demonstration of the techniques used
              in the original Higgs boson discovery announced on July 4, 2012.
            </p>
          </div>
        </ReportSection>

        {/* Software Environment */}
        <ReportSection id="software" number="2" title="Software Environment">
          <p className="text-slate-400 print:text-gray-600 mb-4">
            The following software packages were used in this analysis:
          </p>
          <SoftwareTable versions={softwareVersions} />
        </ReportSection>

        {/* Data Sources */}
        <ReportSection id="data" number="3" title="Data Sources">
          <p className="text-slate-400 print:text-gray-600 mb-4">
            All data used in this analysis is publicly available from the CERN Open Data Portal:
          </p>
          <DataSourcesTable sources={dataSources} />
        </ReportSection>

        {/* Analysis Pipeline */}
        <ReportSection id="pipeline" number="4" title="Analysis Pipeline">
          <p className="text-slate-400 print:text-gray-600 mb-4">
            The analysis follows a sequential pipeline with the following steps:
          </p>
          <AnalysisPipeline steps={analysisSteps} />
        </ReportSection>

        {/* Configuration */}
        <ReportSection id="config" number="5" title="Configuration">
          <p className="text-slate-400 print:text-gray-600 mb-4">
            The analysis was performed with the following configuration parameters:
          </p>
          <ConfigurationDisplay config={analysisConfig} />
        </ReportSection>

        {/* Results */}
        <ReportSection id="results" number="6" title="Results">
          <ResultsSummary />
        </ReportSection>

        {/* Reproducibility Information */}
        <ReportSection id="reproducibility" number="7" title="Reproducibility Information">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-xl p-4">
              <h4 className="font-semibold text-white print:text-black mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Timestamps
              </h4>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-slate-500 print:text-gray-500">Report Generated</dt>
                  <dd className="text-white print:text-black font-mono text-xs">
                    {timestamp}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 print:text-gray-500">Analysis Date</dt>
                  <dd className="text-white print:text-black font-mono text-xs">
                    {metadata.date}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-slate-800/50 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-xl p-4">
              <h4 className="font-semibold text-white print:text-black mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Verification
              </h4>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-slate-500 print:text-gray-500">Report ID</dt>
                  <dd className="text-white print:text-black font-mono text-xs">{reportId}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 print:text-gray-500">Version</dt>
                  <dd className="text-white print:text-black font-mono text-xs">{metadata.version}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* How to Reproduce */}
          <div className="mt-6 bg-blue-500/10 print:bg-blue-50 border border-blue-500/30 print:border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-400 print:text-blue-700 mb-4">
              How to Reproduce This Analysis
            </h4>
            <ol className="space-y-3 text-sm text-slate-300 print:text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 print:bg-blue-100 rounded-full flex items-center justify-center text-blue-400 print:text-blue-600 text-xs font-bold">1</span>
                <div>
                  <p className="font-medium text-white print:text-black">Clone the repository</p>
                  <code className="text-xs bg-slate-800 print:bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                    git clone https://github.com/cms-opendata-analyses/HiggsExample20112012
                  </code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 print:bg-blue-100 rounded-full flex items-center justify-center text-blue-400 print:text-blue-600 text-xs font-bold">2</span>
                <div>
                  <p className="font-medium text-white print:text-black">Install dependencies</p>
                  <code className="text-xs bg-slate-800 print:bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                    pip install -e .
                  </code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 print:bg-blue-100 rounded-full flex items-center justify-center text-blue-400 print:text-blue-600 text-xs font-bold">3</span>
                <div>
                  <p className="font-medium text-white print:text-black">Initialize and run</p>
                  <code className="text-xs bg-slate-800 print:bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                    h4l init && h4l run level2
                  </code>
                </div>
              </li>
            </ol>
          </div>
        </ReportSection>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-800 print:border-gray-300">
          <p className="text-sm text-slate-500 print:text-gray-500">
            This analysis uses CMS Open Data and follows the Open Science principles
          </p>
          <p className="text-xs text-slate-600 print:text-gray-400 mt-2">
            Report ID: {reportId} | Generated: {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 1.5cm;
          }

          section {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
