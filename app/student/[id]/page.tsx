'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Printer,
  Sparkles,
  Sliders,
  Calendar,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  IdCard,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { simulateStudentPerformance } from '@/lib/engine';
import CrestLogo from '@/components/ui/CrestLogo';
import BranchBadge, { BranchCode } from '@/components/ui/BranchBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import { RollNumberChip } from '@/components/ui/RollNumberInput';
import { PhoneCell } from '@/components/ui/PhoneInput';
import Button from '@/components/ui/Button';
import SplitExportButton from '@/components/ui/SplitExportButton';
import ApplyRecommendationCard from '@/components/ui/ApplyRecommendationButton';
import TopBar from '@/components/ui/TopBar';
import SpeedDialFab from '@/components/ui/SpeedDialFab';
import BottomTabBar from '@/components/ui/BottomTabBar';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  // What-If Simulator State
  const [simAttendance, setSimAttendance] = useState<number>(75);
  const [simStudyHours, setSimStudyHours] = useState<number>(10);
  const [simAssignments, setSimAssignments] = useState<number>(70);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Applied recommendations state
  const [appliedRecs, setAppliedRecs] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/students/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        if (resData?.student) {
          setSimAttendance(resData.student.attendance);
          setSimStudyHours(resData.student.weeklyStudyHours);
          setSimAssignments(resData.student.assignmentCompletion);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Recalculate simulation whenever sliders change
  useEffect(() => {
    if (!data?.student) return;
    const sim = simulateStudentPerformance(
      {
        rollNo: data.student.rollNo,
        name: data.student.name,
        classId: data.student.classId,
        attendance: data.student.attendance,
        weeklyStudyHours: data.student.weeklyStudyHours,
        assignmentCompletion: data.student.assignmentCompletion,
        previousGpa: data.student.previousGpa,
        backlogs: data.student.backlogs,
        participation: data.student.participation,
        lateSubmissions: data.student.lateSubmissions,
        internalMarks: data.student.internalMarks,
        monthlyHistory: data.student.monthlyHistory,
      },
      {
        attendance: simAttendance,
        weeklyStudyHours: simStudyHours,
        assignmentCompletion: simAssignments,
      }
    );
    setSimulationResult(sim);
  }, [simAttendance, simStudyHours, simAssignments, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-slate-300 font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-slate-800 border-t-sky-400 rounded-full animate-spin mx-auto" />
          <h2 className="font-sans text-lg font-bold text-white">
            Opening Academic Dossier...
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Verifying OLS trajectory models & faculty advisory logs
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.student) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-center px-4 font-sans">
        <CrestLogo size={48} />
        <h2 className="font-sans text-2xl font-bold text-white mt-4">
          Student Record Not Found
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-6 max-w-md">
          The requested roll number or student ID is not registered in the active Semester V academic session.
        </p>
        <Link href="/students">
          <Button variant="primary" size="md">
            Return to Student Cohort
          </Button>
        </Link>
      </div>
    );
  }

  const { student, analysis } = data;
  const isHigh = analysis.riskLevel === 'HIGH';
  const isMed = analysis.riskLevel === 'MEDIUM';

  // Infer branch from student classId
  const branchMap: Record<string, BranchCode> = {
    'CS-A': 'CSE',
    'CS-B': 'AIML',
    'CS-C': 'DS',
    'EC-A': 'ECE',
    'ME-A': 'MECH',
  };
  const branch: BranchCode = branchMap[student.classId] || 'CSE';
  const phone = student.phone || '9876543210';

  const sectionTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'trend', label: 'OLS Trend' },
    { id: 'reasons', label: 'Risk Factors' },
    { id: 'whatif', label: 'What-If Sandbox' },
    { id: 'actions', label: 'Action Plan' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans pb-28 pt-20">
      <TopBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Branch-Aware Breadcrumbs & Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/students"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-400 text-slate-300 hover:text-white transition-all font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
              <span>Back to Cohort List</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="font-mono text-slate-400">{branch}</span>
            <span className="text-slate-600">/</span>
            <span className="font-sans font-bold text-white truncate max-w-[200px]">
              {student.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <SplitExportButton onPrint={() => window.print()} />
            <Link
              href={`/report/${student.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 text-xs font-bold transition-all shadow-md shadow-sky-500/20"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Dean Report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Student ID-Card Header */}
        <div className="student-id-card p-6 sm:p-8 rounded-idcard border border-slate-800/80 bg-slate-900/90 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Subtle watermark crest */}
          <div className="absolute right-4 bottom-2 opacity-5 pointer-events-none text-sky-400">
            <CrestLogo size={160} showText={false} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              {/* Photo / Initials Frame in Nordic Slate */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 border-2 border-sky-400/30 flex items-center justify-center font-sans text-3xl font-bold text-sky-300 shadow-md shrink-0 overflow-hidden">
                <span>
                  {student.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-sky-400" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <RollNumberChip rollNo={student.rollNo} size="md" />
                  <BranchBadge branch={branch} size="md" />
                  <RiskBadge level={analysis.riskLevel} size="md" showSubtext />
                </div>

                <h1 className="font-sans text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  {student.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-sans">
                  <span>{student.email}</span>
                  <span className="text-slate-600">•</span>
                  <PhoneCell phone={phone} />
                  <span className="text-slate-600">•</span>
                  <span className="text-sky-300 font-mono font-medium">
                    AY 2026-27 • Semester V
                  </span>
                </div>
              </div>
            </div>

            {/* Score Overview Gauges */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Current Score */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[120px]">
                <span className="text-[11px] text-slate-400 font-sans">Current Score</span>
                <div className="font-mono text-2xl font-bold text-white mt-0.5 tabular-nums">
                  {analysis.currentWeightedScore}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Weighted sum</span>
              </div>

              {/* High Contrast Exam Projection */}
              <div
                className={`p-4 rounded-2xl border text-center min-w-[150px] shadow-lg ${
                  isHigh
                    ? 'bg-rose-950/30 text-rose-300 border-rose-500/40'
                    : isMed
                    ? 'bg-amber-950/30 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-950/30 text-emerald-300 border-emerald-500/40'
                }`}
              >
                <span className={`text-[11px] font-medium ${isHigh ? 'text-rose-300/80' : isMed ? 'text-amber-300/80' : 'text-emerald-300/80'}`}>
                  Exam Projection
                </span>
                <div
                  className={`font-mono text-3xl font-extrabold mt-0.5 tabular-nums ${
                    isHigh ? 'text-rose-300' : isMed ? 'text-amber-300' : 'text-emerald-300'
                  }`}
                >
                  {analysis.projectedScore}
                  <span className="text-xs font-normal opacity-70">/100</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">
                  70% Trend + 30% Score
                </span>
              </div>
            </div>
          </div>

          {/* Supportive Early Warning Notice Board */}
          {analysis.earlyWarning && (
            <div className="mt-6 p-4 rounded-2xl notice-board-card text-xs space-y-1.5 animate-in fade-in-50 duration-200 bg-rose-950/20 border border-rose-500/30">
              <div className="font-sans font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Academic Support Advisory Notice:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-2 text-rose-200 font-sans">
                {analysis.earlyWarningReasons.map((reason: string, rIdx: number) => (
                  <li key={rIdx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sticky Section Tabs Bar */}
        <div className="sticky top-16 z-30 py-2 bg-[#0B0F19]/90 backdrop-blur-md">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto scrollbar-none">
            {sectionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSection(tab.id);
                  const el = document.getElementById(tab.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all font-sans ${
                  activeSection === tab.id
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Overview - Academic Telemetry Matrix */}
        <section id="overview" className="space-y-3">
          <h2 className="font-sans text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Academic Telemetry Parameters</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 font-sans">Attendance</span>
              <div
                className={`text-xl font-bold font-mono tabular-nums ${
                  student.attendance < 75 ? 'text-rose-400 underline decoration-rose-500/40' : 'text-slate-200'
                }`}
              >
                {student.attendance}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {student.attendance < 75 ? 'Critical (<75%)' : 'Compliant'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 font-sans">Weekly Study</span>
              <div className="text-xl font-bold font-mono text-slate-200 tabular-nums">
                {student.weeklyStudyHours}h
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Target: 15h–20h</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 font-sans">Assignments</span>
              <div className="text-xl font-bold font-mono text-slate-200 tabular-nums">
                {student.assignmentCompletion}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Submission rate</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 font-sans">Prior Sem GPA</span>
              <div className="text-xl font-bold font-mono text-slate-200 tabular-nums">
                {student.previousGpa}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">10.0 scale</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 font-sans">Active Backlogs</span>
              <div
                className={`text-xl font-bold font-mono tabular-nums ${
                  student.backlogs > 0 ? 'text-rose-400 font-extrabold' : 'text-slate-400'
                }`}
              >
                {student.backlogs}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {student.backlogs > 0 ? 'Pending Remid' : 'Clear'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 font-sans">Late Submissions</span>
              <div className="text-xl font-bold font-mono text-slate-200 tabular-nums">
                {student.lateSubmissions}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Deduction count</span>
            </div>
          </div>
        </section>

        {/* Section 2: Trend & Section 3: Reason Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* OLS Trend Trajectory Chart (Nordic Slate & Frost Blue) */}
          <section
            id="trend"
            className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  <span>6-Month Trajectory & OLS Projection</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Ordinary Least Squares line projected toward final exam month
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold tabular-nums text-sky-300">
                  Slope: {analysis.trend.slope > 0 ? '+' : ''}
                  {analysis.trend.slope} pts/mo
                </span>
                <div className="text-[10px] text-slate-500 font-mono">
                  R² = {analysis.trend.rSquared}
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysis.trend.monthlyPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                  <YAxis domain={[20, 100]} stroke="#64748B" fontSize={11} />
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
                    dataKey="actual"
                    name="Observed Marks"
                    stroke="#38BDF8"
                    strokeWidth={3}
                    dot={{ fill: '#38BDF8', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    name="OLS Exam Forecast"
                    stroke="#BAE6FD"
                    strokeDasharray="5 5"
                    strokeWidth={2.5}
                    dot={{ fill: '#BAE6FD', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Model: y = {analysis.trend.slope}x + {analysis.trend.intercept}</span>
              <span className="text-sky-300 font-bold">
                Forecast Score: {analysis.projectedScore}
              </span>
            </div>
          </section>

          {/* Sequential Reason Bars (Explainability) */}
          <section
            id="reasons"
            className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-sm"
          >
            <div>
              <h3 className="font-sans text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-400" />
                <span>Primary Risk Factors (Sequential Attribution)</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Negative drivers ranked by gap from cohort benchmark
              </p>
            </div>

            <div className="space-y-3">
              {analysis.explainability.topNegativeDrivers.map((driver: any, dIdx: number) => (
                <motion.div
                  key={dIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dIdx * 0.12, duration: 0.24 }}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      Factor #{dIdx + 1}: {driver.factor}
                    </span>
                    <span className="font-mono text-rose-400 font-bold tabular-nums">
                      -{driver.gapScore} pts gap
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {driver.description}
                  </p>
                  <div className="text-[11px] text-sky-300 font-medium pt-1">
                    Suggestion: {driver.actionHint}
                  </div>
                </motion.div>
              ))}

              {analysis.explainability.topNegativeDrivers.length === 0 && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                  Student demonstrates compliant performance across all key academic benchmarks.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Section 4: What-If Sandbox with Ghost Marker */}
        <section
          id="whatif"
          className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/30 mb-2 font-mono">
                <Sliders className="w-3.5 h-3.5" />
                <span>What-If Sandbox Simulation</span>
              </div>
              <h3 className="font-sans text-2xl font-bold text-white">
                Live Trajectory Recalculation
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Adjust student attendance, weekly study hours, and assignment rates. Notice the ghost marker marking original recorded baseline.
              </p>
            </div>

            {simulationResult && (
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Baseline</span>
                  <div className="text-base font-bold font-mono text-slate-300 tabular-nums">
                    {simulationResult.originalProjectedScore}
                  </div>
                </div>
                <span className="text-sky-400 font-bold">→</span>
                <div className="p-3 rounded-xl border border-sky-400/40 bg-sky-500/10 text-sky-300 text-center shadow-lg shadow-sky-500/10">
                  <span className="text-[10px] uppercase font-mono font-bold text-sky-400">Simulated</span>
                  <div className="text-xl font-extrabold font-mono tabular-nums text-white">
                    {simulationResult.simulatedProjectedScore}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    {simulationResult.projectedDelta > 0
                      ? `+${simulationResult.projectedDelta}`
                      : simulationResult.projectedDelta}{' '}
                    pts
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sliders Grid with Ghost Markers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Slider 1: Attendance */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Attendance Target</span>
                <span className="font-mono font-bold text-sky-300 tabular-nums">
                  {simAttendance}%
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={40}
                  max={100}
                  step={1}
                  value={simAttendance}
                  onChange={(e) => setSimAttendance(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                {/* Ghost marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-sky-400/70 rounded pointer-events-none shadow-sm shadow-sky-400/40"
                  style={{
                    left: `${((student.attendance - 40) / 60) * 100}%`,
                  }}
                  title={`Original: ${student.attendance}%`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Original: {student.attendance}%</span>
                <span>Threshold: 75%</span>
              </div>
            </div>

            {/* Slider 2: Weekly Study Hours */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Weekly Study Hours</span>
                <span className="font-mono font-bold text-sky-300 tabular-nums">
                  {simStudyHours}h / wk
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={2}
                  max={30}
                  step={1}
                  value={simStudyHours}
                  onChange={(e) => setSimStudyHours(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                {/* Ghost marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-sky-400/70 rounded pointer-events-none shadow-sm shadow-sky-400/40"
                  style={{
                    left: `${((student.weeklyStudyHours - 2) / 28) * 100}%`,
                  }}
                  title={`Original: ${student.weeklyStudyHours}h`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Original: {student.weeklyStudyHours}h</span>
                <span>Target: 15h–20h</span>
              </div>
            </div>

            {/* Slider 3: Assignment Completion */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Assignment Completion</span>
                <span className="font-mono font-bold text-sky-300 tabular-nums">
                  {simAssignments}%
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={30}
                  max={100}
                  step={1}
                  value={simAssignments}
                  onChange={(e) => setSimAssignments(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                {/* Ghost marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-sky-400/70 rounded pointer-events-none shadow-sm shadow-sky-400/40"
                  style={{
                    left: `${((student.assignmentCompletion - 30) / 70) * 100}%`,
                  }}
                  title={`Original: ${student.assignmentCompletion}%`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Original: {student.assignmentCompletion}%</span>
                <span>Benchmark: 80%</span>
              </div>
            </div>
          </div>

          {/* Simulation Result Output & Reset */}
          {simulationResult && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                <span className="font-sans font-bold text-white">Projected Effect: </span>
                {simulationResult.simulationSummary}
              </div>

              <div className="flex items-center gap-3">
                <RiskBadge
                  level={simulationResult.simulatedRiskLevel}
                  size="md"
                  showSubtext
                />
                <button
                  type="button"
                  onClick={() => {
                    setSimAttendance(student.attendance);
                    setSimStudyHours(student.weeklyStudyHours);
                    setSimAssignments(student.assignmentCompletion);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Reset sliders to baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Section 5: Prioritized Pedagogical Action List */}
        <section id="actions" className="space-y-4">
          <div>
            <h3 className="font-sans text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-400" />
              <span>Prioritized Pedagogical Action List</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Deterministic, explainable interventions tailored to the student's risk drivers. Click "Apply" to commit into the action plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.recommendations.map((rec: any, idx: number) => {
              const recId = `rec-${idx}`;
              return (
                <div key={idx} className="space-y-3">
                  <ApplyRecommendationCard
                    id={recId}
                    title={rec.title}
                    impact={rec.expectedImpact}
                    category={rec.category}
                    onApply={(id) => setAppliedRecs((prev) => [...prev, id])}
                  />

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs backdrop-blur-sm">
                    <p className="text-slate-300 font-sans leading-relaxed">
                      {rec.rationale}
                    </p>
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Action Checklist:
                      </span>
                      {rec.actionItems.map((item: string, iIdx: number) => (
                        <div key={iIdx} className="flex items-start gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <SpeedDialFab onSendNotice={() => alert('Dean Notice Dispatched')} />
      <BottomTabBar />
    </div>
  );
}
