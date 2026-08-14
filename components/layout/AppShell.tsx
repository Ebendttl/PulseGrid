"use client";

import React, { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { BottomTabNav } from "./BottomTabNav";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIsOffline } from "@/store/uiSlice";
import { WifiOff } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isOffline } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const handleOnline = () => dispatch(setIsOffline(false));
    const handleOffline = () => dispatch(setIsOffline(true));

    if (typeof window !== "undefined") {
      dispatch(setIsOffline(!navigator.onLine));
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-pg-paper">
      <Navbar />

      {/* Persistent Offline Banner if connection lost */}
      {isOffline && (
        <div className="bg-pg-alert-amber text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 text-center shadow-flat">
          <WifiOff className="h-4 w-4" />
          <span>
            You are currently offline. Local changes will be synced when connection is restored.
          </span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      <BottomTabNav />
    </div>
  );
}
