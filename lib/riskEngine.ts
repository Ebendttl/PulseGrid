import { Student, RiskScore } from "@/types/domain";

/**
 * Calculates a student's operational risk score based on weighted factors:
 * - Attendance risk: (1 - attendanceRate) * 0.5
 * - Fee risk: overdueFeeRatio * 0.3
 * - Lateness risk: latenessRate * 0.2
 *
 * Thresholds:
 * - High Risk: overallScore >= 0.25
 * - Medium Risk: 0.12 <= overallScore < 0.25
 * - Low Risk: overallScore < 0.12
 */
export function calculateRuleBasedRisk(student: Student): RiskScore {
  const attendanceFactor = Math.max(0, 1 - student.attendanceRate) * 0.5;
  const feeFactor = Math.min(1, Math.max(0, student.overdueFeeRatio)) * 0.3;
  const latenessFactor = Math.min(1, Math.max(0, student.latenessRate)) * 0.2;

  const rawScore = attendanceFactor + feeFactor + latenessFactor;
  const overallScore = Number(rawScore.toFixed(3));

  let tier: "low" | "medium" | "high" = "low";
  if (overallScore >= 0.25) {
    tier = "high";
  } else if (overallScore >= 0.12) {
    tier = "medium";
  }

  return {
    studentId: student.id,
    studentName: student.name,
    overallScore,
    tier,
    attendanceFactor: Number(attendanceFactor.toFixed(3)),
    feeFactor: Number(feeFactor.toFixed(3)),
    latenessFactor: Number(latenessFactor.toFixed(3)),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * AI-powered or Rule-based risk insight evaluator.
 * Respects NEXT_PUBLIC_AI_MODE ('rule' | 'api').
 * On API failure or timeout (3s limit), falls back seamlessly to rule-based logic.
 */
export async function getRiskInsight(student: Student): Promise<RiskScore> {
  const mode = process.env.NEXT_PUBLIC_AI_MODE || "rule";

  if (mode === "api") {
    try {
      // Simulate API call with 3s timeout promise race
      const apiPromise = fetch(`/api/risk?studentId=${student.id}`).then(
        async (res) => {
          if (!res.ok) throw new Error("API response error");
          return (await res.json()) as RiskScore;
        }
      );

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );

      return await Promise.race([apiPromise, timeoutPromise]);
    } catch {
      // Fallback on timeout or fetch error
      return calculateRuleBasedRisk(student);
    }
  }

  return calculateRuleBasedRisk(student);
}
