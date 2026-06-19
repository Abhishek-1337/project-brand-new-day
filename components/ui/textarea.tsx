import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border bg-surface-light px-3 py-2 text-sm text-text placeholder:text-text-dim transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-y",
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
Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
