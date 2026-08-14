import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateRuleBasedRisk, getRiskInsight } from "@/lib/riskEngine";
import {
  timeToMinutes,
  doSessionsOverlap,
  detectTimetableConflicts,
} from "@/lib/timetableConflict";
import {
  formatCurrency,
  formatPercentage,
  formatDate,
} from "@/lib/formatters";
import { apiClient } from "@/lib/apiClient";
import { Student, ClassSession } from "@/types/domain";

describe("Risk Engine Math & Service", () => {
  const baseStudent: Student = {
    id: "std-test-1",
    name: "Test Student",
    rollNumber: "TEST-01",
    gradeClass: "CS 3A",
    gpa: 3.5,
    attendanceRate: 0.95,
    overdueFeeRatio: 0.0,
    latenessRate: 0.02,
    riskTier: "low",
    email: "test@pulsegrid.edu",
  };

  const originalEnv = process.env.NEXT_PUBLIC_AI_MODE;

  afterEach(() => {
    process.env.NEXT_PUBLIC_AI_MODE = originalEnv;
    vi.restoreAllMocks();
  });

  it("calculates low risk tier correctly for high attendance & paid fees", () => {
    const result = calculateRuleBasedRisk(baseStudent);
    expect(result.tier).toBe("low");
    expect(result.overallScore).toBeLessThan(0.12);
  });

  it("calculates medium risk tier correctly at threshold (>= 0.12)", () => {
    const mediumStudent: Student = {
      ...baseStudent,
      attendanceRate: 0.8,
      overdueFeeRatio: 0.1,
      latenessRate: 0.0,
    };
    const result = calculateRuleBasedRisk(mediumStudent);
    expect(result.tier).toBe("medium");
    expect(result.overallScore).toBe(0.13);
  });

  it("calculates high risk tier correctly at high threshold (>= 0.25)", () => {
    const highRiskStudent: Student = {
      ...baseStudent,
      attendanceRate: 0.6,
      overdueFeeRatio: 0.3,
      latenessRate: 0.1,
    };
    const result = calculateRuleBasedRisk(highRiskStudent);
    expect(result.tier).toBe("high");
    expect(result.overallScore).toBeGreaterThanOrEqual(0.25);
  });

  it("getRiskInsight defaults to rule-based evaluation in rule mode", async () => {
    process.env.NEXT_PUBLIC_AI_MODE = "rule";
    const result = await getRiskInsight(baseStudent);
    expect(result.studentId).toBe("std-test-1");
    expect(result.tier).toBe("low");
  });

  it("getRiskInsight fetches API response when NEXT_PUBLIC_AI_MODE=api and handles successful response", async () => {
    process.env.NEXT_PUBLIC_AI_MODE = "api";
    const mockRisk = calculateRuleBasedRisk(baseStudent);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRisk,
    } as Response);

    const result = await getRiskInsight(baseStudent);
    expect(result.studentId).toBe("std-test-1");
  });

  it("getRiskInsight falls back to rule-based score on API fetch error", async () => {
    process.env.NEXT_PUBLIC_AI_MODE = "api";
    global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

    const result = await getRiskInsight(baseStudent);
    expect(result.studentId).toBe("std-test-1");
    expect(result.tier).toBe("low");
  });

  it("getRiskInsight falls back to rule-based score on API non-ok status", async () => {
    process.env.NEXT_PUBLIC_AI_MODE = "api";
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const result = await getRiskInsight(baseStudent);
    expect(result.studentId).toBe("std-test-1");
  });
});

describe("Timetable Conflict Detection", () => {
  const session1: ClassSession = {
    id: "s1",
    subject: "Math",
    code: "M101",
    teacherId: "t1",
    teacherName: "Prof. A",
    room: "R101",
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "10:30",
  };

  const sessionAdjacent: ClassSession = {
    id: "s2",
    subject: "Physics",
    code: "P101",
    teacherId: "t2",
    teacherName: "Prof. B",
    room: "R102",
    dayOfWeek: "Monday",
    startTime: "10:30",
    endTime: "12:00",
  };

  const sessionOverlap: ClassSession = {
    id: "s3",
    subject: "Chemistry",
    code: "C101",
    teacherId: "t3",
    teacherName: "Prof. C",
    room: "R103",
    dayOfWeek: "Monday",
    startTime: "10:00",
    endTime: "11:30",
  };

  it("converts time to minutes correctly", () => {
    expect(timeToMinutes("09:30")).toBe(570);
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("23:59")).toBe(1439);
  });

  it("identifies adjacent sessions as NOT overlapping (zero gap boundary)", () => {
    expect(doSessionsOverlap(session1, sessionAdjacent)).toBe(false);
  });

  it("identifies partially overlapping sessions correctly", () => {
    expect(doSessionsOverlap(session1, sessionOverlap)).toBe(true);
  });

  it("returns false if session compared to itself or different days", () => {
    expect(doSessionsOverlap(session1, session1)).toBe(false);
    expect(
      doSessionsOverlap(session1, { ...sessionOverlap, dayOfWeek: "Tuesday" })
    ).toBe(false);
  });

  it("detects conflicts in a list of sessions", () => {
    const conflicts = detectTimetableConflicts([
      session1,
      sessionAdjacent,
      sessionOverlap,
    ]);
    expect(conflicts.has("s1")).toBe(true);
    expect(conflicts.has("s3")).toBe(true);
    expect(conflicts.has("s2")).toBe(true);
  });
});

describe("Formatters", () => {
  it("formats currency using Intl.NumberFormat", () => {
    expect(formatCurrency(2500)).toBe("$2,500.00");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats percentage correctly", () => {
    expect(formatPercentage(0.96)).toBe("96%");
    expect(formatPercentage(0.854, 1)).toBe("85.4%");
  });

  it("formats dates gracefully", () => {
    expect(formatDate("2026-08-14")).toContain("Aug");
    expect(formatDate("invalid-date")).toBe("invalid-date");
    expect(formatDate("")).toBe("");
  });
});

describe("API Client Interceptors", () => {
  it("initializes apiClient with base settings", () => {
    expect(apiClient.defaults.timeout).toBe(10000);
  });
});
