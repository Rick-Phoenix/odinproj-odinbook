import { eq, getTableColumns } from "drizzle-orm";
import { isLiked } from "./db-methods";
import db from "./dbConfig";
import { posts, rooms, subs, users } from "./schema";

export const postsFromUserSubs = (userId: string) =>
  db
    .select({
      id: posts.id,
    })
    .from(posts)
    .innerJoin(subs, eq(posts.room, subs.room))
    .innerJoin(rooms, eq(rooms.name, posts.room))
    .where(eq(subs.userId, userId))
    .as("user_subs_posts");

const userFeed = (userId: string) => {
  const userSubs = postsFromUserSubs(userId);
  db.select({
    post: getTableColumns(posts),
    author: users.username,
    ...isLiked(userId, posts.id),
  })
    .from(posts)
    .innerJoin(userSubs, eq(posts.id, userSubs.id))
    .innerJoin(users, eq(users.id, posts.authorId))
    // .orderBy(
    //   orderBy === "likes" ? desc(posts.likesCount) : desc(posts.createdAt)
    // )
    .limit(20)
    // .offset(cursor * 20)
    .as("user_feed");
};

// ...(withTotal && {
//   total: sql<number>`count(*) over()`.mapWith(Number).as("total"),
// }),
