/**
 * AcadRisk - Shared Type Definitions
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SubjectInternalMark {
  subjectCode: string;
  subjectName: string;
  test1: number; // 0-100
  test2: number; // 0-100
  test3: number; // 0-100
  average?: number; // calculated 0-100
}

export interface StudentInputData {
  rollNo: string;
  name: string;
  email?: string;
  classId: string;
  attendance: number;          // 0-100 %
  weeklyStudyHours: number;    // 0-40 hours/week
  assignmentCompletion: number;// 0-100 %
  internalMarks: SubjectInternalMark[] | number; // Array of subjects or flat average
  previousGpa: number;         // 0.0 - 10.0 scale
  backlogs: number;            // 0 - 10 count
  participation: number;       // 1 - 5 scale
  lateSubmissions: number;     // 0 - 20 count
  monthlyHistory?: MonthlyRecord[];
}

export interface MonthlyRecord {
  monthIndex: number;          // 1 to 6
  monthName: string;           // "Month 1", "Month 2", etc. or "Sep", "Oct"
  score: number;               // 0 - 100 composite score
  attendance?: number;
  studyHours?: number;
}

export interface FactorBreakdown {
  name: string;
  category: 'attendance' | 'internalMarks' | 'assignmentCompletion' | 'previousGpa' | 'studyHours' | 'participation' | 'penalty';
  rawStudentValue: number;
  normalizedStudentScore: number; // 0 - 100
  weight: number;
  weightedContribution: number;   // Points contributed to final score
  cohortBenchmark: number;
  gapFromBenchmark: number;       // raw difference
  weightedGap: number;            // weighted negative impact on score
  status: 'critical' | 'warning' | 'satisfactory' | 'optimal';
}

export interface ExplainabilityResult {
  topNegativeDrivers: {
    factor: string;
    gapScore: number;
    description: string;
    actionHint: string;
  }[];
  topPositiveDrivers: {
    factor: string;
    surplusScore: number;
    description: string;
  }[];
  allFactors: FactorBreakdown[];
}

export interface RecommendationItem {
  id: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  rationale: string;
  actionItems: string[];
  expectedImpact: string;
  timeline: string;
}

export interface TrendAnalysis {
  slope: number;                // Score change per month (e.g. +2.4 or -3.1)
  intercept: number;            // y-intercept
  rSquared: number;             // 0.0 - 1.0 goodness of fit
  trendDirection: 'improving' | 'declining' | 'stable';
  isConsecutivelyDeclining: boolean; // 3 months consecutive drops
  projectedMonthScore: number;  // Linear extrapolation at target exam month (Month 7)
  monthlyPoints: { month: string; actual: number; projected?: number }[];
}

export interface AnalysisOutput {
  currentWeightedScore: number; // 0 - 100
  projectedScore: number;       // Blended: 70% trend projection + 30% current weighted score (0-100)
  riskLevel: RiskLevel;
  earlyWarning: boolean;
  earlyWarningReasons: string[];
  trend: TrendAnalysis;
  explainability: ExplainabilityResult;
  recommendations: RecommendationItem[];
  timestamp: string;
}
