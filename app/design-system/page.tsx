'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Palette,
  Type,
  MousePointer,
  Sparkles,
  Smartphone,
  Monitor,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sliders,
  Play,
  RotateCcw,
  Maximize2,
  IdCard,
  Phone,
  Code2,
  BrainCircuit,
  Database,
  Cpu,
  Cog,
  ShieldCheck,
  Send,
  Trash2,
  FileText,
  Search,
} from 'lucide-react';
import CrestLogo from '@/components/ui/CrestLogo';
import Button from '@/components/ui/Button';
import BranchBadge, { BRANCH_CONFIGS } from '@/components/ui/BranchBadge';
import RiskBadge from '@/components/ui/RiskBadge';
import { RollNumberInput, RollNumberChip } from '@/components/ui/RollNumberInput';
import { PhoneInput, PhoneCell } from '@/components/ui/PhoneInput';
import StudentIdCard, { StudentCardData } from '@/components/ui/StudentIdCard';
import HoldToConfirmButton from '@/components/ui/HoldToConfirmButton';
import SplitExportButton from '@/components/ui/SplitExportButton';
import SpeedDialFab from '@/components/ui/SpeedDialFab';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import StrokeCheckbox from '@/components/ui/StrokeCheckbox';
import BranchTabs from '@/components/ui/BranchTabs';
import CommandPalette from '@/components/ui/CommandPalette';
import BottomTabBar from '@/components/ui/BottomTabBar';

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<'foundations' | 'workbench' | 'frames' | 'prototypes'>('workbench');
  const [deviceFrame, setDeviceFrame] = useState<'desktop' | 'mobile'>('desktop');

  // Interactive state demos for components
  const [sampleRoll, setSampleRoll] = useState('24R11A0543');
  const [samplePhone, setSamplePhone] = useState('9876543210');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonSuccess, setButtonSuccess] = useState(false);
  const [switchVal, setSwitchVal] = useState(true);
  const [checkVal, setCheckVal] = useState(true);
  const [selectedBranchTab, setSelectedBranchTab] = useState('CSE');
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  // What-If Simulator state
  const originalAttendance = 68;
  const originalMidterm = 52;
  const [whatIfAttendance, setWhatIfAttendance] = useState(originalAttendance);
  const [whatIfMidterm, setWhatIfMidterm] = useState(originalMidterm);

  // Compute live what-if predicted score
  const computedScore = Math.min(
    100,
    Math.round(25 + whatIfAttendance * 0.45 + whatIfMidterm * 0.45)
  );
  const computedRisk =
    computedScore < 60 ? 'High' : computedScore < 75 ? 'Medium' : 'Low';

  const sampleStudent: StudentCardData = {
    id: 'demo-101',
    name: 'Siddharth R. Rao',
    rollNo: '24R11A0543',
    branch: 'CSE',
    phone: '9876543210',
    attendance: whatIfAttendance,
    predictedScore: computedScore,
    riskLevel: computedRisk,
    semester: 'Semester V',
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans pb-24 selection:bg-portal-gold selection:text-navy-950">
      {/* Top Figma Canvas Bar */}
      <header className="sticky top-0 z-40 bg-navy-900/95 border-b border-portal-gold/25 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CrestLogo size={36} subtext="Figma Design System Specification" />
          <span className="hidden sm:inline-block h-5 w-px bg-white/10" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-950 border border-portal-gold/30 text-xs font-mono text-portal-gold">
            <span>v2.4.0-CANVAS</span>
            <span className="opacity-40">•</span>
            <span>UNIVERSITY-PORTAL</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-950 border border-white/10 text-xs font-semibold">
          {[
            { id: 'foundations', label: '1. Foundations', icon: Palette },
            { id: 'workbench', label: '2. Button & UI Workbench (14 States)', icon: MousePointer },
            { id: 'frames', label: '3. Frames (1440 & 390)', icon: Monitor },
            { id: 'prototypes', label: '4. Interactive Prototypes', icon: Play },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isSel
                    ? 'bg-portal-gold text-navy-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCmdPaletteOpen(true)}
            className="text-xs"
          >
            <Search className="w-3.5 h-3.5 text-portal-gold" />
            <span>Cmd+K</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* ========================================================================= */}
        {/* TAB 1: FOUNDATIONS (Colors, Branches, Typography, Motion Tokens) */}
        {/* ========================================================================= */}
        {activeTab === 'foundations' && (
          <div className="space-y-10 animate-in fade-in-50 duration-200">
            {/* Identity Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-portal-gold/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-portal-gold font-bold">
                  Design Identity
                </span>
                <h1 className="font-sans text-3xl font-bold text-white mt-1">
                  Geethanjali College of Engineering and Technology Portal Design System
                </h1>
                <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  Engineered specifically for academic governance, dean-level decision making, and student mentorship. Every token and component honors the university campus aesthetic—dignified, trustworthy, and supportive.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3 rounded-xl bg-navy-950 border border-portal-gold/40 text-center">
                  <span className="block font-sans text-xl font-bold text-portal-gold">100%</span>
                  <span className="text-[10px] text-slate-400 font-mono">WCAG 2.2 AA</span>
                </div>
                <div className="p-3 rounded-xl bg-navy-950 border border-portal-gold/40 text-center">
                  <span className="block font-sans text-xl font-bold text-portal-gold">5</span>
                  <span className="text-[10px] text-slate-400 font-mono">Branches</span>
                </div>
              </div>
            </div>

            {/* Core Brand Palette */}
            <section className="space-y-4">
              <h2 className="font-sans text-xl font-bold text-portal-gold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <span>Primary University Palette</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-3">
                  <div className="h-20 rounded-lg bg-[#0B0F19] border border-white/20 shadow-inner flex items-end p-2">
                    <span className="font-mono text-xs text-white">#0B0F19</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">Nordic Slate Base</h3>
                    <p className="text-xs text-slate-400">Institutional foundation, dark abyss backdrop, academic authority</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-3">
                  <div className="h-20 rounded-lg bg-[#0F172A] border border-sky-500/20 shadow-glow-primary flex items-end p-2">
                    <span className="font-mono text-xs text-white font-bold">#0F172A</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">Deep Slate Night</h3>
                    <p className="text-xs text-slate-400">Surface cards, structural framing, high contrast reading</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-3">
                  <div className="h-20 rounded-lg bg-[#38BDF8] shadow-glow-gold flex items-end p-2">
                    <span className="font-mono text-xs text-navy-950 font-bold">#38BDF8</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">Frost Blue Accent</h3>
                    <p className="text-xs text-slate-400">Interactive controls, cyan flares, active tab indicators</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-3">
                  <div className="h-20 rounded-lg bg-[#F8FAFC] flex items-end p-2">
                    <span className="font-mono text-xs text-navy-950 font-bold">#F8FAFC</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">Slate Off-White</h3>
                    <p className="text-xs text-slate-400">Parchment reports, high-contrast headings, light mode</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Semantic Risk Palette */}
            <section className="space-y-4">
              <h2 className="font-sans text-xl font-bold text-portal-gold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Semantic Risk Level Palette (Always with Icon + Supportive Label)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-navy-900 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <RiskBadge level="Low" size="lg" showSubtext />
                    <span className="font-mono text-xs text-emerald-400">#10B981</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Student trajectory is sound. Continuous positive reinforcement.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-navy-900 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <RiskBadge level="Medium" size="lg" showSubtext />
                    <span className="font-mono text-xs text-amber-400">#F59E0B</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Early dip observed in attendance or internal assessments. Requires faculty advisory.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-navy-900 border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <RiskBadge level="High" size="lg" showSubtext />
                    <span className="font-mono text-xs text-rose-400">#F43F5E</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Non-shaming academic support required. Immediate counselor intervention scheduled.
                  </p>
                </div>
              </div>
            </section>

            {/* Academic Branches Color System */}
            <section className="space-y-4">
              <h2 className="font-sans text-xl font-bold text-portal-gold flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                <span>5 Academic Branches Visual Identity</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Object.entries(BRANCH_CONFIGS).map(([key, cfg]) => (
                  <div
                    key={key}
                    style={{ borderColor: cfg.borderColor, backgroundColor: cfg.bgColor }}
                    className="p-4 rounded-xl border flex flex-col justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <BranchBadge branch={key} size="md" withGlow />
                      <span className="font-mono text-[10px] text-slate-300">{cfg.color}</span>
                    </div>
                    <div className="text-xs text-slate-200 font-sans mt-2">
                      {cfg.name}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Typography Tokens */}
            <section className="space-y-4">
              <h2 className="font-sans text-xl font-bold text-portal-gold flex items-center gap-2">
                <Type className="w-5 h-5" />
                <span>Institutional Typography Scale</span>
              </h2>
              <div className="p-6 rounded-2xl bg-navy-900 border border-white/10 space-y-6">
                <div className="space-y-1 pb-4 border-b border-white/5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    Display Heading • Inter Sans-Serif Normal
                  </span>
                  <p className="font-sans text-3xl font-bold text-white tracking-wide">
                    Office of Academic Affairs • Student Dossier 2026-27
                  </p>
                </div>

                <div className="space-y-1 pb-4 border-b border-white/5">
                  <span className="text-[10px] font-mono text-portal-gold uppercase tracking-wider">
                    Body & UI Controls • Plus Jakarta Sans
                  </span>
                  <p className="font-sans text-sm text-slate-300 leading-relaxed">
                    Designed for maximum legibility in dense academic data tables, probability distributions, and counseling logs.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-portal-gold uppercase tracking-wider">
                    Tabular Figures & Roll Numbers • JetBrains Mono
                  </span>
                  <p className="font-mono text-sm text-slate-200 tabular-nums">
                    ROLL: 24R11A0543 | SCORE: 84.6% | ATTENDANCE: 91.2% | DELTA: +6.4%
                  </p>
                </div>
              </div>
            </section>

            {/* Motion Tokens */}
            <section className="space-y-4">
              <h2 className="font-sans text-xl font-bold text-portal-gold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Motion Tokens & Easing Curves</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { name: 'Instant', ms: '90ms', use: 'Micro-toggles, press' },
                  { name: 'Fast', ms: '160ms', use: 'Tooltips, dropdowns' },
                  { name: 'Base', ms: '240ms', use: 'Route slide, tab pill' },
                  { name: 'Slow', ms: '420ms', use: 'Card fly-to, dialog open' },
                  { name: 'Cinematic', ms: '700ms', use: 'Hero scrub, chart draw' },
                ].map((m) => (
                  <div key={m.name} className="p-3.5 rounded-xl bg-navy-900 border border-white/10">
                    <span className="font-mono text-lg font-bold text-portal-gold block">{m.ms}</span>
                    <span className="text-xs font-semibold text-white block mt-1">{m.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{m.use}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COMPONENT WORKBENCH (ALL 14 BUTTON STATES & INPUTS) */}
        {/* ========================================================================= */}
        {activeTab === 'workbench' && (
          <div className="space-y-10 animate-in fade-in-50 duration-200">
            <div className="p-4 rounded-xl bg-navy-900/80 border border-portal-gold/30 flex items-center justify-between">
              <div>
                <h2 className="font-sans text-xl font-bold text-white">
                  Interactive Component Workbench
                </h2>
                <p className="text-xs text-slate-400">
                  Test all 14 button states, university roll number validation, masked phone numbers, and student ID cards.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-portal-gold/20 text-portal-gold font-mono text-xs font-bold">
                14 / 14 States Live
              </span>
            </div>

            {/* The 14 Button States Grid */}
            <section className="space-y-4">
              <h3 className="font-sans text-lg font-bold text-portal-gold">
                The 14 Button System States
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Hover Shine Streak */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    1. Hover: Shine Streak + 2px Lift
                  </span>
                  <div>
                    <Button variant="primary" size="md" shine>
                      Hover Over Me
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Lifts 2px with smooth shadow, and a 30° light streak passes across.
                  </p>
                </div>

                {/* 2. Magnetic CTA */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    2. Magnetic Physics (12px Spring)
                  </span>
                  <div>
                    <Button variant="gold" size="md" isMagnetic>
                      Magnetic Spring CTA
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Follows cursor displacement up to 12px with spring easing, snaps back.
                  </p>
                </div>

                {/* 3. Press scale & ripple */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    3. Press: Scale 0.97 + Radial Ripple
                  </span>
                  <div>
                    <Button variant="secondary" size="md">
                      Click to Test Ripple
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Smooth scale down to 0.97 with click-origin ping ripple ring.
                  </p>
                </div>

                {/* 4. Focus-visible gold ring */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    4. Focus-Visible (2px Gold Ring)
                  </span>
                  <div>
                    <Button variant="secondary" size="md">
                      Tab Onto Me (Focus)
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Accessible focus ring with 2px offset in `#E8B84A` academic gold.
                  </p>
                </div>

                {/* 5. Loading Spinner Morph */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    5. Loading: Circular Progress Morph
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      isLoading={buttonLoading}
                      onClick={() => {
                        setButtonLoading(true);
                        setTimeout(() => setButtonLoading(false), 2000);
                      }}
                    >
                      Trigger Model Run
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Label fades smoothly, spinner centers with zero button layout shift.
                  </p>
                </div>

                {/* 6. Success Check Morph */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    6. Success Check Morph (1.5s Pulse)
                  </span>
                  <div>
                    <Button
                      variant="secondary"
                      size="md"
                      isSuccess={buttonSuccess}
                      successText="Notice Dispatched"
                      onClick={() => {
                        setButtonSuccess(true);
                        setTimeout(() => setButtonSuccess(false), 1500);
                      }}
                    >
                      Send Academic Alert
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Morphs to checkmark with pulse, automatically reverts after 1.5s.
                  </p>
                </div>

                {/* 7. Disabled 40% + Tooltip */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    7. Disabled State + Tooltip
                  </span>
                  <div>
                    <Button
                      variant="primary"
                      size="md"
                      disabled
                      disabledTooltip="Permission restricted to Dean of Academic Affairs"
                    >
                      Authorize Override
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    40% opacity with informative tooltip explaining the constraint.
                  </p>
                </div>

                {/* 8. Destructive 800ms Hold */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    8. Destructive: 800ms Hold-to-Confirm
                  </span>
                  <div>
                    <HoldToConfirmButton
                      onConfirm={() => alert('Student record purged from active cycle')}
                      label="Purge Student Record"
                      confirmingLabel="Hold to Purge..."
                      confirmedLabel="Record Purged"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Press and hold 800ms with circular SVG countdown to prevent accidental deletion.
                  </p>
                </div>

                {/* 9. Arrow Slide Button */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    9. Arrow Slide Interaction
                  </span>
                  <div>
                    <Button variant="primary" size="md" withArrow>
                      Open Full Dossier
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Arrow slides out to the right and a golden replacement slides in on hover.
                  </p>
                </div>

                {/* 10. Segmented Filter Chips */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    10. Filter Chips with Sliding Spring Pill
                  </span>
                  <div>
                    <BranchTabs
                      selectedBranch={selectedBranchTab}
                      onSelectBranch={setSelectedBranchTab}
                      counts={{ CSE: 142, AIML: 98, DS: 64, ECE: 110, MECH: 85 }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sliding pill layout animation with animated tabular count badges.
                  </p>
                </div>

                {/* 11. Split Export Button */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    11. Split Export (PDF / CSV / Print)
                  </span>
                  <div>
                    <SplitExportButton
                      onExportPDF={() => console.log('PDF export triggered')}
                      onExportCSV={() => console.log('CSV export triggered')}
                      onPrint={() => window.print()}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Primary action on left, split dropdown chevron on right with animated options.
                  </p>
                </div>

                {/* 12. Floating Speed Dial FAB */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    12. Floating Action Speed-Dial
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">
                      Look at bottom right corner ↘
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Fixed speed dial expands into stacked actions with staggered spring reveal.
                  </p>
                </div>

                {/* 13. Apply Recommendation Fly-To */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-2 col-span-1 md:col-span-2">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    13. "Apply Recommendation" Card Collapse & Commit
                  </span>
                  <div className="p-3 rounded-lg bg-navy-950 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-portal-gold uppercase">
                        High Impact (+8.5 pts)
                      </span>
                      <h4 className="text-xs font-semibold text-white">
                        Assign Mandatory TA Tutoring in Data Structures
                      </h4>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => alert('Intervention committed to Student Action Plan')}
                    >
                      Apply Action
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Card collapses into confirmed state and updates student action checklist.
                  </p>
                </div>

                {/* 14. Spring Toggle & Stroke Checkbox */}
                <div className="p-4 rounded-xl bg-navy-900 border border-white/10 space-y-3">
                  <span className="text-[10px] font-mono text-portal-gold uppercase">
                    14. Spring Toggle & Stroke Checkbox
                  </span>
                  <div className="flex flex-col gap-3">
                    <ToggleSwitch
                      checked={switchVal}
                      onChange={setSwitchVal}
                      label="Automated Parent SMS Alerts"
                      description="Send when attendance dips below 75%"
                    />
                    <StrokeCheckbox
                      checked={checkVal}
                      onChange={setCheckVal}
                      label="Require Counselor Sign-Off"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Student Identity Fields Workbench */}
            <section className="space-y-4">
              <h3 className="font-sans text-lg font-bold text-portal-gold">
                Student Identity System (Roll Number & Indian Contact)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-navy-900 border border-white/10">
                {/* Roll Number Field */}
                <div className="space-y-4">
                  <RollNumberInput
                    value={sampleRoll}
                    onChange={setSampleRoll}
                    label="University Roll Number Input"
                  />
                  <div className="p-3 rounded-xl bg-navy-950 border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      ID-Card Style Chip Preview (Click copy icon):
                    </span>
                    <div>
                      <RollNumberChip rollNo={sampleRoll} size="lg" />
                    </div>
                  </div>
                </div>

                {/* Phone Input Field */}
                <div className="space-y-4">
                  <PhoneInput
                    value={samplePhone}
                    onChange={setSamplePhone}
                    label="Student Mobile Contact"
                  />
                  <div className="p-3 rounded-xl bg-navy-950 border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Table Masked Cell with Eye Reveal (+91 Indian Format):
                    </span>
                    <div>
                      <PhoneCell phone={samplePhone} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Student ID Card 3D Tilt Preview */}
            <section className="space-y-4">
              <h3 className="font-sans text-lg font-bold text-portal-gold">
                Student ID Profile Card (Max 4° 3D Tilt & Light Follow)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StudentIdCard student={sampleStudent} />
                <StudentIdCard
                  student={{
                    ...sampleStudent,
                    id: 'demo-102',
                    name: 'Diya Patel',
                    rollNo: '24R11A0512',
                    branch: 'AIML',
                    attendance: 84,
                    predictedScore: 78,
                    riskLevel: 'Medium',
                  }}
                />
                <StudentIdCard
                  student={{
                    ...sampleStudent,
                    id: 'demo-103',
                    name: 'Ananya Reddy',
                    rollNo: '24R11A0408',
                    branch: 'ECE',
                    attendance: 94,
                    predictedScore: 89,
                    riskLevel: 'Low',
                  }}
                />
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FRAMES (Desktop 1440 & Mobile 390 Viewers) */}
        {/* ========================================================================= */}
        {activeTab === 'frames' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Frame Viewport Switcher */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-900 border border-portal-gold/30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeviceFrame('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    deviceFrame === 'desktop'
                      ? 'bg-portal-gold text-navy-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Desktop Frame (1440 × 900)</span>
                </button>

                <button
                  onClick={() => setDeviceFrame('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    deviceFrame === 'mobile'
                      ? 'bg-portal-gold text-navy-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Frame (390 × 844 iPhone)</span>
                </button>
              </div>

              <span className="text-xs font-mono text-portal-gold">
                {deviceFrame === 'desktop' ? 'Viewport: 1440px Fluid Scale' : 'Viewport: 390px Fluid Scale'}
              </span>
            </div>

            {/* Simulated Desktop (1440) Frame */}
            {deviceFrame === 'desktop' && (
              <div className="w-full rounded-2xl bg-navy-950 border-4 border-navy-800 shadow-2xl overflow-hidden">
                {/* Browser Chrome Header */}
                <div className="h-10 bg-navy-900 border-b border-white/10 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-6 py-1 rounded-md bg-navy-950 text-[11px] font-mono text-slate-400 border border-white/5">
                    portal.geethanjali.edu.in/dashboard
                  </div>
                  <div className="text-xs font-mono text-portal-gold">1440 × 900</div>
                </div>

                {/* Dashboard Frame Content */}
                <div className="p-6 space-y-6">
                  {/* Top summary row */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="font-sans text-2xl font-bold text-white">
                        Academic Affairs Executive Council
                      </h2>
                      <span className="text-xs text-slate-400 font-sans">
                        Semester V • Continuous Performance Risk Index
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SplitExportButton />
                    </div>
                  </div>

                  {/* 4 KPI Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Active Students', val: '1,280', sub: '+4.2% enrollment', color: 'text-white' },
                      { label: 'Academic Risk Rate', val: '14.2%', sub: '182 students flagged', color: 'text-amber-400' },
                      { label: 'Average Attendance', val: '86.4%', sub: 'Target: >85%', color: 'text-emerald-400' },
                      { label: 'Forecast Mean Score', val: '74.8', sub: 'OLS Model R² 0.88', color: 'text-portal-gold' },
                    ].map((k) => (
                      <div key={k.label} className="p-4 rounded-xl bg-navy-900 border border-portal-gold/20">
                        <span className="text-[11px] text-slate-400 font-medium">{k.label}</span>
                        <div className={`text-2xl font-bold font-mono my-1 ${k.color}`}>{k.val}</div>
                        <span className="text-[10px] text-slate-500">{k.sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Sample At-Risk Table */}
                  <div className="p-4 rounded-xl bg-navy-900 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-sans text-sm font-bold text-portal-gold">
                        Students Requiring Academic Attention (High/Medium Priority)
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">182 Active Records</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 font-mono">
                            <th className="pb-2">Student Name</th>
                            <th className="pb-2">Roll Number</th>
                            <th className="pb-2">Branch</th>
                            <th className="pb-2">Contact (+91)</th>
                            <th className="pb-2">Attendance</th>
                            <th className="pb-2">Forecast</th>
                            <th className="pb-2">Risk Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {[
                            { name: 'Siddharth Rao', roll: '24R11A0543', br: 'CSE', ph: '9876543210', att: 68, scr: 56, rsk: 'High' },
                            { name: 'Rohan Verma', roll: '24R11A0523', br: 'DS', ph: '9712345678', att: 72, scr: 62, rsk: 'Medium' },
                            { name: 'Vikram Joshi', roll: '24R11A0315', br: 'MECH', ph: '9654321876', att: 64, scr: 51, rsk: 'High' },
                          ].map((st) => (
                            <tr key={st.roll} className="hover:bg-navy-850 transition-colors">
                              <td className="py-2.5 font-medium text-white">{st.name}</td>
                              <td className="py-2.5"><RollNumberChip rollNo={st.roll} size="sm" /></td>
                              <td className="py-2.5"><BranchBadge branch={st.br} size="sm" /></td>
                              <td className="py-2.5"><PhoneCell phone={st.ph} /></td>
                              <td className="py-2.5 font-mono text-slate-300">{st.att}%</td>
                              <td className="py-2.5 font-mono font-bold text-portal-gold">{st.scr}/100</td>
                              <td className="py-2.5"><RiskBadge level={st.rsk} size="sm" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Simulated Mobile (390) Frame */}
            {deviceFrame === 'mobile' && (
              <div className="flex justify-center">
                <div className="w-[390px] h-[780px] rounded-[44px] bg-navy-950 border-[10px] border-navy-850 shadow-2xl overflow-hidden flex flex-col relative">
                  {/* Dynamic Island / Speaker notch */}
                  <div className="h-7 bg-navy-950 flex items-center justify-center relative shrink-0">
                    <div className="w-24 h-4 rounded-full bg-black" />
                  </div>

                  {/* Mobile Header */}
                  <div className="px-4 py-3 bg-navy-900 border-b border-portal-gold/25 flex items-center justify-between shrink-0">
                    <CrestLogo size={32} subtext="Mobile Portal" />
                    <RiskBadge level="High" size="sm" />
                  </div>

                  {/* Scrollable Mobile Body */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-navy-900 border border-portal-gold/30">
                      <span className="text-[10px] font-mono text-portal-gold uppercase">Student Profile</span>
                      <h3 className="font-sans text-lg font-bold text-white mt-0.5">Siddharth Rao</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <RollNumberChip rollNo="24R11A0543" size="sm" />
                        <BranchBadge branch="CSE" size="sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl bg-navy-900 border border-white/5">
                        <span className="text-[10px] text-slate-400">Attendance</span>
                        <div className="text-xl font-bold font-mono text-red-400">68%</div>
                      </div>
                      <div className="p-3 rounded-xl bg-navy-900 border border-white/5">
                        <span className="text-[10px] text-slate-400">Forecast Score</span>
                        <div className="text-xl font-bold font-mono text-portal-gold">56/100</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-navy-900 border border-white/10 space-y-2">
                      <span className="text-[10px] font-mono text-portal-gold uppercase">Direct Communication</span>
                      <PhoneCell phone="9876543210" />
                    </div>

                    <Button variant="primary" size="md" className="w-full" withArrow>
                      Open Full Dossier
                    </Button>
                  </div>

                  {/* Bottom Tab Bar Preview */}
                  <div className="shrink-0 bg-navy-900 border-t border-portal-gold/20 py-2 px-3 flex items-center justify-around">
                    <div className="flex flex-col items-center text-portal-gold text-[10px] font-medium">
                      <Monitor className="w-4 h-4" />
                      <span>Home</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400 text-[10px]">
                      <IdCard className="w-4 h-4" />
                      <span>Students</span>
                    </div>
                    <div className="flex flex-col items-center text-slate-400 text-[10px]">
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: INTERACTIVE PROTOTYPES (What-If Sliders, Command Palette, Speed Dial) */}
        {/* ========================================================================= */}
        {activeTab === 'prototypes' && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            <div className="p-4 rounded-xl bg-navy-900 border border-portal-gold/30">
              <h2 className="font-sans text-xl font-bold text-white">
                Interactive Behavior & Simulation Prototypes
              </h2>
              <p className="text-xs text-slate-400">
                Experience real-time what-if simulation, command palette trigger, and floating quick actions.
              </p>
            </div>

            {/* Prototype 1: What-If Simulator with Ghost Baseline & Color Morph */}
            <section className="p-6 rounded-2xl bg-navy-900 border border-portal-gold/30 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-portal-gold font-bold">
                    Prototype Interaction 1
                  </span>
                  <h3 className="font-sans text-2xl font-bold text-white">
                    What-If Academic Simulator with Baseline Ghost Marker
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag the sliders to see the forecast score update and the risk badge smoothly morph color. Notice the ghost marker showing original recorded value.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <RiskBadge level={computedRisk} size="lg" showSubtext />
                  <button
                    onClick={() => {
                      setWhatIfAttendance(originalAttendance);
                      setWhatIfMidterm(originalMidterm);
                    }}
                    className="p-2 rounded-xl bg-navy-950 border border-white/10 text-slate-400 hover:text-portal-gold"
                    title="Reset to Original Values"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                {/* Attendance Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Attendance Simulation</span>
                    <span className="font-mono font-bold text-portal-gold tabular-nums">
                      {whatIfAttendance}% (Orig: {originalAttendance}%)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={40}
                      max={100}
                      value={whatIfAttendance}
                      onChange={(e) => setWhatIfAttendance(Number(e.target.value))}
                      className="w-full accent-portal-gold cursor-pointer"
                    />
                    {/* Ghost baseline marker at original attendance */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-portal-gold/50 rounded pointer-events-none"
                      style={{ left: `${((originalAttendance - 40) / 60) * 100}%` }}
                      title={`Original Attendance: ${originalAttendance}%`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>40%</span>
                    <span>Ghost Marker = Original {originalAttendance}%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Midterm Score Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Midterm-I Simulation Score</span>
                    <span className="font-mono font-bold text-portal-gold tabular-nums">
                      {whatIfMidterm}/100 (Orig: {originalMidterm})
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={whatIfMidterm}
                      onChange={(e) => setWhatIfMidterm(Number(e.target.value))}
                      className="w-full accent-portal-primary cursor-pointer"
                    />
                    {/* Ghost baseline marker at original midterm */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-blue-400/50 rounded pointer-events-none"
                      style={{ left: `${((originalMidterm - 20) / 80) * 100}%` }}
                      title={`Original Midterm: ${originalMidterm}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>20</span>
                    <span>Ghost Marker = Original {originalMidterm}</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Simulation Result Output */}
              <div className="p-4 rounded-xl bg-navy-950 border border-portal-gold/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Simulated Forecast Score</span>
                  <div className="font-sans text-3xl font-bold text-white tabular-nums">
                    {computedScore}/100
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Risk Level Projection</span>
                  <div className="mt-1">
                    <RiskBadge level={computedRisk} size="md" showSubtext />
                  </div>
                </div>
              </div>
            </section>

            {/* Prototype 2: Command Palette Trigger */}
            <section className="p-6 rounded-2xl bg-navy-900 border border-white/10 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-portal-gold font-bold">
                Prototype Interaction 2
              </span>
              <h3 className="font-sans text-xl font-bold text-white">
                Global Academic Command Palette (Cmd+K)
              </h3>
              <p className="text-xs text-slate-400">
                Press <kbd className="px-1.5 py-0.5 rounded bg-navy-950 border border-portal-gold/30 text-portal-gold font-mono">Cmd + K</kbd> or click the button below to search by student roll number, phone, or run actions.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCmdPaletteOpen(true)}
              >
                <Search className="w-4 h-4 text-portal-gold" />
                <span>Open Command Palette Modal</span>
              </Button>
            </section>
          </div>
        )}
      </main>

      {/* Floating Speed Dial FAB (Interactive in all views) */}
      <SpeedDialFab onSendNotice={() => alert('Dean Notice Broadcasted')} />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
      />

      {/* Mobile Tab Bar */}
      <BottomTabBar />
    </div>
  );
}
