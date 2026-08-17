import { cn } from "@/shared/lib/cn";

type TagChipSize = "sm" | "md";

interface TagChipProps {
  tag: string;
  selected?: boolean;
  size?: TagChipSize;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZE_CLASS: Record<TagChipSize, string> = {
  sm: "h-6 px-2 text-[11px]",
  md: "h-8 px-3 text-[13px]",
};

export function TagChip({
  tag,
  selected = false,
  size = "sm",
  disabled = false,
  onClick,
  className,
}: TagChipProps) {
  const shared = cn(
    "inline-flex items-center rounded-full font-medium transition-colors whitespace-nowrap",
    SIZE_CLASS[size],
    selected
      ? "bg-brand-500 text-white"
      : "bg-brand-50 text-brand-600 border border-brand-100",
    className,
  );

  if (!onClick) {
    return <span className={shared}>#{tag}</span>;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        shared,
        "cursor-pointer",
        !selected && "hover:bg-brand-100",
        selected && "hover:bg-brand-600",
        disabled && "cursor-not-allowed opacity-40 hover:bg-brand-50",
      )}
    >
      #{tag}
    </button>
  );
}
