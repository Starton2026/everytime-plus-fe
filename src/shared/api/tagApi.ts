import { MOCK_TAGS } from "@/mocks/data/tags";
import { delay } from "@/mocks/lib/delay";

/**
 * GET /tags
 *
 * 태그는 게시글 리스트 필터, 글쓰기, 상세 등 여러 기능에서 함께 쓰이므로 shared에 둔다.
 */
export async function fetchTags(): Promise<string[]> {
  await delay(120);
  return [...MOCK_TAGS];
}
