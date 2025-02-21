import type { PostBasic } from "../lib/api-client";

export function extractFromArray<T extends unknown[]>(
  arr: T,
  predicate: (a: (typeof arr)[number]) => boolean
): (typeof arr)[number][] {
  const removed = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      removed.unshift(arr.splice(i, 1)[0]);
    }
  }
  return removed;
}

export function getTotalPosts(pages: { posts: PostBasic[] }[]) {
  return pages.reduce((acc, next) => (acc += next.posts.length), 0);
}
