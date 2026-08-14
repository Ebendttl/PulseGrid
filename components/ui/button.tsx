"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pg-signal-blue disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] min-h-[44px] min-w-[44px] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-pg-signal-blue text-white hover:bg-pg-signal-blue/90 shadow-flat",
        teal: "bg-pg-pulse-teal text-white hover:bg-pg-pulse-teal/90 shadow-flat",
        amber: "bg-pg-alert-amber text-white hover:bg-pg-alert-amber/90 shadow-flat",
        destructive:
          "bg-pg-risk-red text-white hover:bg-pg-risk-red/90 shadow-flat",
        outline:
          "border border-pg-line bg-pg-surface text-pg-ink hover:bg-pg-paper hover:text-pg-ink",
        ghost: "hover:bg-pg-paper text-pg-ink",
        link: "text-pg-signal-blue underline-offset-4 hover:underline min-h-0 min-w-0 p-0",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 text-xs min-h-[36px]",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
