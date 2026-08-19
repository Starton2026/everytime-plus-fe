import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  /** 우측 하단에 "현재/최대" 글자 수를 표시한다. */
  counterMax?: number;
}

export function TextArea({
  label,
  error,
  counterMax,
  className,
  id,
  value,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const length = typeof value === "string" ? value.length : 0;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-[13px] font-semibold text-ink-700"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "rounded-xl border bg-surface transition-colors",
          "focus-within:ring-2 focus-within:ring-brand-200 focus-within:border-brand-400",
          error ? "border-brand-400" : "border-line-strong",
        )}
      >
        <textarea
          id={textareaId}
          value={value}
          aria-invalid={error ? true : undefined}
          className={cn(
            "block w-full resize-none rounded-xl bg-transparent px-3.5 py-3 text-sm",
            "text-ink-900 placeholder:text-ink-300 focus:outline-none",
            className,
          )}
          {...props}
        />
        {counterMax !== undefined && (
          <div className="px-3.5 pb-2 text-right text-xs text-ink-400">
            <span className={length > counterMax ? "text-brand-600" : undefined}>
              {length}
            </span>
            {" / "}
            {counterMax}
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-brand-600">{error}</p>}
    </div>
  );
}
