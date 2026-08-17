import { useState } from "react";
import type { FormEvent } from "react";
import { COMMENT_LIMITS } from "@/features/comment/constants/commentConstants";
import { Button } from "@/shared/components/Button";
import { Checkbox } from "@/shared/components/Checkbox";
import { cn } from "@/shared/lib/cn";

interface CommentFormProps {
  submitting?: boolean;
  onSubmit: (content: string, isAnonymous: boolean) => Promise<void>;
}

export function CommentForm({ submitting = false, onSubmit }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) {
      setError("댓글을 입력해주세요");
      return;
    }
    if (trimmed.length > COMMENT_LIMITS.contentMax) {
      setError(`댓글은 ${COMMENT_LIMITS.contentMax}자 이하로 입력해주세요`);
      return;
    }

    setError(null);
    try {
      await onSubmit(trimmed, isAnonymous);
      setContent("");
    } catch {
      // 실패 메시지는 상위에서 표시한다. 입력한 내용은 지우지 않는다.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-line bg-surface p-4">
      <div
        className={cn(
          "rounded-xl border bg-surface-muted transition-colors",
          "focus-within:border-brand-400 focus-within:bg-surface focus-within:ring-2 focus-within:ring-brand-200",
          error ? "border-brand-400" : "border-line",
        )}
      >
        <textarea
          rows={3}
          value={content}
          maxLength={COMMENT_LIMITS.contentMax}
          onChange={(event) => setContent(event.target.value)}
          placeholder="댓글을 남겨보세요"
          aria-label="댓글 입력"
          className="block w-full resize-none rounded-xl bg-transparent px-3.5 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
        />

        <div className="flex items-center gap-3 px-3.5 pb-3">
          <Checkbox
            label="익명"
            checked={isAnonymous}
            onChange={setIsAnonymous}
            disabled={submitting}
          />
          <span className="text-xs text-ink-400">
            {content.length} / {COMMENT_LIMITS.contentMax}
          </span>
          <Button
            type="submit"
            size="sm"
            loading={submitting}
            className="ml-auto px-4"
          >
            등록
          </Button>
        </div>
      </div>

      {error && <p className="mt-1.5 px-1 text-xs text-brand-600">{error}</p>}
    </form>
  );
}
