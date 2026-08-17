import { cn } from "@/shared/lib/cn";
import { CheckIcon } from "@/shared/components/Icons";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 select-none",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex size-[18px] items-center justify-center rounded-[6px] border transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-200",
          checked
            ? "border-brand-500 bg-brand-500 text-white"
            : "border-line-strong bg-surface text-transparent",
        )}
      >
        <CheckIcon className="size-3" strokeWidth={3} />
      </span>
      <span className="text-sm text-ink-700">
        {label}
        {description && (
          <span className="ml-1.5 text-xs text-ink-400">{description}</span>
        )}
      </span>
    </label>
  );
}
