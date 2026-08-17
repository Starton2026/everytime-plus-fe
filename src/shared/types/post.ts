/**
 * 게시글 리스트 아이템 (GET /posts)
 *
 * `commentCount`, `totalElements`, `isMine`은 명세에 없지만 화면 구현에 필요해
 * 추가로 요청한 필드다. 자세한 이유는 docs/api-spec.md 부록 참고.
 */
export interface PostSummary {
  id: number;
  title: string;
  preview: string;
  tags: string[];
  author: string;
  isAnonymous: boolean;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  createdAt: string;
  isMine: boolean;
}

/** 게시글 상세 (GET /posts/{postId}) */
export interface PostDetail {
  id: number;
  boardId: number;
  title: string;
  content: string;
  tags: string[];
  author: string;
  isAnonymous: boolean;
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  createdAt: string;
  isMine: boolean;
}

export interface PostListParams {
  boardId: number;
  search?: string;
  tags?: string[];
  page?: number;
  size?: number;
}

export interface PostListResponse {
  content: PostSummary[];
  page: number;
  totalPages: number;
  totalElements: number;
}

export interface CreatePostRequest {
  boardId: number;
  title: string;
  content: string;
  tags: string[];
  isAnonymous: boolean;
}

export interface UpdatePostRequest {
  title: string;
  content: string;
  tags: string[];
}
