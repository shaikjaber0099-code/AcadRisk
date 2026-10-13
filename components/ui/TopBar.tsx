'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronRight,
  Sun,
  Moon,
  Filter,
  User,
  GraduationCap,
  Command,
} from 'lucide-react';
import { BranchBadge, BranchCode, BRANCH_CONFIGS } from './BranchBadge';

interface TopBarProps {
  onOpenCommandPalette?: () => void;
  selectedBranch?: string;
  onSelectBranch?: (branch: string) => void;
  hasHighRiskAlert?: boolean;
  className?: string;
}

export function TopBar({
  onOpenCommandPalette,
  selectedBranch = '',
  onSelectBranch,
  hasHighRiskAlert = true,
  className = '',
}: TopBarProps) {
  const pathname = usePathname();
  const [branchOpen, setBranchOpen] = useState(false);
  const [bellShaking, setBellShaking] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const triggerBellShake = () => {
    setBellShaking(true);
    setTimeout(() => setBellShaking(false), 800);
  };

  const toggleTheme = (e: React.MouseEvent) => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('dark', isLightMode);
  };

  // Derive breadcrumbs based on route
  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Apex University', href: '/' }];
    if (pathname.includes('/dashboard')) {
      crumbs.push({ label: 'Academic Dashboard', href: '/dashboard' });
    } else if (pathname.includes('/students')) {
      crumbs.push({ label: 'Student Directory', href: '/students' });
    } else if (pathname.includes('/student/')) {
      crumbs.push({ label: 'Student Directory', href: '/students' });
      crumbs.push({ label: 'Academic Dossier', href: '#' });
    } else if (pathname.includes('/analyze')) {
      crumbs.push({ label: 'Analyze Record', href: '/analyze' });
    } else if (pathname.includes('/batch')) {
      crumbs.push({ label: 'Batch Upload', href: '/batch' });
    } else if (pathname.includes('/student-view')) {
      crumbs.push({ label: 'Student Portal', href: '/student-view' });
    } else if (pathname.includes('/design-system')) {
      crumbs.push({ label: 'Design System', href: '/design-system' });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      className={`h-16 border-b border-zinc-800 bg-black/85 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between gap-4 select-none z-20 ${className}`}
    >
      {/* Left: Breadcrumbs with animated separators */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.label}>
            {idx > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            )}
            <Link
              href={crumb.href}
              className={`transition-colors truncate max-w-[140px] md:max-w-none ${
                idx === breadcrumbs.length - 1
                  ? 'text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Right: Search, Branch Switcher, AY Chip, Bell, Theme, Profile */}
      <div className="flex items-center gap-2.5 md:gap-3.5">
        {/* Global Search trigger bar (Cmd+K) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-xs transition-all shadow-sm"
          title="Search by roll number, name, phone (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-white" />
          <span className="font-sans">Search roll number or name...</span>
          <span className="flex items-center gap-0.5 text-[10px] font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-300">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Branch Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setBranchOpen(!branchOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 hover:border-zinc-500 transition-colors"
            title="Filter by Academic Branch"
          >
            <Filter className="w-3.5 h-3.5 text-white" />
            <span>{selectedBranch || 'All Branches'}</span>
          </button>

          {branchOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl p-1.5 z-50 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  onSelectBranch?.('');
                  setBranchOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                  !selectedBranch
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                All Departments
              </button>
              {['CSE', 'AIML', 'DS', 'ECE', 'MECH'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    onSelectBranch?.(b);
                    setBranchOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                    selectedBranch === b
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <BranchBadge branch={b} size="sm" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Academic Year & Semester Chip */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
          <span>AY 2026-27</span>
          <span className="opacity-40">•</span>
          <span>Sem V</span>
        </div>

        {/* Notification Bell with alert pulse */}
        <button
          type="button"
          onClick={triggerBellShake}
          className={`relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all ${
            bellShaking ? 'animate-bell-shake' : ''
          }`}
          aria-label="Academic alerts"
        >
          <Bell className="w-4 h-4" />
          {hasHighRiskAlert && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Portal Theme"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all"
        >
          {isLightMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 p-0.5 shadow-sm flex items-center justify-center font-bold text-xs text-white">
            DA
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
