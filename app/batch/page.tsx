'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  ArrowRight,
  FileCheck,
  X,
  FileCode,
  GraduationCap,
  ShieldCheck,
  Building2,
  CalendarDays,
  ExternalLink
} from 'lucide-react';
import { CrestLogo } from '@/components/ui/CrestLogo';
import { BranchBadge } from '@/components/ui/BranchBadge';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { RollNumberChip } from '@/components/ui/RollNumberInput';
import { PhoneCell } from '@/components/ui/PhoneInput';
import { Button } from '@/components/ui/Button';

export default function BatchPage() {
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [results, setResults] = useState<any[]>([]);
  const [outputCsv, setOutputCsv] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample CSV template generator with standard roll numbers
  const downloadSampleCsv = () => {
    const sample = 
`RollNo,Name,Class,Attendance,StudyHours,Assignments,InternalMarks,GPA,Backlogs,Participation,LateSubmissions
24R11A0501,Aarav Sharma,CSE-A,84,15,82,75,8.2,0,4,1
24R11A0502,Priya Nair,AIML-A,92,20,90,88,9.0,0,5,0
24R11A0503,Rohan Verma,DS-B,62,5,45,42,4.8,2,2,4
24R11A0504,Neha Gupta,ECE-A,74,10,68,58,6.4,1,3,2
24R11A0505,Vikram Singh,MECH-B,55,4,40,38,4.2,3,1,5
24R11A0506,Tanvi Joshi,CSE-B,88,18,85,82,8.6,0,4,0`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'acadrisk_university_batch_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadSampleIntoInput = () => {
    const sample = 
`RollNo,Name,Class,Attendance,StudyHours,Assignments,InternalMarks,GPA,Backlogs,Participation,LateSubmissions
24R11A0501,Aarav Sharma,CSE-A,84,15,82,75,8.2,0,4,1
24R11A0502,Priya Nair,AIML-A,92,20,90,88,9.0,0,5,0
24R11A0503,Rohan Verma,DS-B,62,5,45,42,4.8,2,2,4
24R11A0504,Neha Gupta,ECE-A,74,10,68,58,6.4,1,3,2
24R11A0505,Vikram Singh,MECH-B,55,4,40,38,4.2,3,1,5
24R11A0506,Tanvi Joshi,CSE-B,88,18,85,82,8.6,0,4,0`;
    setCsvContent(sample);
    setFileName('university_cohort_sample_v5.csv');
    setFileSize('1.4 KB');
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setFileName(null);
    setFileSize(null);
    setCsvContent('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProcess = async () => {
    if (!csvContent.trim()) {
      setError('Please provide CSV roster data by uploading a file or clicking "Load Academic Sample".');
      return;
    }

    setLoading(true);
    setError(null);
    setProgressPercent(15);
    setProgressStage('Validating RFC 4180 student schema...');

    const timer1 = setTimeout(() => {
      setProgressPercent(45);
      setProgressStage('Applying deterministic institutional equations...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgressPercent(80);
      setProgressStage('Synthesizing Ordinary Least Squares projections...');
    }, 850);

    try {
      const res = await fetch('/api/upload-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText: csvContent }),
      });

      const data = await res.json();
      setProgressPercent(100);
      setProgressStage('Analysis finalized.');

      if (!res.ok) {
        setError(data.error || 'Batch processing failed');
      } else {
        setResults(data.results || []);
        setOutputCsv(data.outputCsv || null);
      }
    } catch {
      setError('Network communication failed during batch analysis.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setTimeout(() => setLoading(false), 300);
    }
  };

  const downloadResultsCsv = () => {
    if (!outputCsv) return;
    const blob = new Blob([outputCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `acadrisk_cohort_interventions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to extract branch code for badge
  const parseBranch = (classId?: string): 'CSE' | 'AIML' | 'DS' | 'ECE' | 'MECH' => {
    if (!classId) return 'CSE';
    const upper = classId.toUpperCase();
    if (upper.includes('AIML') || upper.includes('AI')) return 'AIML';
    if (upper.includes('DS') || upper.includes('DATA')) return 'DS';
    if (upper.includes('ECE')) return 'ECE';
    if (upper.includes('MECH')) return 'MECH';
    return 'CSE';
  };

  // Quick stats
  const highRiskCount = results.filter(r => r.riskLevel === 'HIGH').length;
  const mediumRiskCount = results.filter(r => r.riskLevel === 'MEDIUM').length;
  const lowRiskCount = results.filter(r => r.riskLevel === 'LOW').length;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-7xl mx-auto blueprint-grid selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* University Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <CrestLogo size={36} showLabel={false} />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-sky-300 tracking-widest uppercase bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700 font-sans">
                Office of Academic Affairs
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-flex items-center gap-1">
                <CalendarDays className="w-3 h-3 text-sky-400" />
                AY 2026-27 • Semester V
              </span>
            </div>
          </div>

          <h1 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            Cohort Batch Ingestion & Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl leading-relaxed">
            Upload institutional student rosters to perform high-throughput deterministic scoring, identify at-risk trajectories, and dispatch targeted pedagogical action plans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={downloadSampleCsv}
            className="text-xs font-sans"
          >
            <Download className="w-3.5 h-3.5 text-sky-400 mr-1.5" />
            Standard CSV Template
          </Button>
        </div>
      </div>

      {/* Main Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Upload Zone & Text Option */}
        <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-slate-800/80 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-sans text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-sky-400" />
              Upload Student Roster
            </h3>
            <button
              onClick={loadSampleIntoInput}
              className="text-xs text-sky-400 hover:text-sky-300 underline font-semibold transition-colors font-sans"
            >
              Load Demo Template
            </button>
          </div>

          {/* Interactive Drag-and-Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileUpload(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl p-7 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
              isDragging
                ? 'border-sky-400 bg-slate-800/80 scale-[1.01]'
                : fileName
                ? 'border-sky-500/50 bg-slate-950/80'
                : 'border-slate-800 bg-slate-950/60 hover:border-sky-500/50 hover:bg-slate-900/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />

            <motion.div
              animate={{ y: isDragging ? -4 : 0 }}
              className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 mb-3"
            >
              <UploadCloud className="w-6 h-6" />
            </motion.div>

            <span className="text-sm font-semibold text-white font-sans">
              Drag & drop CSV roster file, or <span className="underline text-sky-400">browse</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 font-mono">
              Complies with RFC 4180 • Max recommended: 5,000 records
            </span>
          </div>

          {/* Uploaded File Chip */}
          <AnimatePresence>
            {fileName && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate font-mono">{fileName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{fileSize || 'Standard UTF-8'}</div>
                  </div>
                </div>

                <button
                  onClick={clearFile}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Raw CSV Text Area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 font-sans">
              Or Paste Delimited CSV Content Directly:
            </label>
            <textarea
              rows={5}
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                if (!fileName && e.target.value.trim()) {
                  setFileName('manual_roster_input.csv');
                  setFileSize(`${(new Blob([e.target.value]).size / 1024).toFixed(1)} KB`);
                }
              }}
              placeholder="RollNo,Name,Class,Attendance,StudyHours,Assignments,InternalMarks,GPA,Backlogs..."
              className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition-all placeholder:text-slate-600"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 font-sans">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Progress bar during processing */}
          {loading && (
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-300 animate-pulse">{progressStage}</span>
                <span className="text-slate-300 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-sky-400 rounded-full shadow-sm shadow-sky-400/50"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleProcess}
            isLoading={loading}
            disabled={loading || !csvContent.trim()}
            className="w-full font-sans font-bold tracking-wide"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Process Academic Roster
          </Button>
        </div>

        {/* Right: Specifications & Summary Stats */}
        <div className="lg:col-span-7 space-y-6">
          {results.length > 0 ? (
            /* Post-analysis summary cards */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center shadow-lg backdrop-blur-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">Total Scanned</div>
                  <div className="text-3xl font-extrabold text-white font-mono mt-1">{results.length}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">100% Deterministic</div>
                </div>

                <div className="bg-rose-950/30 text-rose-300 p-5 rounded-2xl border border-rose-500/40 text-center shadow-lg backdrop-blur-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider font-sans">High Risk Flags</div>
                  <div className="text-3xl font-extrabold font-mono mt-1">{highRiskCount}</div>
                  <div className="text-[10px] opacity-80 mt-1">Intervention required</div>
                </div>

                <div className="bg-amber-950/30 text-amber-300 p-5 rounded-2xl border border-amber-500/40 text-center shadow-lg backdrop-blur-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider font-sans">Needs Attention</div>
                  <div className="text-3xl font-extrabold font-mono mt-1">{mediumRiskCount}</div>
                  <div className="text-[10px] opacity-80 mt-1">Advisory compacts</div>
                </div>
              </div>

              {/* Ready to export card */}
              {outputCsv && (
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">
                  <div>
                    <h4 className="font-sans font-bold text-white text-base">Enriched Institutional Telemetry Ready</h4>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">
                      Includes predicted final examination scores, OLS trajectory slopes, and ranked faculty recommendations.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={downloadResultsCsv}
                    className="shrink-0 font-sans font-bold text-xs"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Export CSV Report
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Specification Notice Board */
            <div className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <FileText className="w-4 h-4 text-sky-400" />
                <h3 className="font-sans text-base font-bold text-white">
                  University Roster Schema Guidelines
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The academic intake parser recognizes standard comma-separated fields in any column order. Please verify headers prior to submission:
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950/80 font-mono text-[11px] text-sky-200 border border-slate-800 overflow-x-auto select-all">
                RollNo, Name, Class, Attendance, StudyHours, Assignments, InternalMarks, GPA, Backlogs, Participation, LateSubmissions
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-sans">Roll Number Format:</div>
                  <p className="text-slate-400 font-mono text-[11px]">24R11A0543 (auto-indexed)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-sans">Attendance:</div>
                  <p className="text-slate-400 font-sans text-[11px]">0 to 100% (Flagged if &lt;75%)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-sans">Internal Marks:</div>
                  <p className="text-slate-400 font-sans text-[11px]">Weighted 30% towards composite</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-sans">Historical GPA:</div>
                  <p className="text-slate-400 font-sans text-[11px]">0.0 to 10.0 scale (10% weight)</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Deterministic calculations ensure all batch outputs are verifiable by department boards.</span>
              </div>
            </div>
          )}

          {/* Notice Board style advisory */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider font-sans">
              <Building2 className="w-3.5 h-3.5" />
              Office of Academic Affairs Directive
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Pursuant to Academic Regulation Section 4.2, students classified under "Academic Intervention Recommended" must receive an assigned faculty advisor compact within 5 business days of batch scan publication.
            </p>
          </div>
        </div>
      </div>

      {/* Results Table Section */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-sans text-lg font-bold text-white">
                Intake Assessment Dossier ({results.length} Students)
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Classroom performance indicators paired with linear projected outcomes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                Live Cohort Ingestion
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student & Identity</th>
                  <th className="py-3 px-3">Branch</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-3">Baseline</th>
                  <th className="py-3 px-3">Predicted</th>
                  <th className="py-3 px-3">Risk Status</th>
                  <th className="py-3 px-4">Primary Factor</th>
                  <th className="py-3 px-4">Mandated Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {results.map((r, idx) => {
                  const branch = parseBranch(r.classId);
                  const isHigh = r.riskLevel === 'HIGH';

                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white font-sans">{r.name}</div>
                        <div className="mt-1">
                          <RollNumberChip rollNo={r.rollNo || `24R11A050${idx + 1}`} />
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <BranchBadge branch={branch} size="sm" />
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className={`px-2 py-0.5 rounded ${r.attendance < 75 ? 'text-rose-400 underline font-bold bg-rose-950/30' : 'text-slate-200'}`}>
                          {r.attendance}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {r.currentScore}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        <span className={isHigh ? 'text-rose-400 font-extrabold' : 'text-slate-300'}>
                          {r.predictedScore}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <RiskBadge level={r.riskLevel} />
                        {r.earlyWarning && (
                          <div className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 mt-1 font-sans">
                            <AlertTriangle className="w-3 h-3 text-amber-400" /> Early Decline
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-sans max-w-xs">
                        {r.topRiskFactor}
                      </td>
                      <td className="py-3 px-4 text-white font-medium font-sans">
                        {r.priorityIntervention}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
