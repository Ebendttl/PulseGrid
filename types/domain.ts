export type Role = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  assignedClassIds?: string[];
  studentId?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  gradeClass: string;
  gpa: number;
  attendanceRate: number; // e.g. 0.92 = 92%
  overdueFeeRatio: number; // e.g. 0.15 = 15%
  latenessRate: number; // e.g. 0.05 = 5%
  riskTier: "low" | "medium" | "high";
  email: string;
}

export interface ClassSession {
  id: string;
  subject: string;
  code: string;
  teacherId: string;
  teacherName: string;
  room: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:30"
}

export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  date: string; // ISO format "YYYY-MM-DD"
  status: AttendanceStatus;
  timestamp: string; // ISO string
}

export interface AuditLog {
  id: string;
  studentId: string;
  studentName: string;
  prevStatus: AttendanceStatus | "none";
  newStatus: AttendanceStatus;
  changedBy: string;
  timestamp: string;
}

export type InvoiceStatus = "paid" | "partial" | "overdue" | "unpaid";

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  amount: number;
  amountPaid: number;
  dueDate: string; // ISO date string YYYY-MM-DD
  status: InvoiceStatus;
  issuedDate: string;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: "Credit Card" | "Bank Transfer" | "Mobile Money" | "Cash";
  date: string;
  reference: string;
}

export type AnnouncementCategory = "academic" | "events" | "general";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  author: string;
  authorRole: Role;
  createdAt: string;
  pinned?: boolean;
}

export interface RiskScore {
  studentId: string;
  studentName: string;
  overallScore: number;
  tier: "low" | "medium" | "high";
  attendanceFactor: number;
  feeFactor: number;
  latenessFactor: number;
  generatedAt: string;
}
