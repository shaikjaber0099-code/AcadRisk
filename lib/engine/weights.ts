/**
 * AcadRisk - Smart Analysis Engine Weights & Thresholds Configuration
 * Fully transparent, editable rule-based parameters.
 */

export interface EngineWeights {
  attendance: number;           // Default: 0.20 (20%)
  internalMarks: number;        // Default: 0.30 (30%)
  assignmentCompletion: number; // Default: 0.15 (15%)
  previousGpa: number;          // Default: 0.15 (15%)
  studyHours: number;           // Default: 0.10 (10%)
  participation: number;        // Default: 0.05 (5%)
  maxPenalty: number;           // Default: 5.0 (max 5 points deduction)
}

export interface EngineThresholds {
  lowRiskMinScore: number;      // >= 70 is Low Risk
  mediumRiskMinScore: number;   // 50 to 69 is Medium Risk
  highRiskMaxScore: number;     // < 50 is High Risk
  minAttendanceWarning: number; // Attendance < 75% triggers Early Warning
  minStudyHoursTarget: number;  // Recommended weekly hours: 15h
  projectionWeightTrend: number;// 70% weight on regression projection
  projectionWeightScore: number;// 30% weight on current weighted score
}

export interface CohortBenchmarks {
  attendance: number;
  internalMarks: number;
  assignmentCompletion: number;
  previousGpa: number; // on 0-10 scale
  studyHours: number;  // weekly
  participation: number; // on 1-5 scale
  backlogs: number;
  lateSubmissions: number;
}

export const DEFAULT_WEIGHTS: EngineWeights = {
  attendance: 0.20,
  internalMarks: 0.30,
  assignmentCompletion: 0.15,
  previousGpa: 0.15,
  studyHours: 0.10,
  participation: 0.05,
  maxPenalty: 5.0,
};

export const DEFAULT_THRESHOLDS: EngineThresholds = {
  lowRiskMinScore: 70,
  mediumRiskMinScore: 50,
  highRiskMaxScore: 50,
  minAttendanceWarning: 75.0,
  minStudyHoursTarget: 15.0,
  projectionWeightTrend: 0.70,
  projectionWeightScore: 0.30,
};

export const DEFAULT_COHORT_BENCHMARKS: CohortBenchmarks = {
  attendance: 78.5,
  internalMarks: 68.2,
  assignmentCompletion: 74.0,
  previousGpa: 7.2,
  studyHours: 12.5,
  participation: 3.4,
  backlogs: 0.4,
  lateSubmissions: 1.2,
};
