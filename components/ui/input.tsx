import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border bg-surface-light px-3 py-2 text-sm text-text placeholder:text-text-dim transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
            error
              ? "border-accent focus:ring-accent/50"
              : "border-border focus:border-primary/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-accent">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, type InputProps };
