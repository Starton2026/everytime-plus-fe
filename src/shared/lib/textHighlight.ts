export interface TextSegment {
  text: string;
  matched: boolean;
}

/**
 * 검색어와 일치하는 구간을 잘라낸다. (대소문자 무시)
 * 렌더링은 shared/components/HighlightedText 가 담당한다.
 */
export function splitByKeyword(text: string, keyword: string): TextSegment[] {
  const trimmed = keyword.trim();
  if (!trimmed) return [{ text, matched: false }];

  const haystack = text.toLowerCase();
  const needle = trimmed.toLowerCase();
  const segments: TextSegment[] = [];

  let cursor = 0;

  while (cursor < text.length) {
    const found = haystack.indexOf(needle, cursor);
    if (found === -1) break;

    if (found > cursor) {
      segments.push({ text: text.slice(cursor, found), matched: false });
    }
    segments.push({
      text: text.slice(found, found + needle.length),
      matched: true,
    });
    cursor = found + needle.length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), matched: false });
  }

  return segments;
}
