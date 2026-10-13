'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  IdCard,
  User,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import CrestLogo from '@/components/ui/CrestLogo';
import TopBar from '@/components/ui/TopBar';
import BranchBadge, { BranchCode, BRANCH_CONFIGS } from '@/components/ui/BranchBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import { RollNumberInput, RollNumberChip, ROLL_NUMBER_REGEX } from '@/components/ui/RollNumberInput';
import { PhoneInput, PhoneCell, INDIAN_PHONE_REGEX } from '@/components/ui/PhoneInput';
import StudentIdCard from '@/components/ui/StudentIdCard';
import Button from '@/components/ui/Button';
import SpeedDialFab from '@/components/ui/SpeedDialFab';
import BottomTabBar from '@/components/ui/BottomTabBar';

export default function AnalyzePage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Student Identity
  const [name, setName] = useState('Siddharth R. Rao');
  const [rollNo, setRollNo] = useState('24R11A0543');
  const [branch, setBranch] = useState<BranchCode>('CSE');
  const [phone, setPhone] = useState('9876543210');

  // Step 2: Academic Telemetry
  const [attendance, setAttendance] = useState<number>(68);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState<number>(6);
  const [assignmentCompletion, setAssignmentCompletion] = useState<number>(55);
  const [internalMarks, setInternalMarks] = useState<number>(48);
  const [previousGpa, setPreviousGpa] = useState<number>(5.4);
  const [backlogs, setBacklogs] = useState<number>(1);
  const [participation, setParticipation] = useState<number>(2);
  const [lateSubmissions, setLateSubmissions] = useState<number>(3);

  // Analysis result
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation
  const isRollValid = ROLL_NUMBER_REGEX.test(rollNo);
  const isPhoneValid = INDIAN_PHONE_REGEX.test(phone.replace(/\D/g, ''));
  const isStep1Valid = name.trim().length >= 2 && isRollValid && isPhoneValid;

  const handlePreset = (type: 'atRisk' | 'average' | 'highAchiever') => {
    if (type === 'atRisk') {
      setName('Kunal Deshmukh');
      setRollNo('24R11A0524');
      setBranch('CSE');
      setPhone('9876543210');
      setAttendance(62);
      setWeeklyStudyHours(5);
      setAssignmentCompletion(48);
      setInternalMarks(42);
      setPreviousGpa(4.9);
      setBacklogs(2);
      setParticipation(2);
      setLateSubmissions(4);
    } else if (type === 'average') {
      setName('Ritika Sen');
      setRollNo('24R11A0512');
      setBranch('AIML');
      setPhone('9845123456');
      setAttendance(79);
      setWeeklyStudyHours(11);
      setAssignmentCompletion(76);
      setInternalMarks(66);
      setPreviousGpa(7.1);
      setBacklogs(0);
      setParticipation(3);
      setLateSubmissions(1);
    } else {
      setName('Ananya Sharma');
      setRollNo('24R11A0408');
      setBranch('ECE');
      setPhone('9988776655');
      setAttendance(95);
      setWeeklyStudyHours(22);
      setAssignmentCompletion(96);
      setInternalMarks(88);
      setPreviousGpa(9.2);
      setBacklogs(0);
      setParticipation(5);
      setLateSubmissions(0);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        rollNo,
        classId: branch === 'CSE' ? 'CS-A' : branch === 'AIML' ? 'CS-B' : 'CS-C',
        attendance,
        weeklyStudyHours,
        assignmentCompletion,
        internalMarks,
        previousGpa,
        backlogs,
        participation,
        lateSubmissions,
      };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Academic risk analysis failed');
      } else {
        setResult(data.analysis);
      }
    } catch {
      setError('Network communication failed with prediction engine');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = [
    { num: 1, title: 'Identity', desc: 'Name, Roll No, Branch, Phone' },
    { num: 2, title: 'Academics', desc: 'Attendance, Marks, GPA' },
    { num: 3, title: 'Review Dossier', desc: 'ID Card Verification & Score' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans pb-28 pt-20">
      <TopBar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex-1">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                Student Intake & Analysis
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                AY 2026-27
              </span>
            </div>
            <h1 className="font-sans text-3xl font-bold text-white mt-1">
              Add & Analyze Student Dossier
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Deterministic 3-step evaluation following Geethanjali College of Engineering and Technology Office of Academic Affairs protocol.
            </p>
          </div>

          {/* Quick Archetype Presets */}
          <div className="flex items-center gap-2 flex-wrap font-sans">
            <span className="text-xs text-slate-400 font-mono">Archetype:</span>
            <button
              type="button"
              onClick={() => handlePreset('atRisk')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
            >
              At-Risk
            </button>
            <button
              type="button"
              onClick={() => handlePreset('average')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
            >
              Average
            </button>
            <button
              type="button"
              onClick={() => handlePreset('highAchiever')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
            >
              Top Honors
            </button>
          </div>
        </div>

        {/* 3-Step Stepper & Progress Bar */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {stepLabels.map((st) => {
              const isPast = currentStep > st.num;
              const isCurr = currentStep === st.num;
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => {
                    if (st.num === 1 || (st.num === 2 && isStep1Valid) || (st.num === 3 && isStep1Valid)) {
                      setCurrentStep(st.num as any);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isCurr
                      ? 'bg-slate-800/90 border-sky-500/60 text-white shadow-md shadow-sky-950/40'
                      : isPast
                      ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isCurr
                          ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950'
                          : isPast
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {isPast ? '✓' : st.num}
                    </span>
                    <span className="font-sans font-bold text-xs">{st.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block truncate font-sans">
                    {st.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress line */}
          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500"
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
            />
          </div>
        </div>

        {/* STEP 1: IDENTITY */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-6"
          >
            <div className="border-b border-slate-800 pb-3">
              <h2 className="font-sans text-xl font-bold text-white">
                Step 1: Student Identity Credentials
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Official registrar records matching university admissions format.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Full Student Name <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Siddharth R. Rao"
                  className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                />
              </div>

              {/* Department Branch */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Department Branch <span className="text-sky-400">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(BRANCH_CONFIGS).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBranch(b as BranchCode)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        branch === b
                          ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-md shadow-sky-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span className="font-mono text-xs">{b}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Roll Number with live regex mask */}
              <RollNumberInput
                value={rollNo}
                onChange={setRollNo}
                label="University Roll Number"
              />

              {/* Indian Phone with +91 chip */}
              <PhoneInput
                value={phone}
                onChange={setPhone}
                label="Student Contact Number (+91)"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button
                variant="primary"
                size="md"
                disabled={!isStep1Valid}
                disabledTooltip="Enter valid Name, Roll No (24R11A0543), and 10-digit phone"
                onClick={() => setCurrentStep(2)}
                withArrow
              >
                Continue to Academics
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: ACADEMICS */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-6"
          >
            <div className="border-b border-slate-800 pb-3">
              <h2 className="font-sans text-xl font-bold text-white">
                Step 2: Academic Telemetry Parameters
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Internal marks, weekly study volume, and compliance indicators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance */}
              <div className="space-y-1 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Attendance Rate</span>
                  <span className={`font-mono font-bold tabular-nums ${attendance < 75 ? 'text-rose-400 underline decoration-rose-500/50' : 'text-sky-300'}`}>
                    {attendance}%
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={attendance}
                  onChange={(e) => setAttendance(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-mono">Mandatory Min: 75%</span>
              </div>

              {/* Internal Marks */}
              <div className="space-y-1 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Internal Marks Average</span>
                  <span className="font-mono font-bold text-sky-400 tabular-nums">
                    {internalMarks}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={internalMarks}
                  onChange={(e) => setInternalMarks(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-mono">Semester V midterms</span>
              </div>

              {/* Weekly Study Hours */}
              <div className="space-y-1 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Weekly Study Volume</span>
                  <span className="font-mono font-bold text-sky-400 tabular-nums">
                    {weeklyStudyHours}h / wk
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={35}
                  value={weeklyStudyHours}
                  onChange={(e) => setWeeklyStudyHours(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-mono">Benchmark: 15h–20h</span>
              </div>

              {/* Assignment Completion */}
              <div className="space-y-1 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Assignment Completion</span>
                  <span className="font-mono font-bold text-sky-400 tabular-nums">
                    {assignmentCompletion}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={assignmentCompletion}
                  onChange={(e) => setAssignmentCompletion(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 font-mono">Submission compliance</span>
              </div>
            </div>

            {/* Additional parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Prior GPA (10.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={previousGpa}
                  onChange={(e) => setPreviousGpa(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Backlogs Count
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={backlogs}
                  onChange={(e) => setBacklogs(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Participation (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={participation}
                  onChange={(e) => setParticipation(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Late Submissions
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={lateSubmissions}
                  onChange={(e) => setLateSubmissions(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button variant="ghost" size="md" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Identity</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setCurrentStep(3);
                  handleAnalyze();
                }}
                withArrow
              >
                Proceed to Final Review
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: REVIEW DOSSIER */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {/* Student ID Card Preview */}
            <div className="max-w-md mx-auto">
              <StudentIdCard
                student={{
                  id: 'preview',
                  name,
                  rollNo,
                  branch,
                  phone,
                  attendance,
                  predictedScore: result ? result.projectedScore : 65,
                  riskLevel: result ? result.riskLevel : 'MEDIUM',
                }}
              />
            </div>

            {/* Analysis Output Summary */}
            {loading ? (
              <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3 backdrop-blur-sm">
                <div className="w-8 h-8 border-2 border-slate-700 border-t-sky-400 rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">
                  Executing Ordinary Least Squares trajectory model...
                </p>
              </div>
            ) : result ? (
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                    <h3 className="font-sans font-bold text-base text-white">
                      Official Risk Telemetry Assessment
                    </h3>
                  </div>
                  <RiskBadge level={result.riskLevel} size="md" showSubtext />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Current Score</span>
                    <div className="text-xl font-bold font-mono text-white tabular-nums">
                      {result.currentWeightedScore}/100
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Forecast Projection</span>
                    <div className="text-xl font-bold font-mono text-sky-400 tabular-nums">
                      {result.projectedScore}/100
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Interventions</span>
                    <div className="text-xl font-bold font-mono text-slate-300 tabular-nums">
                      {result.recommendations.length} Actions
                    </div>
                  </div>
                </div>

                {result.earlyWarning && (
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Early Support Alerts Triggered:</span>
                    </div>
                    <ul className="list-disc list-inside text-rose-200/90 pl-1 font-sans">
                      {result.earlyWarningReasons.map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {error && (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs font-sans">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="md" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Academics</span>
              </Button>

              <div className="flex items-center gap-3">
                <Button variant="secondary" size="md" onClick={handleAnalyze} isLoading={loading}>
                  <RotateCcw className="w-4 h-4" />
                  <span>Re-evaluate</span>
                </Button>

                <Link href="/students">
                  <Button variant="primary" size="md">
                    <span>Commit to Registry</span>
                    <CheckCircle2 className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <SpeedDialFab onSendNotice={() => alert('Dean Notice Dispatched')} />
      <BottomTabBar />
    </div>
  );
}
