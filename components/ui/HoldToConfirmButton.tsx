'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Check } from 'lucide-react';

interface HoldToConfirmButtonProps {
  onConfirm: () => void;
  label?: string;
  confirmingLabel?: string;
  confirmedLabel?: string;
  holdDurationMs?: number; // 800ms standard
  className?: string;
}

export function HoldToConfirmButton({
  onConfirm,
  label = 'Delete Student Dossier',
  confirmingLabel = 'Hold to confirm...',
  confirmedLabel = 'Action Completed',
  holdDurationMs = 800,
  className = '',
}: HoldToConfirmButtonProps) {
  const [progress, setProgress] = useState(0); // 0 to 100
  const [holding, setHolding] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startHold = () => {
    if (confirmed) return;
    setHolding(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / holdDurationMs) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(intervalRef.current!);
        setHolding(false);
        setConfirmed(true);
        onConfirm();
        setTimeout(() => {
          setConfirmed(false);
          setProgress(0);
        }, 2000);
      }
    }, 16);
  };

  const cancelHold = () => {
    if (confirmed) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      className={`relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wider transition-all select-none overflow-hidden font-sans ${
        confirmed
          ? 'bg-white text-black border border-white'
          : holding
          ? 'bg-zinc-800 text-white border border-zinc-500 scale-95 shadow-md'
          : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700 hover:bg-zinc-800'
      } ${className}`}
      title="Press and hold 800ms to confirm destructive action"
    >
      {/* Background Fill Progress Bar */}
      <div
        className="absolute inset-y-0 left-0 bg-white/20 transition-all duration-75 pointer-events-none"
        style={{ width: `${progress}%` }}
      />

      {/* Circular SVG Progress Ring */}
      <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
        {confirmed ? (
          <Check className="w-4 h-4 text-black animate-in zoom-in-75" />
        ) : (
          <>
            <svg className="w-5 h-5 -rotate-90">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2.5"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeDasharray={2 * Math.PI * 8}
                strokeDashoffset={
                  2 * Math.PI * 8 - (progress / 100) * (2 * Math.PI * 8)
                }
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Trash2 className="w-2.5 h-2.5 text-zinc-300" />
            </div>
          </>
        )}
      </div>

      <span className="relative z-10">
        {confirmed ? confirmedLabel : holding ? confirmingLabel : label}
      </span>
      <span className="text-[10px] opacity-60 font-mono">800ms</span>
    </button>
  );
}

export default HoldToConfirmButton;
