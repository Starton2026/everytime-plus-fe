import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiErrorHandler } from "@/features/auth/hooks/useApiErrorHandler";
import { fetchPost, updatePost } from "@/features/post/api/postApi";
import { PostForm } from "@/features/post/components/PostForm";
import type { PostFormValues } from "@/features/post/types/postForm";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { PageHeader } from "@/shared/components/PageHeader";
import { LoadingBlock } from "@/shared/components/Spinner";
import { ROUTES } from "@/shared/constants/routes";
import { useTags } from "@/shared/hooks/useTags";
import { useToast } from "@/shared/hooks/useToast";
import type { PostDetail } from "@/shared/types/post";

export function PostEditPage() {
  const { boardId: boardIdParam, postId: postIdParam } = useParams<{
    boardId: string;
    postId: string;
  }>();
  const boardId = Number(boardIdParam);
  const postId = Number(postIdParam);

  const navigate = useNavigate();
  const handleError = useApiErrorHandler();
  const { showToast } = useToast();
  const tags = useTags();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(postId) || !Number.isInteger(boardId)) {
      setBlocked("게시글을 찾을 수 없어요");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const detail = await fetchPost(postId);
        if (cancelled) return;

        // 수정은 작성자만 가능하다.
        if (!detail.isMine) {
          setBlocked("작성자만 수정할 수 있어요");
          return;
        }
        setPost(detail);
      } catch (caught) {
        if (cancelled) return;
        setBlocked("게시글을 찾을 수 없어요");
        handleError(caught);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [boardId, postId, handleError]);

  if (loading) return <LoadingBlock />;

  if (blocked || !post) {
    return (
      <EmptyState
        title={blocked ?? "게시글을 찾을 수 없어요"}
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
      // PUT /posts/{postId}는 isAnonymous를 받지 않는다. (docs/api-spec.md 부록 참고)
      await updatePost(post.id, {
        title: values.title,
        content: values.content,
        tags: values.tags,
      });
      showToast("게시글을 수정했어요", "success");
      navigate(ROUTES.postDetail(post.boardId, post.id), { replace: true });
    } catch (caught) {
      handleError(caught);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="글 수정" backTo={ROUTES.postDetail(post.boardId, post.id)} />

      <PostForm
        mode="edit"
        tags={tags}
        initialValues={{
          title: post.title,
          content: post.content,
          tags: post.tags,
          isAnonymous: post.isAnonymous,
        }}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.postDetail(post.boardId, post.id))}
      />
    </div>
  );
}
