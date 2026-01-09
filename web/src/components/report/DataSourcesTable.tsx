"use client";

import { Database, FileCode, Server } from "lucide-react";
import { DataSource } from "@/lib/report";

interface DataSourcesTableProps {
  sources: DataSource[];
}

export function DataSourcesTable({ sources }: DataSourcesTableProps) {
  const getIcon = (type: string) => {
    if (type.includes("Data") || type.includes("Dataset")) return <Database className="w-4 h-4" />;
    if (type.includes("Code")) return <FileCode className="w-4 h-4" />;
    return <Server className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {sources.map((source, index) => (
        <div
          key={index}
          className="bg-slate-800/50 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-lg p-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-700 print:bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              {getIcon(source.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-medium text-white print:text-black">
                  {source.name}
                </h4>
                <span className="px-2 py-0.5 bg-blue-500/20 print:bg-blue-100 text-blue-400 print:text-blue-600 text-xs rounded-full">
                  {source.type}
                </span>
              </div>
              <p className="text-sm text-slate-400 print:text-gray-600 mt-1">
                {source.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs">
                <div>
                  <span className="text-slate-500 print:text-gray-500">Location: </span>
                  <code className="text-slate-300 print:text-gray-700">{source.location}</code>
                </div>
                {source.size && (
                  <div>
                    <span className="text-slate-500 print:text-gray-500">Size: </span>
                    <span className="text-slate-300 print:text-gray-700">{source.size}</span>
                  </div>
                )}
                {source.checksum && (
                  <div>
                    <span className="text-slate-500 print:text-gray-500">Checksum: </span>
                    <code className="text-slate-300 print:text-gray-700">{source.checksum}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
