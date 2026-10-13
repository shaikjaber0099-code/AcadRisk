'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import BranchBadge, { BranchCode } from './BranchBadge';
import RiskBadge, { RiskLevel } from './RiskBadge';
import { RollNumberChip } from './RollNumberInput';
import { PhoneCell } from './PhoneInput';
import { QrCode, ArrowUpRight, TrendingUp, CalendarCheck } from 'lucide-react';

export interface StudentCardData {
  id: string;
  name: string;
  rollNo: string;
  branch: BranchCode;
  phone?: string;
  attendance: number;
  predictedScore: number;
  riskLevel: RiskLevel;
  avatarUrl?: string;
  semester?: string;
}

interface StudentIdCardProps {
  student: StudentCardData;
  className?: string;
  onSelect?: (student: StudentCardData) => void;
  interactive?: boolean;
}

export function StudentIdCard({
  student,
  className = '',
  onSelect,
  interactive = true,
}: StudentIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [highlightPos, setHighlightPos] = useState({ x: 50, y: 50 });

  // 3D Tilt calculation (max 4 degrees tilt)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -4;
    const rY = ((x - centerX) / centerX) * 4;

    setRotateX(rX);
    setRotateY(rY);
    setHighlightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setHighlightPos({ x: 50, y: 50 });
  };

  const initials = student.name
    ? student.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ST';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.16s cubic-bezier(0.2, 0, 0, 1)',
      }}
      className={`relative rounded-idcard student-id-card p-5 group flex flex-col justify-between transition-shadow hover:shadow-2xl border border-slate-800 hover:border-sky-500/50 bg-slate-900/90 backdrop-blur-sm ${className}`}
    >
      {/* Light follow highlight sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-idcard"
        style={{
          background: `radial-gradient(circle 260px at ${highlightPos.x}% ${highlightPos.y}%, rgba(56, 189, 248, 0.12), transparent 80%)`,
        }}
      />

      {/* Card Header: Crest Ribbon & Branch Badge */}
      <div className="flex items-start justify-between gap-3 relative z-10 mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar or Initials Frame */}
          <div className="relative w-12 h-12 rounded-xl bg-slate-950 border border-sky-400/30 flex items-center justify-center font-sans text-base font-bold text-sky-300 shadow-md overflow-hidden shrink-0">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-sky-400" />
          </div>

          <div className="flex flex-col">
            <h3 className="font-sans font-bold text-base text-white group-hover:text-sky-300 transition-colors line-clamp-1">
              {student.name}
            </h3>
            <span className="text-[11px] text-slate-400 font-sans">
              Semester V • AY 2026-27
            </span>
          </div>
        </div>

        <BranchBadge branch={student.branch} size="sm" withGlow />
      </div>

      {/* Identity Fields: Monospace Roll Number Chip & Masked Phone */}
      <div className="space-y-2 relative z-10 py-2 border-y border-slate-800/80 my-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-sans tracking-wider text-slate-400">
            Roll No
          </span>
          <RollNumberChip rollNo={student.rollNo} size="sm" />
        </div>

        {student.phone && (
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-sans tracking-wider text-slate-400">
              Contact
            </span>
            <PhoneCell phone={student.phone} />
          </div>
        )}
      </div>

      {/* Academic Stats: Attendance & Predicted Score */}
      <div className="grid grid-cols-2 gap-2 my-3 relative z-10">
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <CalendarCheck className="w-3 h-3 text-sky-400" />
            <span>Attendance</span>
          </div>
          <span className="text-base font-bold font-mono text-white mt-0.5 tabular-nums">
            {student.attendance}%
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <TrendingUp className="w-3 h-3 text-sky-400" />
            <span>Forecast Score</span>
          </div>
          <span className="text-base font-bold font-mono text-white mt-0.5 tabular-nums">
            {student.predictedScore}/100
          </span>
        </div>
      </div>

      {/* Footer: Risk Badge, QR Code, and Detail Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 relative z-10 mt-auto">
        <RiskBadge level={student.riskLevel} size="sm" />

        <div className="flex items-center gap-2">
          {/* Subtle QR Code watermark placeholder */}
          <div
            className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400"
            title="Digital Student ID Verification"
          >
            <QrCode className="w-3.5 h-3.5 opacity-80" />
          </div>

          <Link
            href={`/student/${student.id}`}
            onClick={() => onSelect?.(student)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500 hover:text-slate-950 text-xs font-semibold transition-all shadow-sm"
          >
            <span>Dossier</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentIdCard;
