import { http } from "@/shared/api/httpClient";
import type { AuthResponse, LoginRequest, SignupRequest, User } from "@/shared/types/auth";

interface TokenApiResponse {
  access_token: string;
  nickname: string;
}

interface MeApiResponse {
  id: number;
  username: string;
  nickname: string;
}

function toAuthResponse(response: TokenApiResponse): AuthResponse {
  return { accessToken: response.access_token, nickname: response.nickname };
}

/** POST /auth/login */
export async function login(body: LoginRequest): Promise<AuthResponse> {
  const response = await http.post<TokenApiResponse>("/auth/login", body, false);
  return toAuthResponse(response);
}

/** POST /auth/signup — 성공 시 토큰이 바로 발급된다 (자동 로그인) */
export async function signup(body: SignupRequest): Promise<AuthResponse> {
  const response = await http.post<TokenApiResponse>("/auth/signup", body, false);
  return toAuthResponse(response);
}

/** GET /auth/me — 앱 실행 시 토큰 유효성 확인에도 쓴다 */
export async function getMe(): Promise<User> {
  return http.get<MeApiResponse>("/auth/me");
}
