import { Link } from "react-router-dom";
import {
  CommentIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "@/shared/components/Icons";
import { HighlightedText } from "@/shared/components/HighlightedText";
import { TagChip } from "@/shared/components/TagChip";
import { ROUTES } from "@/shared/constants/routes";
import { formatRelativeTime } from "@/shared/lib/formatDate";
import type { PostSummary } from "@/shared/types/post";

interface PostCardProps {
  post: PostSummary;
  /** 검색 결과 하이라이팅용 키워드 */
  keyword?: string;
}

export function PostCard({ post, keyword }: PostCardProps) {
  return (
    <li>
      <Link
        to={ROUTES.postDetail(post.id)}
        className="block border-b border-line bg-surface px-4 py-4 transition-colors hover:bg-surface-muted sm:px-5"
      >
        <h2 className="text-[15px] font-bold leading-snug text-ink-900">
          <HighlightedText text={post.title} keyword={keyword} />
        </h2>

        <p className="mt-1 line-clamp-2-safe text-[13px] leading-relaxed text-ink-500">
          <HighlightedText text={post.preview} keyword={keyword} />
        </p>

        {post.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-400">
          <span className="font-medium text-ink-500">{post.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.createdAt}>
            {formatRelativeTime(post.createdAt)}
          </time>

          <span className="ml-auto flex items-center gap-2.5">
            <span className="flex items-center gap-1">
              <ThumbUpIcon className="size-3.5" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <ThumbDownIcon className="size-3.5" />
              {post.dislikeCount}
            </span>
            <span className="flex items-center gap-1">
              <CommentIcon className="size-3.5" />
              {post.commentCount}
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}
