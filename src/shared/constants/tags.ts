export interface TagGroup {
  label: string;
  tags: string[];
}

/**
 * GET /tags는 태그를 평평한 배열로 내려준다.
 * 선택 UI에서 찾기 쉽도록 프론트에서 분류만 해둔다.
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

/** 서버에서 받은 태그 목록을 그룹에 배치한다. 미분류 태그는 "기타"로 묶는다. */
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
