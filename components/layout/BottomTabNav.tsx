"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./Sidebar";

export function BottomTabNav() {
  const pathname = usePathname();
  const { role } = useAppSelector((state) => state.auth);

  const mobileTabs = NAV_ITEMS.filter(
    (item) => item.roles.includes(role) && item.href !== "/settings/profile"
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-pg-line bg-pg-surface/95 backdrop-blur-xs lg:hidden shadow-flat">
      <div className="flex h-16 items-center justify-around px-2">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1 rounded-[6px] text-[11px] font-medium transition-colors",
                isActive
                  ? "text-pg-signal-blue font-semibold"
                  : "text-pg-muted hover:text-pg-ink"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-pg-signal-blue")} />
              <span className="truncate max-w-[64px]">{tab.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
