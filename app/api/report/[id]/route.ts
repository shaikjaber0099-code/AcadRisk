import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeStudent } from '@/lib/engine';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const student = await prisma.student.findFirst({
      where: {
        OR: [{ id }, { rollNo: id }],
      },
      include: {
        monthlyHistory: {
          orderBy: { monthIndex: 'asc' },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const internalMarks = JSON.parse(student.internalMarksJson || '[]');
    const monthlyHistory = student.monthlyHistory.map(m => ({
      monthIndex: m.monthIndex,
      monthName: m.monthName,
      score: m.score,
    }));

    const analysis = analyzeStudent({
      rollNo: student.rollNo,
      name: student.name,
      email: student.email,
      classId: student.classId,
      attendance: student.attendance,
      weeklyStudyHours: student.weeklyStudyHours,
      assignmentCompletion: student.assignmentCompletion,
      previousGpa: student.previousGpa,
      backlogs: student.backlogs,
      participation: student.participation,
      lateSubmissions: student.lateSubmissions,
      internalMarks,
      monthlyHistory,
    });

    const report = {
      institution: 'AcadRisk Academic Assessment Board',
      generatedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      student: {
        id: student.id,
        rollNo: student.rollNo,
        name: student.name,
        email: student.email,
        classId: student.classId,
        attendance: student.attendance,
        weeklyStudyHours: student.weeklyStudyHours,
        assignmentCompletion: student.assignmentCompletion,
        previousGpa: student.previousGpa,
        backlogs: student.backlogs,
        participation: student.participation,
        lateSubmissions: student.lateSubmissions,
        internalMarks,
      },
      evaluation: {
        currentScore: analysis.currentWeightedScore,
        projectedScore: analysis.projectedScore,
        riskLevel: analysis.riskLevel,
        earlyWarning: analysis.earlyWarning,
        earlyWarningReasons: analysis.earlyWarningReasons,
        trend: analysis.trend,
      },
      explainability: analysis.explainability,
      recommendations: analysis.recommendations,
      officialDisclaimer:
        'This dossier was generated using transparent, deterministic weighted indicators and statistical trend projection. It supports faculty advising and must not be used to penalize or label students.',
    };

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate academic report' }, { status: 500 });
  }
}
