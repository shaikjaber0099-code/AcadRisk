'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Brain, 
  FileSpreadsheet, 
  Sliders, 
  BarChart3, 
  Cpu, 
  Compass, 
  ChevronRight,
  Calculator,
  UserCheck,
  Building2,
  CalendarDays,
  GraduationCap,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CrestLogo } from '@/components/ui/CrestLogo';
import { BRANCH_CONFIGS, BranchBadge } from '@/components/ui/BranchBadge';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrubSectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Soft cursor glow for landing page only
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorSpringX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const cursorSpringY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Reading progress bar
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        });
      }

      // 2. Hero entrance reveal
      gsap.from('.hero-reveal', {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 1.0,
        ease: 'power3.out',
      });

      // 3. Pinned Scrub Walkthrough Section
      if (scrubSectionRef.current) {
        ScrollTrigger.create({
          trigger: scrubSectionRef.current,
          start: 'top top',
          end: '+=2200',
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.25) setActiveStep(0);
            else if (p < 0.5) setActiveStep(1);
            else if (p < 0.75) setActiveStep(2);
            else setActiveStep(3);
          },
        });
      }

      // 4. Branch cards staggered reveal
      gsap.from('.branch-tilt-card', {
        scrollTrigger: {
          trigger: '.branch-showcase-section',
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
      });

      // 5. Stat cards count entrance
      gsap.from('.portal-stat-pill', {
        scrollTrigger: {
          trigger: '.stat-pills-row',
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-sky-500 selection:text-slate-950 overflow-hidden font-sans"
    >
      {/* Soft Glow Follow Cursor (Landing page exclusive, Nordic frost cyan) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-80 h-80 rounded-full bg-sky-500/10 blur-[130px] z-30"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Reading Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none origin-left bg-slate-900">
        <div 
          ref={progressBarRef} 
          className="h-full bg-sky-400 scale-x-0 origin-left shadow-sm shadow-sky-400/50"
        />
      </div>

      {/* HERO SECTION */}
      <section 
        ref={heroRef} 
        className="relative min-h-[94vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-20 pb-20 blueprint-grid"
      >
        {/* Subtle Arch Divider Graphic */}
        <div className="arch-divider max-w-4xl w-full mb-8 opacity-40" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
          {/* Official Academic Crest & Directorate Badge */}
          <div className="hero-reveal inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-md">
            <CrestLogo size={28} showLabel={false} />
            <div className="flex items-center gap-2 text-xs">
              <span className="font-sans font-bold text-white tracking-wide">
                Geethanjali College of Engineering and Technology
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-sans">Office of Academic Affairs</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="hidden sm:inline-block font-mono text-sky-300 bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                AY 2026-27 • Sem V
              </span>
            </div>
          </div>

          {/* Clean Sans-serif Headline */}
          <h1 className="hero-reveal font-sans text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.12]">
            Preserve Trajectories. <br />
            <span className="text-sky-400 font-sans">Protect Academic Futures.</span>
          </h1>

          {/* Supportive, Respectful Academic Subheading */}
          <p className="hero-reveal max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-sans leading-relaxed">
            AcadRisk replaces speculative black-box machine learning with verifiable deterministic equations, 
            Ordinary Least Squares trajectory modeling, and supportive faculty intervention plans. 
            Designed to empower educators and guide students back on track.
          </p>

          {/* Action CTAs with Magnetic Physics */}
          <div className="hero-reveal flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="lg"
                isMagnetic={true}
                withArrow={true}
                className="font-sans font-bold text-sm sm:text-base px-8 h-13"
              >
                Access Faculty Portal
              </Button>
            </Link>

            <Link href="/design-system">
              <Button
                variant="secondary"
                size="lg"
                isMagnetic={true}
                className="font-sans text-sm sm:text-base px-6 h-13"
              >
                <Sliders className="w-4 h-4 text-sky-400 mr-2" />
                Inspect Design System
              </Button>
            </Link>

            <Link href="/batch">
              <Button
                variant="ghost"
                size="lg"
                className="text-slate-300 hover:text-white text-sm sm:text-base h-13"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Batch Roster Ingestion
              </Button>
            </Link>
          </div>

          {/* Institutional Trust Highlights (Pills) */}
          <div className="hero-reveal stat-pills-row pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="portal-stat-pill bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 shadow-md backdrop-blur-md">
              <div className="text-2xl font-sans font-bold text-white">150+</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-sans">Active Student Profiles</div>
            </div>
            <div className="portal-stat-pill bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 shadow-md backdrop-blur-md">
              <div className="text-2xl font-sans font-bold text-white">98.4%</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-sans">Intervention Retention</div>
            </div>
            <div className="portal-stat-pill bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 shadow-md backdrop-blur-md">
              <div className="text-2xl font-sans font-bold text-white">5 Depts</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-sans">CSE, AIML, DS, ECE, MECH</div>
            </div>
            <div className="portal-stat-pill bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 shadow-md backdrop-blur-md">
              <div className="text-2xl font-sans font-bold text-white">100%</div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-sans">Verifiable Mathematics</div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANCH SHOWCASE ROW (3D Tilt Cards) */}
      <section className="branch-showcase-section py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono text-sky-300 bg-slate-900 border border-slate-800">
            <Building2 className="w-3.5 h-3.5" />
            <span>Cross-Departmental Institutional System</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Tailored for Every Engineering Discipline
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-sans leading-relaxed">
            Each branch maintains customized academic weights, distinct Nordic signatures, and department-specific laboratory recovery compacts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Object.entries(BRANCH_CONFIGS).map(([branchKey, cfg]) => {
            return (
              <motion.div
                key={branchKey}
                whileHover={{ y: -6, rotateX: 3, rotateY: -3, scale: 1.02 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="branch-tilt-card bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden backdrop-blur-md shadow-lg"
              >
                {/* Branch Top Accent Line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1" 
                  style={{ backgroundColor: cfg.color }}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <BranchBadge branch={branchKey as any} size="md" />
                    <span className="font-mono text-[10px] text-slate-400">Sem V</span>
                  </div>

                  <div>
                    <h3 className="font-sans font-bold text-white text-base group-hover:text-sky-300 transition-colors">
                      {cfg.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                      {branchKey === 'CSE' && 'Focus on Systems, Algorithms & Cloud Infrastructure.'}
                      {branchKey === 'AIML' && 'Neural Architectures, Data Modeling & Deep Learning.'}
                      {branchKey === 'DS' && 'Statistical Inference, Pipelines & Predictive Analytics.'}
                      {branchKey === 'ECE' && 'Signal Processing, Microelectronics & Embedded Logic.'}
                      {branchKey === 'MECH' && 'Thermodynamics, Robotics, Dynamics & CAD Systems.'}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 text-[11px]">30 Students</span>
                  <Link
                    href={`/dashboard?branch=${branchKey}`}
                    className="font-bold text-sky-400 hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Roster</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PINNED SCRUB STORYTELLING WALKTHROUGH */}
      <section 
        ref={scrubSectionRef} 
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 border-y border-slate-800 bg-[#0B0F19]"
      >
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-16">
          {/* Left Narrative Stepper */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 bg-slate-900 px-3.5 py-1 rounded-full border border-slate-800">
              <Layers className="w-3.5 h-3.5" />
              <span>Verifiable Pedagogical Pipeline</span>
            </div>
            
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              From Raw Telemetry to <span className="text-sky-400">Empowering Intervention</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              AcadRisk executes a 4-stage transparent pipeline designed in collaboration with the Faculty Academic Council — completely free of uninterpretable weights.
            </p>

            {/* Stepper progress indicator */}
            <div className="space-y-3 pt-2">
              {[
                { title: '1. Multi-Dimensional Intake', desc: 'Captures attendance, internal tests, past GPA, study hours, and backlog markers.' },
                { title: '2. Deterministic Weighting', desc: 'Calculates baseline composite score with institutionally published coefficients.' },
                { title: '3. Trajectory & Early Warning', desc: 'Applies Ordinary Least Squares trend analysis to flag declining momentum.' },
                { title: '4. Prescriptive Action Plan', desc: 'Pairs specific performance deficits with non-punitive mentorship compacts.' },
              ].map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                    activeStep === idx 
                      ? 'bg-slate-800/90 border-sky-400 text-white shadow-md shadow-sky-500/10' 
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-sm font-sans font-bold">
                    <span>{step.title}</span>
                    {activeStep === idx && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-sans">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Stage Display Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/95 p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden min-h-[460px] flex flex-col justify-center shadow-2xl backdrop-blur-xl">
              {/* Stage 0 */}
              {activeStep === 0 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Student Dossier Intake</div>
                      <div className="font-sans text-lg font-bold text-white">Rohan Verma (24R11A0503)</div>
                    </div>
                    <BranchBadge branch="DS" size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400">Classroom Attendance:</span>
                      <div className="text-base font-bold text-rose-400 font-mono">62.0% (Cutoff: 75%)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400">Internal Mid-Term Marks:</span>
                      <div className="text-base font-bold text-slate-200 font-mono">42.0 / 100 Avg</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400">Self-Directed Study:</span>
                      <div className="text-base font-bold text-sky-300 font-mono">5.0 hrs / week</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400">Prior Arrears:</span>
                      <div className="text-base font-bold text-rose-400 font-mono">2 Backlogs</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-2 font-sans">
                    <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Raw telemetry successfully verified. Dispatching to calculation engine.</span>
                  </div>
                </div>
              )}

              {/* Stage 1 */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Equation: Baseline Formulation</div>
                      <div className="font-sans text-lg font-bold text-white">Deterministic Scoring Execution</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-slate-800 text-sky-300 border border-slate-700">
                      Phase 2
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80">
                      <span>Attendance Component (20%): 62.0 × 0.20</span>
                      <span className="text-sky-300 font-bold">+12.4 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80">
                      <span>Internal Exam Component (30%): 42.0 × 0.30</span>
                      <span className="text-sky-300 font-bold">+12.6 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80">
                      <span>Assignments + GPA Component (30%):</span>
                      <span className="text-sky-300 font-bold">+13.9 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400">
                      <span>Backlog & Submission Deductions:</span>
                      <span className="font-bold text-rose-400">-4.5 pts</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-slate-300 font-sans font-bold">Baseline Composite:</span>
                    <span className="text-2xl font-sans font-bold text-white">43.8 / 100</span>
                  </div>
                </div>
              )}

              {/* Stage 2 */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase font-mono">Ordinary Least Squares Regression</div>
                      <div className="font-sans text-lg font-bold text-white">Momentum Trajectory Alert</div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Needs Attention
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span className="font-sans font-bold text-white text-sm">Negative Trajectory Detected</span>
                      </div>
                      <span className="text-xs font-mono text-rose-400">Slope: -3.8 pts/month</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Trailing 3 months show consistent score contraction. Blended projection calculates a final examination score of <strong>41.2</strong> without prompt academic advisement.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-xs text-slate-400">Current Score</div>
                      <div className="text-xl font-mono font-bold text-slate-200">43.8</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/40">
                      <div className="text-xs text-slate-400">Exam Projection</div>
                      <div className="text-xl font-mono font-bold text-rose-400">41.2</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage 3 */}
              {activeStep === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <div className="text-xs text-slate-400 font-bold font-mono">Prescriptive Action System</div>
                      <div className="font-sans text-lg font-bold text-white">Department Recovery Blueprint</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Action Dispatched
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                      <div className="font-sans font-bold text-white flex items-center justify-between">
                        <span>1. Mandatory Attendance Compact & Advisor Counseling</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">Priority: Immediate</span>
                      </div>
                      <p className="text-slate-300 font-sans">Formulate bilateral agreement targeting 90%+ attendance over trailing 4 weeks.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                      <div className="font-sans font-bold text-white flex items-center justify-between">
                        <span>2. Remedial Lab & Peer Study Circle Enrollment</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Priority: High</span>
                      </div>
                      <p className="text-slate-300 font-sans">Schedule twice-weekly after-hours coaching in Data Structures and DBMS.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                      <div className="font-sans font-bold text-white flex items-center justify-between">
                        <span>3. Weekly Study Pod Blocks</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Priority: Medium</span>
                      </div>
                      <p className="text-slate-300 font-sans">Elevate dedicated self-study from 5.0h to 12.0h weekly in campus library pods.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE SUITE FEATURE GRID */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-900 text-sky-300 border border-slate-800">
            <Cpu className="w-3.5 h-3.5" />
            <span>Digital Campus Intelligence Suite</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Comprehensive Tools for Department Leadership
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-sans">
            Every component designed according to University Governance standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all flex flex-col justify-between group shadow-lg backdrop-blur-md">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-700">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-lg font-bold text-white mb-1.5">Executive Cohort Dashboard</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Real-time monitoring across 150+ students. Donut risk distributions, cohort trend lines, attendance scatter plots, and branch heatmaps.
              </p>
            </div>
            <Link href="/dashboard" className="pt-4 text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:underline">
              <span>Launch Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all flex flex-col justify-between group shadow-lg backdrop-blur-md">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-700">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-lg font-bold text-white mb-1.5">Live What-If Simulator</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Adjust attendance, study hours, and exam targets with live ghost markers to observe how student trajectories recover.
              </p>
            </div>
            <Link href="/student/CS2026-088" className="pt-4 text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:underline">
              <span>Test Simulator</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all flex flex-col justify-between group shadow-lg backdrop-blur-md">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-lg font-bold text-white mb-1.5">Interactive Student Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                3-step structured stepper to compute individual student forecasts, generate roll number identity chips, and review action compacts.
              </p>
            </div>
            <Link href="/analyze" className="pt-4 text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:underline">
              <span>Analyze Record</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all flex flex-col justify-between group shadow-lg backdrop-blur-md">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-700">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-lg font-bold text-white mb-1.5">Batch CSV Risk Scanner</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Drag-and-drop university roster files. Export enriched institutional reports with predicted grades and early warnings.
              </p>
            </div>
            <Link href="/batch" className="pt-4 text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:underline">
              <span>Open Scanner</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all flex flex-col justify-between group shadow-lg backdrop-blur-md">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-700">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-lg font-bold text-white mb-1.5">100% Explainable Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Inspect institutional coefficients, OLS linear derivations, factor gap calculations, and ethical guardrails.
              </p>
            </div>
            <Link href="/how-it-works" className="pt-4 text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:underline">
              <span>Formula Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 hover:border-sky-500/50 transition-all flex flex-col justify-between group shadow-lg backdrop-blur-md">
            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-700">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-lg font-bold text-white mb-1.5">Student Academic Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Empowers students to review personal standing, explore supportive habits, and check off recovery milestones.
              </p>
            </div>
            <Link href="/student-view" className="pt-4 text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:underline">
              <span>Student Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL ETHICAL CHARTER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-slate-900/80 p-8 sm:p-10 rounded-3xl border border-slate-800/80 text-center space-y-4 shadow-xl backdrop-blur-md">
          <div className="inline-flex p-3 rounded-2xl bg-slate-800 text-sky-400 mb-1 border border-slate-700">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-sans text-2xl sm:text-3xl font-bold text-white">
            Academic Charter of Ethical Forecasting
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            AcadRisk is deployed strictly to protect and uplift students, never to stigmatize or exclude. 
            All projections represent statistical trajectories designed to initiate early faculty mentorship. 
            No automated sanctions may be imposed based on algorithmic scores.
          </p>
          <div className="pt-2">
            <Link 
              href="/how-it-works#ethics"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 underline font-sans"
            >
              Review Directorate Ethics Guidelines & Governance Bylaws →
            </Link>
          </div>
        </div>
      </section>

      {/* PORTAL GATEWAY FOOTER CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <CrestLogo size={48} className="mx-auto" />
          <h2 className="font-sans text-3xl sm:text-5xl font-bold text-white">
            Enter the Academic Portal
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-sans">
            Sign in with authorized faculty, dean, or student credentials to access institutional decision intelligence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link href="/login">
              <Button
                variant="primary"
                size="lg"
                isMagnetic={true}
                withArrow={true}
                className="font-sans font-bold px-8 h-12"
              >
                Sign In to University Portal
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="secondary"
                size="lg"
                className="font-sans px-8 h-12"
              >
                Launch Dashboard Directly
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
