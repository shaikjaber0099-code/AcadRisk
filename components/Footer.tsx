import Link from 'next/link';
import { GraduationCap, ShieldCheck, Scale, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#0B0F19] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 no-print font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">AcadRisk</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            AI-Based Student Performance Prediction and Academic Risk Analysis System.
            Built with 100% transparent, explainable mathematics, Ordinary Least Squares trend projection,
            and deterministic pedagogical interventions.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg w-fit">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Verifiable Rule-Based AI • Zero Opaque Machine Learning</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            System Modules
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/dashboard" className="hover:text-sky-400 transition-colors">
                Teacher Dashboard
              </Link>
            </li>
            <li>
              <Link href="/analyze" className="hover:text-sky-400 transition-colors">
                Instant Student Analysis
              </Link>
            </li>
            <li>
              <Link href="/batch" className="hover:text-sky-400 transition-colors">
                CSV Batch Risk Scanner
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-sky-400 transition-colors">
                Mathematical Formulations
              </Link>
            </li>
            <li>
              <Link href="/student-view" className="hover:text-sky-400 transition-colors">
                Student Self-Service Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Ethical Framework */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-sky-400" />
            Ethical Governance
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            AcadRisk complies with academic fairness and data privacy charters. Predictions serve exclusively to direct timely counseling and tutoring support.
          </p>
          <div className="text-xs text-slate-500 font-sans">
            Compliant with FERPA & Higher Education AI Ethics Guidelines.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} AcadRisk Educational Systems. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/how-it-works#ethics" className="hover:text-sky-400">
            Ethics & Human-in-the-Loop
          </Link>
          <span>•</span>
          <Link href="/how-it-works#formula" className="hover:text-sky-400">
            Open Formula Specifications
          </Link>
        </div>
      </div>
    </footer>
  );
}
