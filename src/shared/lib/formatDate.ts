const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * API의 createdAt은 "2026-08-10" 또는 ISO datetime 두 형식 모두 올 수 있다.
 * (docs/api-spec.md 부록 참고)
 */
function parse(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** 목록·댓글에 쓰는 상대 시간. "방금 전 / 12분 전 / 3시간 전 / 어제 / 08/10" */
export function formatRelativeTime(value: string): string {
  const date = parse(value);
  if (!date) return value;

  const diff = Date.now() - date.getTime();

  if (diff < MINUTE) return "방금 전";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}시간 전`;
  if (diff < 2 * DAY) return "어제";
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}일 전`;

  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

/** 상세 화면에 쓰는 절대 시간. "2026.08.10 14:03" */
export function formatDateTime(value: string): string {
  const date = parse(value);
  if (!date) return value;

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
