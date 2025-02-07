import { queryOptions } from "@tanstack/react-query";
import { queryClient } from "../main";
import { api, type PostBasic } from "./api-client";

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
    const {
      subsContent: { rooms, posts },
      ...userData
    } = data;
    const initialFeedTrending: PostBasic[] = [];
    const initialFeedNewest: PostBasic[] = [];
    for (const room of rooms) {
      queryClient.setQueryData(["userSub", room.name], room);
    }

    posts.forEach((post, i) => {
      if (i < 20) initialFeedTrending.push(post);
      else initialFeedNewest.push(post);
      queryClient.setQueryData(["post", post.id], post);
    });

    queryClient.setQueryData(["initialFeed", "likesCount"], {
      posts: initialFeedTrending,
      total: data.totalFeedPosts,
    });

    queryClient.setQueryData(["initialFeed", "createdAt"], {
      posts: initialFeedNewest.sort((a, b) =>
        new Date(b.createdAt) > new Date(a.createdAt) ? 1 : -1,
      ),
      total: data.totalFeedPosts,
    });

    return userData;
  },
};

// ROOMS

export const roomQueryOptions = (
  roomName: string,
  orderBy: "likesCount" | "createdAt" = "likesCount",
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

      for (const post of data.posts) {
        queryClient.setQueryData(["post", post.id], post);
      }

      return data;
    },
  });
