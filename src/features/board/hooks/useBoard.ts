import { useEffect, useState } from "react";
import { fetchBoards } from "@/features/board/api/boardApi";
import type { Board } from "@/shared/types/board";

/** 게시판 이름 표시용. 목록이 3개뿐이라 전체를 받아 찾는다. */
export function useBoard(boardId: number | null): Board | null {
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    if (boardId === null) {
      setBoard(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const boards = await fetchBoards();
        if (cancelled) return;
        setBoard(boards.find((item) => item.id === boardId) ?? null);
      } catch {
        if (!cancelled) setBoard(null);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [boardId]);

  return board;
}
