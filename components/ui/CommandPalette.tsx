'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  ArrowRight,
  User,
  LayoutDashboard,
  Sparkles,
  UploadCloud,
  GraduationCap,
  AlertTriangle,
  History,
  X,
} from 'lucide-react';
import { RollNumberChip } from './RollNumberInput';
import { BranchBadge } from './BranchBadge';
import { RiskBadge } from './RiskBadge';

export interface CommandStudent {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  phone?: string;
  riskLevel: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  students?: CommandStudent[];
}

export function CommandPalette({ isOpen, onClose, students = [] }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Default mock students if none passed
  const allStudents = students.length > 0 ? students : [
    { id: '1', name: 'Aarav Sharma', rollNo: '24R11A0501', branch: 'CSE', phone: '9876543210', riskLevel: 'Low' },
    { id: '2', name: 'Diya Patel', rollNo: '24R11A0512', branch: 'AIML', phone: '9845123456', riskLevel: 'Medium' },
    { id: '3', name: 'Rohan Verma', rollNo: '24R11A0523', branch: 'DS', phone: '9712345678', riskLevel: 'High' },
    { id: '4', name: 'Ananya Reddy', rollNo: '24R11A0408', branch: 'ECE', phone: '9988776655', riskLevel: 'Low' },
    { id: '5', name: 'Vikram Joshi', rollNo: '24R11A0315', branch: 'MECH', phone: '9654321876', riskLevel: 'High' },
    { id: '6', name: 'Siddharth Rao', rollNo: '24R11A0543', branch: 'CSE', phone: '9876512340', riskLevel: 'High' },
  ];

  // Quick navigation pages
  const quickPages = [
    { label: 'Academic Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analyze Student Record', href: '/analyze', icon: Sparkles },
    { label: 'Batch CSV Upload', href: '/batch', icon: UploadCloud },
    { label: 'Student Self-View', href: '/student-view', icon: GraduationCap },
    { label: 'Show High-Risk ECE Students', href: '/dashboard?branch=ECE&risk=High', icon: AlertTriangle },
  ];

  // Filter students by name, roll number, or phone
  const filteredStudents = query.trim()
    ? allStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.rollNo.toLowerCase().includes(query.toLowerCase()) ||
          (s.phone && s.phone.includes(query)) ||
          s.branch.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredPages = query.trim()
    ? quickPages.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
    : quickPages;

  // Keyboard shortcut listener for Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectStudent = (id: string) => {
    onClose();
    router.push(`/student/${id}`);
  };

  const handleSelectPage = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-black">
              <Search className="w-5 h-5 text-white shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search by Roll No (24R11A0543), student name, phone, or branch..."
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none font-sans"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800">
                ESC
              </span>
            </div>

            {/* Content List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
              {/* Student Results */}
              {filteredStudents.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                    Matching Students ({filteredStudents.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredStudents.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => handleSelectStudent(st.id)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
                            {st.name[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors font-sans">
                              {st.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <RollNumberChip
                                rollNo={st.rollNo}
                                size="sm"
                                highlightQuery={query}
                              />
                              <BranchBadge branch={st.branch} size="sm" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <RiskBadge level={st.riskLevel} size="sm" />
                          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Navigation Pages */}
              <div>
                <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-white" />
                  <span>Quick Actions & Views</span>
                </div>
                <div className="space-y-1 mt-1">
                  {filteredPages.map((pg) => {
                    const Icon = pg.icon;
                    return (
                      <div
                        key={pg.label}
                        onClick={() => handleSelectPage(pg.href)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium text-zinc-200 group-hover:text-white font-sans">
                            {pg.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300">
                          Jump ↵
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-2 border-t border-zinc-800 bg-black flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>ESC Close</span>
              </div>
              <span className="text-zinc-300">Apex Institute Academic Affairs</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
