import type { PostBasic } from "../lib/db-types";

export function getTotalPosts(pages: { posts: PostBasic[] }[]) {
  return pages.reduce((acc, next) => (acc += next.posts.length), 0);
}
