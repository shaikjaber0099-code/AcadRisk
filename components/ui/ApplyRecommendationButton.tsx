'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface RecommendationCardProps {
  id: string;
  title: string;
  impact: string;
  category: string;
  onApply: (id: string) => void;
  className?: string;
}

export function ApplyRecommendationCard({
  id,
  title,
  impact,
  category,
  onApply,
  className = '',
}: RecommendationCardProps) {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => {
      onApply(id);
    }, 500);
  };

  return (
    <AnimatePresence>
      {!applied ? (
        <motion.div
          layout
          initial={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0.6,
            y: -40,
            transition: { duration: 0.42, ease: [0.4, 0, 1, 1] },
          }}
          className={`p-4 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md flex items-center justify-between gap-4 group hover:border-zinc-600 transition-colors ${className}`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 text-white border border-zinc-750 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                {category} • Impact {impact}
              </span>
              <h4 className="text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors font-sans">
                {title}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold shadow-sm border border-white active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Apply</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs flex items-center gap-2 font-sans"
        >
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Intervention committed to Academic Action Plan</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ApplyRecommendationCard;
