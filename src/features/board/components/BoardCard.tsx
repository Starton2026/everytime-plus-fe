import { Link } from "react-router-dom";
import { getBoardMeta } from "@/features/board/constants/boardMeta";
import { ChevronRightIcon } from "@/shared/components/Icons";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/cn";
import type { Board } from "@/shared/types/board";

export function BoardCard({ board }: { board: Board }) {
  const meta = getBoardMeta(board.id);

  return (
    <Link
      to={ROUTES.postList(board.id)}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-surface-muted"
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl text-xl",
          meta.accentClass,
        )}
      >
        {meta.emoji}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-ink-900">
          {board.name}
        </span>
        <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-400">
          {meta.description}
        </span>
      </span>

      <ChevronRightIcon className="size-5 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
