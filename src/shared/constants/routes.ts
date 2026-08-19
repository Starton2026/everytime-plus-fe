/**
 * 게시글 상세·수정 경로에 boardId가 들어간다.
 *
 * 백엔드 게시글 상세 응답에 board_id가 없어서, 상세에서 목록으로 돌아가거나
 * 태그를 눌러 필터링된 목록으로 이동하려면 게시판을 URL로 들고 다녀야 한다.
 */
export const ROUTES = {
  login: "/login",
  signup: "/signup",
  boardList: "/",
  postList: (boardId: number | string) => `/boards/${boardId}/posts`,
  postWrite: (boardId: number | string) => `/boards/${boardId}/posts/new`,
  postDetail: (boardId: number | string, postId: number | string) =>
    `/boards/${boardId}/posts/${postId}`,
  postEdit: (boardId: number | string, postId: number | string) =>
    `/boards/${boardId}/posts/${postId}/edit`,
} as const;

/** 게시글 리스트의 쿼리 파라미터 키 — 검색어/태그/페이지를 URL로 관리한다. */
export const LIST_QUERY_KEYS = {
  search: "search",
  tags: "tags",
  page: "page",
} as const;
