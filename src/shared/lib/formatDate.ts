const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const HAS_TIME = /\d{2}:\d{2}/;
const HAS_TIMEZONE = /(Z|[+-]\d{2}:?\d{2})$/;

/**
 * 백엔드는 created_at을 datetime.utcnow()로 저장하고 타임존 없이 내려준다.
 * ("2026-08-19T04:12:33")
 *
 * 이런 문자열을 그대로 new Date()에 넣으면 브라우저가 로컬 시간으로 해석해서
 * 한국 기준 9시간 어긋난다. 시간 정보가 있는데 타임존이 없으면 UTC로 간주한다.
 */
function parse(value: string): Date | null {
  const normalized =
    HAS_TIME.test(value) && !HAS_TIMEZONE.test(value) ? `${value}Z` : value;

  const date = new Date(normalized);
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
