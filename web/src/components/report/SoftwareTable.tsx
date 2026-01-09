"use client";

import { ExternalLink } from "lucide-react";
import { SoftwareVersion } from "@/lib/report";

interface SoftwareTableProps {
  versions: SoftwareVersion[];
}

export function SoftwareTable({ versions }: SoftwareTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 print:border-gray-300">
            <th className="text-left py-3 px-4 text-slate-400 print:text-gray-600 font-medium">
              Software
            </th>
            <th className="text-left py-3 px-4 text-slate-400 print:text-gray-600 font-medium">
              Version
            </th>
            <th className="text-left py-3 px-4 text-slate-400 print:text-gray-600 font-medium">
              Description
            </th>
            <th className="text-center py-3 px-4 text-slate-400 print:text-gray-600 font-medium print:hidden">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {versions.map((software) => (
            <tr
              key={software.name}
              className="border-b border-slate-800 print:border-gray-200 hover:bg-slate-800/30"
            >
              <td className="py-3 px-4">
                <span className="font-medium text-white print:text-black">
                  {software.name}
                </span>
              </td>
              <td className="py-3 px-4">
                <code className="px-2 py-1 bg-slate-800 print:bg-gray-100 rounded text-blue-400 print:text-blue-600 text-xs">
                  {software.version}
                </code>
              </td>
              <td className="py-3 px-4 text-slate-300 print:text-gray-700">
                {software.description}
              </td>
              <td className="py-3 px-4 text-center print:hidden">
                {software.url && (
                  <a
                    href={software.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
