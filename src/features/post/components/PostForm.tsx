import { useState } from "react";
import type { FormEvent } from "react";
import { POST_LIMITS } from "@/features/post/constants/postConstants";
import {
  validateContent,
  validateTags,
  validateTitle,
} from "@/features/post/lib/postValidation";
import type { PostFormValues } from "@/features/post/types/postForm";
import { Button } from "@/shared/components/Button";
import { Checkbox } from "@/shared/components/Checkbox";
import { TagSelector } from "@/shared/components/TagSelector";
import { TextArea } from "@/shared/components/TextArea";
import { TextField } from "@/shared/components/TextField";

interface PostFormProps {
  mode: "create" | "edit";
  /** 선택 가능한 전체 태그 (GET /tags) */
  tags: string[];
  initialValues?: PostFormValues;
  submitting?: boolean;
  onSubmit: (values: PostFormValues) => void;
  onCancel: () => void;
}

const EMPTY_VALUES: PostFormValues = {
  title: "",
  content: "",
  tags: [],
  isAnonymous: true,
};

interface FieldErrors {
  title?: string;
  content?: string;
  tags?: string;
}

export function PostForm({
  mode,
  tags,
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const [values, setValues] = useState<PostFormValues>(
    initialValues ?? EMPTY_VALUES,
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const toggleTag = (tag: string) => {
    setValues((current) => {
      const selected = current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag];
      return { ...current, tags: selected };
    });
    setErrors((current) => ({ ...current, tags: undefined }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {
      title: validateTitle(values.title) ?? undefined,
      content: validateContent(values.content) ?? undefined,
      tags: validateTags(values.tags) ?? undefined,
    };

    if (nextErrors.title || nextErrors.content || nextErrors.tags) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    // 제목 앞뒤 공백은 자동으로 제거한다.
    onSubmit({ ...values, title: values.title.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <TextField
            label="제목"
            value={values.title}
            maxLength={POST_LIMITS.titleMax}
            placeholder="제목을 입력해주세요"
            error={errors.title}
            suffix={`${values.title.length}/${POST_LIMITS.titleMax}`}
            onChange={(event) =>
              setValues((current) => ({ ...current, title: event.target.value }))
            }
          />

          <TextArea
            label="본문"
            rows={12}
            value={values.content}
            maxLength={POST_LIMITS.contentMax}
            counterMax={POST_LIMITS.contentMax}
            placeholder={"자유롭게 이야기해보세요.\n\n서로를 존중하는 글을 부탁드려요."}
            error={errors.content}
            onChange={(event) =>
              setValues((current) => ({ ...current, content: event.target.value }))
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[13px] font-bold text-ink-900">태그</h2>
          <span className="text-[12px] text-ink-400">
            {values.tags.length} / {POST_LIMITS.tagMax}개 선택
          </span>
        </div>

        <TagSelector
          tags={tags}
          selected={values.tags}
          onToggle={toggleTag}
          max={POST_LIMITS.tagMax}
        />

        {errors.tags && (
          <p className="mt-3 text-xs text-brand-600">{errors.tags}</p>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        {mode === "create" ? (
          <Checkbox
            label="익명으로 작성"
            description="작성자가 '익명'으로 표시돼요"
            checked={values.isAnonymous}
            onChange={(checked) =>
              setValues((current) => ({ ...current, isAnonymous: checked }))
            }
          />
        ) : (
          <p className="text-[13px] text-ink-400">
            작성자 표시:{" "}
            <b className="text-ink-700">
              {values.isAnonymous ? "익명" : "닉네임 공개"}
            </b>
            <span className="ml-1.5">— 수정 시에는 변경할 수 없어요</span>
          </p>
        )}
      </div>

      <div className="flex gap-2 pb-8">
        <Button
          variant="secondary"
          size="lg"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1"
        >
          취소
        </Button>
        <Button type="submit" size="lg" loading={submitting} className="flex-[2]">
          {mode === "create" ? "등록하기" : "수정 완료"}
        </Button>
      </div>
    </form>
  );
}
