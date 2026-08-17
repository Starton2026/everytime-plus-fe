import { commit, getDb, nextId } from "@/mocks/db";
import { delay } from "@/mocks/lib/delay";
import {
  applyReaction,
  buildPreview,
  resolveAuthorName,
  summarizeReactions,
} from "@/mocks/lib/serialize";
import { getCurrentUser, requireCurrentUser } from "@/mocks/session";
import type { MockPost } from "@/mocks/types";
import { ApiError } from "@/shared/api/apiError";
import type {
  CreatePostRequest,
  PostDetail,
  PostListParams,
  PostListResponse,
  PostSummary,
  UpdatePostRequest,
} from "@/shared/types/post";
import type { ReactionResponse, ReactionType } from "@/shared/types/reaction";

const DEFAULT_PAGE_SIZE = 10;

function findPostOrThrow(postId: number): MockPost {
  const post = getDb().posts.find((candidate) => candidate.id === postId);
  if (!post) {
    throw new ApiError("게시글을 찾을 수 없습니다", 404);
  }
  return post;
}

function toSummary(post: MockPost, search: string | undefined): PostSummary {
  const db = getDb();
  const currentUser = getCurrentUser();
  const reactions = summarizeReactions(
    db.postReactions,
    post.id,
    { like: post.baseLikeCount, dislike: post.baseDislikeCount },
    currentUser?.id ?? null,
  );

  return {
    id: post.id,
    title: post.title,
    preview: buildPreview(post.content, search),
    tags: [...post.tags],
    author: resolveAuthorName(post.authorId, post.isAnonymous),
    isAnonymous: post.isAnonymous,
    likeCount: reactions.likeCount,
    dislikeCount: reactions.dislikeCount,
    commentCount: db.comments.filter((comment) => comment.postId === post.id).length,
    createdAt: post.createdAt,
    isMine: currentUser?.id === post.authorId,
  };
}

function toDetail(post: MockPost): PostDetail {
  const currentUser = getCurrentUser();
  const reactions = summarizeReactions(
    getDb().postReactions,
    post.id,
    { like: post.baseLikeCount, dislike: post.baseDislikeCount },
    currentUser?.id ?? null,
  );

  return {
    id: post.id,
    boardId: post.boardId,
    title: post.title,
    content: post.content,
    tags: [...post.tags],
    author: resolveAuthorName(post.authorId, post.isAnonymous),
    isAnonymous: post.isAnonymous,
    likeCount: reactions.likeCount,
    dislikeCount: reactions.dislikeCount,
    isLiked: reactions.isLiked,
    isDisliked: reactions.isDisliked,
    createdAt: post.createdAt,
    isMine: currentUser?.id === post.authorId,
  };
}

/** GET /posts?boardId=&search=&tags=&page=&size= */
export async function fetchPosts(
  params: PostListParams,
): Promise<PostListResponse> {
  await delay();

  const page = params.page && params.page > 0 ? params.page : 1;
  const size = params.size && params.size > 0 ? params.size : DEFAULT_PAGE_SIZE;
  const keyword = params.search?.trim().toLowerCase() ?? "";
  const tags = params.tags ?? [];

  const matched = getDb()
    .posts.filter((post) => post.boardId === params.boardId)
    // 검색 조건 AND 태그 조건을 동시에 적용한다.
    .filter((post) => {
      if (!keyword) return true;
      return (
        post.title.toLowerCase().includes(keyword) ||
        post.content.toLowerCase().includes(keyword)
      );
    })
    .filter((post) => {
      if (tags.length === 0) return true;
      return tags.every((tag) => post.tags.includes(tag));
    })
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const totalPages = Math.max(1, Math.ceil(matched.length / size));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * size;

  return {
    content: matched
      .slice(start, start + size)
      .map((post) => toSummary(post, params.search)),
    page: safePage,
    totalPages,
    totalElements: matched.length,
  };
}

/** GET /posts/{postId} */
export async function fetchPost(postId: number): Promise<PostDetail> {
  await delay();
  return toDetail(findPostOrThrow(postId));
}

/** POST /posts */
export async function createPost(body: CreatePostRequest): Promise<PostDetail> {
  await delay();

  const user = requireCurrentUser();
  const db = getDb();

  const created: MockPost = {
    id: nextId("post"),
    boardId: body.boardId,
    authorId: user.id,
    title: body.title,
    content: body.content,
    tags: [...body.tags],
    isAnonymous: body.isAnonymous,
    createdAt: new Date().toISOString(),
    baseLikeCount: 0,
    baseDislikeCount: 0,
  };

  db.posts.push(created);
  commit();

  return toDetail(created);
}

/** PUT /posts/{postId} */
export async function updatePost(
  postId: number,
  body: UpdatePostRequest,
): Promise<PostDetail> {
  await delay();

  const user = requireCurrentUser();
  const post = findPostOrThrow(postId);

  if (post.authorId !== user.id) {
    throw new ApiError("작성자만 수정할 수 있습니다", 403);
  }

  post.title = body.title;
  post.content = body.content;
  post.tags = [...body.tags];
  commit();

  return toDetail(post);
}

/** DELETE /posts/{postId} */
export async function deletePost(postId: number): Promise<void> {
  await delay();

  const user = requireCurrentUser();
  const post = findPostOrThrow(postId);

  if (post.authorId !== user.id) {
    throw new ApiError("작성자만 삭제할 수 있습니다", 403);
  }

  const db = getDb();
  db.posts = db.posts.filter((candidate) => candidate.id !== postId);
  db.comments = db.comments.filter((comment) => comment.postId !== postId);
  db.postReactions = db.postReactions.filter(
    (reaction) => reaction.targetId !== postId,
  );
  commit();
}

/** POST /posts/{postId}/reaction */
export async function reactToPost(
  postId: number,
  type: ReactionType,
): Promise<ReactionResponse> {
  await delay(120);

  const user = requireCurrentUser();
  const post = findPostOrThrow(postId);
  const db = getDb();

  applyReaction(db.postReactions, postId, user.id, type);
  commit();

  const reactions = summarizeReactions(
    db.postReactions,
    post.id,
    { like: post.baseLikeCount, dislike: post.baseDislikeCount },
    user.id,
  );

  return {
    likeCount: reactions.likeCount,
    dislikeCount: reactions.dislikeCount,
    myReaction: reactions.myReaction,
  };
}
