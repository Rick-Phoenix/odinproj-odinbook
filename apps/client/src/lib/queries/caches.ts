import type { Post, PostBasic, PostFull } from "../api-client";
import { queryClient } from "./queryClient";
import { sortPosts } from "./queryOptions";

const postsTimeSlotsMap = new Map<string, Map<string, Set<number>>>();
const postsLikesSlotsMap = new Map<string, Map<number, Set<number>>>();

const feedTimeSlotsMap = new Map<string, Set<number>>();
const feedLikesSlotsMap = new Map<number, Set<number>>();

function storeIdInCache<T extends number | string>(
  cache: Map<string, Map<T, Set<number>>>,
  slotValue: T,
  room: string,
  id: number
) {
  if (!cache.get(room)) cache.set(room, new Map());
  const innerCache = cache.get(room);
  const slot =
    typeof slotValue === "string"
      ? getPostTimeSlot(slotValue)
      : (Math.floor((slotValue as number) / 10) as T);
  if (!innerCache?.has(slot as T)) innerCache?.set(slot as T, new Set([id]));
  else {
    const slotValues = innerCache.get(slot as T);
    slotValues!.add(id);
  }
}

function storeIdInFeedCache(timeValue: string, likesValue: number, id: number) {
  const timeSlot = getPostTimeSlot(timeValue);
  const likesSlot = Math.floor(likesValue / 10);
  const timeSlotSet = feedTimeSlotsMap.get(timeSlot);
  if (!timeSlotSet) {
    feedTimeSlotsMap.set(timeSlot, new Set([id]));
  } else timeSlotSet.add(id);
  const likesSlotSet = feedLikesSlotsMap.get(likesSlot);
  if (!likesSlotSet) {
    feedLikesSlotsMap.set(likesSlot, new Set([id]));
  } else likesSlotSet.add(id);
}

export function cachePost(post: PostBasic | PostFull) {
  const room =
    typeof post.room === "string" ? post.room.toLowerCase() : post.room.name.toLowerCase();
  const isFullPost = typeof post.room !== "string";
  storeIdInCache(postsTimeSlotsMap, post.createdAt, room, post.id);
  storeIdInCache(postsLikesSlotsMap, post.likesCount, room, post.id);

  if (queryClient.getQueryData<string[]>(["roomSubs"])?.includes(room)) {
    storeIdInFeedCache(post.createdAt, post.likesCount, post.id);
  }

  queryClient.setQueryData([isFullPost ? "postFull" : "postBasic", post.id], post);
  queryClient.setQueryData(["postLikes", post.id], {
    isLiked: post.isLiked,
    likesCount: post.likesCount,
  });
}

export function getNextPostsByLikes(
  opts: {
    cursorLikes: number;
    cursorTime: string;
  } & ({ room: string; fromFeed?: never } | { fromFeed: true; room?: never })
) {
  const posts = [] as PostBasic[];
  const likesSlot = Math.max(Math.floor(opts.cursorLikes / 10) - 10, 0);
  let nextPostsInRange = !opts.fromFeed
    ? getCachedPostsInLikesSlot(likesSlot, opts.cursorTime, opts.room.toLowerCase())
    : getCachedPostsInLikesSlot(likesSlot, opts.cursorTime, "", true);
  posts.push(...nextPostsInRange);
  return posts;
}

function getCachedPostsInLikesSlot(
  likesSlot: number,
  cursorTime: string,
  roomName: string,
  fromFeed?: boolean
) {
  const posts = [] as PostBasic[];
  const room = roomName.toLowerCase();
  let nextSlotIds: Set<number> | undefined;
  if (fromFeed) nextSlotIds = feedLikesSlotsMap.get(likesSlot);
  else {
    const roomCache = postsLikesSlotsMap.get(room);
    nextSlotIds = roomCache?.get(likesSlot);
  }
  if (!nextSlotIds) return [];
  nextSlotIds.forEach((id) => {
    const post: PostBasic | undefined =
      queryClient.getQueryData(["postBasic", id]) || queryClient.getQueryData(["postFull", id]);
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

export function getNextPostsByTime(
  opts: { cursorTime: string } & (
    | { room: string; fromFeed?: never }
    | { fromFeed: true; room?: never }
  )
) {
  const nextPosts = [] as PostBasic[];
  for (let i = 1; i <= 24; i++) {
    const timeSlot = getNextTimeSlot(opts.cursorTime, i);
    const posts = !opts.fromFeed
      ? getCachedPostsInTimeSlot(timeSlot, opts.room.toLowerCase())
      : getCachedPostsInTimeSlot(timeSlot, "", true);
    nextPosts.push(...posts);
    if (nextPosts.length >= 20) break;
  }

  return nextPosts;
}

function getCachedPostsInTimeSlot(timeSlot: string, room: string, fromFeed?: boolean) {
  const posts = [] as PostBasic[];
  let nextSlotIds: Set<number> | undefined;
  if (fromFeed) nextSlotIds = feedTimeSlotsMap.get(timeSlot);
  else {
    const roomCache = postsTimeSlotsMap.get(room.toLowerCase());
    nextSlotIds = roomCache?.get(timeSlot);
  }
  if (!nextSlotIds) return [];
  nextSlotIds.forEach((id) => {
    const post: PostBasic | undefined =
      queryClient.getQueryData(["postBasic", id]) || queryClient.getQueryData(["postFull", id]);
    if (post) posts.push(post);
  });

  return sortPosts(posts, "createdAt");
}

export function getPostsCursor(post: Post[]) {
  return {
    time: post.at(-1)?.createdAt || new Date().toISOString(),
    likes: post.at(-1)?.likesCount ?? 1000,
  };
}
