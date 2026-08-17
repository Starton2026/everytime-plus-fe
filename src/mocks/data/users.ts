import type { MockUser } from "@/mocks/types";

/** 로그인 화면에 안내되는 데모 계정 */
export const DEMO_ACCOUNT = {
  username: "demo",
  password: "demo1234",
} as const;

export const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    nickname: "데모유저",
    username: DEMO_ACCOUNT.username,
    password: DEMO_ACCOUNT.password,
  },
  { id: 2, nickname: "김코딩", username: "kimcoding", password: "password123" },
  { id: 3, nickname: "이자바", username: "leejava", password: "password123" },
  { id: 4, nickname: "박리액트", username: "parkreact", password: "password123" },
  { id: 5, nickname: "최타입", username: "choitype", password: "password123" },
  { id: 6, nickname: "정노드", username: "jeongnode", password: "password123" },
  { id: 7, nickname: "한스프링", username: "hanspring", password: "password123" },
];
