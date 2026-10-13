import { NextResponse } from 'next/server';
import { analyzeStudent } from '@/lib/engine';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let csvText = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No CSV file provided' }, { status: 400 });
      }
      csvText = await file.text();
    } else {
      const body = await request.json();
      csvText = body.csvText || '';
    }

    if (!csvText.trim()) {
      return NextResponse.json({ error: 'CSV content is empty' }, { status: 400 });
    }

    // Parse lines
    const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length <= 1) {
      return NextResponse.json({ error: 'CSV file contains no data rows' }, { status: 400 });
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Map column indices
    const colIndex = {
      rollNo: header.findIndex(h => h.includes('roll')),
      name: header.findIndex(h => h.includes('name')),
      classId: header.findIndex(h => h.includes('class')),
      attendance: header.findIndex(h => h.includes('attend')),
      studyHours: header.findIndex(h => h.includes('study') || h.includes('hour')),
      assignments: header.findIndex(h => h.includes('assign')),
      internalMarks: header.findIndex(h => h.includes('internal') || h.includes('mark')),
      gpa: header.findIndex(h => h.includes('gpa')),
      backlogs: header.findIndex(h => h.includes('backlog')),
      participation: header.findIndex(h => h.includes('participat')),
      lateSubmissions: header.findIndex(h => h.includes('late')),
    };

    const results = [];
    const outputRows = [];
    
    // Header for output CSV
    outputRows.push(
      'RollNo,Name,Class,Attendance,StudyHours,Assignments,InternalMarks,GPA,Backlogs,Participation,LateSubmissions,CurrentScore,PredictedScore,RiskLevel,EarlyWarning,TopRiskFactor,PriorityIntervention'
    );

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 5) continue; // skip empty or malformed

      const rollNo = colIndex.rollNo !== -1 ? cols[colIndex.rollNo] : `STU-${i}`;
      const name = colIndex.name !== -1 ? cols[colIndex.name] : `Student ${i}`;
      const classId = colIndex.classId !== -1 ? cols[colIndex.classId] : 'CS-A';
      const attendance = colIndex.attendance !== -1 ? parseFloat(cols[colIndex.attendance]) || 75 : 75;
      const weeklyStudyHours = colIndex.studyHours !== -1 ? parseFloat(cols[colIndex.studyHours]) || 10 : 10;
      const assignmentCompletion = colIndex.assignments !== -1 ? parseFloat(cols[colIndex.assignments]) || 70 : 70;
      const internalMarks = colIndex.internalMarks !== -1 ? parseFloat(cols[colIndex.internalMarks]) || 65 : 65;
      const previousGpa = colIndex.gpa !== -1 ? parseFloat(cols[colIndex.gpa]) || 7.0 : 7.0;
      const backlogs = colIndex.backlogs !== -1 ? parseInt(cols[colIndex.backlogs], 10) || 0 : 0;
      const participation = colIndex.participation !== -1 ? parseFloat(cols[colIndex.participation]) || 3 : 3;
      const lateSubmissions = colIndex.lateSubmissions !== -1 ? parseInt(cols[colIndex.lateSubmissions], 10) || 0 : 0;

      const analysis = analyzeStudent({
        rollNo,
        name,
        classId,
        attendance,
        weeklyStudyHours,
        assignmentCompletion,
        internalMarks,
        previousGpa,
        backlogs,
        participation,
        lateSubmissions,
      });

      const topReason = analysis.explainability.topNegativeDrivers[0]?.factor || 'None';
      const topIntervention = analysis.recommendations[0]?.title || 'Standard Monitoring';

      results.push({
        rollNo,
        name,
        classId,
        attendance,
        weeklyStudyHours,
        assignmentCompletion,
        internalMarks,
        previousGpa,
        backlogs,
        participation,
        lateSubmissions,
        currentScore: analysis.currentWeightedScore,
        predictedScore: analysis.projectedScore,
        riskLevel: analysis.riskLevel,
        earlyWarning: analysis.earlyWarning,
        topRiskFactor: topReason,
        priorityIntervention: topIntervention,
      });

      outputRows.push(
        `"${rollNo}","${name}","${classId}",${attendance},${weeklyStudyHours},${assignmentCompletion},${internalMarks},${previousGpa},${backlogs},${participation},${lateSubmissions},${analysis.currentWeightedScore},${analysis.projectedScore},"${analysis.riskLevel}",${analysis.earlyWarning},"${topReason}","${topIntervention}"`
      );
    }

    const outputCsv = outputRows.join('\n');

    return NextResponse.json({
      success: true,
      processedCount: results.length,
      results,
      outputCsv,
    });
  } catch (error) {
    console.error('Batch CSV error:', error);
    return NextResponse.json({ error: 'Failed to process batch CSV analysis' }, { status: 500 });
  }
}
