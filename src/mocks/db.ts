import { MOCK_COMMENTS } from "@/mocks/data/comments";
import { MOCK_POSTS } from "@/mocks/data/posts";
import { MOCK_USERS } from "@/mocks/data/users";
import type { MockDatabase } from "@/mocks/types";

/**
 * 백엔드 대신 쓰는 인메모리 DB.
 *
 * 새로고침해도 작성한 글/댓글/로그인 상태가 유지되도록 localStorage에 함께 저장한다.
 * 시드 데이터를 수정했는데 화면에 반영되지 않으면 STORAGE_VERSION을 올리면 된다.
 */
const STORAGE_VERSION = 1;
const STORAGE_KEY = `etp.mockDb.v${STORAGE_VERSION}`;

function createSeedDatabase(): MockDatabase {
  return {
    users: MOCK_USERS.map((user) => ({ ...user })),
    posts: MOCK_POSTS.map((post) => ({ ...post, tags: [...post.tags] })),
    comments: MOCK_COMMENTS.map((comment) => ({ ...comment })),
    postReactions: [],
    commentReactions: [],
    sequences: {
      user: Math.max(...MOCK_USERS.map((user) => user.id)),
      post: Math.max(...MOCK_POSTS.map((post) => post.id)),
      comment: Math.max(...MOCK_COMMENTS.map((comment) => comment.id)),
    },
  };
}

function readFromStorage(): MockDatabase | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<MockDatabase>;
    if (!Array.isArray(parsed.users) || !Array.isArray(parsed.posts)) {
      return null;
    }
    return parsed as MockDatabase;
  } catch {
    return null;
  }
}

let database: MockDatabase = readFromStorage() ?? createSeedDatabase();

export function getDb(): MockDatabase {
  return database;
}

/** 데이터를 변경한 뒤 반드시 호출한다. */
export function commit(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  } catch {
    console.warn("mock 데이터를 저장하지 못했습니다. 새로고침하면 초기화됩니다.");
  }
}

/** 시드 상태로 되돌린다. (개발 중 데이터가 꼬였을 때) */
export function resetDb(): void {
  database = createSeedDatabase();
  commit();
}

export function nextId(key: keyof MockDatabase["sequences"]): number {
  database.sequences[key] += 1;
  return database.sequences[key];
}
