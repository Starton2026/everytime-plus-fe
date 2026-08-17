import { ThumbDownIcon, ThumbUpIcon } from "@/shared/components/Icons";
import { cn } from "@/shared/lib/cn";
import type { ReactionType } from "@/shared/types/reaction";

type ReactionSize = "sm" | "md";

interface ReactionButtonsProps {
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  pending?: boolean;
  size?: ReactionSize;
  onReact: (type: ReactionType) => void;
}

const SIZE_CLASS: Record<ReactionSize, string> = {
  sm: "h-7 gap-1 px-2 text-[12px]",
  md: "h-9 gap-1.5 px-3 text-sm",
};

const ICON_CLASS: Record<ReactionSize, string> = {
  sm: "size-3.5",
  md: "size-4.5",
};

export function ReactionButtons({
  likeCount,
  dislikeCount,
  isLiked,
  isDisliked,
  pending = false,
  size = "md",
  onReact,
}: ReactionButtonsProps) {
  const base = cn(
    "inline-flex items-center rounded-full border font-semibold transition-colors",
    "disabled:cursor-not-allowed",
    SIZE_CLASS[size],
  );

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={pending}
        aria-pressed={isLiked}
        onClick={() => onReact("LIKE")}
        className={cn(
          base,
          isLiked
            ? "border-brand-200 bg-brand-50 text-brand-600"
            : "border-line-strong bg-surface text-ink-500 hover:bg-surface-muted",
        )}
      >
        <ThumbUpIcon className={ICON_CLASS[size]} />
        {likeCount}
      </button>

      <button
        type="button"
        disabled={pending}
        aria-pressed={isDisliked}
        onClick={() => onReact("DISLIKE")}
        className={cn(
          base,
          isDisliked
            ? "border-indigo-200 bg-indigo-50 text-indigo-600"
            : "border-line-strong bg-surface text-ink-500 hover:bg-surface-muted",
        )}
      >
        <ThumbDownIcon className={ICON_CLASS[size]} />
        {dislikeCount}
      </button>
    </div>
  );
}
