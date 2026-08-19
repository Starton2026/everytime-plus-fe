import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBoards } from "@/features/board/api/boardApi";
import { BoardCard } from "@/features/board/components/BoardCard";
import { useApiErrorHandler } from "@/features/auth/hooks/useApiErrorHandler";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingBlock } from "@/shared/components/Spinner";
import { TagChip } from "@/shared/components/TagChip";
import { LIST_QUERY_KEYS, ROUTES } from "@/shared/constants/routes";
import { FEATURED_TAGS } from "@/shared/constants/tags";
import type { Board } from "@/shared/types/board";

const DEFAULT_BOARD_ID = 1;

export function BoardListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleError = useApiErrorHandler();

  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetchBoards();
        if (!cancelled) setBoards(response);
      } catch (caught) {
        if (!cancelled) handleError(caught);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [handleError]);

  const goToTag = (tag: string) => {
    const params = new URLSearchParams({ [LIST_QUERY_KEYS.tags]: tag });
    navigate(`${ROUTES.postList(DEFAULT_BOARD_ID)}?${params.toString()}`);
  };

  return (
    <div className="pb-16">
      <section className="py-7">
        <p className="text-[13px] font-medium text-brand-600">
          안녕하세요, {user?.nickname ?? "회원"}님
        </p>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight text-ink-900">
          오늘은 어떤 이야기가 궁금하세요?
        </h1>
      </section>

      {loading ? (
        <LoadingBlock label="게시판을 불러오는 중이에요" />
      ) : (
        <section aria-labelledby="board-list-heading">
          <h2
            id="board-list-heading"
            className="mb-2.5 px-1 text-[13px] font-bold text-ink-500"
          >
            게시판
          </h2>
          <div className="flex flex-col gap-2.5">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-9" aria-labelledby="featured-tag-heading">
        <h2
          id="featured-tag-heading"
          className="mb-1 px-1 text-[13px] font-bold text-ink-500"
        >
          태그로 바로 찾기
        </h2>
        <p className="mb-3 px-1 text-[12px] text-ink-400">
          자유게시판에서 해당 태그가 붙은 글만 모아서 보여줘요
        </p>

        <div className="flex flex-wrap gap-1.5 px-1">
          {FEATURED_TAGS.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              size="md"
              onClick={() => goToTag(tag)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
