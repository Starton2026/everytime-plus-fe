import type { ReactionType } from "@/shared/types/reaction";

/**
 * mock DB에 저장되는 원본(엔티티) 형태.
 * API 응답 타입(@/shared/types/*)과 달리 authorId·password 같은 서버 내부 값을 갖는다.
 */
export interface MockUser {
  id: number;
  nickname: string;
  username: string;
  password: string;
}

export interface MockPost {
  id: number;
  boardId: number;
  authorId: number;
  title: string;
  content: string;
  tags: string[];
  isAnonymous: boolean;
  createdAt: string;
  /** 다른 사용자들이 이미 누른 수. 로그인 사용자의 반응은 reactions에서 따로 더한다. */
  baseLikeCount: number;
  baseDislikeCount: number;
}

export interface MockComment {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  baseLikeCount: number;
  baseDislikeCount: number;
}

export interface MockReaction {
  userId: number;
  targetId: number;
  type: ReactionType;
}

export interface MockDatabase {
  users: MockUser[];
  posts: MockPost[];
  comments: MockComment[];
  postReactions: MockReaction[];
  commentReactions: MockReaction[];
  sequences: {
    user: number;
    post: number;
    comment: number;
  };
}
