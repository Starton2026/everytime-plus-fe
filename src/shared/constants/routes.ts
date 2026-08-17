export const ROUTES = {
  login: "/login",
  signup: "/signup",
  boardList: "/",
  postList: (boardId: number | string) => `/boards/${boardId}/posts`,
  postWrite: (boardId: number | string) => `/boards/${boardId}/posts/new`,
  postDetail: (postId: number | string) => `/posts/${postId}`,
  postEdit: (postId: number | string) => `/posts/${postId}/edit`,
} as const;

/** 게시글 리스트의 쿼리 파라미터 키 — 검색어/태그/페이지를 URL로 관리한다. */
export const LIST_QUERY_KEYS = {
  search: "search",
  tags: "tags",
  page: "page",
} as const;
