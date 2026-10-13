import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        monthlyHistory: {
          orderBy: { monthIndex: 'asc' },
        },
      },
    });

    const totalStudents = students.length;
    if (totalStudents === 0) {
      return NextResponse.json({
        totalStudents: 0,
        atRiskCount: 0,
        atRiskPercentage: 0,
        avgPredictedScore: 0,
        improvingCount: 0,
        decliningCount: 0,
        stableCount: 0,
        riskDistribution: [],
        monthlyTrend: [],
        scatterData: [],
        heatmap: [],
        recentAlerts: [],
      });
    }

    let lowCount = 0;
    let mediumCount = 0;
    let highCount = 0;
    let totalPredicted = 0;
    let improvingCount = 0;
    let decliningCount = 0;
    let stableCount = 0;

    // Monthly score accumulator for 6 months
    const monthlyTotals: { [key: number]: { sum: number; count: number; name: string } } = {
      1: { sum: 0, count: 0, name: 'Aug' },
      2: { sum: 0, count: 0, name: 'Sep' },
      3: { sum: 0, count: 0, name: 'Oct' },
      4: { sum: 0, count: 0, name: 'Nov' },
      5: { sum: 0, count: 0, name: 'Dec' },
      6: { sum: 0, count: 0, name: 'Jan' },
    };

    // Class x Subject marks aggregator
    const classSubjectStats: {
      [classId: string]: {
        [subCode: string]: { sum: number; count: number; atRiskMarksCount: number; name: string };
      };
    } = {
      'CS-A': {},
      'CS-B': {},
      'CS-C': {},
    };

    const scatterData = [];
    const alerts = [];

    for (const s of students) {
      totalPredicted += s.predictedScore;

      if (s.riskLevel === 'HIGH') highCount++;
      else if (s.riskLevel === 'MEDIUM') mediumCount++;
      else lowCount++;

      if (s.trendDirection === 'improving') improvingCount++;
      else if (s.trendDirection === 'declining') decliningCount++;
      else stableCount++;

      scatterData.push({
        id: s.id,
        rollNo: s.rollNo,
        name: s.name,
        attendance: Math.round(s.attendance * 10) / 10,
        predictedScore: Math.round(s.predictedScore * 10) / 10,
        currentScore: Math.round(s.currentScore * 10) / 10,
        riskLevel: s.riskLevel,
        classId: s.classId,
        earlyWarning: s.earlyWarning,
      });

      if (s.earlyWarning) {
        alerts.push({
          id: s.id,
          rollNo: s.rollNo,
          name: s.name,
          classId: s.classId,
          attendance: Math.round(s.attendance * 10) / 10,
          predictedScore: Math.round(s.predictedScore * 10) / 10,
          riskLevel: s.riskLevel,
          reasons: JSON.parse(s.earlyWarningReasons || '[]'),
        });
      }

      // Aggregate monthly history
      for (const mh of s.monthlyHistory) {
        if (monthlyTotals[mh.monthIndex]) {
          monthlyTotals[mh.monthIndex].sum += mh.score;
          monthlyTotals[mh.monthIndex].count++;
          monthlyTotals[mh.monthIndex].name = mh.monthName;
        }
      }

      // Aggregate subjects
      try {
        const subs = JSON.parse(s.internalMarksJson || '[]');
        if (classSubjectStats[s.classId]) {
          for (const sub of subs) {
            if (!classSubjectStats[s.classId][sub.subjectCode]) {
              classSubjectStats[s.classId][sub.subjectCode] = {
                sum: 0,
                count: 0,
                atRiskMarksCount: 0,
                name: sub.subjectName,
              };
            }
            classSubjectStats[s.classId][sub.subjectCode].sum += sub.average;
            classSubjectStats[s.classId][sub.subjectCode].count++;
            if (sub.average < 50) {
              classSubjectStats[s.classId][sub.subjectCode].atRiskMarksCount++;
            }
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    const atRiskPercentage = Math.round((highCount / totalStudents) * 1000) / 10;
    const avgPredictedScore = Math.round((totalPredicted / totalStudents) * 10) / 10;

    const riskDistribution = [
      { name: 'Low Risk (>= 70)', value: lowCount, percentage: Math.round((lowCount / totalStudents) * 100), color: '#10b981' },
      { name: 'Medium Risk (50-69)', value: mediumCount, percentage: Math.round((mediumCount / totalStudents) * 100), color: '#f59e0b' },
      { name: 'High Risk (< 50)', value: highCount, percentage: Math.round((highCount / totalStudents) * 100), color: '#ef4444' },
    ];

    const monthlyTrend = Object.keys(monthlyTotals).map(k => {
      const item = monthlyTotals[parseInt(k, 10)];
      const avg = item.count > 0 ? Math.round((item.sum / item.count) * 10) / 10 : 0;
      return {
        month: item.name,
        averageScore: avg,
      };
    });

    // Format heatmap table
    const subjectsList = ['CS301', 'CS302', 'CS303', 'CS304', 'CS305'];
    const heatmap = ['CS-A', 'CS-B', 'CS-C'].map(cId => {
      const subjectMetrics: any = { classId: cId };
      for (const subCode of subjectsList) {
        const data = classSubjectStats[cId]?.[subCode];
        if (data && data.count > 0) {
          const avgMarks = Math.round((data.sum / data.count) * 10) / 10;
          const riskRate = Math.round((data.atRiskMarksCount / data.count) * 100);
          subjectMetrics[subCode] = {
            average: avgMarks,
            riskRate, // % of students scoring < 50
            name: data.name,
          };
        } else {
          subjectMetrics[subCode] = { average: 70, riskRate: 15, name: subCode };
        }
      }
      return subjectMetrics;
    });

    // Sort alerts by predicted score ascending (most severe first)
    alerts.sort((a, b) => a.predictedScore - b.predictedScore);

    return NextResponse.json({
      totalStudents,
      atRiskCount: highCount,
      atRiskPercentage,
      avgPredictedScore,
      improvingCount,
      decliningCount,
      stableCount,
      riskDistribution,
      monthlyTrend,
      scatterData,
      heatmap,
      recentAlerts: alerts.slice(0, 10),
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json({ error: 'Failed to compute analytics overview' }, { status: 500 });
  }
}
