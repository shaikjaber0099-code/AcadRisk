'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StrokeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function StrokeCheckbox({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}: StrokeCheckboxProps) {
  return (
    <label
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={`relative w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white ${
          checked
            ? 'bg-white border-white shadow-sm'
            : 'bg-zinc-950 border-zinc-700 group-hover:border-zinc-500'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={checked ? '#000000' : 'transparent'}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <motion.path
            d="M20 6L9 17L4 12"
            initial={false}
            animate={{
              pathLength: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
              duration: 0.2,
            }}
          />
        </svg>
      </div>

      {label && (
        <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors font-sans">
          {label}
        </span>
      )}
    </label>
  );
}

export default StrokeCheckbox;
