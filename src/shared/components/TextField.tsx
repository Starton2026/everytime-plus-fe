import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  suffix?: ReactNode;
}

export function TextField({
  label,
  hint,
  error,
  suffix,
  className,
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error || hint ? `${inputId}-desc` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[13px] font-semibold text-ink-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink-900",
            "placeholder:text-ink-300 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400",
            error ? "border-brand-400" : "border-line-strong",
            suffix ? "pr-16" : undefined,
            className,
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-3 flex items-center text-xs text-ink-400">
            {suffix}
          </div>
        )}
      </div>

      {(error || hint) && (
        <p
          id={describedBy}
          className={cn(
            "mt-1.5 text-xs",
            error ? "text-brand-600" : "text-ink-400",
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
