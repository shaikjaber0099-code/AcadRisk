'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Loader2, Check, ArrowRight } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'gold'
  | 'icon';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isSuccess?: boolean;
  successText?: string;
  isMagnetic?: boolean;
  withArrow?: boolean;
  disabledTooltip?: string;
  shine?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  successText = 'Success',
  isMagnetic = false,
  withArrow = false,
  disabledTooltip,
  shine = true,
  className = '',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [internalSuccess, setInternalSuccess] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Magnetic spring physics (up to 12px displacement)
  const x = useSpring(0, { stiffness: 260, damping: 20 });
  const y = useSpring(0, { stiffness: 260, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMagnetic || !btnRef.current || disabled || isLoading) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.28;
    const deltaY = (e.clientY - centerY) * 0.28;
    // Cap to 12px
    const clampedX = Math.max(-12, Math.min(12, deltaX));
    const clampedY = Math.max(-12, Math.min(12, deltaY));
    x.set(clampedX);
    y.set(clampedY);
  };

  const handleMouseLeave = () => {
    if (isMagnetic) {
      x.set(0);
      y.set(0);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    // Create click ripple effect
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const rippleX = e.clientX - rect.left;
      const rippleY = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: rippleX, y: rippleY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  // Base size styling
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs gap-1.5 min-w-[32px]',
    md: 'h-10 px-4 text-sm gap-2 min-w-[40px]',
    lg: 'h-12 px-6 text-base gap-2.5 min-w-[48px]',
  };

  // Variants styling
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:from-sky-400 hover:to-blue-500 hover:-translate-y-0.5 shadow-md shadow-sky-500/25 border border-sky-400/30',
    secondary:
      'bg-slate-900/90 text-slate-200 font-semibold border border-slate-700/80 hover:bg-slate-800 hover:border-sky-500/50 hover:text-white hover:-translate-y-0.5 shadow-sm',
    gold:
      'bg-sky-500/15 text-sky-300 font-semibold hover:bg-sky-500/25 hover:-translate-y-0.5 border border-sky-500/40',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 active:bg-slate-800',
    destructive:
      'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40 hover:bg-rose-500/30',
    icon:
      'p-2 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-sky-500/50 hover:bg-slate-800',
  };

  const showSuccessState = isSuccess || internalSuccess;

  return (
    <div className="relative inline-flex group/btn">
      <motion.button
        ref={btnRef}
        type={props.type || 'button'}
        disabled={disabled || isLoading}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={isMagnetic ? { x, y } : undefined}
        whileTap={!disabled && !isLoading ? { scale: 0.97 } : undefined}
        className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-200 select-none overflow-hidden outline-none ${
          shine ? 'shine-streak' : ''
        } ${sizeClasses[size]} ${variantClasses[variant]} ${
          disabled ? 'opacity-40 cursor-not-allowed hover:translate-y-0' : 'cursor-pointer'
        } ${className}`}
        {...props}
      >
        {/* Ripples */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/20 pointer-events-none animate-ping"
            style={{
              width: 40,
              height: 40,
              left: ripple.x - 20,
              top: ripple.y - 20,
            }}
          />
        ))}

        {/* Loading Spinner Morph */}
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-inherit" />
            <span className="opacity-80">Processing...</span>
          </span>
        ) : showSuccessState ? (
          <span className="inline-flex items-center gap-1.5 text-white animate-in zoom-in-75 duration-200">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{successText}</span>
          </span>
        ) : (
          <>
            <span className="relative z-10 flex items-center gap-2">
              {children}
            </span>

            {/* Sliding Arrow interaction: slides out to right, new one enters */}
            {withArrow && (
              <span className="relative overflow-hidden w-4 h-4 ml-1 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-4" />
                <ArrowRight className="w-4 h-4 absolute -translate-x-4 transition-transform duration-200 group-hover/btn:translate-x-0 opacity-80" />
              </span>
            )}
          </>
        )}
      </motion.button>

      {/* Tooltip for Disabled Button State */}
      {disabled && disabledTooltip && (
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/btn:flex flex-col items-center z-50">
          <span className="px-2.5 py-1 text-[11px] font-sans font-medium text-white bg-zinc-950 border border-zinc-700 rounded-lg shadow-xl whitespace-nowrap">
            {disabledTooltip}
          </span>
          <span className="w-2 h-2 -mt-1 rotate-45 bg-zinc-950 border-r border-b border-zinc-700" />
        </div>
      )}
    </div>
  );
}

export default Button;
