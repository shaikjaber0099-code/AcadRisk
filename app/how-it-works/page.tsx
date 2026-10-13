import Link from 'next/link';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  Scale, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  HelpCircle, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS } from '@/lib/engine';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 px-4 sm:px-6 lg:px-8 py-12 space-y-16 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full font-sans shadow-sm">
          <Calculator className="w-3.5 h-3.5" />
          <span>Transparent Algorithmic Specification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
          How the Smart Analysis Engine Works
        </h1>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
          AcadRisk is 100% free of black-box Machine Learning. Every score, trajectory projection, 
          and pedagogical recommendation is computed through verifiable, deterministic mathematics.
        </p>
      </div>

      {/* 1. Core Weighted Formula Section */}
      <section id="formula" className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-8">
        <div>
          <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Section 1.0</div>
          <h2 className="text-2xl font-bold text-white mt-1 font-sans">Multi-Factor Performance Score (S_current)</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-sans">
            Student performance is scored on an absolute 0 to 100 scale using a transparent weighted sum of normalized inputs, minus disciplinary deductions:
          </p>
        </div>

        {/* Formula Display Box */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-center text-slate-200 overflow-x-auto shadow-inner">
          <span className="text-sky-400 font-bold">Score</span> = (Attendance × 0.20) + (InternalMarks × 0.30) + (Assignments × 0.15) + (GPA_Norm × 0.15) + (StudyHours_Norm × 0.10) + (Participation_Norm × 0.05) - <span className="text-rose-400 underline font-bold">Penalties</span>
        </div>

        {/* Weights Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold text-white font-sans">
              <span>1. Classroom Attendance</span>
              <span className="text-sky-400 font-mono">20% Weight (0.20)</span>
            </div>
            <p className="text-slate-400 font-sans">
              Direct percentage (0-100%). Institutional regulatory threshold is 75%.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold text-white font-sans">
              <span>2. Internal Examination Marks</span>
              <span className="text-sky-400 font-mono">30% Weight (0.30)</span>
            </div>
            <p className="text-slate-400 font-sans">
              Average across 5 core subjects, each tested across 3 periodic examinations (test1, test2, test3).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold text-white font-sans">
              <span>3. Assignment Submissions</span>
              <span className="text-sky-400 font-mono">15% Weight (0.15)</span>
            </div>
            <p className="text-slate-400 font-sans">
              Percentage of scheduled module assignments completed and submitted (0-100%).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold text-white font-sans">
              <span>4. Prior Semester GPA</span>
              <span className="text-sky-400 font-mono">15% Weight (0.15)</span>
            </div>
            <p className="text-slate-400 font-sans">
              Scaled linearly from 0.0-10.0 grade point average: <code className="text-sky-300 font-mono">(GPA / 10.0) × 100</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold text-white font-sans">
              <span>5. Weekly Self-Study Hours</span>
              <span className="text-sky-400 font-mono">10% Weight (0.10)</span>
            </div>
            <p className="text-slate-400 font-sans">
              Normalized against institutional 20 hrs/week target: <code className="text-sky-300 font-mono">min(100, (Hours / 20) × 100)</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold text-white font-sans">
              <span>6. Classroom Participation</span>
              <span className="text-sky-400 font-mono">5% Weight (0.05)</span>
            </div>
            <p className="text-slate-400 font-sans">
              Faculty evaluation score on 1 to 5 scale: <code className="text-sky-300 font-mono">(Participation / 5.0) × 100</code>.
            </p>
          </div>
        </div>

        {/* Deduction Rules */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="font-bold text-rose-300 flex items-center gap-1.5 font-sans">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Academic Deductions (Maximum 5.0 Points Subtraction)</span>
          </div>
          <p className="text-slate-300 font-sans">
            Penalties discourage backlog accumulation and chronic late submissions:
          </p>
          <div className="font-mono text-rose-200">
            Penalty = min(5.0, (Backlogs × 2.0) + (LateSubmissions × 0.75))
          </div>
        </div>
      </section>

      {/* 2. Linear Regression Trend Projection */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-8">
        <div>
          <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Section 2.0</div>
          <h2 className="text-2xl font-bold text-white mt-1 font-sans">
            Hand-Crafted Ordinary Least Squares (OLS) Linear Regression
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-sans">
            Rather than training an uninterpretable machine learning model, student trajectory is projected using hand-coded closed-form mathematical regression over their 6-month historical evaluations:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-center">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px]">Slope (m)</div>
            <div className="text-sky-400 font-bold text-sm">m = Σ(x - x̄)(y - ȳ) / Σ(x - x̄)²</div>
            <div className="text-slate-500 text-[10px]">Rate of score change per month</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px]">Intercept (c)</div>
            <div className="text-sky-400 font-bold text-sm">c = ȳ - m · x̄</div>
            <div className="text-slate-500 text-[10px]">Initial baseline reference</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 text-[10px]">Goodness of Fit (R²)</div>
            <div className="text-sky-400 font-bold text-sm">R² = [Σ(x-x̄)(y-ȳ)]² / [SS_xx · SS_yy]</div>
            <div className="text-slate-500 text-[10px]">Variance explained (0.0 to 1.0)</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          <h4 className="font-bold text-white font-sans">70% Trend + 30% Current Score Blending Formula:</h4>
          <p className="text-slate-300 leading-relaxed font-sans">
            To prevent erratic linear runaway while still honoring true momentum, the projected final exam score blends 
            70% of the regression forecast at Month 7 with 30% of the student's current weighted score:
          </p>
          <div className="font-mono text-sky-300 font-bold p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            PredictedFinalScore = clamp((0.70 × LinearProjection) + (0.30 × CurrentWeightedScore), 0, 100)
          </div>
        </div>
      </section>

      {/* 3. Risk Classification & Early Warning Rules */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-6">
        <div>
          <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Section 3.0</div>
          <h2 className="text-2xl font-bold text-white mt-1 font-sans">Risk Classification & Early Warning Flags</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans">
            Predicted scores are categorized into clear, actionable institutional tiers:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[10px] font-mono border border-emerald-500/40">
              LOW RISK (≥ 70.0)
            </span>
            <p className="text-slate-300">
              Student is performing well and tracking toward strong end-semester exam clearance. Suitable for honors or peer mentoring.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase text-[10px] font-mono border border-amber-500/40">
              MEDIUM RISK (50.0 - 69.9)
            </span>
            <p className="text-slate-300">
              Student exhibits moderate vulnerability in one or two subjects. Recommended for targeted revision and milestone trackers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold uppercase text-[10px] font-mono border border-rose-500/40">
              HIGH RISK (&lt; 50.0)
            </span>
            <p className="text-slate-300">
              Immediate academic intervention required. Student is at severe risk of failing or course debarment.
            </p>
          </div>
        </div>

        {/* Early Warning Trigger Rules */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-sans">
          <div className="font-bold text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Early Warning Trigger Conditions:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 font-sans">
            <li><strong>Attendance Breached:</strong> Attendance falls below the mandatory institutional 75% cutoff.</li>
            <li><strong>Trajectory Deterioration:</strong> Trend slope is negative for 3 consecutive evaluation cycles or slope &lt; -1.5 pts/mo.</li>
          </ul>
        </div>
      </section>

      {/* 4. Ethical Safeguards & Human-in-the-Loop */}
      <section id="ethics" className="p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Governance & Ethics</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">Human-in-the-Loop Safeguard Pledge</h2>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          <p>
            <strong>Decision Support, Not Replacement:</strong> AcadRisk is designed solely as an early-warning telemetry compass for teachers, counselors, and academic advisors. Under no circumstances should algorithmic scores replace human discretion or faculty empathy.
          </p>
          <p>
            <strong>No Penalization Charter:</strong> Predictions must never be used to discipline, debar, rank publicly, or stigmatize any student. The purpose of risk classification is purely to schedule personalized tutoring, provide study counseling, and remove learning barriers.
          </p>
          <p>
            <strong>Complete Auditability:</strong> Because AcadRisk uses explicit formulas instead of black-box neural networks, any student or faculty member can inspect the exact raw values and weights that produced their score.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-sans">
          Complies with the IEEE Ethics in Autonomous Systems Guidelines and Institutional Higher Education Data Standards.
        </div>
      </section>

      {/* Navigation CTA */}
      <div className="text-center pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-sky-400 hover:to-blue-500 transition-all font-sans shadow-lg shadow-sky-500/20"
        >
          <span>Return to Faculty Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
