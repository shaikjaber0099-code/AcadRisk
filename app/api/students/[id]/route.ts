import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeStudent, simulateStudentPerformance } from '@/lib/engine';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const isSimulate = searchParams.get('simulate') === 'true';

    // Find student by ID or rollNo
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

    const studentEngineInput = {
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
    };

    const analysis = analyzeStudent(studentEngineInput);

    let simulationResult = null;
    if (isSimulate) {
      const simAttendance = searchParams.has('simAttendance') ? parseFloat(searchParams.get('simAttendance')!) : undefined;
      const simStudyHours = searchParams.has('simStudyHours') ? parseFloat(searchParams.get('simStudyHours')!) : undefined;
      const simAssignment = searchParams.has('simAssignment') ? parseFloat(searchParams.get('simAssignment')!) : undefined;
      const simBacklogs = searchParams.has('simBacklogs') ? parseInt(searchParams.get('simBacklogs')!, 10) : undefined;
      const simLate = searchParams.has('simLate') ? parseInt(searchParams.get('simLate')!, 10) : undefined;

      simulationResult = simulateStudentPerformance(studentEngineInput, {
        attendance: simAttendance,
        weeklyStudyHours: simStudyHours,
        assignmentCompletion: simAssignment,
        backlogs: simBacklogs,
        lateSubmissions: simLate,
      });
    }

    return NextResponse.json({
      student: {
        ...student,
        internalMarks,
        earlyWarningReasons: JSON.parse(student.earlyWarningReasons || '[]'),
      },
      analysis,
      simulation: simulationResult,
    });
  } catch (error) {
    console.error('Error fetching student detail:', error);
    return NextResponse.json({ error: 'Failed to retrieve student details' }, { status: 500 });
  }
}
