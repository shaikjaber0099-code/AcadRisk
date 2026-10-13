'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Sparkles,
  UploadCloud,
  HelpCircle,
  GraduationCap,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Search,
  BookOpen,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import CrestLogo from './ui/CrestLogo';
import { BRANCH_CONFIGS, BranchBadge } from './ui/BranchBadge';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [pathname]);

  // Scroll listener: progress bar, hide on scroll down / show on scroll up, blur shrink after 80px
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (currentY / totalScroll) * 100 : 0;
      setScrollProgress(progress);

      setScrolled(currentY > 80);

      // Hide on scroll down, show on scroll up
      if (currentY > lastScrollY.current && currentY > 150) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze Record', href: '/analyze', icon: Sparkles },
    { name: 'Batch Upload', href: '/batch', icon: UploadCloud },
    { name: 'Student View', href: '/student-view', icon: GraduationCap },
    { name: 'Figma System', href: '/design-system', icon: Sliders, badge: 'NEW' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Scroll Reading Progress Line (Frost Blue) */}
      <div
        className="h-[2px] bg-sky-400 transition-all duration-75 origin-left"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* University Official Notice Bar */}
      <div className="bg-[#0B0F19] border-b border-slate-800/80 px-4 py-1 text-center text-xs text-slate-300 flex items-center justify-center gap-2 select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
        <span className="font-sans tracking-wide text-white font-medium">
          Apex Institute of Technology • Office of Academic Affairs
        </span>
        <span className="hidden sm:inline-block text-slate-400 font-sans">
          — AY 2026-27 • Semester V Academic Risk & Intervention Cycle Active
        </span>
      </div>

      {/* Main Floating Navbar Header */}
      <header
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'py-2 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl'
            : 'py-3.5 bg-[#0B0F19]/80 backdrop-blur-lg border-b border-slate-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo with Crest */}
          <Link href="/" className="flex items-center gap-2 group">
            <CrestLogo size={scrolled ? 36 : 40} subtext="Office of Academic Affairs" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all select-none ${
                    isActive
                      ? 'text-sky-300 bg-sky-500/10 border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>

                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Academic Branches Mega-Menu Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setBranchMenuOpen(!branchMenuOpen)}
                onMouseEnter={() => setBranchMenuOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Departments</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                    branchMenuOpen ? 'rotate-180 text-sky-400' : ''
                  }`}
                />
              </button>

              {/* Mega-menu Panel */}
              <AnimatePresence>
                {branchMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    onMouseLeave={() => setBranchMenuOpen(false)}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[580px] rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl p-4 backdrop-blur-2xl z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-sm text-white">
                          Academic Engineering Branches
                        </span>
                        <span className="text-[10px] font-mono text-sky-300 px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30">
                          5 Departments
                        </span>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setBranchMenuOpen(false)}
                        className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1"
                      >
                        <span>Cross-branch analytics</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {Object.entries(BRANCH_CONFIGS).map(([code, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                          <Link
                            key={code}
                            href={`/dashboard?branch=${code}`}
                            onClick={() => setBranchMenuOpen(false)}
                            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 transition-all group flex items-start gap-3"
                          >
                            <div
                              style={{ backgroundColor: cfg.bgColor, color: cfg.color }}
                              className="p-2 rounded-lg shrink-0 border border-slate-700/80"
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                                {cfg.code}
                              </span>
                              <span className="text-[11px] text-slate-400 line-clamp-1">
                                {cfg.name}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* User Status & AY Chip */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span>AY 2026-27</span>
              <span className="opacity-40">•</span>
              <span className="text-sky-400 font-semibold">Sem V</span>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                  <div className="text-[10px] font-mono text-sky-400 uppercase">
                    {currentUser.role}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 border border-slate-800"
                  title="Sign out of portal"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl shadow-md shadow-sky-500/20 border border-sky-400/30 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 border border-slate-800"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-slate-800 bg-[#0B0F19]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-800">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-md border border-sky-400/30"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
