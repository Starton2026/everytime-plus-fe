import { TagSelector } from "@/shared/components/TagSelector";

interface TagFilterPanelProps {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

/** 데스크톱 사이드바용 태그 필터. 클릭 즉시 반영된다. */
export function TagFilterPanel({
  tags,
  selected,
  onToggle,
  onClear,
}: TagFilterPanelProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-ink-900">태그 필터</h2>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-[12px] font-medium text-ink-400 transition-colors hover:text-brand-600"
          >
            초기화
          </button>
        )}
      </div>

      <TagSelector
        tags={tags}
        selected={selected}
        onToggle={onToggle}
        size="sm"
      />
    </div>
  );
}
