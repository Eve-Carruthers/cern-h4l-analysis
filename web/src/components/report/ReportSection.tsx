"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ReportSectionProps {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function ReportSection({
  id,
  number,
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: ReportSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden print:bg-white print:border-gray-300"
    >
      {/* Section header */}
      <div
        className={`
          flex items-center gap-4 p-6 border-b border-slate-800
          print:border-gray-300 print:bg-gray-50
          ${collapsible ? "cursor-pointer hover:bg-slate-800/50" : ""}
        `}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center print:bg-blue-100">
          <span className="text-blue-400 font-bold print:text-blue-600">{number}</span>
        </div>
        <h2 className="text-xl font-semibold text-white print:text-black flex-1">
          {title}
        </h2>
        {collapsible && (
          <button className="text-slate-400 print:hidden">
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Section content */}
      {(!collapsible || isOpen) && (
        <div className="p-6 print:p-4">
          {children}
        </div>
      )}
    </motion.section>
  );
}
