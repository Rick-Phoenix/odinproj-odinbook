// export async function fetchUserData(userId: string) {
//   const orderBy = "likes";
//   const cursor = 0;
//   const userSubs = postsFromUserSubs(userId);
//   const userFeed = db
//     .select({
//       post: getTableColumns(posts),
//       author: users.username,
//       ...isLiked(userId, posts.id),
//     })
//     .from(posts)
//     .innerJoin(userSubs, eq(posts.id, userSubs.id))
//     .innerJoin(users, eq(users.id, posts.authorId))
//     .orderBy(
//       orderBy === "likes" ? desc(posts.likesCount) : desc(posts.createdAt)
//     )
//     .limit(20)
//     .offset(cursor * 20)
//     .as("user_feed");

//   const que = await db.query.users.findFirst({
//     extras: {
//       feed: sql<number>`${db.$count(userSubs)}::int`.mapWith(Number).as("feed"),
//     },
//   });
//   console.log("🚀 ~ fetchUserData ~ que:", que);
//   // const query = await db.select({ c: db.$count(userFeed) }).from(userFeed);
//   // console.log("🚀 ~ fetchUserData ~ query:", query);
// }

// await fetchUserData("967186cc-80df-4bf4-80f1-93e7892db2cb");
