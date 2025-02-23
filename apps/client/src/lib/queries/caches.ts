import type { Post, PostBasic, PostFull } from "../api-client";
import { queryClient } from "./queryClient";

export const postsTimeSlotsMap = new Map<string, Map<string, Set<number>>>();
export const postsLikesSlotsMap = new Map<string, Map<number, Set<number>>>();
export const cachedPostsMap = new Map<string, Set<number>>();

export function cachePost(post: PostBasic | PostFull) {
  const room = typeof post.room === "string" ? post.room.toLowerCase() : post.room.name.toLowerCase();
  const isFullPost = typeof post.room !== "string";
  if (cachedPostsMap.get(room)?.has(post.id) && !isFullPost) return;
  if (!postsTimeSlotsMap.get(room)) postsTimeSlotsMap.set(room, new Map());
  if (!postsLikesSlotsMap.get(room)) postsLikesSlotsMap.set(room, new Map());
  const timeSlotsMap = postsTimeSlotsMap.get(room);
  const timeSlot = getPostTimeSlot(post.createdAt);
  if (!timeSlotsMap!.has(timeSlot)) {
    timeSlotsMap!.set(timeSlot, new Set([post.id]));
  } else {
    const idsInTimeSlot = timeSlotsMap!.get(timeSlot);
    idsInTimeSlot!.add(post.id);
  }

  const likesSlotsMap = postsLikesSlotsMap.get(room);
  const likesSlot = Math.floor(post.likesCount / 10);
  if (!likesSlotsMap!.has(likesSlot)) {
    likesSlotsMap!.set(likesSlot, new Set([post.id]));
  } else {
    const idsInLikesSlot = likesSlotsMap!.get(likesSlot);
    idsInLikesSlot!.add(post.id);
  }

  queryClient.setQueryData([isFullPost ? "postFull" : "postBasic", room.toLowerCase(), post.id], post);
  queryClient.setQueryData(["postLikes", post.id], {
    isLiked: post.isLiked,
    likesCount: post.likesCount,
  });
  let roomIdCache = cachedPostsMap.get(room);
  if (roomIdCache) roomIdCache.add(post.id);
  else cachedPostsMap.set(room, new Set([post.id]));
}

export function getNextPostsByLikes(cursorLikes: number, cursorTime: string, room: string) {
  const posts = [] as PostBasic[];
  const likesSlot = Math.max(Math.floor(cursorLikes / 10) - 10, 0);
  const nextPostsInRange = getCachedPostsInLikesSlot(likesSlot, cursorTime, room.toLowerCase());
  posts.push(...nextPostsInRange);
  return posts;
}

function getCachedPostsInLikesSlot(likesSlot: number, cursorTime: string, roomName: string) {
  const posts = [] as PostBasic[];
  const room = roomName.toLowerCase();
  const roomCache = postsLikesSlotsMap.get(room);
  const nextSlotIds = roomCache?.get(likesSlot);
  if (!roomCache || !nextSlotIds) return [];
  nextSlotIds.forEach((id) => {
    const post: PostBasic | undefined =
      queryClient.getQueryData(["postBasic", room, id]) || queryClient.getQueryData(["postFull", room, id]);
    if (post && new Date(post.createdAt) < new Date(cursorTime)) posts.push(post);
  });

  return posts;
}

function getPostTimeSlot(postDate: string) {
  const nextHourKey = new Date(postDate + "Z").toISOString().slice(0, 13);
  return nextHourKey;
}

function getNextTimeSlot(cursorTime: string, offset: number = 1) {
  const cursorHour = new Date(cursorTime + "Z");
  cursorHour.setUTCHours(cursorHour.getUTCHours() - offset);
  const timeSlot = cursorHour.toISOString().slice(0, 13);
  return timeSlot;
}

export function getNextPostsByTime(cursorTime: string, room: string) {
  const nextPosts = [] as PostBasic[];
  for (let i = 1; i <= 72; i++) {
    const timeSlot = getNextTimeSlot(cursorTime, i);
    const posts = getCachedPostsInTimeSlot(timeSlot, room.toLowerCase());
    nextPosts.push(...posts);
    if (nextPosts.length >= 20) break;
  }

  return nextPosts;
}

function getCachedPostsInTimeSlot(timeSlot: string, room: string) {
  const posts = [] as PostBasic[];
  const roomCache = postsTimeSlotsMap.get(room.toLowerCase());
  const nextSlotIds = roomCache?.get(timeSlot);
  if (!roomCache || !nextSlotIds) return [];
  nextSlotIds.forEach((id) => {
    const post: PostBasic | undefined =
      queryClient.getQueryData(["postBasic", room.toLowerCase(), id]) ||
      queryClient.getQueryData(["postFull", room.toLowerCase(), id]);
    if (post) posts.push(post);
  });

  return posts;
}

export function getCursor(post: Post[]) {
  return {
    time: post.at(-1)?.createdAt || new Date().toISOString(),
    likes: post.at(-1)?.likesCount ?? 1000,
  };
}
