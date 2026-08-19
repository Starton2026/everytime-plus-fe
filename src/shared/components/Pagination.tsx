import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/components/Icons";
import { cn } from "@/shared/lib/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const WINDOW_SIZE = 5;

function buildPageNumbers(page: number, totalPages: number): number[] {
  const start = Math.max(1, Math.min(page - 2, totalPages - WINDOW_SIZE + 1));
  const end = Math.min(totalPages, start + WINDOW_SIZE - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageNumbers(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 py-6" aria-label="페이지">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-surface disabled:text-ink-300 disabled:hover:bg-transparent"
      >
        <ChevronLeftIcon className="size-4.5" />
      </button>

      {pages.map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? "page" : undefined}
          onClick={() => onChange(number)}
          className={cn(
            "size-9 rounded-lg text-sm font-semibold transition-colors",
            number === page
              ? "bg-brand-500 text-white"
              : "text-ink-500 hover:bg-surface",
          )}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-surface disabled:text-ink-300 disabled:hover:bg-transparent"
      >
        <ChevronRightIcon className="size-4.5" />
      </button>
    </nav>
  );
}
