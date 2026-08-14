import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-pg-signal-blue focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-pg-signal-blue/15 text-[#1E40AF] dark:bg-pg-signal-blue/20 dark:text-blue-300",
        success:
          "border-transparent bg-pg-pulse-teal/15 text-[#065F46] dark:bg-pg-pulse-teal/20 dark:text-teal-300",
        warning:
          "border-transparent bg-pg-alert-amber/15 text-[#854D0E] dark:bg-pg-alert-amber/20 dark:text-amber-300",
        destructive:
          "border-transparent bg-pg-risk-red/15 text-[#991B1B] dark:bg-pg-risk-red/20 dark:text-red-300",
        outline: "border border-pg-line text-pg-ink",
        muted: "bg-pg-paper text-pg-muted border border-pg-line/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
