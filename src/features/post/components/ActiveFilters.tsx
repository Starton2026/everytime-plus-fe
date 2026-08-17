import { CloseIcon } from "@/shared/components/Icons";

interface ActiveFiltersProps {
  keyword: string;
  tags: string[];
  totalElements: number;
  onRemoveTag: (tag: string) => void;
  onClearKeyword: () => void;
  onClearAll: () => void;
}

/** 현재 적용된 검색어·태그를 칩으로 보여주고 개별 해제할 수 있게 한다. */
export function ActiveFilters({
  keyword,
  tags,
  totalElements,
  onRemoveTag,
  onClearKeyword,
  onClearAll,
}: ActiveFiltersProps) {
  if (!keyword && tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-1 py-1">
      {keyword && (
        <button
          type="button"
          onClick={onClearKeyword}
          className="inline-flex h-7 items-center gap-1 rounded-full bg-ink-900 px-2.5 text-[12px] font-medium text-white transition-opacity hover:opacity-80"
        >
          검색 · {keyword}
          <CloseIcon className="size-3" />
        </button>
      )}

      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onRemoveTag(tag)}
          className="inline-flex h-7 items-center gap-1 rounded-full bg-brand-500 px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-brand-600"
        >
          #{tag}
          <CloseIcon className="size-3" />
        </button>
      ))}

      <span className="ml-1 text-[12px] text-ink-400">총 {totalElements}개</span>

      <button
        type="button"
        onClick={onClearAll}
        className="ml-auto text-[12px] font-medium text-ink-400 underline-offset-2 transition-colors hover:text-brand-600 hover:underline"
      >
        전체 해제
      </button>
    </div>
  );
}
