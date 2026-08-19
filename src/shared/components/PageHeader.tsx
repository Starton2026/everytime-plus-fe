import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@/shared/components/Icons";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** 지정하면 해당 경로로, 없으면 브라우저 히스토리 뒤로 */
  backTo?: string;
  showBack?: boolean;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  backTo,
  showBack = true,
  actions,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const goBack = () => {
    if (backTo) {
      navigate(backTo);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="flex items-start gap-2 py-5">
      {showBack && (
        <button
          type="button"
          onClick={goBack}
          aria-label="뒤로 가기"
          className="-ml-2 mt-0.5 shrink-0 rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-surface hover:text-ink-900"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
      )}

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-bold tracking-tight text-ink-900">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-[13px] text-ink-400">{description}</p>
        )}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
