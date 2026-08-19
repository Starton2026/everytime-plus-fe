import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApiErrorHandler } from "@/features/auth/hooks/useApiErrorHandler";
import { useBoard } from "@/features/board/hooks/useBoard";
import { fetchPosts } from "@/features/post/api/postApi";
import { ActiveFilters } from "@/features/post/components/ActiveFilters";
import { PostCard } from "@/features/post/components/PostCard";
import { SearchBar } from "@/features/post/components/SearchBar";
import { TagFilterModal } from "@/features/post/components/TagFilterModal";
import { TagFilterPanel } from "@/features/post/components/TagFilterPanel";
import { POST_PAGE_SIZE } from "@/features/post/constants/postConstants";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { FilterIcon, PencilIcon } from "@/shared/components/Icons";
import { PageHeader } from "@/shared/components/PageHeader";
import { Pagination } from "@/shared/components/Pagination";
import { LoadingBlock } from "@/shared/components/Spinner";
import { LIST_QUERY_KEYS, ROUTES } from "@/shared/constants/routes";
import { useTags } from "@/shared/hooks/useTags";
import type { PostListResponse } from "@/shared/types/post";

const EMPTY_RESULT: PostListResponse = {
  content: [],
  page: 1,
  totalPages: 1,
  totalElements: 0,
};

interface FilterPatch {
  search?: string;
  tags?: string[];
  page?: number;
}

export function PostListPage() {
  const { boardId: boardIdParam } = useParams<{ boardId: string }>();
  const boardId = Number(boardIdParam);

  const navigate = useNavigate();
  const handleError = useApiErrorHandler();
  const board = useBoard(Number.isInteger(boardId) ? boardId : null);
  const allTags = useTags();

  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get(LIST_QUERY_KEYS.search) ?? "";
  const tagsParam = searchParams.get(LIST_QUERY_KEYS.tags) ?? "";
  const page = Number(searchParams.get(LIST_QUERY_KEYS.page) ?? "1") || 1;

  const selectedTags = useMemo(
    () => tagsParam.split(",").filter(Boolean),
    [tagsParam],
  );

  const [result, setResult] = useState<PostListResponse>(EMPTY_RESULT);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  /** 검색어·태그가 바뀌면 1페이지로 돌아간다. */
  const applyFilters = useCallback(
    (patch: FilterPatch) => {
      const nextSearch = patch.search ?? keyword;
      const nextTags = patch.tags ?? selectedTags;
      const nextPage = patch.page ?? 1;

      const params = new URLSearchParams();
      if (nextSearch) params.set(LIST_QUERY_KEYS.search, nextSearch);
      if (nextTags.length > 0) {
        params.set(LIST_QUERY_KEYS.tags, nextTags.join(","));
      }
      if (nextPage > 1) params.set(LIST_QUERY_KEYS.page, String(nextPage));

      setSearchParams(params);
    },
    [keyword, selectedTags, setSearchParams],
  );

  const toggleTag = (tag: string) => {
    applyFilters({
      tags: selectedTags.includes(tag)
        ? selectedTags.filter((item) => item !== tag)
        : [...selectedTags, tag],
    });
  };

  useEffect(() => {
    if (!Number.isInteger(boardId)) return;

    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const response = await fetchPosts({
          boardId,
          search: keyword || undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          page,
          size: POST_PAGE_SIZE,
        });
        if (!cancelled) setResult(response);
      } catch (caught) {
        if (!cancelled) {
          setResult(EMPTY_RESULT);
          handleError(caught);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [boardId, keyword, selectedTags, page, handleError]);

  if (!Number.isInteger(boardId)) {
    return (
      <EmptyState
        title="게시판을 찾을 수 없어요"
        action={
          <Button onClick={() => navigate(ROUTES.boardList)}>
            게시판 목록으로
          </Button>
        }
      />
    );
  }

  const hasFilter = Boolean(keyword) || selectedTags.length > 0;

  return (
    <div className="pb-24">
      <PageHeader
        title={board?.name ?? "게시판"}
        description="검색과 태그로 원하는 글만 골라보세요"
        backTo={ROUTES.boardList}
        actions={
          <Button
            className="hidden sm:inline-flex"
            onClick={() => navigate(ROUTES.postWrite(boardId))}
          >
            <PencilIcon className="size-4" />
            글쓰기
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <div className="flex flex-col gap-2.5">
            <SearchBar
              value={keyword}
              onSearch={(next) => applyFilters({ search: next })}
            />

            {/* 데스크톱은 우측 사이드바를 쓰고, 그 아래 폭에서는 모달로 연다 */}
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex h-10 items-center gap-1.5 self-start rounded-xl border border-line-strong bg-surface px-3.5 text-[13px] font-semibold text-ink-700 transition-colors hover:bg-surface-muted lg:hidden"
            >
              <FilterIcon className="size-4" />
              태그 필터
              {selectedTags.length > 0 && (
                <span className="ml-0.5 rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white">
                  {selectedTags.length}
                </span>
              )}
            </button>

            <ActiveFilters
              keyword={keyword}
              tags={selectedTags}
              totalElements={result.totalElements}
              onRemoveTag={(tag) =>
                applyFilters({ tags: selectedTags.filter((item) => item !== tag) })
              }
              onClearKeyword={() => applyFilters({ search: "" })}
              onClearAll={() => applyFilters({ search: "", tags: [] })}
            />
          </div>

          <div className="mt-2.5 overflow-hidden rounded-2xl border border-line bg-surface">
            {loading ? (
              <LoadingBlock label="게시글을 불러오는 중이에요" />
            ) : result.content.length === 0 ? (
              <EmptyState
                title={hasFilter ? "검색 결과가 없습니다" : "아직 게시글이 없어요"}
                description={
                  hasFilter
                    ? "검색어나 태그를 바꿔서 다시 찾아보세요."
                    : "이 게시판의 첫 글을 남겨보세요."
                }
                action={
                  hasFilter ? (
                    <Button
                      variant="secondary"
                      onClick={() => applyFilters({ search: "", tags: [] })}
                    >
                      필터 전체 해제
                    </Button>
                  ) : (
                    <Button onClick={() => navigate(ROUTES.postWrite(boardId))}>
                      글쓰기
                    </Button>
                  )
                }
              />
            ) : (
              <ul>
                {result.content.map((post) => (
                  <PostCard key={post.id} post={post} keyword={keyword} />
                ))}
              </ul>
            )}
          </div>

          {!loading && result.content.length > 0 && (
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              onChange={(next) => {
                applyFilters({ page: next });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <TagFilterPanel
              tags={allTags}
              selected={selectedTags}
              onToggle={toggleTag}
              onClear={() => applyFilters({ tags: [] })}
            />
          </div>
        </aside>
      </div>

      <TagFilterModal
        open={filterOpen}
        tags={allTags}
        selected={selectedTags}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          applyFilters({ tags: next });
          setFilterOpen(false);
        }}
      />

      {/* 모바일 전용 글쓰기 버튼 */}
      <button
        type="button"
        onClick={() => navigate(ROUTES.postWrite(boardId))}
        aria-label="글쓰기"
        className="fixed bottom-6 right-5 flex size-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg transition-colors hover:bg-brand-600 sm:hidden"
      >
        <PencilIcon className="size-6" />
      </button>
    </div>
  );
}
