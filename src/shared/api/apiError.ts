/** 공통 에러 응답 형식 — { "message": "에러 메시지", "status": 400 } */
export interface ApiErrorResponse {
  message: string;
  status: number;
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
