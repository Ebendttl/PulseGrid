import { NextResponse } from "next/server";
import { calculateRuleBasedRisk } from "@/lib/riskEngine";
import { Student } from "@/types/domain";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json({ error: "studentId required" }, { status: 400 });
  }

  // Fetch student from mock backend (JSON Server)
  try {
    const res = await fetch(`http://localhost:3001/students/${studentId}`);
    if (!res.ok) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    const student = (await res.json()) as Student;
    const risk = calculateRuleBasedRisk(student);
    return NextResponse.json(risk);
  } catch {
    return NextResponse.json(
      { error: "Failed to compute risk" },
      { status: 500 }
    );
  }
}
