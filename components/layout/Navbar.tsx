"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "@/store";
import { switchRole, logout } from "@/store/authSlice";
import { setMobileSidebarOpen } from "@/store/uiSlice";
import { Role } from "@/types/domain";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Sun,
  Moon,
  LogOut,
  WifiOff,
  Menu,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);
  const { isOffline } = useAppSelector((state) => state.ui);

  const handleRoleChange = (newRole: Role) => {
    document.cookie = `pg_session=${newRole}; path=/; max-age=86400; SameSite=Lax`;
    dispatch(switchRole(newRole));
  };

  const handleLogout = () => {
    document.cookie = "pg_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("pg_auth_token");
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pg-line bg-pg-surface/95 backdrop-blur-xs shadow-flat">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu toggle + Brand */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => dispatch(setMobileSidebarOpen(true))}
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-heading font-bold text-lg text-pg-ink tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="p-1.5 rounded-md bg-pg-paper text-pg-pulse-teal border border-pg-line">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <span>PulseGrid</span>
          </Link>
        </div>

        {/* Offline indicator banner icon */}
        {isOffline && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-pg-alert-amber bg-pg-alert-amber/10 px-3 py-1 rounded-full border border-pg-alert-amber/20">
            <WifiOff className="h-3.5 w-3.5" />
            <span>Offline Mode</span>
          </div>
        )}

        {/* Right: Actions, Theme Toggle, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role selector pill */}
          <div className="flex items-center gap-1 bg-pg-paper p-1 rounded-full border border-pg-line text-xs font-medium">
            <button
              onClick={() => handleRoleChange("admin")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                role === "admin"
                  ? "bg-pg-signal-blue text-white font-semibold"
                  : "text-pg-muted hover:text-pg-ink"
              }`}
              title="Switch to Admin role"
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleChange("teacher")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                role === "teacher"
                  ? "bg-pg-pulse-teal text-white font-semibold"
                  : "text-pg-muted hover:text-pg-ink"
              }`}
              title="Switch to Teacher role"
            >
              Teacher
            </button>
            <button
              onClick={() => handleRoleChange("student")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                role === "student"
                  ? "bg-pg-alert-amber text-white font-semibold"
                  : "text-pg-muted hover:text-pg-ink"
              }`}
              title="Switch to Student role"
            >
              Student
            </button>
          </div>

          {/* Theme toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme mode"
            title="Toggle theme mode"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-pg-alert-amber" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-pg-signal-blue" />
          </Button>

          {/* User profile avatar & logout */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-pg-line">
            <span className="text-xs font-medium text-pg-ink max-w-[120px] truncate">
              {user?.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="h-4 w-4 text-pg-muted hover:text-pg-risk-red transition-colors" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
