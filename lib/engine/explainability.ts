import { NormalizedMetrics } from './scoring';
import { EngineWeights, CohortBenchmarks, DEFAULT_WEIGHTS, DEFAULT_COHORT_BENCHMARKS } from './weights';
import { ExplainabilityResult, FactorBreakdown } from './types';

/**
 * Computes transparent factor gap contributions against cohort averages.
 * Identifies the top 3 primary drivers dragging down student performance.
 */
export function explainStudentRisk(
  studentMetrics: {
    attendance: number;
    internalMarks: number;
    assignmentCompletion: number;
    previousGpa: number;
    weeklyStudyHours: number;
    participation: number;
    backlogs: number;
    lateSubmissions: number;
  },
  normalized: NormalizedMetrics,
  weights: EngineWeights = DEFAULT_WEIGHTS,
  benchmarks: CohortBenchmarks = DEFAULT_COHORT_BENCHMARKS
): ExplainabilityResult {
  const benchGpaNorm = (benchmarks.previousGpa / 10.0) * 100;
  const benchStudyNorm = (benchmarks.studyHours / 20.0) * 100;
  const benchPartNorm = (benchmarks.participation / 5.0) * 100;
  const benchPenalty = Math.min(5.0, (benchmarks.backlogs * 2.0) + (benchmarks.lateSubmissions * 0.75));

  const factors: FactorBreakdown[] = [
    {
      name: 'Classroom Attendance',
      category: 'attendance',
      rawStudentValue: studentMetrics.attendance,
      normalizedStudentScore: normalized.attendanceNorm,
      weight: weights.attendance,
      weightedContribution: Math.round(normalized.attendanceNorm * weights.attendance * 10) / 10,
      cohortBenchmark: benchmarks.attendance,
      gapFromBenchmark: Math.round((normalized.attendanceNorm - benchmarks.attendance) * 10) / 10,
      weightedGap: Math.round((normalized.attendanceNorm - benchmarks.attendance) * weights.attendance * 10) / 10,
      status: normalized.attendanceNorm < 75 ? 'critical' : normalized.attendanceNorm < 85 ? 'warning' : 'satisfactory',
    },
    {
      name: 'Internal Examination Marks',
      category: 'internalMarks',
      rawStudentValue: Math.round(normalized.internalMarksNorm * 10) / 10,
      normalizedStudentScore: normalized.internalMarksNorm,
      weight: weights.internalMarks,
      weightedContribution: Math.round(normalized.internalMarksNorm * weights.internalMarks * 10) / 10,
      cohortBenchmark: benchmarks.internalMarks,
      gapFromBenchmark: Math.round((normalized.internalMarksNorm - benchmarks.internalMarks) * 10) / 10,
      weightedGap: Math.round((normalized.internalMarksNorm - benchmarks.internalMarks) * weights.internalMarks * 10) / 10,
      status: normalized.internalMarksNorm < 50 ? 'critical' : normalized.internalMarksNorm < 65 ? 'warning' : 'satisfactory',
    },
    {
      name: 'Assignment Submissions',
      category: 'assignmentCompletion',
      rawStudentValue: studentMetrics.assignmentCompletion,
      normalizedStudentScore: normalized.assignmentCompletionNorm,
      weight: weights.assignmentCompletion,
      weightedContribution: Math.round(normalized.assignmentCompletionNorm * weights.assignmentCompletion * 10) / 10,
      cohortBenchmark: benchmarks.assignmentCompletion,
      gapFromBenchmark: Math.round((normalized.assignmentCompletionNorm - benchmarks.assignmentCompletion) * 10) / 10,
      weightedGap: Math.round((normalized.assignmentCompletionNorm - benchmarks.assignmentCompletion) * weights.assignmentCompletion * 10) / 10,
      status: normalized.assignmentCompletionNorm < 60 ? 'critical' : normalized.assignmentCompletionNorm < 75 ? 'warning' : 'satisfactory',
    },
    {
      name: 'Prior Academic Record (GPA)',
      category: 'previousGpa',
      rawStudentValue: studentMetrics.previousGpa,
      normalizedStudentScore: normalized.previousGpaNorm,
      weight: weights.previousGpa,
      weightedContribution: Math.round(normalized.previousGpaNorm * weights.previousGpa * 10) / 10,
      cohortBenchmark: benchGpaNorm,
      gapFromBenchmark: Math.round((normalized.previousGpaNorm - benchGpaNorm) * 10) / 10,
      weightedGap: Math.round((normalized.previousGpaNorm - benchGpaNorm) * weights.previousGpa * 10) / 10,
      status: studentMetrics.previousGpa < 5.0 ? 'critical' : studentMetrics.previousGpa < 6.5 ? 'warning' : 'satisfactory',
    },
    {
      name: 'Weekly Self-Study Hours',
      category: 'studyHours',
      rawStudentValue: studentMetrics.weeklyStudyHours,
      normalizedStudentScore: normalized.studyHoursNorm,
      weight: weights.studyHours,
      weightedContribution: Math.round(normalized.studyHoursNorm * weights.studyHours * 10) / 10,
      cohortBenchmark: benchStudyNorm,
      gapFromBenchmark: Math.round((normalized.studyHoursNorm - benchStudyNorm) * 10) / 10,
      weightedGap: Math.round((normalized.studyHoursNorm - benchStudyNorm) * weights.studyHours * 10) / 10,
      status: studentMetrics.weeklyStudyHours < 8 ? 'critical' : studentMetrics.weeklyStudyHours < 12 ? 'warning' : 'satisfactory',
    },
    {
      name: 'Classroom Participation',
      category: 'participation',
      rawStudentValue: studentMetrics.participation,
      normalizedStudentScore: normalized.participationNorm,
      weight: weights.participation,
      weightedContribution: Math.round(normalized.participationNorm * weights.participation * 10) / 10,
      cohortBenchmark: benchPartNorm,
      gapFromBenchmark: Math.round((normalized.participationNorm - benchPartNorm) * 10) / 10,
      weightedGap: Math.round((normalized.participationNorm - benchPartNorm) * weights.participation * 10) / 10,
      status: studentMetrics.participation <= 2 ? 'warning' : 'satisfactory',
    },
    {
      name: 'Academic Penalties (Backlogs & Delays)',
      category: 'penalty',
      rawStudentValue: studentMetrics.backlogs + (studentMetrics.lateSubmissions * 0.5),
      normalizedStudentScore: Math.max(0, 100 - (normalized.penaltyPoints * 20)),
      weight: 0.05,
      weightedContribution: -normalized.penaltyPoints,
      cohortBenchmark: benchPenalty,
      gapFromBenchmark: Math.round((-normalized.penaltyPoints - (-benchPenalty)) * 10) / 10,
      weightedGap: Math.round((-normalized.penaltyPoints + benchPenalty) * 10) / 10,
      status: normalized.penaltyPoints > 3 ? 'critical' : normalized.penaltyPoints > 1 ? 'warning' : 'satisfactory',
    },
  ];

  // Sort negative drivers (factors with negative weightedGap)
  const negativeDrivers = factors
    .filter(f => f.weightedGap < 0)
    .sort((a, b) => a.weightedGap - b.weightedGap) // most negative first
    .map(f => {
      let description = '';
      let actionHint = '';

      switch (f.category) {
        case 'attendance':
          description = `Attendance at ${Math.round(f.rawStudentValue)}% is ${Math.abs(Math.round(f.gapFromBenchmark))}% below the peer average (${benchmarks.attendance}%).`;
          actionHint = 'Establish an attendance compact and schedule an advisor check-in.';
          break;
        case 'internalMarks':
          description = `Internal test marks average ${Math.round(f.rawStudentValue)}% vs cohort benchmark of ${benchmarks.internalMarks}%.`;
          actionHint = 'Enroll in subject-specific remedial doubt-clearing sessions.';
          break;
        case 'assignmentCompletion':
          description = `Assignment completion rate of ${Math.round(f.rawStudentValue)}% lags peer standard (${benchmarks.assignmentCompletion}%).`;
          actionHint = 'Break down upcoming course modules into daily submission checkpoints.';
          break;
        case 'studyHours':
          description = `Dedicates only ${f.rawStudentValue} hrs/week to self-study compared to peer average of ${benchmarks.studyHours} hrs.`;
          actionHint = 'Adopt a block-scheduled study calendar targeting at least 12 hrs/week.';
          break;
        case 'previousGpa':
          description = `Historical GPA (${f.rawStudentValue}/10.0) reflects foundational concept challenges.`;
          actionHint = 'Revisit foundational prerequisites with peer study circles.';
          break;
        case 'participation':
          description = `Engagement level (${f.rawStudentValue}/5) shows minimal active lab/classroom interaction.`;
          actionHint = 'Encourage oral presentation and lab pair-programming tasks.';
          break;
        case 'penalty':
          description = `Accumulated ${studentMetrics.backlogs} backlog(s) and ${studentMetrics.lateSubmissions} late submissions, incurring ${normalized.penaltyPoints} penalty deduction points.`;
          actionHint = 'Prioritize backlog exam clearance and strict deadline management.';
          break;
      }

      return {
        factor: f.name,
        gapScore: Math.abs(f.weightedGap),
        description,
        actionHint,
      };
    });

  // Top positive drivers
  const positiveDrivers = factors
    .filter(f => f.weightedGap >= 0)
    .sort((a, b) => b.weightedGap - a.weightedGap)
    .map(f => ({
      factor: f.name,
      surplusScore: f.weightedGap,
      description: `${f.name} is performing above the cohort benchmark by +${Math.abs(f.gapFromBenchmark)} points.`,
    }));

  return {
    topNegativeDrivers: negativeDrivers.slice(0, 3),
    topPositiveDrivers: positiveDrivers.slice(0, 3),
    allFactors: factors,
  };
}
