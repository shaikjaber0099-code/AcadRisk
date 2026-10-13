'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UserPlus, Sparkles, UploadCloud, Bell } from 'lucide-react';
import Link from 'next/link';

interface SpeedDialFabProps {
  className?: string;
  onSendNotice?: () => void;
}

export function SpeedDialFab({ className = '', onSendNotice }: SpeedDialFabProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      label: 'Add Student',
      icon: UserPlus,
      href: '/analyze?mode=add',
      color: 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800',
    },
    {
      label: 'Analyze Record',
      icon: Sparkles,
      href: '/analyze',
      color: 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800',
    },
    {
      label: 'Upload CSV Batch',
      icon: UploadCloud,
      href: '/batch',
      color: 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800',
    },
    {
      label: 'Send Academic Notice',
      icon: Bell,
      onClick: () => {
        setOpen(false);
        onSendNotice?.();
      },
      color: 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800',
    },
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end ${className}`}>
      {/* Expanded Actions Stack */}
      <AnimatePresence>
        {open && (
          <div className="flex flex-col items-end gap-3 mb-3">
            {actions.map((act, index) => {
              const Icon = act.icon;
              return (
                <motion.div
                  key={act.label}
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ delay: (actions.length - 1 - index) * 0.04, duration: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-medium text-white shadow-xl whitespace-nowrap font-sans">
                    {act.label}
                  </span>

                  {act.href ? (
                    <Link
                      href={act.href}
                      onClick={() => setOpen(false)}
                      className={`w-11 h-11 rounded-full ${act.color} text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border border-zinc-700`}
                      title={act.label}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={act.onClick}
                      className={`w-11 h-11 rounded-full ${act.color} text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border border-zinc-700`}
                      title={act.label}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Quick Campus Actions Speed Dial"
        aria-expanded={open}
        className="relative w-14 h-14 rounded-full bg-white text-black shadow-xl hover:bg-zinc-200 flex items-center justify-center border-2 border-white hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <motion.div
          animate={{ rotate: open ? 135 : 0 }}
          transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </motion.div>
      </button>
    </div>
  );
}

export default SpeedDialFab;
