import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-pg-paper">
      <div className="max-w-md w-full text-center space-y-4 p-6 rounded-[8px] border border-pg-line bg-pg-surface shadow-flat">
        <div className="p-3 rounded-full bg-pg-alert-amber/10 text-pg-alert-amber w-fit mx-auto">
          <WifiOff className="h-10 w-10" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-pg-ink">You are Offline</h1>
        <p className="text-xs text-pg-muted leading-relaxed">
          PulseGrid detected no active internet connection. Offline cached views remain accessible.
        </p>
        <div className="pt-2">
          <Link href="/dashboard">
            <Button className="w-full gap-2 min-h-[44px]">
              <RefreshCw className="h-4 w-4" />
              <span>Try Reconnecting</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
