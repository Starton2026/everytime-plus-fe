import { TagChip } from "@/shared/components/TagChip";
import { groupTags } from "@/shared/constants/tags";

interface TagSelectorProps {
  /** 선택 가능한 전체 태그 (GET /tags) */
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  /** 지정하면 초과 선택을 막는다. (글쓰기: 최대 3개) */
  max?: number;
  size?: "sm" | "md";
}

export function TagSelector({
  tags,
  selected,
  onToggle,
  max,
  size = "md",
}: TagSelectorProps) {
  const reachedMax = max !== undefined && selected.length >= max;

  return (
    <div className="flex flex-col gap-4">
      {groupTags(tags).map((group) => (
        <section key={group.label}>
          <h3 className="mb-2 text-[11px] font-bold tracking-wide text-ink-400">
            {group.label}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {group.tags.map((tag) => {
              const isSelected = selected.includes(tag);
              return (
                <TagChip
                  key={tag}
                  tag={tag}
                  size={size}
                  selected={isSelected}
                  disabled={!isSelected && reachedMax}
                  onClick={() => onToggle(tag)}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
