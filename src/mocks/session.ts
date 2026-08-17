import { getDb } from "@/mocks/db";
import type { MockUser } from "@/mocks/types";
import { ApiError } from "@/shared/api/apiError";
import { getAccessToken } from "@/shared/api/authToken";

const TOKEN_PREFIX = "mock";

/**
 * 서버의 JWT 발급/검증을 흉내 낸다.
 * 실제 JWT는 아니고 "mock.{userId}.{발급시각}" 형태의 문자열이다.
 */
export function issueToken(userId: number): string {
  return `${TOKEN_PREFIX}.${userId}.${Date.now()}`;
}

function parseUserId(token: string): number | null {
  const [prefix, rawId] = token.split(".");
  if (prefix !== TOKEN_PREFIX) return null;

  const userId = Number(rawId);
  return Number.isInteger(userId) ? userId : null;
}

/** 토큰으로 사용자 조회. 없으면 null. (Authorization 헤더 검증에 해당) */
export function getCurrentUser(): MockUser | null {
  const token = getAccessToken();
  if (!token) return null;

  const userId = parseUserId(token);
  if (userId === null) return null;

  return getDb().users.find((user) => user.id === userId) ?? null;
}

/** 인증이 필요한 API용. 토큰이 없거나 만료되면 401을 던진다. */
export function requireCurrentUser(): MockUser {
  const user = getCurrentUser();
  if (!user) {
    throw new ApiError("로그인이 필요합니다", 401);
  }
  return user;
}
