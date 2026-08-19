type ClassValue = string | false | null | undefined;

/** 조건부 className을 하나의 문자열로 합친다. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
