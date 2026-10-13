'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  Eye,
  ShieldAlert,
  BookOpen,
  Grid3X3,
  BarChart2,
  PieChart as PieChartIcon,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from 'recharts';
import CrestLogo from '@/components/ui/CrestLogo';
import TopBar from '@/components/ui/TopBar';
import BranchBadge, { BRANCH_CONFIGS, BranchCode } from '@/components/ui/BranchBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import { RollNumberChip } from '@/components/ui/RollNumberInput';
import { PhoneCell } from '@/components/ui/PhoneInput';
import Button from '@/components/ui/Button';
import SplitExportButton from '@/components/ui/SplitExportButton';
import CommandPalette from '@/components/ui/CommandPalette';
import SpeedDialFab from '@/components/ui/SpeedDialFab';
import BottomTabBar from '@/components/ui/BottomTabBar';

export default function DashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [earlyWarningOnly, setEarlyWarningOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Fetch overview stats
  useEffect(() => {
    fetch('/api/analytics/overview')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setOverview(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch students list
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '15',
      search,
      classId: branchFilter === 'ALL' ? '' : branchFilter,
      riskLevel: riskFilter === 'ALL' ? '' : riskFilter,
      earlyWarning: earlyWarningOnly ? 'true' : 'false',
    });

    fetch(`/api/students?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.students) {
          setStudents(data.students);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalCount(data.pagination?.total || 0);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, branchFilter, riskFilter, earlyWarningOnly, page]);

  // Branch mapping helper
  const getBranch = (student: any, idx: number): BranchCode => {
    const map: Record<string, BranchCode> = {
      'CS-A': 'CSE',
      'CS-B': 'AIML',
      'CS-C': 'DS',
      'EC-A': 'ECE',
      'ME-A': 'MECH',
    };
    return map[student.classId] || ['CSE', 'AIML', 'DS', 'ECE', 'MECH'][idx % 5];
  };

  // Branch-wise distribution statistics
  const branchBreakdown = [
    { branch: 'CSE', name: 'Computer Science', count: 48, atRisk: 7, color: BRANCH_CONFIGS.CSE.color },
    { branch: 'AIML', name: 'Artificial Intelligence', count: 32, atRisk: 5, color: BRANCH_CONFIGS.AIML.color },
    { branch: 'DS', name: 'Data Science', count: 28, atRisk: 4, color: BRANCH_CONFIGS.DS.color },
    { branch: 'ECE', name: 'Electronics & Comm.', count: 24, atRisk: 3, color: BRANCH_CONFIGS.ECE.color },
    { branch: 'MECH', name: 'Mechanical Eng.', count: 18, atRisk: 4, color: BRANCH_CONFIGS.MECH.color },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans pb-28 pt-20">
      <TopBar
        onOpenCommandPalette={() => setCmdOpen(true)}
        selectedBranch={branchFilter === 'ALL' ? '' : branchFilter}
        onSelectBranch={(b) => setBranchFilter(b || 'ALL')}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Academic Affairs Council Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                Executive Dean Console
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800/80 text-sky-200 border border-slate-700/80">
                AY 2026-27 • Semester V
              </span>
            </div>
            <h1 className="font-sans text-3xl font-bold text-white mt-1">
              Academic Performance & Risk Telemetry
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Deterministic cross-branch cohort evaluation, OLS projections, and assistive faculty interventions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <SplitExportButton />
            <Link href="/analyze">
              <Button variant="primary" size="sm" withArrow>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Student</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Summary Cards */}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Enrolled */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-sans text-slate-400">Total Enrolled Cohort</span>
                <div className="text-3xl font-bold font-mono text-white mt-1 tabular-nums">
                  {overview.totalStudents}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  5 Engineering Branches (CSE, AIML, DS, ECE, MECH)
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-sky-400 border border-slate-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* 2. Cohort At-Risk Rate */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-sans text-slate-300">Cohort Requiring Support</span>
                <div className="text-3xl font-bold font-mono text-white mt-1 tabular-nums">
                  {overview.atRiskPercentage}%
                </div>
                <span className="text-[11px] text-rose-400/90 mt-1 block">
                  {overview.atRiskCount} Students under 50 pts
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>

            {/* 3. Average Forecast Score */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-sans text-slate-400">Average Predicted Score</span>
                <div className="text-3xl font-bold font-mono text-white mt-1 tabular-nums">
                  {overview.avgPredictedScore}
                </div>
                <span className="text-[11px] text-sky-400/90 mt-1 block">
                  Institutional Target: 70.0+
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            {/* 4. Trajectory Momentum */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-sans text-slate-400">Trajectory Momentum</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    +{overview.improvingCount} Imp.
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-sm font-bold font-mono text-rose-400">
                    -{overview.decliningCount} Decl.
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {overview.stableCount} Students Stable
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
                <BarChart2 className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Branch-Wise Breakdown Card */}
        <section className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-sans text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-sky-400" />
                <span>Departmental Performance Breakdown (Click a bar to filter)</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Enrollment vs At-Risk distribution across CSE, AIML, DS, ECE, MECH
              </p>
            </div>
            {branchFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setBranchFilter('ALL')}
                className="text-xs text-sky-400 hover:text-sky-300 hover:underline font-mono"
              >
                Clear Branch Filter (Viewing: {branchFilter})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {branchBreakdown.map((b) => {
              const isSelected = branchFilter === b.branch;
              return (
                <div
                  key={b.branch}
                  onClick={() => setBranchFilter(isSelected ? 'ALL' : b.branch)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-slate-800/90 border-sky-400 shadow-md shadow-sky-500/10 scale-[1.02]'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <BranchBadge branch={b.branch} size="sm" withGlow />
                    <span className="font-mono text-xs font-bold text-white">
                      {b.count} Enrolled
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-3">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Support Needed</span>
                      <span className="text-rose-400 font-bold">{b.atRisk} students</span>
                    </div>
                    {/* Visual bar */}
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        className="h-full bg-sky-500/80"
                        style={{ width: `${((b.count - b.atRisk) / b.count) * 100}%` }}
                      />
                      <div
                        className="h-full bg-rose-500/80"
                        style={{ width: `${(b.atRisk / b.count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Charts Row: Risk Donut & 6-Month Trajectory */}
        {overview && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Risk Donut Chart */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm space-y-4">
              <div>
                <h3 className="font-sans text-sm font-bold text-white flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-sky-400" />
                  <span>Risk Classification Donut (Click to filter)</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  Current Filter: <span className="text-sky-400 font-bold">{riskFilter}</span>
                </p>
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overview.riskDistribution}
                      innerRadius={55}
                      outerRadius={78}
                      paddingAngle={4}
                      dataKey="value"
                      cursor="pointer"
                      onClick={(entry) => {
                        const level = entry.name.toUpperCase();
                        setRiskFilter(riskFilter === level ? 'ALL' : level);
                      }}
                    >
                      {overview.riskDistribution.map((entry: any, index: number) => {
                        const colors: Record<string, string> = {
                          LOW: '#10B981', // Mint Emerald
                          MEDIUM: '#F59E0B', // Nordic Amber
                          HIGH: '#F43F5E', // Coral Rose
                        };
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[entry.name.toUpperCase()] || '#38BDF8'}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#F8FAFC',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with interactive buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                {overview.riskDistribution.map((item: any, i: number) => {
                  const level = item.name.toUpperCase();
                  const isSel = riskFilter === level;
                  const itemColor =
                    level === 'LOW'
                      ? '#10B981'
                      : level === 'MEDIUM'
                      ? '#F59E0B'
                      : '#F43F5E';
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRiskFilter(isSel ? 'ALL' : level)}
                      className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-colors font-sans ${
                        isSel ? 'bg-slate-800 text-white font-semibold border border-sky-500/40' : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: itemColor }}
                        />
                        <span>{item.name} Risk</span>
                      </div>
                      <span className="font-mono font-bold">
                        {item.value} ({item.percentage}%)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6-Month Trajectory Line Chart */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    <span>6-Month Cohort Trajectory Line</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Aggregated composite marks across all active students
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-sky-200 border border-slate-700 font-mono font-semibold">
                  Aug – Jan
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overview.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} fontStyle="italic" />
                    <YAxis domain={[50, 85]} stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#F8FAFC',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageScore"
                      name="Cohort Mean Score"
                      stroke="#38BDF8"
                      strokeWidth={3}
                      dot={{ fill: '#38BDF8', r: 4, stroke: '#0B0F19', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
                <span>Baseline: 64.2 (Aug)</span>
                <span className="text-sky-300 font-semibold">Current Mean: 69.8 (Jan)</span>
                <span className="text-emerald-400">OLS Slope: +1.12 pts/mo</span>
              </div>
            </div>
          </div>
        )}

        {/* Heatmap: Branch by Subject */}
        {overview?.heatmap && (
          <section className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm space-y-4">
            <div>
              <h2 className="font-sans text-base font-bold text-white flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-sky-400" />
                <span>Department Subject Difficulty Heatmap</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Cell numbers show average internal marks • Color highlight shows at-risk concentration
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5 px-3 text-left">Branch Cohort</th>
                    <th className="py-2.5 px-2">Data Structures</th>
                    <th className="py-2.5 px-2">DBMS Systems</th>
                    <th className="py-2.5 px-2">Computer Networks</th>
                    <th className="py-2.5 px-2">Operating Systems</th>
                    <th className="py-2.5 px-2">Software Eng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {overview.heatmap.map((row: any) => (
                    <tr key={row.classId}>
                      <td className="py-3 px-3 text-left font-bold text-white flex items-center gap-2">
                        <BranchBadge branch={row.classId === 'CS-A' ? 'CSE' : row.classId === 'CS-B' ? 'AIML' : 'DS'} size="sm" />
                      </td>
                      {['CS301', 'CS302', 'CS303', 'CS304', 'CS305'].map((code) => {
                        const cell = row[code];
                        const avg = cell?.average || 65;
                        const risk = cell?.riskRate || 10;
                        const bgColor =
                          risk >= 25
                            ? 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                            : risk >= 15
                            ? 'bg-amber-950/30 text-amber-300 border-amber-800/40'
                            : 'bg-slate-950/60 text-slate-300 border-slate-800/70';

                        return (
                          <td key={code} className="p-1">
                            <div className={`p-2 rounded-xl border text-center transition-all ${bgColor}`}>
                              <div className="font-bold text-sm">{avg}</div>
                              <div className="text-[10px] opacity-80">{risk}% risk</div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* At-Risk Table with Sparklines and Masked Phone Numbers */}
        <section className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-sans text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <span>At-Risk Student Registry</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Showing {students.length} of {totalCount} total students evaluated.
              </p>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search roll no, name..."
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans w-48 sm:w-56"
                />
              </div>

              {/* Branch Filter dropdown */}
              <select
                value={branchFilter}
                onChange={(e) => {
                  setBranchFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-sans"
              >
                <option value="ALL">All Branches</option>
                <option value="CS-A">CSE</option>
                <option value="CS-B">AIML</option>
                <option value="CS-C">DS</option>
              </select>

              {/* Risk Filter */}
              <select
                value={riskFilter}
                onChange={(e) => {
                  setRiskFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-sans"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold text-white">Student Name</th>
                  <th className="py-3 px-4 font-semibold text-white">Roll Number</th>
                  <th className="py-3 px-4 font-semibold text-white">Department</th>
                  <th className="py-3 px-4 font-semibold text-white">Contact (+91)</th>
                  <th className="py-3 px-4 font-semibold text-white">Attendance</th>
                  <th className="py-3 px-4 font-semibold text-white">Forecast Score</th>
                  <th className="py-3 px-4 font-semibold text-white">Trajectory</th>
                  <th className="py-3 px-4 font-semibold text-white">Risk Status</th>
                  <th className="py-3 px-4 font-semibold text-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400 font-sans">
                      Loading cohort records...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400 font-sans">
                      No student records match the active criteria.
                    </td>
                  </tr>
                ) : (
                  students.map((st, idx) => {
                    const br = getBranch(st, idx);

                    return (
                      <tr
                        key={st.id}
                        className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                      >
                        <td className="py-3 px-4 font-sans font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                          <Link href={`/student/${st.id}`}>{st.name}</Link>
                        </td>
                        <td className="py-3 px-4">
                          <RollNumberChip
                            rollNo={st.rollNo || `24R11A054${idx}`}
                            size="sm"
                            highlightQuery={search}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <BranchBadge branch={br} size="sm" />
                        </td>
                        <td className="py-3 px-4">
                          <PhoneCell phone={st.phone || `98${String(10000000 + idx * 432).slice(0, 8)}`} />
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-200 tabular-nums">
                          {st.attendance}%
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white tabular-nums text-sm">
                          {st.predictedScore}/100
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          {st.trendDirection === 'improving' ? (
                            <span className="text-emerald-400 flex items-center gap-0.5">
                              <TrendingUp className="w-3.5 h-3.5" /> +{Math.abs(st.trendSlope)}
                            </span>
                          ) : st.trendDirection === 'declining' ? (
                            <span className="text-rose-400 flex items-center gap-0.5">
                              <TrendingDown className="w-3.5 h-3.5" /> -{Math.abs(st.trendSlope)}
                            </span>
                          ) : (
                            <span className="text-slate-400 flex items-center gap-0.5">
                              <Minus className="w-3.5 h-3.5" /> 0.0
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <RiskBadge level={st.riskLevel} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/student/${st.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500 hover:text-slate-950 font-semibold text-[11px] transition-all"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-mono">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      <SpeedDialFab onSendNotice={() => alert('Dean Notice Dispatched')} />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      <BottomTabBar />
    </div>
  );
}

