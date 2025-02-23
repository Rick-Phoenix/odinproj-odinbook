import type { PostBasic } from "../lib/api-client";

export function extractPostsFromArray<T extends PostBasic>(
  arr: T[],
  predicate: (item: T) => boolean,
  idSet: Set<number>
): T[] {
  const removed = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      const removedPost = arr.splice(i, 1)[0];
      if (!idSet.has(removedPost.id)) removed.unshift(removedPost);
    }
  }
  return removed;
}

export function getTotalPosts(pages: { posts: PostBasic[] }[]) {
  return pages.reduce((acc, next) => (acc += next.posts.length), 0);
}
