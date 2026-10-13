'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, BrainCircuit, Database, Cpu, Cog, Layers } from 'lucide-react';
import { BRANCH_CONFIGS } from './BranchBadge';

export interface BranchCountMap {
  [branch: string]: number;
}

interface BranchTabsProps {
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  counts?: BranchCountMap;
  className?: string;
}

const TABS = [
  { id: 'ALL', label: 'All Departments', icon: Layers, color: '#FFFFFF' },
  { id: 'CSE', label: 'CSE', icon: Code2, color: BRANCH_CONFIGS.CSE.color },
  { id: 'AIML', label: 'AIML', icon: BrainCircuit, color: BRANCH_CONFIGS.AIML.color },
  { id: 'DS', label: 'DS', icon: Database, color: BRANCH_CONFIGS.DS.color },
  { id: 'ECE', label: 'ECE', icon: Cpu, color: BRANCH_CONFIGS.ECE.color },
  { id: 'MECH', label: 'MECH', icon: Cog, color: BRANCH_CONFIGS.MECH.color },
];

export function BranchTabs({
  selectedBranch,
  onSelectBranch,
  counts = {},
  className = '',
}: BranchTabsProps) {
  return (
    <div className={`w-full overflow-x-auto scrollbar-none py-1.5 ${className}`}>
      <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-zinc-800 backdrop-blur-md">
        {TABS.map((tab) => {
          const isSelected =
            selectedBranch.toUpperCase() === tab.id ||
            (!selectedBranch && tab.id === 'ALL');
          const count =
            tab.id === 'ALL'
              ? Object.values(counts).reduce((a, b) => a + b, 0)
              : counts[tab.id] ?? 0;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectBranch(tab.id === 'ALL' ? '' : tab.id)}
              className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 select-none shrink-0 ${
                isSelected
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              {/* Sliding Pill Active Background */}
              {isSelected && (
                <motion.div
                  layoutId="activeBranchTabPill"
                  className="absolute inset-0 rounded-xl bg-zinc-900 border border-zinc-700 shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-1.5">
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isSelected ? '#FFFFFF' : 'currentColor' }}
                />
                <span>{tab.label}</span>
              </span>

              {/* Count Badge */}
              {count !== undefined && count > 0 && (
                <span
                  className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold tabular-nums transition-colors ${
                    isSelected
                      ? 'bg-zinc-800 text-white border border-zinc-600'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BranchTabs;
