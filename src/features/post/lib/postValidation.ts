import { POST_LIMITS } from "@/features/post/constants/postConstants";

/** 제목은 앞뒤 공백을 자동으로 제거한 값으로 검사·저장한다. */
export function validateTitle(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "제목을 입력해주세요";
  if (trimmed.length > POST_LIMITS.titleMax) {
    return `제목은 ${POST_LIMITS.titleMax}자 이하로 입력해주세요`;
  }
  return null;
}

export function validateContent(value: string): string | null {
  if (!value.trim()) return "본문을 입력해주세요";
  if (value.length > POST_LIMITS.contentMax) {
    return `본문은 ${POST_LIMITS.contentMax}자 이하로 입력해주세요`;
  }
  return null;
}

export function validateTags(tags: string[]): string | null {
  if (tags.length > POST_LIMITS.tagMax) {
    return `태그는 최대 ${POST_LIMITS.tagMax}개까지 선택할 수 있습니다`;
  }
  return null;
}

/** 검색어: 1~50자, 공백만 입력 불가 */
export function validateSearch(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "검색어를 입력해주세요";
  if (trimmed.length > POST_LIMITS.searchMax) {
    return `검색어는 ${POST_LIMITS.searchMax}자 이하로 입력해주세요`;
  }
  return null;
}
