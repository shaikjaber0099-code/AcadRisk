'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowUpDown,
  Download,
  Bell,
  Sparkles,
  UserPlus,
  Eye,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import CrestLogo from '@/components/ui/CrestLogo';
import TopBar from '@/components/ui/TopBar';
import BranchTabs from '@/components/ui/BranchTabs';
import BranchBadge from '@/components/ui/BranchBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import { RollNumberChip } from '@/components/ui/RollNumberInput';
import { PhoneCell } from '@/components/ui/PhoneInput';
import StudentIdCard, { StudentCardData } from '@/components/ui/StudentIdCard';
import Button from '@/components/ui/Button';
import SplitExportButton from '@/components/ui/SplitExportButton';
import CommandPalette from '@/components/ui/CommandPalette';
import SpeedDialFab from '@/components/ui/SpeedDialFab';
import BottomTabBar from '@/components/ui/BottomTabBar';

// Fallback high-fidelity sample students if database is hydrating
const SAMPLE_STUDENTS: StudentCardData[] = [
  {
    id: 's-1',
    name: 'Siddharth R. Rao',
    rollNo: '24R11A0543',
    branch: 'CSE',
    phone: '9876543210',
    attendance: 68.4,
    predictedScore: 56.2,
    riskLevel: 'High',
  },
  {
    id: 's-2',
    name: 'Diya Patel',
    rollNo: '24R11A0512',
    branch: 'AIML',
    phone: '9845123456',
    attendance: 84.0,
    predictedScore: 78.5,
    riskLevel: 'Medium',
  },
  {
    id: 's-3',
    name: 'Rohan Verma',
    rollNo: '24R11A0523',
    branch: 'DS',
    phone: '9712345678',
    attendance: 72.1,
    predictedScore: 61.8,
    riskLevel: 'Medium',
  },
  {
    id: 's-4',
    name: 'Ananya Reddy',
    rollNo: '24R11A0408',
    branch: 'ECE',
    phone: '9988776655',
    attendance: 94.6,
    predictedScore: 89.4,
    riskLevel: 'Low',
  },
  {
    id: 's-5',
    name: 'Vikram Joshi',
    rollNo: '24R11A0315',
    branch: 'MECH',
    phone: '9654321876',
    attendance: 64.0,
    predictedScore: 51.0,
    riskLevel: 'High',
  },
  {
    id: 's-6',
    name: 'Aarav Sharma',
    rollNo: '24R11A0501',
    branch: 'CSE',
    phone: '9811223344',
    attendance: 91.5,
    predictedScore: 88.0,
    riskLevel: 'Low',
  },
  {
    id: 's-7',
    name: 'Kavya Nair',
    rollNo: '24R11A0534',
    branch: 'AIML',
    phone: '9744556677',
    attendance: 70.2,
    predictedScore: 58.6,
    riskLevel: 'High',
  },
  {
    id: 's-8',
    name: 'Manish Kumar',
    rollNo: '24R11A0419',
    branch: 'ECE',
    phone: '9911882233',
    attendance: 86.0,
    predictedScore: 74.2,
    riskLevel: 'Medium',
  },
];

export default function StudentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [students, setStudents] = useState<StudentCardData[]>(SAMPLE_STUDENTS);
  const [loading, setLoading] = useState(true);

  // Fetch real students from API with fallback
  useEffect(() => {
    fetch('/api/students?limit=50')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.students && data.students.length > 0) {
          const mapped = data.students.map((s: any, idx: number) => {
            // Assign branch from classId or round-robin
            const branchMap: Record<string, string> = {
              'CS-A': 'CSE',
              'CS-B': 'AIML',
              'CS-C': 'DS',
              'EC-A': 'ECE',
              'ME-A': 'MECH',
            };
            const branch =
              branchMap[s.classId] ||
              ['CSE', 'AIML', 'DS', 'ECE', 'MECH'][idx % 5];
            return {
              id: s.id,
              name: s.name,
              rollNo: s.rollNo || `24R11A0${500 + idx}`,
              branch,
              phone: `98${String(10000000 + idx * 837).slice(0, 8)}`,
              attendance: Math.round(s.attendance || 80),
              predictedScore: Math.round(s.predictedScore || 70),
              riskLevel: s.riskLevel || 'LOW',
            };
          });
          setStudents(mapped);
        }
      })
      .catch(() => {
        // Fallback to sample data
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter and search
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchBranch =
        !selectedBranch ||
        s.branch.toUpperCase() === selectedBranch.toUpperCase();

      const matchRisk =
        riskFilter === 'ALL' ||
        s.riskLevel.toUpperCase() === riskFilter.toUpperCase();

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q)) ||
        s.branch.toLowerCase().includes(q);

      return matchBranch && matchRisk && matchQuery;
    });
  }, [students, selectedBranch, riskFilter, searchQuery]);

  // Branch counts for tabs
  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = {
      CSE: 0,
      AIML: 0,
      DS: 0,
      ECE: 0,
      MECH: 0,
    };
    students.forEach((s) => {
      if (counts[s.branch] !== undefined) counts[s.branch]++;
    });
    return counts;
  }, [students]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans pb-28 pt-20">
      {/* TopBar with University Identity */}
      <TopBar
        onOpenCommandPalette={() => setCmdOpen(true)}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                Student Directory
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-200 border border-slate-700">
                Semester V
              </span>
            </div>
            <h1 className="font-sans text-3xl font-bold text-white mt-1">
              Academic Cohort Dossiers
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Active student tracking across all 5 engineering branches with live risk scoring.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <SplitExportButton />
            <Link href="/analyze?mode=add">
              <Button variant="primary" size="sm" withArrow>
                <UserPlus className="w-4 h-4" />
                <span>Add Student</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Branch Filter Tabs Bar (with sliding pill + animated count badges) */}
        <BranchTabs
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
          counts={branchCounts}
        />

        {/* Filter & Search Bar Row */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          {/* Search by Roll Number, Name, or Phone */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Roll No (24R11A0543), student name, phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-sans"
            />
          </div>

          {/* Risk Level Filter Chips */}
          <div className="flex items-center gap-1.5 text-xs font-sans">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
              Risk Filter:
            </span>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  riskFilter === lvl
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Grid vs List View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Counter & Select All */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white"
            >
              {selectedIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-sky-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-600" />
              )}
              <span>Select All Cohort</span>
            </button>
            <span>Showing {filteredStudents.length} students</span>
          </div>

          {selectedBranch && (
            <span className="text-sky-300">
              Department: {selectedBranch}
            </span>
          )}
        </div>

        {/* View Mode: Grid (ID-Card Style with 3D Tilt) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((st) => (
              <div key={st.id} className="relative group">
                {/* Checkbox select */}
                <button
                  type="button"
                  onClick={() => toggleSelectOne(st.id)}
                  className="absolute top-3 left-3 z-20 p-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white"
                  title="Select for bulk action"
                >
                  {selectedIds.includes(st.id) ? (
                    <CheckSquare className="w-4 h-4 text-sky-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 opacity-60 group-hover:opacity-100" />
                  )}
                </button>

                <StudentIdCard student={st} />
              </div>
            ))}
          </div>
        )}

        {/* View Mode: List (Academic Table with Masked Phone and Sparklines) */}
        {viewMode === 'list' && (
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-400 font-mono">
                    <th className="py-3 px-4 w-10">
                      <button onClick={toggleSelectAll} className="p-0.5">
                        {selectedIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-sky-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4 font-semibold text-white">Student Name</th>
                    <th className="py-3 px-4 font-semibold text-white">Roll Number</th>
                    <th className="py-3 px-4 font-semibold text-white">Department</th>
                    <th className="py-3 px-4 font-semibold text-white">Contact (+91)</th>
                    <th className="py-3 px-4 font-semibold text-white">Attendance</th>
                    <th className="py-3 px-4 font-semibold text-white">Forecast Score</th>
                    <th className="py-3 px-4 font-semibold text-white">Risk Status</th>
                    <th className="py-3 px-4 font-semibold text-white text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredStudents.map((st) => (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                      onClick={() => toggleSelectOne(st.id)}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleSelectOne(st.id)}>
                          {selectedIds.includes(st.id) ? (
                            <CheckSquare className="w-4 h-4 text-sky-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-sans font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                        <Link href={`/student/${st.id}`}>{st.name}</Link>
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <RollNumberChip rollNo={st.rollNo} size="sm" highlightQuery={searchQuery} />
                      </td>
                      <td className="py-3 px-4">
                        <BranchBadge branch={st.branch} size="sm" />
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <PhoneCell phone={st.phone || '9876543210'} />
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-200 tabular-nums">
                        {st.attendance}%
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums text-sm">
                        {st.predictedScore}/100
                      </td>
                      <td className="py-3 px-4">
                        <RiskBadge level={st.riskLevel} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/student/${st.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500 hover:text-slate-950 font-semibold text-[11px] transition-all"
                        >
                          <span>Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="p-12 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center space-y-4 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-sky-400">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans text-lg font-bold text-white">
                No matching student dossiers found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                No students match your query or filters. Clear the current department or risk selection.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedBranch('');
                setRiskFilter('ALL');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </main>

      {/* Bulk Action Bar (Slides up when students are selected) */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-sky-500/30 shadow-2xl shadow-sky-500/10 rounded-2xl px-5 py-3 flex items-center gap-4 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-mono text-xs font-bold flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-xs font-semibold text-white font-sans">
                Students Selected
              </span>
            </div>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => alert(`Assigned Faculty Intervention to ${selectedIds.length} students`)}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assign Intervention</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => alert(`Dispatched Academic Notice to ${selectedIds.length} student records`)}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Send Batch Alert</span>
              </Button>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 font-sans"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Speed Dial & Command Palette */}
      <SpeedDialFab onSendNotice={() => alert('Broadcasting Dean Notice')} />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      <BottomTabBar />
    </div>
  );
}
