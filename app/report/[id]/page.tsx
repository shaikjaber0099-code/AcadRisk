'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ArrowLeft, GraduationCap, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function FormalReportPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/report/${id}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData?.report);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400 font-sans">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-sky-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-slate-400 font-sans">
        Report record not found.
      </div>
    );
  }

  const { student, evaluation, explainability, recommendations } = data;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 print:bg-white print:text-black py-10 px-4 sm:px-8 font-sans">
      {/* Action Bar (Hidden in print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href={`/student/${student.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-sky-500/40 transition-colors font-sans"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Back to Student Profile</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 hover:from-sky-400 hover:to-blue-500 text-xs font-bold shadow-md shadow-sky-500/20 transition-all font-sans"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Dossier Document Container */}
      <div className="max-w-4xl mx-auto bg-slate-900/90 print:bg-white border border-slate-800 print:border-gray-300 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl print:shadow-none text-slate-100 print:text-gray-900 backdrop-blur-sm">
        {/* Document Header */}
        <div className="border-b border-slate-800 print:border-gray-300 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-white print:text-black font-bold text-lg font-sans">
              <GraduationCap className="w-6 h-6 text-sky-400 print:text-black" />
              <span>AcadRisk Academic Assessment Board</span>
            </div>
            <div className="text-xs text-slate-400 print:text-gray-500 mt-1 font-mono">
              CONFIDENTIAL STUDENT PERFORMANCE DOSSIER & RISK AUDIT
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 print:text-gray-500 font-mono">
            <div>Dossier Date: {data.generatedDate}</div>
            <div>Ref: AR-2026-{student.rollNo}</div>
          </div>
        </div>

        {/* Student Bio Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-200 text-xs">
          <div>
            <div className="text-slate-400 print:text-gray-500 font-sans">Student Name</div>
            <div className="font-bold text-white print:text-gray-900 mt-0.5 font-sans">{student.name}</div>
          </div>
          <div>
            <div className="text-slate-400 print:text-gray-500 font-sans">Roll Number</div>
            <div className="font-mono font-bold text-sky-400 print:text-gray-900 mt-0.5">{student.rollNo}</div>
          </div>
          <div>
            <div className="text-slate-400 print:text-gray-500 font-sans">Class & Department</div>
            <div className="font-bold text-white print:text-gray-900 mt-0.5 font-sans">{student.classId} • Computer Science</div>
          </div>
          <div>
            <div className="text-slate-400 print:text-gray-500 font-sans">Academic Standing</div>
            <div className="mt-0.5">
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                evaluation.riskLevel === 'HIGH' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 print:bg-rose-100 print:text-rose-800' 
                  : evaluation.riskLevel === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 print:bg-amber-100 print:text-amber-800'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 print:bg-emerald-100 print:text-emerald-800'
              }`}>
                {evaluation.riskLevel} RISK
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-sans">
          <div className="p-3 rounded-xl bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300">
            <div className="text-slate-400 print:text-gray-500 text-[10px]">Current Weighted Score</div>
            <div className="text-xl font-bold font-mono text-white print:text-gray-900 mt-0.5">{evaluation.currentScore} / 100</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300">
            <div className="text-slate-400 print:text-gray-500 text-[10px]">Predicted Exam Score</div>
            <div className="text-xl font-bold font-mono text-sky-400 print:text-black mt-0.5">{evaluation.projectedScore} / 100</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300">
            <div className="text-slate-400 print:text-gray-500 text-[10px]">Attendance Rate</div>
            <div className="text-xl font-bold font-mono text-white print:text-gray-900 mt-0.5">{student.attendance}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 print:bg-gray-100 border border-slate-800 print:border-gray-300">
            <div className="text-slate-400 print:text-gray-500 text-[10px]">Active Backlogs</div>
            <div className="text-xl font-bold font-mono text-white print:text-gray-900 mt-0.5">{student.backlogs}</div>
          </div>
        </div>

        {/* Explainability Gap Factors */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-gray-700 font-sans">
            Algorithmic Factor Attribution & Peer Benchmarks
          </h3>
          <div className="space-y-2 text-xs">
            {explainability.allFactors.map((f: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-200">
                <span className="font-medium text-white print:text-gray-900 font-sans">{f.name} (Weight {f.weight * 100}%)</span>
                <span className="font-mono text-slate-300 print:text-gray-700">
                  Student: <span className="text-sky-300">{f.normalizedStudentScore}%</span> | Benchmark: {f.cohortBenchmark}% ({f.gapFromBenchmark > 0 ? '+' : ''}{f.gapFromBenchmark} pts)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Prescribed Interventions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-gray-700 font-sans">
            Prescribed Academic Recovery Roadmap
          </h3>
          <div className="space-y-3 text-xs">
            {recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-800 print:border-gray-300 bg-slate-950 print:bg-white space-y-1.5">
                <div className="flex justify-between font-bold font-sans">
                  <span className="text-white print:text-gray-900">{idx + 1}. {rec.title}</span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                    rec.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                  }`}>{rec.priority} Priority</span>
                </div>
                <p className="text-slate-400 print:text-gray-600 font-sans">{rec.rationale}</p>
                <div className="text-[11px] text-sky-400 print:text-gray-800 font-mono">
                  Impact: {rec.expectedImpact} | Timeline: {rec.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Signatures & Institutional Disclaimer */}
        <div className="pt-8 border-t border-slate-800 print:border-gray-300 space-y-6 text-xs font-sans">
          <p className="text-[11px] text-slate-400 print:text-gray-500 leading-relaxed italic">
            {data.officialDisclaimer}
          </p>

          <div className="grid grid-cols-2 pt-6 gap-8">
            <div className="border-t border-dashed border-slate-700 print:border-gray-400 pt-2 text-center text-[11px] text-slate-400 print:text-gray-600 font-sans">
              Department Academic Counselor Signature
            </div>
            <div className="border-t border-dashed border-slate-700 print:border-gray-400 pt-2 text-center text-[11px] text-slate-400 print:text-gray-600 font-sans">
              Dean / Faculty Coordinator Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
