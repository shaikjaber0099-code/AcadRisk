'use strict';
import React from 'react';

interface CrestLogoProps {
  size?: number;
  showText?: boolean;
  showLabel?: boolean;
  subtext?: string;
  className?: string;
}

export function CrestLogo({
  size = 40,
  showText = true,
  showLabel,
  subtext = 'Office of Academic Affairs',
  className = '',
}: CrestLogoProps) {
  const shouldShowText = showLabel !== undefined ? showLabel : showText;
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* University Crest SVG Mark */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-slate-900 border border-slate-700/80 shadow-md p-1.5 transition-transform hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white drop-shadow-sm"
        >
          {/* Outer Shield Border */}
          <path
            d="M24 4L38 9V22C38 31.5 32 39.5 24 44C16 39.5 10 31.5 10 22V9L24 4Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sky-400"
          />
          {/* Inner Shield Accent */}
          <path
            d="M24 8L34 12V21C34 28 29.5 34.5 24 38C18.5 34.5 14 28 14 21V12L24 8Z"
            fill="rgba(56, 189, 248, 0.08)"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1.2"
          />
          {/* Academic Book / Knowledge Wings */}
          <path
            d="M19 25C21 24 23 24.5 24 26C25 24.5 27 24 29 25V30C27 29 25 29.5 24 31C23 29.5 21 29 19 30V25Z"
            fill="currentColor"
            className="text-white"
          />
          {/* University Torch of Wisdom Flame */}
          <path
            d="M24 13C24 13 22 16 22 17.5C22 18.6 22.9 19.5 24 19.5C25.1 19.5 26 18.6 26 17.5C26 16 24 13 24 13Z"
            fill="#38BDF8"
          />
          <circle cx="24" cy="18" r="1.5" fill="#38BDF8" />
        </svg>
        {/* Subtle Flare Point */}
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
        </span>
      </div>

      {/* University & Portal Identity Header */}
      {shouldShowText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-bold text-base tracking-wide text-white group-hover:text-sky-300 transition-colors">
              AcadRisk
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold tracking-wider">
              PORTAL
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-sans tracking-tight">
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
}

export default CrestLogo;
