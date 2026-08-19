import { CommentItem } from "@/features/comment/components/CommentItem";
import type { Comment } from "@/shared/types/comment";
import type { ReactionType } from "@/shared/types/reaction";

interface CommentListProps {
  comments: Comment[];
  pendingId?: number | null;
  onReact: (commentId: number, type: ReactionType) => void;
  onDelete: (commentId: number) => void;
}

export function CommentList({
  comments,
  pendingId,
  onReact,
  onDelete,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-ink-400 sm:px-5">
        아직 댓글이 없어요. 첫 댓글을 남겨보세요
      </p>
    );
  }

  return (
    <ul>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          pending={pendingId === comment.id}
          onReact={onReact}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
