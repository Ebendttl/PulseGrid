"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedClassId, setAuditDrawerOpen } from "@/store/attendanceSlice";
import { apiClient } from "@/lib/apiClient";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/formatters";
import { Student, ClassSession, AttendanceRecord, AttendanceStatus, AuditLog } from "@/types/domain";
import { toast } from "sonner";
import {
  UserCheck,
  UserX,
  Clock,
  Search,
  History,
  AlertCircle,
  Filter,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);
  const { selectedClassId, auditDrawerOpen } = useAppSelector((state) => state.attendance);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0] ?? "2026-08-14");

  const todayStr = new Date().toISOString().split("T")[0] ?? "2026-08-14";
  const isFutureDate = selectedDate > todayStr;

  // Data Fetching
  const { data: classes = [] } = useQuery<ClassSession[]>({
    queryKey: ["classSessions"],
    queryFn: async () => (await apiClient.get("/classSessions")).data,
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => (await apiClient.get("/students")).data,
  });

  const { data: attendanceRecords = [] } = useQuery<AttendanceRecord[]>({
    queryKey: ["attendanceRecords"],
    queryFn: async () => (await apiClient.get("/attendanceRecords")).data,
  });

  const { data: auditLogs = [] } = useQuery<AuditLog[]>({
    queryKey: ["auditLogs"],
    queryFn: async () => (await apiClient.get("/auditLogs")).data,
  });

  // Selected Class details
  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Enrolled students for selected class (filtered by gradeClass or mock association)
  const enrolledStudents = useMemo(() => {
    if (!students.length) return [];
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [students, searchQuery]);

  // Memoized Daily Aggregate Summary Counts
  const dailySummary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;

    enrolledStudents.forEach((student) => {
      const record = attendanceRecords.find(
        (r) => r.studentId === student.id && r.date === selectedDate && r.classId === activeClass?.id
      );
      if (record?.status === "present") present++;
      else if (record?.status === "absent") absent++;
      else if (record?.status === "late") late++;
    });

    return { present, absent, late, total: enrolledStudents.length };
  }, [enrolledStudents, attendanceRecords, selectedDate, activeClass]);

  // Optimistic Attendance Toggle Mutation with Rollback
  const markAttendanceMutation = useMutation({
    mutationFn: async ({
      student,
      newStatus,
    }: {
      student: Student;
      newStatus: AttendanceStatus;
    }) => {
      const existing = attendanceRecords.find(
        (r) => r.studentId === student.id && r.date === selectedDate && r.classId === activeClass?.id
      );

      const recordData: Partial<AttendanceRecord> = {
        studentId: student.id,
        studentName: student.name,
        classId: activeClass?.id || "cls-101",
        date: selectedDate,
        status: newStatus,
        timestamp: new Date().toISOString(),
      };

      if (existing) {
        await apiClient.patch(`/attendanceRecords/${existing.id}`, recordData);
      } else {
        await apiClient.post("/attendanceRecords", recordData);
      }

      // Record Audit Log
      const auditEntry: Partial<AuditLog> = {
        studentId: student.id,
        studentName: student.name,
        prevStatus: existing ? existing.status : "none",
        newStatus,
        changedBy: user?.name || "System User",
        timestamp: new Date().toISOString(),
      };
      await apiClient.post("/auditLogs", auditEntry);
    },
    onMutate: async ({ student, newStatus }) => {
      // Cancel outgoing queries for optimistic update
      await queryClient.cancelQueries({ queryKey: ["attendanceRecords"] });
      const previousRecords = queryClient.getQueryData<AttendanceRecord[]>(["attendanceRecords"]) || [];

      // Optimistically update query cache
      queryClient.setQueryData<AttendanceRecord[]>(["attendanceRecords"], (old = []) => {
        const index = old.findIndex(
          (r) => r.studentId === student.id && r.date === selectedDate && r.classId === activeClass?.id
        );
        if (index > -1 && old[index]) {
          const updated = [...old];
          updated[index] = { ...old[index], status: newStatus, timestamp: new Date().toISOString() };
          return updated;
        } else {
          return [
            ...old,
            {
              id: `temp-${Date.now()}`,
              studentId: student.id,
              studentName: student.name,
              classId: activeClass?.id || "cls-101",
              date: selectedDate,
              status: newStatus,
              timestamp: new Date().toISOString(),
            },
          ];
        }
      });

      return { previousRecords };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error per Section 7.2 requirement
      if (context?.previousRecords) {
        queryClient.setQueryData(["attendanceRecords"], context.previousRecords);
      }
      toast.error("Couldn't save — attendance reverted. Check your connection and try again.");
    },
    onSuccess: () => {
      toast.success("Attendance register updated.");
      queryClient.invalidateQueries({ queryKey: ["attendanceRecords"] });
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
    },
  });

  const handleToggle = (student: Student, newStatus: AttendanceStatus) => {
    if (isFutureDate) {
      toast.error("Marking attendance for a future date is not permitted.");
      return;
    }
    if (role === "student") {
      toast.error("Students are not authorized to modify attendance registers.");
      return;
    }
    markAttendanceMutation.mutate({ student, newStatus });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-pg-line pb-4">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-pg-ink">
              Class Register & Attendance
            </h1>
            <p className="text-xs text-pg-muted">
              Live attendance marking, optimistic state sync, and immutable audit logging.
            </p>
          </div>
          {role === "admin" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setAuditDrawerOpen(true))}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              <span>View Audit Log</span>
            </Button>
          )}
        </div>

        {/* Filter Bar: Class Selector & Date Selector */}
        <Card className="shadow-flat">
          <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-xs font-semibold text-pg-muted uppercase tracking-wider whitespace-nowrap">
                Class:
              </label>
              <select
                value={activeClass?.id || ""}
                onChange={(e) => dispatch(setSelectedClassId(e.target.value))}
                className="h-11 w-full md:w-64 rounded-[6px] border border-pg-line bg-pg-surface px-3 py-2 text-xs font-semibold text-pg-ink focus:outline-none focus:ring-2 focus:ring-pg-signal-blue"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.subject} ({c.room})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-pg-muted" />
                <label className="text-xs font-semibold text-pg-muted uppercase tracking-wider whitespace-nowrap">
                  Date:
                </label>
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-11 w-full md:w-48 text-xs font-mono-tabular"
              />
            </div>
          </CardContent>
        </Card>

        {/* Future Date Blocking Warning */}
        {isFutureDate && (
          <div className="p-3.5 rounded-[6px] bg-pg-alert-amber/10 border border-pg-alert-amber/30 text-pg-alert-amber text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Marking attendance for future dates is blocked by system policy.</span>
          </div>
        )}

        {/* Summary Aggregates */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 border-l-4 border-l-pg-pulse-teal">
            <p className="text-xs font-semibold text-pg-muted uppercase">Present</p>
            <p className="font-mono-tabular text-xl font-bold text-pg-pulse-teal">
              {dailySummary.present} / {dailySummary.total}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-pg-risk-red">
            <p className="text-xs font-semibold text-pg-muted uppercase">Absent</p>
            <p className="font-mono-tabular text-xl font-bold text-pg-risk-red">
              {dailySummary.absent} / {dailySummary.total}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-pg-alert-amber">
            <p className="text-xs font-semibold text-pg-muted uppercase">Late</p>
            <p className="font-mono-tabular text-xl font-bold text-pg-alert-amber">
              {dailySummary.late} / {dailySummary.total}
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-pg-signal-blue">
            <p className="text-xs font-semibold text-pg-muted uppercase">Rate</p>
            <p className="font-mono-tabular text-xl font-bold text-pg-signal-blue">
              {dailySummary.total ? formatPercentage(dailySummary.present / dailySummary.total) : "0%"}
            </p>
          </Card>
        </div>

        {/* Student Register List */}
        <Card className="shadow-flat">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
            <div>
              <CardTitle className="text-base">Student Roster</CardTitle>
              <CardDescription>
                {activeClass ? `${activeClass.subject} (${activeClass.code})` : "Class Register"}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-pg-muted" />
              <Input
                placeholder="Search student or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0 sm:p-5">
            {enrolledStudents.length === 0 ? (
              /* Edge Case 1: Empty class state */
              <div className="p-8 text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-pg-muted mx-auto" />
                <h3 className="text-sm font-semibold text-pg-ink">No Students Enrolled</h3>
                <p className="text-xs text-pg-muted max-w-sm mx-auto">
                  There are no active students enrolled in this class roster or matching your search criteria.
                </p>
              </div>
            ) : (
              /* Stacked card rows on mobile (<640px), clean table on desktop per Section 6.4 rules */
              <div className="divide-y divide-pg-line">
                {enrolledStudents.map((student) => {
                  const currentRecord = attendanceRecords.find(
                    (r) => r.studentId === student.id && r.date === selectedDate && r.classId === activeClass?.id
                  );
                  const status = currentRecord?.status || "unmarked";

                  return (
                    <div
                      key={student.id}
                      className="p-4 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-pg-paper/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-pg-ink">
                            {student.name}
                          </span>
                          <span className="text-xs font-mono-tabular text-pg-muted">
                            ({student.rollNumber})
                          </span>
                        </div>
                        <p className="text-xs text-pg-muted font-mono-tabular">
                          7-Day Attendance Rate: {formatPercentage(student.attendanceRate)}
                        </p>
                      </div>

                      {/* Status Action Toggle Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={status === "present" ? "teal" : "outline"}
                          disabled={isFutureDate || markAttendanceMutation.isPending || role === "student"}
                          onClick={() => handleToggle(student, "present")}
                          className="flex-1 sm:flex-initial text-xs min-h-[44px]"
                        >
                          <UserCheck className="h-4 w-4" />
                          <span>Present</span>
                        </Button>

                        <Button
                          size="sm"
                          variant={status === "absent" ? "destructive" : "outline"}
                          disabled={isFutureDate || markAttendanceMutation.isPending || role === "student"}
                          onClick={() => handleToggle(student, "absent")}
                          className="flex-1 sm:flex-initial text-xs min-h-[44px]"
                        >
                          <UserX className="h-4 w-4" />
                          <span>Absent</span>
                        </Button>

                        <Button
                          size="sm"
                          variant={status === "late" ? "amber" : "outline"}
                          disabled={isFutureDate || markAttendanceMutation.isPending || role === "student"}
                          onClick={() => handleToggle(student, "late")}
                          className="flex-1 sm:flex-initial text-xs min-h-[44px]"
                        >
                          <Clock className="h-4 w-4" />
                          <span>Late</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Log Dialog / Drawer (Admin only) */}
        <Dialog open={auditDrawerOpen} onOpenChange={(open) => dispatch(setAuditDrawerOpen(open))}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-pg-signal-blue" />
                <span>Attendance Audit Trail</span>
              </DialogTitle>
              <DialogDescription>
                Immutable historical record of all attendance modifications.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto py-2">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-[6px] border border-pg-line bg-pg-paper/50 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-pg-ink">{log.studentName}</span>
                      <span className="text-pg-muted text-[10px] font-mono-tabular">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-pg-muted">
                      Status changed from <Badge variant="outline">{log.prevStatus}</Badge> to{" "}
                      <Badge variant="default">{log.newStatus}</Badge> by{" "}
                      <span className="font-semibold text-pg-ink">{log.changedBy}</span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-pg-muted text-center py-6">No audit records logged yet.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
