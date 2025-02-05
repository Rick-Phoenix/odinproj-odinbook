import { queryClient } from "../main";
import { api } from "./api-client";

import { queryOptions } from "@tanstack/react-query";

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
        queryClient.setQueryData(["room", room.name], room);
        const { posts } = room;
        for (const post of posts) {
          feed.push({ ...post, roomName: room.name });
          queryClient.setQueryData(["post", post.id], post);
        }
      }

      queryClient.setQueryData(["feed"], feed);
    }
    return userData;
  },
};

// ROOMS

export const roomQueryOptions = (roomName: string) =>
  queryOptions({
    queryKey: ["room", roomName],
    queryFn: async () => {
      const res = await api.rooms[":roomName"].$get({
        param: { roomName },
        query: {},
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
