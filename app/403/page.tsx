import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-pg-paper">
      <div className="max-w-md w-full text-center space-y-4 p-6 rounded-[8px] border border-pg-line bg-pg-surface shadow-flat">
        <div className="p-3 rounded-full bg-pg-risk-red/10 text-pg-risk-red w-fit mx-auto">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-pg-ink">403 — Access Restricted</h1>
        <p className="text-xs text-pg-muted leading-relaxed">
          Your current account role does not hold authorization to access this operational feature.
          If you believe this is in error, contact your campus system administrator.
        </p>
        <div className="pt-2">
          <Link href="/dashboard">
            <Button className="w-full gap-2 min-h-[44px]">
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
