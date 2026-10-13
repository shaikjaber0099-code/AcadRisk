'use client';

import React from 'react';
import { Code2, BrainCircuit, Database, Cpu, Cog } from 'lucide-react';

export type BranchCode = 'CSE' | 'AIML' | 'DS' | 'ECE' | 'MECH' | string;

export interface BranchInfo {
  code: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BRANCH_CONFIGS: Record<string, BranchInfo> = {
  CSE: {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    color: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.28)',
    glowClass: 'shadow-[0_0_12px_rgba(56,189,248,0.2)]',
    icon: Code2,
  },
  AIML: {
    code: 'AIML',
    name: 'Artificial Intelligence & Machine Learning',
    color: '#818CF8',
    bgColor: 'rgba(129, 140, 248, 0.1)',
    borderColor: 'rgba(129, 140, 248, 0.28)',
    glowClass: 'shadow-[0_0_12px_rgba(129,140,248,0.2)]',
    icon: BrainCircuit,
  },
  DS: {
    code: 'DS',
    name: 'Data Science & Analytics',
    color: '#2DD4BF',
    bgColor: 'rgba(45, 212, 191, 0.1)',
    borderColor: 'rgba(45, 212, 191, 0.28)',
    glowClass: 'shadow-[0_0_12px_rgba(45,212,191,0.2)]',
    icon: Database,
  },
  ECE: {
    code: 'ECE',
    name: 'Electronics & Communication',
    color: '#60A5FA',
    bgColor: 'rgba(96, 165, 250, 0.1)',
    borderColor: 'rgba(96, 165, 250, 0.28)',
    glowClass: 'shadow-[0_0_12px_rgba(96,165,250,0.2)]',
    icon: Cpu,
  },
  MECH: {
    code: 'MECH',
    name: 'Mechanical Engineering',
    color: '#94A3B8',
    bgColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.28)',
    glowClass: 'shadow-[0_0_12px_rgba(148,163,184,0.2)]',
    icon: Cog,
  },
};

interface BranchBadgeProps {
  branch?: BranchCode;
  size?: 'sm' | 'md' | 'lg';
  showFullName?: boolean;
  withGlow?: boolean;
  className?: string;
  onClick?: () => void;
}

export function BranchBadge({
  branch = 'CSE',
  size = 'md',
  showFullName = false,
  withGlow = false,
  className = '',
  onClick,
}: BranchBadgeProps) {
  const normBranch = (branch || 'CSE').toUpperCase().trim();
  const config = BRANCH_CONFIGS[normBranch] || {
    code: normBranch,
    name: normBranch,
    color: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    glowClass: '',
    icon: Code2,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      onClick={onClick}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        color: config.color,
      }}
      className={`inline-flex items-center rounded-lg border font-mono font-semibold transition-all duration-200 ${
        withGlow ? config.glowClass : ''
      } ${sizeClasses[size]} ${
        onClick ? 'cursor-pointer hover:brightness-110 active:scale-95' : ''
      } ${className}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} />
      <span className="tracking-wide">
        {showFullName ? config.name : config.code}
      </span>
    </span>
  );
}

export default BranchBadge;
