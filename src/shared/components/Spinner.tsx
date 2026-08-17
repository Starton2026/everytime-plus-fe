import { cn } from "@/shared/lib/cn";

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = "불러오는 중" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block size-5 animate-spin rounded-full",
        "border-2 border-line-strong border-t-brand-500",
        className,
      )}
    />
  );
}

/** 목록/상세 로딩 시 영역 전체를 채우는 형태 */
export function LoadingBlock({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Spinner className="size-7" />
      <p className="text-sm text-ink-400">{label ?? "불러오는 중이에요"}</p>
    </div>
  );
}
