/**
 * 백엔드(FastAPI) 공통 에러 형식.
 *
 * - 대부분: { "detail": "에러 메시지" }
 * - 422(스키마 검증 실패): { "detail": [{ "loc": [...], "msg": "...", "type": "..." }] }
 */
export interface ApiErrorDetailItem {
  msg?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const FALLBACK_MESSAGE = "잠시 후 다시 시도해주세요";

/** 어떤 예외가 오든 사용자에게 보여줄 문구 하나로 정리한다. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return FALLBACK_MESSAGE;
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function isForbidden(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403;
}
