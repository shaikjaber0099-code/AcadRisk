'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  UploadCloud,
  GraduationCap,
} from 'lucide-react';

export function BottomTabBar() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Analyze', href: '/analyze', icon: Sparkles },
    { name: 'Batch', href: '/batch', icon: UploadCloud },
    { name: 'Student', href: '/student-view', icon: GraduationCap },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-zinc-800 backdrop-blur-xl px-2 py-1.5 pb-safe"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {/* Active bubble */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveBubble"
                  className="absolute inset-0 rounded-xl bg-zinc-900 border border-zinc-700"
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                />
              )}

              <Icon className="w-5 h-5 relative z-10" />
              <span className="text-[10px] font-sans font-medium mt-0.5 relative z-10">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomTabBar;
