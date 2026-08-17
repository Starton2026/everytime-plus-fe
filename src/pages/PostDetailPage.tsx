import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiErrorHandler } from "@/features/auth/hooks/useApiErrorHandler";
import { CommentForm } from "@/features/comment/components/CommentForm";
import { CommentList } from "@/features/comment/components/CommentList";
import {
  createComment,
  deleteComment,
  fetchComments,
  reactToComment,
} from "@/features/comment/api/commentApi";
import {
  deletePost,
  fetchPost,
  reactToPost,
} from "@/features/post/api/postApi";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { CommentIcon, PencilIcon, TrashIcon } from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import { ReactionButtons } from "@/shared/components/ReactionButtons";
import { LoadingBlock } from "@/shared/components/Spinner";
import { TagChip } from "@/shared/components/TagChip";
import { LIST_QUERY_KEYS, ROUTES } from "@/shared/constants/routes";
import { useToast } from "@/shared/hooks/useToast";
import { formatDateTime } from "@/shared/lib/formatDate";
import type { Comment } from "@/shared/types/comment";
import type { PostDetail } from "@/shared/types/post";
import type { ReactionType } from "@/shared/types/reaction";

export function PostDetailPage() {
  const { postId: postIdParam } = useParams<{ postId: string }>();
  const postId = Number(postIdParam);

  const navigate = useNavigate();
  const handleError = useApiErrorHandler();
  const { showToast } = useToast();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [reactionPending, setReactionPending] = useState(false);
  const [commentPendingId, setCommentPendingId] = useState<number | null>(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<"post" | number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(postId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const [detail, commentList] = await Promise.all([
          fetchPost(postId),
          fetchComments(postId),
        ]);
        if (cancelled) return;
        setPost(detail);
        setComments(commentList);
      } catch (caught) {
        if (cancelled) return;
        setNotFound(true);
        handleError(caught);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [postId, handleError]);

  const goToTag = useCallback(
    (tag: string) => {
      if (!post) return;
      const params = new URLSearchParams({ [LIST_QUERY_KEYS.tags]: tag });
      navigate(`${ROUTES.postList(post.boardId)}?${params.toString()}`);
    },
    [navigate, post],
  );

  const handlePostReaction = async (type: ReactionType) => {
    if (!post) return;

    setReactionPending(true);
    try {
      const response = await reactToPost(post.id, type);
      setPost({
        ...post,
        likeCount: response.likeCount,
        dislikeCount: response.dislikeCount,
        isLiked: response.myReaction === "LIKE",
        isDisliked: response.myReaction === "DISLIKE",
      });
    } catch (caught) {
      handleError(caught);
    } finally {
      setReactionPending(false);
    }
  };

  const handleCommentReaction = async (commentId: number, type: ReactionType) => {
    setCommentPendingId(commentId);
    try {
      const response = await reactToComment(commentId, type);
      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likeCount: response.likeCount,
                dislikeCount: response.dislikeCount,
                isLiked: response.myReaction === "LIKE",
                isDisliked: response.myReaction === "DISLIKE",
              }
            : comment,
        ),
      );
    } catch (caught) {
      handleError(caught);
    } finally {
      setCommentPendingId(null);
    }
  };

  const handleCommentSubmit = async (content: string, isAnonymous: boolean) => {
    if (!post) return;

    setCommentSubmitting(true);
    try {
      const created = await createComment(post.id, { content, isAnonymous });
      setComments((current) => [...current, created]);
    } catch (caught) {
      handleError(caught);
      // 입력값을 유지하도록 폼에 실패를 알린다.
      throw caught;
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget === null || !post) return;

    setDeleting(true);
    try {
      if (deleteTarget === "post") {
        await deletePost(post.id);
        showToast("게시글을 삭제했어요", "success");
        navigate(ROUTES.postList(post.boardId), { replace: true });
        return;
      }

      await deleteComment(deleteTarget);
      setComments((current) =>
        current.filter((comment) => comment.id !== deleteTarget),
      );
      showToast("댓글을 삭제했어요", "success");
    } catch (caught) {
      handleError(caught);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) return <LoadingBlock />;

  if (notFound || !post) {
    return (
      <EmptyState
        title="게시글을 찾을 수 없어요"
        description="삭제되었거나 잘못된 주소일 수 있어요."
        action={
          <Button onClick={() => navigate(ROUTES.boardList)}>
            게시판 목록으로
          </Button>
        }
      />
    );
  }

  return (
    <div className="pb-16">
      <PageHeader title="게시글" backTo={ROUTES.postList(post.boardId)} />

      <article className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="px-4 pt-5 sm:px-5">
          <h1 className="text-lg font-bold leading-snug text-ink-900">
            {post.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-ink-400">
            <span className="font-semibold text-ink-500">{post.author}</span>
            {post.isMine && (
              <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600">
                내 글
              </span>
            )}
            <span aria-hidden="true">·</span>
            <time dateTime={post.createdAt}>{formatDateTime(post.createdAt)}</time>
          </div>

          <p className="mt-5 text-body text-[15px] leading-[1.75] text-ink-700">
            {post.content}
          </p>

          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  size="md"
                  onClick={() => goToTag(tag)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-line px-4 py-3.5 sm:px-5">
          <ReactionButtons
            likeCount={post.likeCount}
            dislikeCount={post.dislikeCount}
            isLiked={post.isLiked}
            isDisliked={post.isDisliked}
            pending={reactionPending}
            onReact={handlePostReaction}
          />

          {post.isMine && (
            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(ROUTES.postEdit(post.id))}
              >
                <PencilIcon className="size-3.5" />
                수정
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteTarget("post")}
              >
                <TrashIcon className="size-3.5" />
                삭제
              </Button>
            </div>
          )}
        </div>
      </article>

      <section className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
        <h2 className="flex items-center gap-1.5 border-b border-line px-4 py-3.5 text-[13px] font-bold text-ink-900 sm:px-5">
          <CommentIcon className="size-4 text-ink-400" />
          댓글 {comments.length}
        </h2>

        <CommentList
          comments={comments}
          pendingId={commentPendingId}
          onReact={handleCommentReaction}
          onDelete={(commentId) => setDeleteTarget(commentId)}
        />

        <CommentForm
          submitting={commentSubmitting}
          onSubmit={handleCommentSubmit}
        />
      </section>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={deleteTarget === "post" ? "게시글 삭제" : "댓글 삭제"}
        message={
          deleteTarget === "post"
            ? "삭제한 게시글은 되돌릴 수 없어요. 정말 삭제할까요?"
            : "삭제한 댓글은 되돌릴 수 없어요. 정말 삭제할까요?"
        }
        confirmLabel="삭제"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
