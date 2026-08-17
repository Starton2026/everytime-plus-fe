const ACCESS_TOKEN_KEY = "etp.accessToken";

/**
 * accessToken 보관소.
 * 기능정의서상 로그인 상태 유지는 localStorage 기준이다.
 * 실제 API 연동 시 요청 인터셉터가 여기서 토큰을 읽어 Authorization 헤더에 넣는다.
 */
export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    console.warn("accessToken을 저장하지 못했습니다.");
  }
}

export function clearAccessToken(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    console.warn("accessToken을 삭제하지 못했습니다.");
  }
}
