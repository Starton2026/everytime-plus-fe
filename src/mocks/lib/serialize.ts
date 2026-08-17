import { getDb } from "@/mocks/db";
import type { MockReaction } from "@/mocks/types";
import type { ReactionType } from "@/shared/types/reaction";

export const ANONYMOUS_NAME = "익명";

/** isAnonymous면 닉네임 대신 "익명"을 내려준다. (기능정의서 프론트 표시 규칙) */
export function resolveAuthorName(authorId: number, isAnonymous: boolean): string {
  if (isAnonymous) return ANONYMOUS_NAME;
  const author = getDb().users.find((user) => user.id === authorId);
  return author?.nickname ?? "알 수 없음";
}

export interface ReactionSummary {
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  myReaction: ReactionType | null;
}

/** 시드에 박아둔 기본 카운트 + 실제 사용자가 누른 반응을 합쳐서 계산한다. */
export function summarizeReactions(
  reactions: MockReaction[],
  targetId: number,
  base: { like: number; dislike: number },
  currentUserId: number | null,
): ReactionSummary {
  const forTarget = reactions.filter((reaction) => reaction.targetId === targetId);

  const mine =
    currentUserId === null
      ? undefined
      : forTarget.find((reaction) => reaction.userId === currentUserId);

  return {
    likeCount:
      base.like + forTarget.filter((reaction) => reaction.type === "LIKE").length,
    dislikeCount:
      base.dislike +
      forTarget.filter((reaction) => reaction.type === "DISLIKE").length,
    isLiked: mine?.type === "LIKE",
    isDisliked: mine?.type === "DISLIKE",
    myReaction: mine?.type ?? null,
  };
}

/**
 * 같은 버튼을 다시 누르면 취소, 다른 버튼을 누르면 교체.
 * (사용자당 1회 · 둘 중 하나만 선택)
 */
export function applyReaction(
  reactions: MockReaction[],
  targetId: number,
  userId: number,
  type: ReactionType,
): void {
  const index = reactions.findIndex(
    (reaction) => reaction.targetId === targetId && reaction.userId === userId,
  );

  if (index === -1) {
    reactions.push({ targetId, userId, type });
    return;
  }

  if (reactions[index].type === type) {
    reactions.splice(index, 1);
    return;
  }

  reactions[index] = { targetId, userId, type };
}

const PREVIEW_LENGTH = 90;

/**
 * 리스트에 보여줄 본문 일부.
 * 검색어가 있으면 매치된 부분이 보이도록 잘라낸다.
 */
export function buildPreview(content: string, search?: string): string {
  const flat = content.replace(/\s+/g, " ").trim();
  const keyword = search?.trim();

  if (!keyword) {
    return flat.length > PREVIEW_LENGTH
      ? `${flat.slice(0, PREVIEW_LENGTH)}…`
      : flat;
  }

  const matchedAt = flat.toLowerCase().indexOf(keyword.toLowerCase());
  if (matchedAt <= PREVIEW_LENGTH / 2) {
    return flat.length > PREVIEW_LENGTH
      ? `${flat.slice(0, PREVIEW_LENGTH)}…`
      : flat;
  }

  const start = matchedAt - Math.floor(PREVIEW_LENGTH / 3);
  const snippet = flat.slice(start, start + PREVIEW_LENGTH);
  const suffix = start + PREVIEW_LENGTH < flat.length ? "…" : "";

  return `…${snippet}${suffix}`;
}
