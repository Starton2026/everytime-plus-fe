import { useEffect, useState } from "react";
import { Button } from "@/shared/components/Button";
import { Modal } from "@/shared/components/Modal";
import { TagSelector } from "@/shared/components/TagSelector";

interface TagFilterModalProps {
  open: boolean;
  tags: string[];
  selected: string[];
  onClose: () => void;
  onApply: (tags: string[]) => void;
}

/**
 * 모바일·태블릿용 태그 선택 UI.
 * 여기서는 "적용"을 눌러야 필터가 반영된다. (데스크톱 사이드바는 즉시 반영)
 */
export function TagFilterModal({
  open,
  tags,
  selected,
  onClose,
  onApply,
}: TagFilterModalProps) {
  const [draft, setDraft] = useState<string[]>(selected);

  // 열 때마다 현재 적용된 필터에서 다시 시작한다.
  useEffect(() => {
    if (open) setDraft(selected);
  }, [open, selected]);

  const toggle = (tag: string) => {
    setDraft((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  return (
    <Modal
      open={open}
      title="태그 필터"
      onClose={onClose}
      footer={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setDraft([])}
            disabled={draft.length === 0}
          >
            초기화
          </Button>
          <Button variant="primary" fullWidth onClick={() => onApply(draft)}>
            {draft.length > 0 ? `${draft.length}개 적용` : "적용"}
          </Button>
        </div>
      }
    >
      <p className="mb-4 text-[13px] leading-relaxed text-ink-400">
        여러 개를 고를 수 있어요. 선택한 태그를 <b className="text-ink-700">모두</b>{" "}
        가진 게시글만 보여줍니다.
      </p>
      <TagSelector tags={tags} selected={draft} onToggle={toggle} />
    </Modal>
  );
}
