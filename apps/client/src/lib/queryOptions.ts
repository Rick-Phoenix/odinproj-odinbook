import { queryOptions } from "@tanstack/react-query";
import { queryClient } from "../main";
import { api } from "./api-client";

// USER

export const userQueryOptions = {
  queryKey: ["user"],
  queryFn: async () => {
    const res = await api.users.user.$get();
    if (res.status === 401) {
      return null;
    }
    if (!res.ok) {
      throw new Error("Could not fetch user.");
    }
    const data = await res.json();
    const { roomSubscriptions, ...userData } = data;
    if (roomSubscriptions.length > 0) {
      const feed = [];
      for (const room of roomSubscriptions) {
        const { posts, ...roomData } = room;
        queryClient.setQueryData(["room", room.name], roomData);
        queryClient.setQueryData(["posts", room.name], posts);
        for (const post of posts) {
          feed.push(post);
          queryClient.setQueryData(["post", post.id], post);
        }
      }

      queryClient.setQueryData(["initialFeed"], {
        posts: feed,
        total: data.totalFeedPosts,
      });
    }
    return userData;
  },
};

// ROOMS

export const roomQueryOptions = (
  roomName: string,
  orderBy?: "likes" | "time",
) =>
  queryOptions({
    queryKey: ["room", roomName],
    queryFn: async () => {
      const res = await api.rooms[":roomName"].$get({
        param: { roomName },
        query: { orderBy },
      });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("Room not found.");
      }
      const { posts, ...roomData } = data;
      queryClient.setQueryData(["posts", roomName], posts);
      for (const post of posts) {
        queryClient.setQueryData(["post", post.id], post);
      }
      return roomData;
    },
  });
