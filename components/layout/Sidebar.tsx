"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { setMobileSidebarOpen } from "@/store/uiSlice";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserCheck,
  CreditCard,
  CalendarDays,
  Bell,
  User,
  X,
  Shield,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "teacher", "student"],
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: UserCheck,
    roles: ["admin", "teacher", "student"],
  },
  {
    name: "Fees & Invoices",
    href: "/fees",
    icon: CreditCard,
    roles: ["admin", "student"],
  },
  {
    name: "Timetable",
    href: "/timetable",
    icon: CalendarDays,
    roles: ["admin", "teacher", "student"],
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ["admin", "teacher", "student"],
  },
  {
    name: "Profile Settings",
    href: "/settings/profile",
    icon: User,
    roles: ["admin", "teacher", "student"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((state) => state.auth);
  const { mobileSidebarOpen } = useAppSelector((state) => state.ui);

  const filteredNavItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => dispatch(setMobileSidebarOpen(false))}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-pg-line bg-pg-surface flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-pg-line lg:hidden">
          <span className="font-heading font-semibold text-lg text-pg-ink">
            Navigation
          </span>
          <button
            onClick={() => dispatch(setMobileSidebarOpen(false))}
            className="p-2 text-pg-muted hover:text-pg-ink"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => dispatch(setMobileSidebarOpen(false))}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-[6px] text-sm font-medium transition-colors min-h-[44px]",
                  isActive
                    ? "bg-pg-signal-blue text-white font-semibold shadow-flat"
                    : "text-pg-muted hover:bg-pg-paper hover:text-pg-ink"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role badge footer in sidebar */}
        <div className="p-4 border-t border-pg-line bg-pg-paper/50">
          <div className="flex items-center justify-between text-xs text-pg-muted">
            <span className="font-semibold uppercase tracking-wider">Active Role</span>
            <span className="font-bold text-pg-signal-blue capitalize">{role}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
