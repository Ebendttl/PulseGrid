"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, role } = useAppSelector((state) => state.auth);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile preferences updated.");
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="border-b border-pg-line pb-4">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-pg-ink">
            Profile Settings
          </h1>
          <p className="text-xs text-pg-muted">
            Manage your personal account preferences and authentication credentials.
          </p>
        </div>

        <Card className="shadow-flat">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-pg-signal-blue/10 text-pg-signal-blue flex items-center justify-center font-bold text-xl border border-pg-signal-blue/20">
                {user?.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-lg">{user?.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="capitalize text-xs">
                    Role: {role}
                  </Badge>
                  <span className="text-xs text-pg-muted font-mono-tabular">{user?.email}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-pg-ink">Full Name</label>
                <Input defaultValue={user?.name || ""} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-pg-ink">Email Address</label>
                <Input defaultValue={user?.email || ""} disabled className="bg-pg-paper" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-pg-ink">Notification Frequency</label>
                <select className="h-11 w-full rounded-[6px] border border-pg-line bg-pg-surface px-3 py-2 text-xs font-semibold text-pg-ink focus:outline-none focus:ring-2 focus:ring-pg-signal-blue">
                  <option value="instant">Instant Real-time Alerts</option>
                  <option value="daily">Daily Summary Digest</option>
                  <option value="weekly">Weekly Operational Report</option>
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full sm:w-auto gap-2 min-h-[44px]">
                  <Save className="h-4 w-4" />
                  <span>Save Preferences</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
