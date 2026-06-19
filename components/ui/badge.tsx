import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-surface-lighter text-text-muted": variant === "default",
          "bg-primary/10 text-primary": variant === "primary",
          "bg-secondary/10 text-secondary": variant === "secondary",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
