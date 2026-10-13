import { RiskLevel, TrendAnalysis } from './types';
import { EngineThresholds, DEFAULT_THRESHOLDS } from './weights';

export interface RiskEvaluation {
  riskLevel: RiskLevel;
  earlyWarning: boolean;
  earlyWarningReasons: string[];
  riskColor: string; // for UI badge
  riskLabel: string;
}

export function evaluateRisk(
  predictedScore: number,
  attendance: number,
  trend: TrendAnalysis,
  thresholds: EngineThresholds = DEFAULT_THRESHOLDS
): RiskEvaluation {
  let riskLevel: RiskLevel = 'LOW';
  let riskColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  let riskLabel = 'Low Risk';

  if (predictedScore < thresholds.highRiskMaxScore) {
    riskLevel = 'HIGH';
    riskColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    riskLabel = 'High Academic Risk';
  } else if (predictedScore < thresholds.lowRiskMinScore) {
    riskLevel = 'MEDIUM';
    riskColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    riskLabel = 'Moderate Risk';
  }

  const earlyWarningReasons: string[] = [];

  // Attendance below 75%
  if (attendance < thresholds.minAttendanceWarning) {
    earlyWarningReasons.push(
      `Attendance critical: ${Math.round(attendance * 10) / 10}% is below mandatory 75% requirement`
    );
  }

  // Downward slope or 3 consecutive declines
  if (trend.isConsecutivelyDeclining || trend.slope < -1.5) {
    earlyWarningReasons.push(
      `Persistent negative trajectory: scores declining at ${Math.abs(trend.slope)} pts/month over trailing assessments`
    );
  }

  const earlyWarning = earlyWarningReasons.length > 0;

  return {
    riskLevel,
    earlyWarning,
    earlyWarningReasons,
    riskColor,
    riskLabel,
  };
}
