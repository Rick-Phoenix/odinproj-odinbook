import { queryOptions } from "@tanstack/react-query";
import { api, type ListingCategory, type PostBasic } from "../api-client";
import { cachePost } from "./caches";
import { cacheChats } from "./chatQueries";
import { queryClient } from "./queryClient";

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
      subsContent: { rooms, posts, suggestedRooms },
      listingsCreated,
      listingsSaved,
      ownChats,
      ...userData
    } = data;
    console.log("🚀 ~ queryFn: ~ rooms:", rooms);

    cacheChats(ownChats);

    const initialFeedTrending = posts[19].likesCount === 0 ? posts : posts.slice(0, 20);

    if (rooms) {
      for (const room of rooms) {
        queryClient.setQueryData(["roomPreview", room.name], room);
        queryClient.setQueryData(["roomSubs"], (old: string[] | undefined) =>
          !old ? [room.name] : [...old, room.name]
        );
      }
    }

    queryClient.setQueryData(["suggestedRooms"], suggestedRooms);

    if (posts) {
      posts.forEach((post) => {
        cachePost(post);
      });
    }

    queryClient.setQueryData(["initialFeed", "likesCount"], {
      posts: initialFeedTrending,
      total: data.totalFeedPosts,
    });

    queryClient.setQueryData(["initialFeed", "createdAt"], {
      posts: sortPosts(posts, "createdAt").slice(0, 20),
      total: data.totalFeedPosts,
    });

    queryClient.setQueryData(["listingsCreated"], listingsCreated);
    queryClient.setQueryData(
      ["listingsSaved"],
      listingsSaved.map((list) => list.listing)
    );

    return userData;
  },
};

// LISTINGS

export const listingQueryOptions = (itemId: number) => {
  return queryOptions({
    queryKey: ["listing", itemId],
    queryFn: async () => {
      const res = await api.market.listings.listing[":itemId"].$get({
        param: { itemId },
      });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("Listing not found.");
      }
      return data;
    },
  });
};

export const listingsByCategoryQueryOptions = (category: ListingCategory, orderBy: "cheapest" | "mostRecent") => {
  return queryOptions({
    queryKey: ["listings", category],
    queryFn: async () => {
      const res = await api.market.listings.$get({
        query: { category, orderBy },
      });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("Error while fetching the listings.");
      }
      return data;
    },
  });
};

export const profileQueryOptions = (username: string) =>
  queryOptions({
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await api.users[":username"].$get({ param: { username } });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("User not found.");
      }
      return data;
    },
  });

export const roomPostsQueryOptions = (
  roomName: string,
  orderBy: "likesCount" | "createdAt",
  cursorLikes?: number,
  cursorTime?: string
) =>
  queryOptions({
    queryKey: ["room", roomName.toLowerCase(), orderBy],
    queryFn: async () => {
      const res = await api.rooms[":roomName"].posts.$get({
        param: { roomName },
        query: { cursorLikes, cursorTime, orderBy },
      });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("An error occurred while loading the posts.");
      }
      const { posts, ...room } = data;
      for (const post of posts) {
        cachePost(post);
      }

      queryClient.setQueryData(["roomPreview", roomName.toLowerCase()], room);

      return data;
    },
  });

export const postQueryOptions = (postId: number, roomName: string) => {
  return queryOptions({
    queryKey: ["postFull", roomName.toLowerCase(), postId],
    queryFn: async () => {
      const res = await api.posts[":postId"].$get({ param: { postId } });
      const post = await res.json();
      if ("issues" in post) {
        throw new Error("Post not found.");
      }

      cachePost(post);
      queryClient.setQueryData(["roomPreview", post.room.name.toLowerCase()], post.room);

      return post;
    },
  });
};

export const sortPosts = (array: PostBasic[], orderBy: "likesCount" | "createdAt") => {
  return array
    .slice()
    .sort((a, b) =>
      orderBy === "likesCount" ? b.likesCount - a.likesCount : new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1
    );
};
