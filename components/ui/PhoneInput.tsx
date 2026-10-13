'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Copy, Check, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

// Format helper: formats 10 digits to "98765 43210"
export function formatIndianPhone(digits: string): string {
  const clean = digits.replace(/\D/g, '').slice(0, 10);
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)} ${clean.slice(5)}`;
}

// Mask helper: "98•••• ••210"
export function maskIndianPhone(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  if (clean.length < 10) return digits;
  // first 2 digits, 3 bullets, space, 2 bullets, last 3 digits
  return `${clean.slice(0, 2)}•••• ••${clean.slice(7)}`;
}

interface PhoneCellProps {
  phone: string;
  className?: string;
}

export function PhoneCell({ phone, className = '' }: PhoneCellProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const clean = (phone || '').replace(/\D/g, '');
  const displayPhone = revealed ? formatIndianPhone(clean) : maskIndianPhone(clean);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`+91 ${clean}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`inline-flex items-center gap-2 font-mono text-xs text-zinc-300 ${className}`}>
      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-semibold border border-zinc-700">
        +91
      </span>
      <span className="tracking-wider select-all">{displayPhone}</span>

      {/* Reveal Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setRevealed(!revealed);
        }}
        title={revealed ? 'Hide phone' : 'Reveal phone'}
        className="p-1 text-zinc-400 hover:text-white transition-colors"
        aria-label={revealed ? 'Mask phone number' : 'Unmask phone number'}
      >
        {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>

      {/* Copy / Action Buttons */}
      <button
        type="button"
        onClick={handleCopy}
        title="Copy full number"
        className="hidden md:inline-flex p-1 text-zinc-400 hover:text-white transition-colors"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-white" />
        ) : (
          <Copy className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
        )}
      </button>

      {/* Mobile direct call / WhatsApp links */}
      <div className="flex md:hidden items-center gap-1">
        <a
          href={`tel:+91${clean}`}
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded bg-zinc-800 text-white hover:bg-zinc-700"
          title="Call student"
        >
          <Phone className="w-3 h-3" />
        </a>
        <a
          href={`https://wa.me/91${clean}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded bg-zinc-800 text-white hover:bg-zinc-700"
          title="WhatsApp student"
        >
          <MessageCircle className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  id?: string;
  name?: string;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  required = false,
  disabled = false,
  label = 'Student Contact Number',
  id = 'phone-input',
  name = 'phone',
  className = '',
}: PhoneInputProps) {
  const [touched, setTouched] = useState(false);

  // Clean raw digits
  const rawDigits = (value || '').replace(/\D/g, '').slice(0, 10);
  const formatted = formatIndianPhone(rawDigits);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(digits);
  };

  const isValid = INDIAN_PHONE_REGEX.test(rawDigits);
  const showError = touched && rawDigits.length > 0 && !isValid;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between font-sans">
          <span>{label} {required && <span className="text-white">*</span>}</span>
          <span className="text-[10px] font-mono text-zinc-400">+91 [6-9]XX XXX XX</span>
        </label>
      )}

      <div className="relative flex items-center">
        {/* +91 Country Chip */}
        <div className="absolute left-2.5 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-white font-mono text-xs font-semibold select-none">
          <span>+91</span>
        </div>

        <input
          id={id}
          name={name}
          type="tel"
          value={formatted}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="98765 43210"
          maxLength={11} // 10 digits + 1 space
          disabled={disabled}
          className={`w-full pl-20 pr-10 py-2.5 bg-zinc-950 border rounded-xl font-mono text-sm tracking-wider text-white placeholder:text-zinc-600 focus:outline-none transition-all ${
            showError
              ? 'border-white focus:ring-1 focus:ring-white'
              : isValid
              ? 'border-zinc-500 focus:ring-1 focus:ring-white'
              : 'border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-white/30'
          }`}
        />

        <div className="absolute right-3 flex items-center pointer-events-none">
          {isValid ? (
            <span className="text-white text-xs">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
          ) : showError ? (
            <span className="text-zinc-400 text-xs">
              <AlertCircle className="w-4 h-4" />
            </span>
          ) : null}
        </div>
      </div>

      {showError && (
        <span className="text-xs text-zinc-300 font-sans flex items-center gap-1 animate-in fade-in-50 duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9
        </span>
      )}
    </div>
  );
}

export default PhoneInput;
