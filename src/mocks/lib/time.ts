/** 시드 데이터가 항상 "방금 올라온 글"처럼 보이도록 현재 시각 기준으로 계산한다. */
export function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export function hoursAgo(hours: number): string {
  return minutesAgo(hours * 60);
}

export function daysAgo(days: number): string {
  return minutesAgo(days * 60 * 24);
}
