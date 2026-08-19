import { http } from "@/shared/api/httpClient";
import type {
  CreatePostRequest,
  PostDetail,
  PostListParams,
  PostListResponse,
  PostSummary,
  UpdatePostRequest,
} from "@/shared/types/post";
import type { ReactionResponse, ReactionType } from "@/shared/types/reaction";

const DEFAULT_PAGE_SIZE = 10;

type ServerReaction = "like" | "dislike";

interface PostListItemApiResponse {
  id: number;
  board_id: number;
  title: string;
  content_preview: string;
  tags: string[];
  like_count: number;
  dislike_count: number;
  comment_count: number;
  author_nickname: string;
  is_anonymous: boolean;
  created_at: string;
  is_mine: boolean;
  my_reaction: ServerReaction | null;
}

interface PostDetailApiResponse extends Omit<PostListItemApiResponse, "content_preview"> {
  content: string;
}

interface PageApiResponse<T> {
  items: T[];
  page: number;
  size: number;
  total_pages: number;
  total_elements: number;
}

interface ReactionApiResponse {
  like_count: number;
  dislike_count: number;
  my_reaction: ServerReaction | null;
}

/** 프론트는 UI 일관성을 위해 대문자를 쓰고, 백엔드는 소문자를 받는다. */
function toServerReactionType(type: ReactionType): ServerReaction {
  return type === "LIKE" ? "like" : "dislike";
}

function toReactionType(value: ServerReaction | null): ReactionType | null {
  if (value === null) return null;
  return value === "like" ? "LIKE" : "DISLIKE";
}

function toReactionResponse(response: ReactionApiResponse): ReactionResponse {
  return {
    likeCount: response.like_count,
    dislikeCount: response.dislike_count,
    myReaction: toReactionType(response.my_reaction),
  };
}

function toSummary(item: PostListItemApiResponse): PostSummary {
  return {
    id: item.id,
    boardId: item.board_id,
    title: item.title,
    preview: item.content_preview,
    tags: item.tags,
    author: item.author_nickname,
    isAnonymous: item.is_anonymous,
    likeCount: item.like_count,
    dislikeCount: item.dislike_count,
    commentCount: item.comment_count,
    createdAt: item.created_at,
    isMine: item.is_mine,
  };
}

function toDetail(response: PostDetailApiResponse): PostDetail {
  return {
    id: response.id,
    boardId: response.board_id,
    title: response.title,
    content: response.content,
    tags: response.tags,
    author: response.author_nickname,
    isAnonymous: response.is_anonymous,
    likeCount: response.like_count,
    dislikeCount: response.dislike_count,
    commentCount: response.comment_count,
    isLiked: response.my_reaction === "like",
    isDisliked: response.my_reaction === "dislike",
    createdAt: response.created_at,
    isMine: response.is_mine,
  };
}

/**
 * 게시글 목록 조회.
 *
 * 백엔드는 목록과 검색이 다른 엔드포인트지만 응답 형태(Page)는 같다.
 * - 검색어·태그가 없으면 GET /boards/{boardId}/posts
 * - 하나라도 있으면 GET /search?board_id=&keyword=&tags=
 */
export async function fetchPosts(
  params: PostListParams,
): Promise<PostListResponse> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const size = params.size && params.size > 0 ? params.size : DEFAULT_PAGE_SIZE;
  const keyword = params.search?.trim() ?? "";
  const tags = params.tags ?? [];

  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("size", String(size));

  let response: PageApiResponse<PostListItemApiResponse>;

  if (keyword || tags.length > 0) {
    query.set("board_id", String(params.boardId));
    if (keyword) query.set("keyword", keyword);
    // FastAPI의 list[str] 쿼리는 같은 키를 반복해서 넘긴다.
    tags.forEach((tag) => query.append("tags", tag));

    response = await http.get<PageApiResponse<PostListItemApiResponse>>(
      "/search",
      query,
    );
  } else {
    response = await http.get<PageApiResponse<PostListItemApiResponse>>(
      `/boards/${params.boardId}/posts`,
      query,
    );
  }

  return {
    content: response.items.map(toSummary),
    page: response.page,
    totalPages: response.total_pages,
    totalElements: response.total_elements,
  };
}

/** GET /posts/{postId} */
export async function fetchPost(postId: number): Promise<PostDetail> {
  const response = await http.get<PostDetailApiResponse>(`/posts/${postId}`);
  return toDetail(response);
}

/** POST /posts */
export async function createPost(body: CreatePostRequest): Promise<PostDetail> {
  const response = await http.post<PostDetailApiResponse>("/posts", {
    board_id: body.boardId,
    title: body.title,
    content: body.content,
    tags: body.tags,
    is_anonymous: body.isAnonymous,
  });
  return toDetail(response);
}

/** PUT /posts/{postId} — isAnonymous는 수정할 수 없다 */
export async function updatePost(
  postId: number,
  body: UpdatePostRequest,
): Promise<PostDetail> {
  const response = await http.put<PostDetailApiResponse>(`/posts/${postId}`, {
    title: body.title,
    content: body.content,
    tags: body.tags,
  });
  return toDetail(response);
}

/** DELETE /posts/{postId} */
export async function deletePost(postId: number): Promise<void> {
  await http.delete<unknown>(`/posts/${postId}`);
}

/** POST /posts/{postId}/reaction */
export async function reactToPost(
  postId: number,
  type: ReactionType,
): Promise<ReactionResponse> {
  const response = await http.post<ReactionApiResponse>(
    `/posts/${postId}/reaction`,
    { type: toServerReactionType(type) },
  );
  return toReactionResponse(response);
}
