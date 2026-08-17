import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { POST_LIMITS } from "@/features/post/constants/postConstants";
import { validateSearch } from "@/features/post/lib/postValidation";
import { CloseIcon, SearchIcon } from "@/shared/components/Icons";

interface SearchBarProps {
  /** URL 쿼리에서 내려오는 현재 검색어 */
  value: string;
  onSearch: (keyword: string) => void;
}

export function SearchBar({ value, onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState(value);
  const [error, setError] = useState<string | null>(null);

  // 뒤로 가기 등으로 URL이 바뀌면 입력값도 맞춰준다.
  useEffect(() => {
    setKeyword(value);
    setError(null);
  }, [value]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // 완전히 비운 경우는 "검색 해제"로 취급한다.
    if (keyword.length === 0) {
      setError(null);
      onSearch("");
      return;
    }

    const message = validateSearch(keyword);
    if (message) {
      setError(message);
      return;
    }

    setError(null);
    onSearch(keyword.trim());
  };

  const handleClear = () => {
    setKeyword("");
    setError(null);
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} role="search">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-ink-300" />

        <input
          type="search"
          value={keyword}
          maxLength={POST_LIMITS.searchMax}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="제목·본문으로 검색"
          aria-label="게시글 검색"
          className="h-11 w-full rounded-xl border border-line-strong bg-surface pl-10 pr-20 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200 [&::-webkit-search-cancel-button]:hidden"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {keyword.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 지우기"
              className="rounded-full p-1 text-ink-300 transition-colors hover:bg-surface-muted hover:text-ink-500"
            >
              <CloseIcon className="size-4" />
            </button>
          )}
          <button
            type="submit"
            className="rounded-lg bg-brand-500 px-3 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-600"
          >
            검색
          </button>
        </div>
      </div>

      {error && <p className="mt-1.5 px-1 text-xs text-brand-600">{error}</p>}
    </form>
  );
}
