import { api } from "./api-client";

import { queryClient } from "../main";

export const userQueryOptions = {
  queryKey: ["user"],
  queryFn: async () => {
    const res = await api.users.user.$get();
    if (res.status === 401) {
      return null;
    }
    if (!res.ok) {
      throw new Error("Server Error");
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
