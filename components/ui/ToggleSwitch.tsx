'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}: ToggleSwitchProps) {
  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${className}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-240 ease-standard focus-visible:ring-2 focus-visible:ring-white ${
          checked ? 'bg-white' : 'bg-zinc-800'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          animate={{ x: checked ? 20 : 2 }}
          className={`inline-block h-4 w-4 rounded-full shadow-md self-center ${
            checked ? 'bg-black' : 'bg-zinc-400'
          }`}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col font-sans">
          {label && <span className="text-sm font-medium text-white">{label}</span>}
          {description && (
            <span className="text-xs text-zinc-400">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}

export default ToggleSwitch;
