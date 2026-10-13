'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Sparkles,
  UploadCloud,
  FileQuestion,
  BellRing,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';
import CrestLogo from './CrestLogo';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, shortcut: 'G D' },
  { name: 'Students', href: '/students', icon: Users, shortcut: 'G S' },
  { name: 'Branches', href: '/branches', icon: GitBranch, shortcut: 'G B' },
  { name: 'Analyze Record', href: '/analyze', icon: Sparkles, shortcut: 'G A' },
  { name: 'Batch Upload', href: '/batch', icon: UploadCloud, shortcut: 'G U' },
  { name: 'Student View', href: '/student-view', icon: GraduationCap, shortcut: 'G V' },
  { name: 'Model Logic', href: '/how-it-works', icon: HelpCircle, shortcut: 'G H' },
  { name: 'Design System', href: '/design-system', icon: Settings, shortcut: 'G X', badge: 'NEW' },
];

interface SidebarNavProps {
  className?: string;
}

export function SidebarNav({ className = '' }: SidebarNavProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-zinc-800 bg-black/95 backdrop-blur-xl transition-all duration-300 ease-standard select-none z-30 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      } ${className}`}
    >
      {/* Sidebar Header: University Crest & Portal Identity */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-zinc-800 overflow-hidden">
        <Link href="/" className="flex items-center gap-3">
          <CrestLogo size={collapsed ? 36 : 40} showText={!collapsed} />
        </Link>

        {/* Collapse Rail Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Academic Year Chip in Sidebar */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="text-white font-medium">AY 2026-27</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
              Sem V
            </span>
          </div>
        </div>
      )}

      {/* Nav Items List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              {/* Active Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 rounded-xl bg-zinc-900 border border-zinc-700 shadow-sm"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon with tilt and scale on hover */}
              <div
                className={`relative z-10 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
              </div>

              {/* Staggered Label */}
              {!collapsed && (
                <span className="relative z-10 font-sans tracking-wide truncate flex-1">
                  {item.name}
                </span>
              )}

              {/* Badge if present */}
              {!collapsed && item.badge && (
                <span className="relative z-10 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-white text-black">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed rail showing shortcut */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl z-50 flex items-center gap-2">
                  <span>{item.name}</span>
                  {item.shortcut && (
                    <span className="font-mono text-[10px] text-zinc-300 bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">
                      {item.shortcut}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* University Portal Footer Notice in Rail */}
      {!collapsed && (
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-mono text-zinc-300 font-semibold">
              Dean of Academics
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Risk analysis cycle active for Midterm-II reviews.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

export default SidebarNav;
