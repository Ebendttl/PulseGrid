"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store";
import { switchRole } from "@/store/authSlice";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/types/domain";
import { ShieldCheck, GraduationCap, UserCheck, Activity } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    role: "admin" as Role,
    name: "Dr. Eleanor Vance",
    title: "Campus Registrar & Administrator",
    email: "admin@pulsegrid.edu",
    description: "Full system access, fee approvals, notice posting, risk alerts audit",
    icon: ShieldCheck,
    badgeVariant: "default" as const,
  },
  {
    role: "teacher" as Role,
    name: "Prof. Marcus Thorne",
    title: "Computer Science Lead Faculty",
    email: "teacher@pulsegrid.edu",
    description: "Assigned class registers, optimistic attendance marking, timetable grid",
    icon: UserCheck,
    badgeVariant: "success" as const,
  },
  {
    role: "student" as Role,
    name: "Aria Chen",
    title: "Computer Science 3A Student",
    email: "student@pulsegrid.edu",
    description: "Personal academic overview, fee receipts, class timetable, notices",
    icon: GraduationCap,
    badgeVariant: "warning" as const,
  },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const handleDemoLogin = (role: Role) => {
    // Set session cookie for middleware
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `pg_session=${role}; path=/; max-age=86400; SameSite=Lax`;
    localStorage.setItem("pg_auth_token", `mock-token-${role}`);
    dispatch(switchRole(role));
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-pg-paper">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-pg-signal-blue font-heading font-bold text-2xl tracking-tight">
            <Activity className="h-7 w-7 text-pg-pulse-teal animate-pulse" />
            <span>PulseGrid</span>
          </div>
          <p className="text-xs text-pg-muted italic">
            &ldquo;The heartbeat of your campus, in one grid.&rdquo;
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-pg-line shadow-flat">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Demo Access Portal</CardTitle>
            <CardDescription>
              Select a role below to launch the role-aware cockpit dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {DEMO_ACCOUNTS.map((acc) => {
              const Icon = acc.icon;
              return (
                <div
                  key={acc.role}
                  className="p-4 rounded-[6px] border border-pg-line hover:border-pg-signal-blue/50 bg-pg-surface hover:bg-pg-paper/50 transition-all flex flex-col gap-2 cursor-pointer group"
                  onClick={() => handleDemoLogin(acc.role)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-pg-paper text-pg-signal-blue group-hover:bg-pg-signal-blue group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-pg-ink group-hover:text-pg-signal-blue transition-colors">
                          {acc.name}
                        </h4>
                        <p className="text-xs text-pg-muted">{acc.title}</p>
                      </div>
                    </div>
                    <Badge variant={acc.badgeVariant} className="capitalize">
                      {acc.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-pg-muted leading-relaxed pl-11">
                    {acc.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full text-xs font-semibold group-hover:bg-pg-signal-blue group-hover:text-white transition-colors"
                  >
                    Launch as {acc.role.toUpperCase()}
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-pg-muted">
          PulseGrid SIMS Portal &bull; Senior Engineering Portfolio Deliverable &bull; MIT License
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-pg-paper flex items-center justify-center text-xs text-pg-muted">Loading Portal...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
