export interface TagGroup {
  label: string;
  tags: string[];
}

/**
 * 선택 가능한 태그 목록.
 *
 * 백엔드에는 태그 목록 조회 API가 없고, 게시글 작성 시 받은 태그 이름을
 * Tag 테이블에 없으면 새로 만들어 연결하는 구조다.
 * 그래서 선택 UI에 노출할 태그는 프론트 상수로 관리한다.
 */
const TAG_GROUPS: TagGroup[] = [
  {
    label: "일상",
    tags: ["질문", "정보", "잡담", "고민", "추천", "후기", "맛집", "연애", "축제"],
  },
  {
    label: "학사",
    tags: ["수강신청", "수업", "시간표", "과제", "시험", "동아리", "기숙사"],
  },
  {
    label: "진로",
    tags: ["취업", "이직", "면접", "진로", "자격증", "대학원", "커리어"],
  },
];

/** 선택 UI에 노출할 전체 태그 (그룹 순서대로 평평하게 편 목록) */
export const ALL_TAGS: string[] = TAG_GROUPS.flatMap((group) => group.tags);

/** 태그 목록을 그룹에 배치한다. 미분류 태그는 "기타"로 묶는다. */
export function groupTags(allTags: string[]): TagGroup[] {
  const known = new Set(TAG_GROUPS.flatMap((group) => group.tags));

  const groups = TAG_GROUPS.map((group) => ({
    label: group.label,
    tags: group.tags.filter((tag) => allTags.includes(tag)),
  })).filter((group) => group.tags.length > 0);

  const others = allTags.filter((tag) => !known.has(tag));
  if (others.length > 0) {
    groups.push({ label: "기타", tags: others });
  }

  return groups;
}

/** 게시판 목록 화면에서 바로 눌러볼 수 있게 노출하는 태그 */
export const FEATURED_TAGS = ["시험", "과제", "수강신청", "맛집", "취업", "동아리"];
