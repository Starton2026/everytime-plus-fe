import { http } from "@/shared/api/httpClient";

/**
 * GET /tags
 *
 * 태그는 게시글 리스트 필터, 글쓰기, 상세 등 여러 기능에서 함께 쓰이므로 shared에 둔다.
 * 서버는 기본 태그 + 사용자가 새로 만든 태그를 합쳐서 내려준다.
 */
export async function fetchTags(): Promise<string[]> {
  return http.get<string[]>("/tags", undefined, false);
}
