export interface User {
  id: number;
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

export interface AuthResponse {
  accessToken: string;
  user: User;
}
