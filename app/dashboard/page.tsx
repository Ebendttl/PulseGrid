"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/store";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { calculateRuleBasedRisk } from "@/lib/riskEngine";
import { Student, Invoice, Announcement, ClassSession, AttendanceRecord } from "@/types/domain";
import { apiClient } from "@/lib/apiClient";
import {
  Activity,
  CreditCard,
  UserCheck,
  CalendarDays,
  Bell,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

export default function DashboardPage() {
  const { user, role } = useAppSelector((state) => state.auth);

  // Queries
  const { data: students = [], isLoading: loadingStudents } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => (await apiClient.get("/students")).data,
  });

  const { data: invoices = [], isLoading: loadingInvoices } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => (await apiClient.get("/invoices")).data,
  });

  const { data: announcements = [], isLoading: loadingAnnouncements } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => (await apiClient.get("/announcements")).data,
  });

  const { data: sessions = [], isLoading: loadingSessions } = useQuery<ClassSession[]>({
    queryKey: ["classSessions"],
    queryFn: async () => (await apiClient.get("/classSessions")).data,
  });

  const { data: attendance = [], isLoading: loadingAttendance } = useQuery<AttendanceRecord[]>({
    queryKey: ["attendanceRecords"],
    queryFn: async () => (await apiClient.get("/attendanceRecords")).data,
  });

  const isLoading =
    loadingStudents || loadingInvoices || loadingAnnouncements || loadingSessions || loadingAttendance;

  // Derived aggregates
  const totalOverdueFees = invoices
    .filter((inv) => inv.status === "overdue" || inv.status === "partial")
    .reduce((sum, inv) => sum + (inv.amount - inv.amountPaid), 0);

  const avgAttendance =
    students.length > 0
      ? students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length
      : 0;

  const atRiskStudents = students.map(calculateRuleBasedRisk).filter((r) => r.tier === "high");

  const nextSession = sessions[0];
  const latestNotices = announcements.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-pg-line pb-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-pg-ink">
              Operational Grid
            </h1>
            <p className="text-sm text-pg-muted">
              Welcome back, <span className="font-semibold text-pg-ink">{user?.name}</span> ({role.toUpperCase()})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="px-3 py-1 text-xs">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span>Grid Live</span>
            </Badge>
          </div>
        </div>

        {/* Signature Grid: 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Attendance Rate */}
          <Card className="hover:border-pg-signal-blue/40 transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-pg-muted uppercase tracking-wider">
                7-Day Attendance Rate
              </CardTitle>
              <div className="p-2 rounded-md bg-pg-pulse-teal/10 text-pg-pulse-teal">
                <UserCheck className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="space-y-1">
                  <div className="font-mono-tabular text-2xl font-bold text-pg-ink">
                    {formatPercentage(avgAttendance)}
                  </div>
                  <p className="text-xs text-pg-muted flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-pg-pulse-teal" />
                    <span>Campus Average</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Fees Summary */}
          <Card className="hover:border-pg-signal-blue/40 transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-pg-muted uppercase tracking-wider">
                Outstanding Fees
              </CardTitle>
              <div className="p-2 rounded-md bg-pg-alert-amber/10 text-pg-alert-amber">
                <CreditCard className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="space-y-1">
                  <div className="font-mono-tabular text-2xl font-bold text-pg-ink">
                    {formatCurrency(totalOverdueFees)}
                  </div>
                  <p className="text-xs text-pg-muted">
                    {invoices.filter((i) => i.status === "overdue").length} overdue invoices
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Next Session */}
          <Card className="hover:border-pg-signal-blue/40 transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-pg-muted uppercase tracking-wider">
                Next Session
              </CardTitle>
              <div className="p-2 rounded-md bg-pg-signal-blue/10 text-pg-signal-blue">
                <CalendarDays className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : nextSession ? (
                <div className="space-y-1">
                  <div className="font-semibold text-sm text-pg-ink truncate">
                    {nextSession.subject}
                  </div>
                  <p className="text-xs font-mono-tabular text-pg-muted">
                    {nextSession.dayOfWeek} &bull; {nextSession.startTime} - {nextSession.endTime}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-pg-muted">No classes scheduled today</p>
              )}
            </CardContent>
          </Card>

          {/* Card 4: At-Risk Alerts */}
          <Card className="hover:border-pg-signal-blue/40 transition-all cursor-pointer border-l-4 border-l-pg-risk-red">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-pg-muted uppercase tracking-wider">
                At-Risk Alerts
              </CardTitle>
              <div className="p-2 rounded-md bg-pg-risk-red/10 text-pg-risk-red">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="space-y-1">
                  <div className="font-mono-tabular text-2xl font-bold text-pg-risk-red">
                    {atRiskStudents.length}
                  </div>
                  <p className="text-xs text-pg-muted">High-priority intervention needed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Sections: Risk Watchlist + Recent Notices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: At-Risk Watchlist (Admin / Teacher view) */}
          <Card className="lg:col-span-2 shadow-flat">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-pg-risk-red" />
                  <span>AI Risk Watchlist</span>
                </CardTitle>
                <CardDescription>
                  Students flagged by automated attendance & fee risk algorithm
                </CardDescription>
              </div>
              <Link href="/attendance">
                <Button variant="outline" size="sm" className="text-xs">
                  View Registers
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : atRiskStudents.length > 0 ? (
                <div className="space-y-3">
                  {atRiskStudents.map((risk) => (
                    <div
                      key={risk.studentId}
                      className="p-3.5 rounded-[6px] border border-pg-line bg-pg-paper/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-pg-ink">
                            {risk.studentName}
                          </span>
                          <Badge variant="destructive" className="text-[10px]">
                            High Risk ({risk.overallScore})
                          </Badge>
                        </div>
                        <p className="text-xs text-pg-muted font-mono-tabular">
                          Attendance Factor: {(risk.attendanceFactor * 2 * 100).toFixed(0)}% drop | Fee Factor: {(risk.feeFactor / 0.3 * 100).toFixed(0)}% overdue
                        </p>
                      </div>
                      <Link href={`/attendance?student=${risk.studentId}`}>
                        <Button size="sm" variant="outline" className="text-xs min-h-[36px]">
                          Audit Profile
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-pg-muted text-center py-6">
                  No students currently flagged in high-risk threshold.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Right Column: Latest Announcements Feed */}
          <Card className="shadow-flat flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-pg-signal-blue" />
                <span>Noticeboard</span>
              </CardTitle>
              <Link href="/notifications">
                <Button variant="link" className="text-xs">
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : latestNotices.length > 0 ? (
                latestNotices.map((notice) => (
                  <div key={notice.id} className="space-y-1.5 pb-3 border-b border-pg-line/50 last:border-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {notice.category}
                      </Badge>
                      <span className="text-[10px] text-pg-muted">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-pg-ink line-clamp-1">
                      {notice.title}
                    </h4>
                    <p className="text-xs text-pg-muted line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-pg-muted text-center py-6">No announcements found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
