'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export type RiskLevel = 'Low' | 'Medium' | 'High' | string;

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
  className?: string;
}

export function RiskBadge({
  level,
  size = 'md',
  showSubtext = false,
  className = '',
}: RiskBadgeProps) {
  const norm = (level || 'Low').toLowerCase();

  let color = '#34D399'; // Mint Emerald
  let bg = 'rgba(16, 185, 129, 0.12)';
  let border = 'rgba(16, 185, 129, 0.3)';
  let label = 'Low Risk';
  let supportiveLabel = 'On Track';
  let Icon = CheckCircle2;

  if (norm.includes('high')) {
    color = '#FB7185'; // Coral Rose
    bg = 'rgba(244, 63, 94, 0.15)';
    border = 'rgba(244, 63, 94, 0.35)';
    label = 'High Risk';
    supportiveLabel = 'Academic Support Recommended';
    Icon = ShieldAlert;
  } else if (norm.includes('med')) {
    color = '#FBBF24'; // Nordic Amber
    bg = 'rgba(245, 158, 11, 0.12)';
    border = 'rgba(245, 158, 11, 0.35)';
    label = 'Medium Risk';
    supportiveLabel = 'Needs Faculty Attention';
    Icon = AlertTriangle;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      style={{
        backgroundColor: bg,
        borderColor: border,
        color: color,
      }}
      className={`inline-flex items-center rounded-lg border font-semibold tracking-wide transition-all duration-200 select-none ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={`Academic risk level: ${label}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} />
      <span>{label}</span>
      {showSubtext && (
        <span className="text-[10px] opacity-80 font-normal ml-1">
          • {supportiveLabel}
        </span>
      )}
    </span>
  );
}

export default RiskBadge;
