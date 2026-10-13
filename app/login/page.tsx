'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Building2,
  CalendarDays,
  BookOpen,
  User,
  Info
} from 'lucide-react';
import { CrestLogo } from '@/components/ui/CrestLogo';
import { Button } from '@/components/ui/Button';
import { RollNumberInput } from '@/components/ui/RollNumberInput';

type RoleType = 'STUDENT' | 'TEACHER' | 'ADMIN';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<RoleType>('TEACHER');
  
  // Credentials
  const [email, setEmail] = useState('teacher@acadrisk.edu');
  const [password, setPassword] = useState('Teacher@123');
  const [rollNumber, setRollNumber] = useState('24R11A0543');
  const [isRollValid, setIsRollValid] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = {
    TEACHER: {
      name: 'Prof. Marcus Holloway',
      email: 'teacher@acadrisk.edu',
      password: 'Teacher@123',
      title: 'Senior Faculty Advisor • CSE',
      desc: 'Access complete department dossiers, interactive what-if simulator & early warnings.',
    },
    ADMIN: {
      name: 'Dr. Evelyn Vance (Dean)',
      email: 'admin@acadrisk.edu',
      password: 'Admin@123',
      title: 'Dean of Academic Affairs',
      desc: 'Cross-branch executive oversight, high-throughput batch scanners & governance policies.',
    },
    STUDENT: {
      name: 'Aarav Sharma (24R11A0543)',
      email: 'student@acadrisk.edu',
      password: 'Student@123',
      rollNo: '24R11A0543',
      title: 'Enrolled Student • CSE Semester V',
      desc: 'Personal trajectory timeline, recovery checklist & self-directed habit tracker.',
    },
  };

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    setError(null);
    const demo = demoAccounts[newRole];
    setEmail(demo.email);
    setPassword(demo.password);
    if (newRole === 'STUDENT') {
      setRollNumber(demoAccounts.STUDENT.rollNo || '24R11A0543');
      setIsRollValid(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If student, check roll number format
    if (role === 'STUDENT' && !isRollValid && !rollNumber.startsWith('CS')) {
      setError('Please provide a valid university Roll Number (Format: 24R11A0543).');
      setLoading(false);
      return;
    }

    try {
      // In student mode, credentials map to the student auth account
      const loginEmail = role === 'STUDENT' ? 'student@acadrisk.edu' : email;
      const loginPassword = role === 'STUDENT' ? 'Student@123' : password;

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication rejected. Please verify credentials.');
        setLoading(false);
        return;
      }

      // Redirect based on user role
      if (data.user?.role === 'STUDENT') {
        router.push('/student-view');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch {
      setError('Network communication failed. Please check local server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 blueprint-grid selection:bg-sky-500 selection:text-slate-950 font-sans">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Campus Visual & Institutional Identity */}
        <div className="lg:col-span-5 bg-slate-900/95 border border-slate-800 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="space-y-6 relative z-10">
            <CrestLogo size={48} />

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-sky-300 tracking-widest uppercase bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700 font-sans">
                Office of Academic Affairs
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Apex Institute of Technology
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Welcome to the Central Academic Risk & Predictive Mentorship Gateway. Sign in with authorized university credentials to access verified decision intelligence.
              </p>
            </div>

            {/* University Metadata Chips */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <CalendarDays className="w-4 h-4 text-sky-400" />
                <span>Academic Year 2026-27 • Semester V</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-sans">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Zero Black-Box Deterministic Compliance</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-sans">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>5 Integrated Engineering Departments</span>
              </div>
            </div>
          </div>

          {/* Quick Notice Banner at bottom */}
          <div className="mt-8 pt-6 border-t border-slate-800 relative z-10">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed font-sans">
                Notice: All session activity is recorded under Institutional Bylaw 12-A for auditing and academic advisory records.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Role-Tabbed Authentication Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Role Tabs with Sliding Indicator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                  Select Portal Persona:
                </label>
                <span className="text-[11px] text-sky-400 font-mono">Pre-seeded Demo</span>
              </div>

              <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 relative">
                {(['STUDENT', 'TEACHER', 'ADMIN'] as RoleType[]).map((r) => {
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`relative z-10 py-2.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 ${
                        isSelected ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {r === 'STUDENT' && <GraduationCap className="w-3.5 h-3.5" />}
                      {r === 'TEACHER' && <UserCheck className="w-3.5 h-3.5" />}
                      {r === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                      <span>{r === 'STUDENT' ? 'Student' : r === 'TEACHER' ? 'Faculty' : 'Dean / Admin'}</span>

                      {isSelected && (
                        <motion.div
                          layoutId="login-role-pill"
                          className="absolute inset-0 bg-sky-400 rounded-xl -z-10 shadow-md shadow-sky-400/30"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persona Preview Badge */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white font-sans">{demoAccounts[role].name}</div>
                <div className="text-[11px] text-slate-400 font-sans">{demoAccounts[role].title}</div>
              </div>
              <span className="text-[10px] font-mono text-sky-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                Ready to Sign In
              </span>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 font-sans"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Conditional Field: Roll Number for Student vs Email for Staff */}
              {role === 'STUDENT' ? (
                <div className="space-y-1">
                  <RollNumberInput
                    value={rollNumber}
                    onChange={(val, isValid) => {
                      setRollNumber(val);
                      setIsRollValid(!!isValid);
                    }}
                    label="University Roll Number"
                    helperText="Input university-issued registration code (Format: 24R11A0543)"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 font-sans">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="faculty@acadrisk.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition-all font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 font-sans">
                    Portal Security Key / Password
                  </label>
                  <span className="text-[11px] text-sky-400 hover:underline cursor-pointer font-sans">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  isMagnetic={true}
                  withArrow={true}
                  className="w-full font-sans font-bold text-sm"
                >
                  Sign In as {role === 'STUDENT' ? 'Student' : role === 'TEACHER' ? 'Faculty Advisor' : 'Department Dean'}
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Demo Pre-fills at Bottom */}
          <div className="mt-8 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 font-sans">
              Need access assistance? Reach the{' '}
              <a href="/how-it-works" className="text-sky-400 hover:underline font-semibold">
                Office of Academic Affairs Helpdesk
              </a>{' '}
              or inspect the{' '}
              <a href="/design-system" className="text-sky-400 hover:underline font-semibold">
                Design System Specification
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
