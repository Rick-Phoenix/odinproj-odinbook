// const length = 160; // specify the length of the array
// const array = Array.from({ length }, (_, i) => i + 7);
// const l2 = 300; // specify the length of the array
// const a2 = Array.from({ length: l2 }, (_, i) => i + 1);

// for (const i of a2) {
//   await db.insert(likes).values({
//     userId: Math.round(Math.random() * 203 + 1).toString(),
//     postId: array[Math.round(Math.random() * 160)],
//   });
// }

// const a = await fetchRoom("Cats");
// console.log(a);
// export async function fetchRooms() {
//   const room = await db.query.posts.findMany({
//     extras: (fields) => ({
//       ...countRelation("likesCount", fields.id, likes.postId),
//     }),
//     orderBy: desc(sql`"likesCount"`),
//     // desc(groupByColumn("likesCount", fields.id, likes.postId)),
//     limit: 50,
//   });

//   return room;
// }

// const a = await fetchRooms();
// console.log(a);
