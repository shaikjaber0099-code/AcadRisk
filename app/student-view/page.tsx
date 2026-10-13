'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Target, 
  Sliders, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Building2, 
  CalendarDays, 
  HeartHandshake, 
  CheckCircle, 
  Smile 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CrestLogo } from '@/components/ui/CrestLogo';
import { BranchBadge } from '@/components/ui/BranchBadge';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { RollNumberChip } from '@/components/ui/RollNumberInput';
import { StrokeCheckbox } from '@/components/ui/StrokeCheckbox';
import { Button } from '@/components/ui/Button';

export default function StudentViewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // "Your Next 3 Steps" Checklist state
  const [next3Steps, setNext3Steps] = useState([
    { id: 'step-1', text: 'Schedule a 15-minute catch-up with your Academic Advisor (Block C, Room 204)', done: false },
    { id: 'step-2', text: 'Reserve two 90-minute quiet study blocks in the Central Campus Library Pods this week', done: false },
    { id: 'step-3', text: 'Submit Module 3 Remedial Problem Set for Data Structures & Algorithms', done: false },
  ]);

  // What-If local sliders for student with ghost markers
  const [extraStudyHours, setExtraStudyHours] = useState(4);
  const [targetAttendance, setTargetAttendance] = useState(88);

  useEffect(() => {
    // Check if logged in student exists or fallback
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(authData => {
        const studentId = authData?.user?.studentId || 'CS2026-001';
        return fetch(`/api/students/${studentId}`);
      })
      .then(res => res.json())
      .then(studentData => {
        setData(studentData);
        if (studentData?.student) {
          setTargetAttendance(Math.min(95, Math.max(75, Math.round(studentData.student.attendance + 6))));
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback fetch first student
        fetch('/api/students?limit=1')
          .then(res => res.json())
          .then(sList => {
            if (sList.students?.[0]) {
              return fetch(`/api/students/${sList.students[0].id}`);
            }
            return null;
          })
          .then(res => res?.json())
          .then(d => {
            setData(d);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, []);

  const toggleStep = (id: string) => {
    setNext3Steps(prev =>
      prev.map(step => step.id === id ? { ...step, done: !step.done } : step)
    );
  };

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-black text-zinc-300 font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-sm font-sans">Opening Your Digital Student Portfolio...</p>
        </div>
      </div>
    );
  }

  if (!data?.student) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-black font-sans">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-750 flex items-center justify-center text-white mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="font-sans text-2xl font-bold text-white">Student Profile Not Linked</h2>
        <p className="text-xs text-zinc-400 mt-1 mb-5 max-w-sm font-sans">
          Please sign in using your university student account or select a student from the institutional directory.
        </p>
        <Link href="/login">
          <Button variant="primary" size="md">
            Go to Portal Login
          </Button>
        </Link>
      </div>
    );
  }

  const { student, analysis } = data;
  const isHigh = analysis.riskLevel === 'HIGH';
  const isMed = analysis.riskLevel === 'MEDIUM';

  // Projected gain from what-if
  const simulatedGain = Math.round((extraStudyHours * 0.5 + (targetAttendance - student.attendance) * 0.2) * 10) / 10;
  const estimatedNewScore = Math.min(100, Math.round((analysis.projectedScore + Math.max(0, simulatedGain)) * 10) / 10);

  // Simulated morphing risk badge based on estimated score
  const dynamicRiskLevel =
    estimatedNewScore >= 70 ? 'LOW' : estimatedNewScore >= 50 ? 'MEDIUM' : 'HIGH';

  const completedStepsCount = next3Steps.filter(s => s.done).length;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-6xl mx-auto blueprint-grid selection:bg-sky-500 selection:text-slate-950 font-sans">
      
      {/* STUDENT ID-CARD HEADER */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar and Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950 border-2 border-sky-400/40 flex items-center justify-center font-sans text-2xl font-bold text-sky-300 shadow-xl">
                {student.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <BranchBadge branch="CSE" size="sm" />
                <span className="text-[11px] font-mono text-sky-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  AY 2026-27 • Semester V
                </span>
              </div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {student.name}
              </h1>
              <div className="flex items-center gap-2 pt-0.5">
                <RollNumberChip rollNo={student.rollNo} />
                <span className="text-xs text-slate-400 font-sans hidden sm:inline">
                  • Section {student.classId}
                </span>
              </div>
            </div>
          </div>

          {/* Supportive Academic Status Badge */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="text-[11px] text-slate-400 font-sans uppercase tracking-wider">
              Academic Advisory Status
            </div>
            <RiskBadge level={analysis.riskLevel} />
          </div>
        </div>

        {/* Supportive, Non-Shaming Affirmation Banner */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-3 text-xs sm:text-sm text-slate-300">
          <HeartHandshake className="w-5 h-5 text-sky-400 shrink-0" />
          <p className="leading-relaxed font-sans">
            {isHigh ? (
              <span><strong>Let's get you back on track.</strong> Your faculty advisors and peer coaches are ready with structured study compacts. Small, steady daily adjustments build huge momentum.</span>
            ) : isMed ? (
              <span><strong>Needs attention.</strong> You are within striking distance of the Dean's Honor Roll. Focused attendance and submission discipline will solidify your trajectory.</span>
            ) : (
              <span><strong>Exemplary trajectory!</strong> You are well on track for semester honors. Maintain your weekly consistency and consider mentoring peers in your branch lab.</span>
            )}
          </p>
        </div>
      </div>

      {/* PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-lg backdrop-blur-sm">
          <div className="text-xs font-semibold text-slate-400 font-sans">Current Composite Score</div>
          <div className="text-3xl font-sans font-bold text-white mt-1 font-mono">{analysis.currentWeightedScore}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Weighted out of 100</div>
        </div>

        <div className="bg-slate-900/95 p-5 rounded-2xl border border-sky-500/30 shadow-lg shadow-sky-500/10 backdrop-blur-sm">
          <div className="text-xs font-semibold text-sky-300 font-sans">Projected Exam Outcome</div>
          <div className="text-3xl font-sans font-bold text-white mt-1 font-mono">{analysis.projectedScore}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">Linear trajectory blend</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-lg backdrop-blur-sm">
          <div className="text-xs font-semibold text-slate-400 font-sans">Classroom Attendance</div>
          <div className={`text-3xl font-sans font-bold mt-1 font-mono ${student.attendance < 75 ? 'text-rose-400 underline' : 'text-slate-200'}`}>
            {student.attendance}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">
            {student.attendance < 75 ? 'Mandatory cutoff: 75%' : 'Above 75% cutoff threshold'}
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-lg backdrop-blur-sm">
          <div className="text-xs font-semibold text-slate-400 font-sans">Independent Study</div>
          <div className="text-3xl font-sans font-bold text-white mt-1 font-mono">{student.weeklyStudyHours}h</div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">Weekly library & self-study</div>
        </div>
      </div>

      {/* "YOUR NEXT 3 STEPS" CHECKLIST */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-sky-400" />
              <h3 className="font-sans text-lg font-bold text-white">
                Your Next 3 Priority Steps
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Immediate actionable milestones recommended by the Office of Academic Affairs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-sky-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              {completedStepsCount} of 3 Milestones Completed
            </span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3 pt-1">
          {next3Steps.map((step, index) => (
            <motion.div
              key={step.id}
              whileHover={{ x: 3 }}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                step.done
                  ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                  : 'bg-slate-950/80 border-slate-800 hover:border-sky-500/50 text-white'
              }`}
              onClick={() => toggleStep(step.id)}
            >
              <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <StrokeCheckbox
                  checked={step.done}
                  onChange={() => toggleStep(step.id)}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-sans font-bold ${step.done ? 'text-slate-500 line-through' : 'text-white'}`}>
                    Step {index + 1}:
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {step.done ? 'Completed' : 'Pending Action'}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 font-sans leading-relaxed ${step.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Celebratory message when all steps checked */}
        <AnimatePresence>
          {completedStepsCount === 3 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-xl bg-sky-500 text-slate-950 text-xs font-sans flex items-center justify-center gap-2 font-bold shadow-md shadow-sky-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Outstanding dedication! All 3 priority steps marked complete for this academic week.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PERFORMANCE TIMELINE CHART */}
      <div className="bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-sans text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              6-Month Performance Timeline & Momentum
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Recorded assessment marks from August through January with projected final examination slope.
            </p>
          </div>

          <span className="text-xs font-mono text-sky-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            Trajectory: {analysis.trend.trendDirection} ({analysis.trend.slope > 0 ? '+' : ''}{analysis.trend.slope} pts/mo)
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysis.trend.monthlyPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
              <YAxis domain={[30, 100]} stroke="#64748B" fontSize={11} />
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
                name="Monthly Exam Mark"
                stroke="#38BDF8"
                strokeWidth={3}
                dot={{ fill: '#38BDF8', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="projected"
                name="Projected Examination"
                stroke="#BAE6FD"
                strokeDasharray="4 4"
                strokeWidth={2.5}
                dot={{ fill: '#BAE6FD', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* INTERACTIVE WHAT-IF SLIDERS */}
      <div className="bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-sans text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-400" />
              Personal Goal Simulator: Boost Your Projected Score
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Explore how small weekly study commitments and attendance improvements shift your academic standing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Dynamic Risk Status:</span>
            <RiskBadge level={dynamicRiskLevel} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          
          {/* Extra Study Hours Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 relative">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-sans font-semibold">Additional Weekly Study (+hrs)</span>
              <span className="font-mono font-bold text-sky-300">+{extraStudyHours} hrs / week</span>
            </div>
            
            <div className="relative py-2">
              {/* Ghost Marker for Original Baseline (0 hrs added) */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-sky-400/70 z-10 pointer-events-none"
                style={{ left: '0%' }}
                title="Current baseline (0 additional hrs)"
              >
                <span className="absolute -top-4 -left-3 text-[9px] font-mono text-slate-400">Orig</span>
              </div>

              <input
                type="range"
                min={0}
                max={15}
                value={extraStudyHours}
                onChange={(e) => setExtraStudyHours(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Baseline: {student.weeklyStudyHours}h</span>
              <span className="text-sky-300 font-bold">Target: {student.weeklyStudyHours + extraStudyHours}h weekly</span>
            </div>
          </div>

          {/* Target Attendance Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 relative">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-sans font-semibold">Target Attendance Percentage (%)</span>
              <span className="font-mono font-bold text-sky-300">{targetAttendance}%</span>
            </div>

            <div className="relative py-2">
              {/* Ghost Marker for Original Attendance */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-sky-400/70 z-10 pointer-events-none"
                style={{ left: `${Math.min(100, Math.max(0, ((student.attendance - 60) / 40) * 100))}%` }}
                title={`Original attendance: ${student.attendance}%`}
              >
                <span className="absolute -top-4 -left-3 text-[9px] font-mono text-slate-400">Current</span>
              </div>

              <input
                type="range"
                min={60}
                max={100}
                value={targetAttendance}
                onChange={(e) => setTargetAttendance(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Current: {student.attendance}%</span>
              <span className="text-sky-300 font-bold">Goal: {targetAttendance}%</span>
            </div>
          </div>
        </div>

        {/* Projected Result Callout */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-300 font-sans">
            <span className="font-sans font-bold text-white text-sm">Simulated Exam Projection: </span>
            Committing to these targets projects an exam score of <strong className="text-white font-mono text-sm">{estimatedNewScore} / 100</strong>.
          </div>
          <span className="font-mono font-bold text-emerald-400 text-sm shrink-0">
            +{simulatedGain > 0 ? simulatedGain : 0} Projected Points
          </span>
        </div>
      </div>

      {/* ADVISORY OFFICE NOTICE BOARD */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-white text-sm">Office of Academic Affairs • Student Support Center</h4>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Drop-in advisory sessions held Monday through Friday, 3:00 PM – 5:00 PM in Central Block C, Room 204.
            </p>
          </div>
        </div>
        <Link href="/how-it-works">
          <Button variant="secondary" size="sm" className="shrink-0 text-xs font-sans">
            Review Guidelines
          </Button>
        </Link>
      </div>

    </div>
  );
}
