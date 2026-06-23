import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "muted";

export default function Badge({
  children,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-[10px] py-[6px] text-[0.75rem] font-bold leading-[1.1] tracking-[0.08em]",
        variant === "primary" && "bg-surface-soft text-primary-hover",
        variant === "muted" && "bg-surface-elevated text-text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}
