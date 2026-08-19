import { http } from "@/shared/api/httpClient";
import type { Board } from "@/shared/types/board";

/** GET /boards — 기본 게시판 3개가 없으면 서버가 자동으로 만들어준다 */
export async function fetchBoards(): Promise<Board[]> {
  return http.get<Board[]>("/boards", undefined, false);
}
