/** 댓글 (GET /posts/{postId}/comments) */
export interface Comment {
  id: number;
  content: string;
  author: string;
  isAnonymous: boolean;
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  createdAt: string;
  isMine: boolean;
}

export interface CreateCommentRequest {
  content: string;
  isAnonymous: boolean;
}
