"use client";

import { motion } from "framer-motion";
import { User, Building, Calendar, Hash } from "lucide-react";
import { AnalysisMetadata } from "@/lib/report";

interface ReportHeaderProps {
  metadata: AnalysisMetadata;
  reportId: string;
  onMetadataChange: (metadata: AnalysisMetadata) => void;
  editable?: boolean;
}

export function ReportHeader({
  metadata,
  reportId,
  onMetadataChange,
  editable = false
}: ReportHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 print:bg-white print:border-black print:text-black"
    >
      {/* CERN-style header bar */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700 print:border-black">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center print:bg-blue-600">
          <span className="text-white text-2xl font-bold">CMS</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-400 print:text-gray-600">
            CMS Open Data Analysis Report
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white print:text-black">
            {editable ? (
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => onMetadataChange({ ...metadata, title: e.target.value })}
                className="bg-transparent border-b border-slate-600 focus:border-blue-500 outline-none w-full"
              />
            ) : (
              metadata.title
            )}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 print:text-gray-500">Report ID</p>
          <p className="font-mono text-sm text-slate-300 print:text-gray-700">{reportId}</p>
        </div>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetadataField
          icon={<User className="w-4 h-4" />}
          label="Author"
          value={metadata.author}
          editable={editable}
          onChange={(value) => onMetadataChange({ ...metadata, author: value })}
        />
        <MetadataField
          icon={<Building className="w-4 h-4" />}
          label="Institution"
          value={metadata.institution}
          editable={editable}
          onChange={(value) => onMetadataChange({ ...metadata, institution: value })}
        />
        <MetadataField
          icon={<Calendar className="w-4 h-4" />}
          label="Date"
          value={metadata.date}
          editable={editable}
          onChange={(value) => onMetadataChange({ ...metadata, date: value })}
        />
        <MetadataField
          icon={<Hash className="w-4 h-4" />}
          label="Version"
          value={metadata.version}
          editable={editable}
          onChange={(value) => onMetadataChange({ ...metadata, version: value })}
        />
      </div>
    </motion.div>
  );
}

function MetadataField({
  icon,
  label,
  value,
  editable,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-slate-400 print:text-gray-600 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      {editable && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white w-full focus:border-blue-500 outline-none print:bg-white print:border-gray-300 print:text-black"
        />
      ) : (
        <p className="text-white print:text-black font-medium">{value}</p>
      )}
    </div>
  );
}
