'use client';

import React, { useState } from 'react';
import { Check, Copy, AlertCircle, IdCard } from 'lucide-react';

export const ROLL_NUMBER_REGEX = /^\d{2}R\d{2}A\d{4}$/;

interface RollNumberChipProps {
  rollNo?: string;
  rollNumber?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  highlightQuery?: string;
}

export function RollNumberChip({
  rollNo,
  rollNumber,
  size = 'md',
  className = '',
  highlightQuery = '',
}: RollNumberChipProps) {
  const actualRoll = rollNumber || rollNo || '24R11A0543';
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!actualRoll) return;
    navigator.clipboard.writeText(actualRoll);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderHighlighted = (text: string, query: string) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-white text-black font-bold px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg bg-zinc-900 border border-zinc-750 font-mono text-zinc-100 shadow-sm transition-all hover:border-zinc-500 select-none group ${sizeClasses[size]} ${className}`}
      title="University Student Roll Number (Click copy icon)"
    >
      <IdCard className="w-3.5 h-3.5 text-white/80 group-hover:text-white shrink-0" />
      <span className="tracking-wider">
        {renderHighlighted(actualRoll, highlightQuery)}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy roll number"
        className="ml-1 p-0.5 text-zinc-400 hover:text-white focus:outline-none transition-colors"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-white animate-in zoom-in-50 duration-150" />
        ) : (
          <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
        )}
      </button>
    </span>
  );
}

interface RollNumberInputProps {
  value: string;
  onChange: (val: string, isValid?: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
  label?: string;
  helperText?: string;
  className?: string;
}

export function RollNumberInput({
  value,
  onChange,
  required = true,
  disabled = false,
  placeholder = '24R11A0543',
  id = 'roll-number-input',
  name = 'rollNo',
  label = 'University Roll Number',
  helperText,
  className = '',
}: RollNumberInputProps) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upper = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 10);
    const valid = ROLL_NUMBER_REGEX.test(upper);
    onChange(upper, valid);
  };

  const isValid = ROLL_NUMBER_REGEX.test(value);
  const showError = touched && value.length > 0 && !isValid;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between font-sans">
          <span>{label} {required && <span className="text-white">*</span>}</span>
          <span className="text-[10px] font-mono text-zinc-400">Pattern: 24R11A0543</span>
        </label>
      )}

      <div className="relative flex items-center">
        <span className="absolute left-3 font-mono text-xs text-zinc-400 pointer-events-none select-none flex items-center gap-1">
          <IdCard className="w-3.5 h-3.5 text-white" />
          <span>ROLL</span>
        </span>

        <input
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          maxLength={10}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          className={`w-full pl-20 pr-10 py-2.5 bg-zinc-950 border rounded-xl font-mono text-sm tracking-widest text-white placeholder:text-zinc-600 focus:outline-none transition-all ${
            showError
              ? 'border-white focus:ring-1 focus:ring-white'
              : isValid
              ? 'border-zinc-500 focus:ring-1 focus:ring-white'
              : 'border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-white/30'
          }`}
        />

        <div className="absolute right-3 flex items-center pointer-events-none">
          {isValid ? (
            <span className="flex items-center text-white gap-1 text-xs font-sans">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
          ) : showError ? (
            <span className="flex items-center text-zinc-400 gap-1 text-xs font-sans">
              <AlertCircle className="w-4 h-4" />
            </span>
          ) : null}
        </div>
      </div>

      {showError && (
        <span className="text-xs text-zinc-300 font-sans flex items-center gap-1 animate-in fade-in-50 duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          Format: 24R11A0543 (Year 24 + R + Branch 11 + A + 4 Digits)
        </span>
      )}
    </div>
  );
}

export default RollNumberInput;
