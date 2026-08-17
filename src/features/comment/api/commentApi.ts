import { commit, getDb, nextId } from "@/mocks/db";
import { delay } from "@/mocks/lib/delay";
import {
  applyReaction,
  resolveAuthorName,
  summarizeReactions,
} from "@/mocks/lib/serialize";
import { getCurrentUser, requireCurrentUser } from "@/mocks/session";
import type { MockComment } from "@/mocks/types";
import { ApiError } from "@/shared/api/apiError";
import type { Comment, CreateCommentRequest } from "@/shared/types/comment";
import type { ReactionResponse, ReactionType } from "@/shared/types/reaction";

function toComment(comment: MockComment): Comment {
  const currentUser = getCurrentUser();
  const reactions = summarizeReactions(
    getDb().commentReactions,
    comment.id,
    { like: comment.baseLikeCount, dislike: comment.baseDislikeCount },
    currentUser?.id ?? null,
  );

  return {
    id: comment.id,
    content: comment.content,
    author: resolveAuthorName(comment.authorId, comment.isAnonymous),
    isAnonymous: comment.isAnonymous,
    likeCount: reactions.likeCount,
    dislikeCount: reactions.dislikeCount,
    isLiked: reactions.isLiked,
    isDisliked: reactions.isDisliked,
    createdAt: comment.createdAt,
    isMine: currentUser?.id === comment.authorId,
  };
}

function findCommentOrThrow(commentId: number): MockComment {
  const comment = getDb().comments.find((candidate) => candidate.id === commentId);
  if (!comment) {
    throw new ApiError("댓글을 찾을 수 없습니다", 404);
  }
  return comment;
}

/** GET /posts/{postId}/comments */
export async function fetchComments(postId: number): Promise<Comment[]> {
  await delay();

  return getDb()
    .comments.filter((comment) => comment.postId === postId)
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map(toComment);
}

/** POST /posts/{postId}/comments */
export async function createComment(
  postId: number,
  body: CreateCommentRequest,
): Promise<Comment> {
  await delay();

  const user = requireCurrentUser();
  const db = getDb();

  if (!db.posts.some((post) => post.id === postId)) {
    throw new ApiError("게시글을 찾을 수 없습니다", 404);
  }

  const created: MockComment = {
    id: nextId("comment"),
    postId,
    authorId: user.id,
    content: body.content,
    isAnonymous: body.isAnonymous,
    createdAt: new Date().toISOString(),
    baseLikeCount: 0,
    baseDislikeCount: 0,
  };

  db.comments.push(created);
  commit();

  return toComment(created);
}

/** DELETE /comments/{commentId} */
export async function deleteComment(commentId: number): Promise<void> {
  await delay();

  const user = requireCurrentUser();
  const comment = findCommentOrThrow(commentId);

  if (comment.authorId !== user.id) {
    throw new ApiError("작성자만 삭제할 수 있습니다", 403);
  }

  const db = getDb();
  db.comments = db.comments.filter((candidate) => candidate.id !== commentId);
  db.commentReactions = db.commentReactions.filter(
    (reaction) => reaction.targetId !== commentId,
  );
  commit();
}

/** POST /comments/{commentId}/reaction */
export async function reactToComment(
  commentId: number,
  type: ReactionType,
): Promise<ReactionResponse> {
  await delay(120);

  const user = requireCurrentUser();
  const comment = findCommentOrThrow(commentId);
  const db = getDb();

  applyReaction(db.commentReactions, commentId, user.id, type);
  commit();

  const reactions = summarizeReactions(
    db.commentReactions,
    comment.id,
    { like: comment.baseLikeCount, dislike: comment.baseDislikeCount },
    user.id,
  );

  return {
    likeCount: reactions.likeCount,
    dislikeCount: reactions.dislikeCount,
    myReaction: reactions.myReaction,
  };
}
