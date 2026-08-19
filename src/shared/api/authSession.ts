const ACCESS_TOKEN_KEY = "etp.accessToken";

/**
 * accessToken 보관소. 기능정의서상 로그인 상태 유지는 localStorage 기준이다.
 * httpClient가 요청마다 여기서 토큰을 읽어 Authorization 헤더에 넣는다.
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

export function clearSession(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    console.warn("로그인 정보를 삭제하지 못했습니다.");
  }
}
