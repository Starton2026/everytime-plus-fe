export type ReactionType = "LIKE" | "DISLIKE";

/** POST /posts/{id}/reaction, POST /comments/{id}/reaction 응답 */
export interface ReactionResponse {
  likeCount: number;
  dislikeCount: number;
  /** 반응을 취소한 경우 null */
  myReaction: ReactionType | null;
}
