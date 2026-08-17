import { cn } from "@/shared/lib/cn";

interface BrandMarkProps {
  className?: string;
  /** 헤더처럼 브랜드 배경 위에 놓일 때 흰색 반전 */
  inverted?: boolean;
}

export function BrandMark({ className, inverted = false }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center rounded-[10px] font-black tracking-tighter",
        inverted ? "bg-white text-brand-500" : "bg-brand-500 text-white",
        className,
      )}
    >
      E+
    </span>
  );
}
