/**
 * 게시판 화면 표시용 메타데이터.
 * API(GET /boards)는 id와 name만 내려주므로, 설명·아이콘 같은 표현 정보는 프론트에서 갖는다.
 */
export interface BoardMeta {
  emoji: string;
  description: string;
  accentClass: string;
}

const BOARD_META: Record<number, BoardMeta> = {
  1: {
    emoji: "💬",
    description: "학교 이야기부터 사소한 잡담까지, 무엇이든 자유롭게",
    accentClass: "bg-brand-50 text-brand-600",
  },
  2: {
    emoji: "🌱",
    description: "처음이라 궁금한 것들. 선배들이 알려줄게요",
    accentClass: "bg-emerald-50 text-emerald-600",
  },
  3: {
    emoji: "🎓",
    description: "취업·이직·진로, 졸업 이후의 이야기",
    accentClass: "bg-indigo-50 text-indigo-600",
  },
};

const FALLBACK_META: BoardMeta = {
  emoji: "📋",
  description: "게시글을 확인해보세요",
  accentClass: "bg-surface-muted text-ink-500",
};

export function getBoardMeta(boardId: number): BoardMeta {
  return BOARD_META[boardId] ?? FALLBACK_META;
}
