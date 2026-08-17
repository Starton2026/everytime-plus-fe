import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiErrorHandler } from "@/features/auth/hooks/useApiErrorHandler";
import { useBoard } from "@/features/board/hooks/useBoard";
import { createPost } from "@/features/post/api/postApi";
import { PostForm } from "@/features/post/components/PostForm";
import type { PostFormValues } from "@/features/post/types/postForm";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { PageHeader } from "@/shared/components/PageHeader";
import { ROUTES } from "@/shared/constants/routes";
import { useTags } from "@/shared/hooks/useTags";
import { useToast } from "@/shared/hooks/useToast";

export function PostWritePage() {
  const { boardId: boardIdParam } = useParams<{ boardId: string }>();
  const boardId = Number(boardIdParam);

  const navigate = useNavigate();
  const handleError = useApiErrorHandler();
  const { showToast } = useToast();
  const board = useBoard(Number.isInteger(boardId) ? boardId : null);
  const tags = useTags();

  const [submitting, setSubmitting] = useState(false);

  if (!Number.isInteger(boardId)) {
    return (
      <EmptyState
        title="게시판을 찾을 수 없어요"
        action={
          <Button onClick={() => navigate(ROUTES.boardList)}>
            게시판 목록으로
          </Button>
        }
      />
    );
  }

  const handleSubmit = async (values: PostFormValues) => {
    setSubmitting(true);
    try {
      await createPost({ boardId, ...values });
      showToast("게시글을 등록했어요", "success");
      // 작성 완료 시 게시글 리스트로 이동한다.
      navigate(ROUTES.postList(boardId), { replace: true });
    } catch (caught) {
      handleError(caught);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="글쓰기"
        description={board ? `${board.name}에 올라갑니다` : undefined}
        backTo={ROUTES.postList(boardId)}
      />

      <PostForm
        mode="create"
        tags={tags}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.postList(boardId))}
      />
    </div>
  );
}
