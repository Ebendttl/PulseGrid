"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedDay, DayOfWeek } from "@/store/scheduleSlice";
import { apiClient } from "@/lib/apiClient";
import { ClassSession } from "@/types/domain";
import { detectTimetableConflicts } from "@/lib/timetableConflict";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export default function TimetablePage() {
  const dispatch = useAppDispatch();
  const { selectedDay, showConflictsOnly } = useAppSelector((state) => state.schedule);

  // Queries
  const { data: sessions = [], isLoading } = useQuery<ClassSession[]>({
    queryKey: ["classSessions"],
    queryFn: async () => (await apiClient.get("/classSessions")).data,
  });

  // Calculate conflict IDs across all sessions using unit-tested interval overlap logic
  const conflictingSessionIds = useMemo(() => {
    return detectTimetableConflicts(sessions);
  }, [sessions]);

  // Filter sessions per day
  const daySessions = useMemo(() => {
    return sessions.filter((s) => s.dayOfWeek === selectedDay);
  }, [sessions, selectedDay]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-pg-line pb-4">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-pg-ink">
              Weekly Timetable Grid
            </h1>
            <p className="text-xs text-pg-muted">
              Interactive session schedule with automated interval conflict detection.
            </p>
          </div>

          {conflictingSessionIds.size > 0 && (
            <Badge variant="warning" className="px-3 py-1 text-xs self-start sm:self-auto">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{conflictingSessionIds.size} Schedule Conflicts Detected</span>
            </Badge>
          )}
        </div>

        {/* Day Selector Tabs for Mobile & Desktop */}
        <Tabs
          defaultValue={selectedDay}
          onValueChange={(val) => dispatch(setSelectedDay(val as DayOfWeek))}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-5 h-12 bg-pg-paper p-1 border border-pg-line">
            {DAYS_OF_WEEK.map((day) => {
              const count = sessions.filter((s) => s.dayOfWeek === day).length;
              return (
                <TabsTrigger key={day} value={day} className="text-xs font-semibold">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.substring(0, 3)}</span>
                  {count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-pg-line/50 text-[10px] font-mono-tabular">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {DAYS_OF_WEEK.map((day) => (
            <TabsContent key={day} value={day} className="mt-4 space-y-4">
              <Card className="shadow-flat">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-pg-signal-blue" />
                    <span>{day} Class Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoading ? (
                    <p className="text-xs text-pg-muted py-6 text-center">Loading schedule...</p>
                  ) : daySessions.length === 0 ? (
                    /* Edge Case 1: Empty day state */
                    <div className="p-8 text-center space-y-2">
                      <Sparkles className="h-8 w-8 text-pg-pulse-teal mx-auto" />
                      <h3 className="text-sm font-semibold text-pg-ink">
                        No classes scheduled today — enjoy the break!
                      </h3>
                      <p className="text-xs text-pg-muted max-w-sm mx-auto">
                        Your timetable is clear for {day}. Use this time for independent study or research.
                      </p>
                    </div>
                  ) : (
                    daySessions.map((session) => {
                      const isConflicting = conflictingSessionIds.has(session.id);

                      return (
                        <div
                          key={session.id}
                          className={`p-4 rounded-[6px] border bg-pg-paper/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            isConflicting
                              ? "border-l-4 border-l-pg-risk-red border-pg-risk-red/40 bg-pg-risk-red/5"
                              : "border-pg-line hover:border-pg-signal-blue/40"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-pg-ink">
                                {session.subject}
                              </span>
                              <Badge variant="outline" className="font-mono-tabular text-[10px]">
                                {session.code}
                              </Badge>
                              {isConflicting && (
                                <Badge variant="destructive" className="text-[10px]">
                                  Overlap Conflict
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-pg-muted font-mono-tabular">
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {session.teacherName}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {session.room}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 font-mono-tabular font-semibold text-xs text-pg-signal-blue bg-pg-surface px-3 py-1.5 rounded-[4px] border border-pg-line self-start sm:self-auto">
                            <Clock className="h-3.5 w-3.5 text-pg-muted" />
                            <span>
                              {session.startTime} - {session.endTime}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppShell>
  );
}
