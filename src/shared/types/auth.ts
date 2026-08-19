export interface User {
  id: number;
  username: string;
  nickname: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  nickname: string;
  username: string;
  password: string;
}

/** POST /auth/login, POST /auth/signup 응답 (백엔드는 access_token + nickname만 준다) */
export interface AuthResponse {
  accessToken: string;
  nickname: string;
}
