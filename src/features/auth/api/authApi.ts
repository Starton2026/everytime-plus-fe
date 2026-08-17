import { commit, getDb, nextId } from "@/mocks/db";
import { delay } from "@/mocks/lib/delay";
import { issueToken, requireCurrentUser } from "@/mocks/session";
import { ApiError } from "@/shared/api/apiError";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from "@/shared/types/auth";

/** POST /auth/login */
export async function login(body: LoginRequest): Promise<AuthResponse> {
  await delay();

  const user = getDb().users.find(
    (candidate) =>
      candidate.username === body.username && candidate.password === body.password,
  );

  if (!user) {
    throw new ApiError("아이디 또는 비밀번호가 올바르지 않습니다", 401);
  }

  return {
    accessToken: issueToken(user.id),
    user: { id: user.id, nickname: user.nickname },
  };
}

/** POST /auth/signup */
export async function signup(body: SignupRequest): Promise<AuthResponse> {
  await delay();

  const db = getDb();

  if (db.users.some((user) => user.username === body.username)) {
    throw new ApiError("이미 사용 중인 아이디입니다", 409);
  }
  if (db.users.some((user) => user.nickname === body.nickname)) {
    throw new ApiError("이미 사용 중인 닉네임입니다", 409);
  }

  const created = {
    id: nextId("user"),
    nickname: body.nickname,
    username: body.username,
    password: body.password,
  };

  db.users.push(created);
  commit();

  return {
    accessToken: issueToken(created.id),
    user: { id: created.id, nickname: created.nickname },
  };
}

/** GET /auth/me */
export async function getMe(): Promise<User> {
  await delay(120);

  const user = requireCurrentUser();
  return { id: user.id, nickname: user.nickname };
}
