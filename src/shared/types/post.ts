/** 게시글 리스트 아이템 (GET /boards/{boardId}/posts, GET /search) */
export interface PostSummary {
  id: number;
  boardId: number;
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
  commentCount: number;
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

/** 서버의 Page 응답을 그대로 옮긴 형태 */
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
