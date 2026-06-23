import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

export default function Button({
  children,
  variant = "primary",
  className,
  disabled,
  onClick,
  type,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type ?? "button"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-12 rounded-full px-[22px] text-center font-bold text-sm tracking-[-0.005em] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:cursor-not-allowed",
        variant === "primary" && "bg-primary text-ink hover:bg-primary-hover disabled:bg-surface-soft disabled:text-text-muted",
        variant === "secondary" && "bg-surface-elevated text-text-primary border border-border hover:border-border-strong disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
