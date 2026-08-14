import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[6px] bg-pg-line/60 dark:bg-pg-line/20",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
