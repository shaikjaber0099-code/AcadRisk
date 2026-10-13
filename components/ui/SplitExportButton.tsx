'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronDown, FileText, Table, Printer, Check } from 'lucide-react';

interface SplitExportButtonProps {
  onExportPDF?: () => void;
  onExportCSV?: () => void;
  onPrint?: () => void;
  className?: string;
}

export function SplitExportButton({
  onExportPDF,
  onExportCSV,
  onPrint,
  className = '',
}: SplitExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (label: string, callback?: () => void) => {
    setLastAction(label);
    setOpen(false);
    callback?.();
    setTimeout(() => setLastAction(null), 2000);
  };

  return (
    <div ref={containerRef} className={`relative inline-flex rounded-xl shadow-sm ${className}`}>
      {/* Primary Export Action */}
      <button
        type="button"
        onClick={() => handleAction('PDF', onExportPDF)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-l-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 active:scale-95 transition-all border border-white border-r-0"
      >
        {lastAction === 'PDF' ? (
          <Check className="w-4 h-4 text-black" />
        ) : (
          <Download className="w-4 h-4 text-black" />
        )}
        <span>{lastAction ? `Exported ${lastAction}` : 'Export Report'}</span>
      </button>

      {/* Split Arrow Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Export format options"
        className="px-2 py-2 rounded-r-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs border border-zinc-700 hover:border-zinc-500 transition-all"
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? 'rotate-180 text-white' : 'text-zinc-400'
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl z-50 p-1.5 flex flex-col gap-1 backdrop-blur-xl"
          >
            <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              Select Dossier Format
            </div>

            <button
              type="button"
              onClick={() => handleAction('PDF', onExportPDF)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors text-left"
            >
              <FileText className="w-4 h-4 text-white" />
              <div className="flex flex-col">
                <span>Official PDF Dossier</span>
                <span className="text-[10px] text-zinc-400">Includes Dean Signature</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleAction('CSV', onExportCSV)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors text-left"
            >
              <Table className="w-4 h-4 text-white" />
              <div className="flex flex-col">
                <span>Export CSV Dataset</span>
                <span className="text-[10px] text-zinc-400">Raw features & labels</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleAction('Print', onPrint)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors text-left"
            >
              <Printer className="w-4 h-4 text-white" />
              <div className="flex flex-col">
                <span>Print Dossier</span>
                <span className="text-[10px] text-zinc-400">Campus hardcopy layout</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SplitExportButton;
