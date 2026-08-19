import { useEffect, useState } from "react";
import { fetchTags } from "@/shared/api/tagApi";
import { ALL_TAGS } from "@/shared/constants/tags";

/**
 * GET /tags — 자주 바뀌지 않으므로 화면 진입 시 한 번만 받는다.
 * 응답이 오기 전이나 실패했을 때는 기본 태그 목록을 그대로 쓴다.
 */
export function useTags(): string[] {
  const [tags, setTags] = useState<string[]>(ALL_TAGS);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetchTags();
        if (!cancelled && response.length > 0) setTags(response);
      } catch {
        // 실패하면 기본 목록을 그대로 둔다. 태그 선택은 계속 쓸 수 있어야 한다.
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return tags;
}
