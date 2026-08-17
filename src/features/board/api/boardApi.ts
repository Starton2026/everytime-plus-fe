import { MOCK_BOARDS } from "@/mocks/data/boards";
import { delay } from "@/mocks/lib/delay";
import type { Board } from "@/shared/types/board";

/** GET /boards */
export async function fetchBoards(): Promise<Board[]> {
  await delay(120);
  return MOCK_BOARDS.map((board) => ({ ...board }));
}
