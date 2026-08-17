import { useEffect, useState } from "react";
import { fetchTags } from "@/shared/api/tagApi";

/** GET /tags — 태그 목록은 자주 바뀌지 않으므로 화면 진입 시 한 번만 받는다. */
export function useTags(): string[] {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetchTags();
        if (!cancelled) setTags(response);
      } catch {
        if (!cancelled) setTags([]);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return tags;
}
