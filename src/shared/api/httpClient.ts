import { ApiError } from "@/shared/api/apiError";
import type { ApiErrorDetailItem } from "@/shared/api/apiError";
import { getAccessToken } from "@/shared/api/authSession";

/**
 * 백엔드 주소.
 *
 * 저장소에 올리지 않는 .env.local의 VITE_API_BASE_URL에서 읽고,
 * 값이 없으면 배포된 백엔드를 쓴다. 덕분에 클론 직후 별 설정 없이 화면이 동작한다.
 * 로컬 백엔드로 붙일 때는 .env.local에 http://localhost:8000 을 넣으면 된다.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://everytime-plus-be.onrender.com";

const STATUS_MESSAGE: Record<number, string> = {
  400: "요청을 처리할 수 없습니다",
  401: "로그인이 필요합니다",
  403: "권한이 없습니다",
  404: "요청한 정보를 찾을 수 없습니다",
  409: "이미 존재하는 값입니다",
  422: "입력값을 확인해주세요",
};

/** Pydantic 검증 실패 메시지는 "Value error, 닉네임은 ..." 형태로 온다. */
function cleanValidationMessage(message: string): string {
  return message.replace(/^(Value error|Assertion failed),\s*/, "");
}

async function toApiError(response: Response): Promise<ApiError> {
  const fallback = STATUS_MESSAGE[response.status] ?? "잠시 후 다시 시도해주세요";

  try {
    const body: unknown = await response.json();
    const detail = (body as { detail?: unknown } | null)?.detail;

    if (typeof detail === "string" && detail) {
      // 토큰 없이 인증 API를 호출하면 FastAPI가 영문 기본 문구를 내려준다.
      if (detail === "Not authenticated") {
        return new ApiError(fallback, response.status);
      }
      return new ApiError(detail, response.status);
    }

    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as ApiErrorDetailItem;
      if (first?.msg) {
        return new ApiError(cleanValidationMessage(first.msg), response.status);
      }
    }
  } catch {
    // 응답 본문이 JSON이 아니면 상태 코드 기본 문구를 쓴다.
  }

  return new ApiError(fallback, response.status);
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  /** JSON으로 직렬화해서 body로 보낼 값 */
  body?: unknown;
  /** URLSearchParams로 변환할 쿼리. undefined 값은 제외된다. */
  query?: URLSearchParams;
  /** Authorization 헤더를 붙일지 여부 (기본: 토큰이 있으면 붙임) */
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, auth = true } = options;

  const url = query
    ? `${API_BASE_URL}${path}?${query.toString()}`
    : `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = auth ? getAccessToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // 서버가 꺼져 있거나 CORS로 막힌 경우
    throw new ApiError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요", 0);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const http = {
  get: <T>(path: string, query?: URLSearchParams, auth = true) =>
    request<T>(path, { method: "GET", query, auth }),
  post: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "POST", body, auth }),
  put: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "PUT", body, auth }),
  delete: <T>(path: string, auth = true) =>
    request<T>(path, { method: "DELETE", auth }),
};
