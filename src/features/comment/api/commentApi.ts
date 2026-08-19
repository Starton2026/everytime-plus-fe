import { http } from "@/shared/api/httpClient";
import type { Comment, CreateCommentRequest } from "@/shared/types/comment";
import type { ReactionResponse, ReactionType } from "@/shared/types/reaction";

interface CommentApiResponse {
  id: number;
  content: string;
  is_anonymous: boolean;
  author_nickname: string;
  like_count: number;
  dislike_count: number;
  created_at: string;
  is_mine: boolean;
  my_reaction: "like" | "dislike" | null;
}

interface ReactionApiResponse {
  like_count: number;
  dislike_count: number;
  my_reaction: "like" | "dislike" | null;
}

function toComment(response: CommentApiResponse): Comment {
  return {
    id: response.id,
    content: response.content,
    author: response.author_nickname,
    isAnonymous: response.is_anonymous,
    likeCount: response.like_count,
    dislikeCount: response.dislike_count,
    isLiked: response.my_reaction === "like",
    isDisliked: response.my_reaction === "dislike",
    createdAt: response.created_at,
    isMine: response.is_mine,
  };
}

/** GET /posts/{postId}/comments */
export async function fetchComments(postId: number): Promise<Comment[]> {
  const response = await http.get<CommentApiResponse[]>(
    `/posts/${postId}/comments`,
  );
  return response.map(toComment);
}

/** POST /posts/{postId}/comments */
export async function createComment(
  postId: number,
  body: CreateCommentRequest,
): Promise<Comment> {
  const response = await http.post<CommentApiResponse>(
    `/posts/${postId}/comments`,
    { content: body.content, is_anonymous: body.isAnonymous },
  );
  return toComment(response);
}

/** DELETE /posts/{postId}/comments/{commentId} — 명세서와 달리 postId가 경로에 포함된다 */
export async function deleteComment(
  postId: number,
  commentId: number,
): Promise<void> {
  await http.delete<void>(`/posts/${postId}/comments/${commentId}`);
}

/** POST /comments/{commentId}/reaction */
export async function reactToComment(
  commentId: number,
  type: ReactionType,
): Promise<ReactionResponse> {
  const response = await http.post<ReactionApiResponse>(
    `/comments/${commentId}/reaction`,
    { type: type === "LIKE" ? "like" : "dislike" },
  );
  return {
    likeCount: response.like_count,
    dislikeCount: response.dislike_count,
    myReaction:
      response.my_reaction === null
        ? null
        : response.my_reaction === "like"
          ? "LIKE"
          : "DISLIKE",
  };
}
