import { TrashIcon } from "@/shared/components/Icons";
import { ReactionButtons } from "@/shared/components/ReactionButtons";
import { formatRelativeTime } from "@/shared/lib/formatDate";
import type { Comment } from "@/shared/types/comment";
import type { ReactionType } from "@/shared/types/reaction";

interface CommentItemProps {
  comment: Comment;
  pending?: boolean;
  onReact: (commentId: number, type: ReactionType) => void;
  onDelete: (commentId: number) => void;
}

export function CommentItem({
  comment,
  pending = false,
  onReact,
  onDelete,
}: CommentItemProps) {
  return (
    <li className="border-b border-line px-4 py-3.5 last:border-b-0 sm:px-5">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-ink-900">
          {comment.author}
        </span>
        {comment.isMine && (
          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600">
            내 댓글
          </span>
        )}
        <time
          dateTime={comment.createdAt}
          className="text-[12px] text-ink-400"
        >
          {formatRelativeTime(comment.createdAt)}
        </time>

        {comment.isMine && (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            aria-label="댓글 삭제"
            className="ml-auto rounded-lg p-1.5 text-ink-300 transition-colors hover:bg-brand-50 hover:text-brand-600"
          >
            <TrashIcon className="size-4" />
          </button>
        )}
      </div>

      <p className="mt-1.5 text-body text-sm leading-relaxed text-ink-700">
        {comment.content}
      </p>

      <div className="mt-2.5">
        <ReactionButtons
          size="sm"
          likeCount={comment.likeCount}
          dislikeCount={comment.dislikeCount}
          isLiked={comment.isLiked}
          isDisliked={comment.isDisliked}
          pending={pending}
          onReact={(type) => onReact(comment.id, type)}
        />
      </div>
    </li>
  );
}
