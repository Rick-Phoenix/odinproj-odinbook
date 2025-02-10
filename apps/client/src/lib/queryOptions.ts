import { queryOptions } from "@tanstack/react-query";
import { api, type ListingCategory, type PostBasic } from "./api-client";
import { queryClient } from "./queries/queryClient";

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
      ...userData
    } = data;
    const initialFeedTrending: PostBasic[] = [];
    const initialFeedNewest: PostBasic[] = [];
    for (const room of rooms) {
      queryClient.setQueryData(["userSub", room.name], room);
    }
    queryClient.setQueryData(["suggestedRooms"], suggestedRooms);

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

    queryClient.setQueryData(["listingsCreated"], listingsCreated);
    queryClient.setQueryData(["listingsSaved"], listingsSaved);

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

// POSTS

export const postQueryOptions = (postId: number) => {
  return queryOptions({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await api.posts[":postId"].$get({ param: { postId } });
      const post = await res.json();
      if ("issues" in post) {
        throw new Error("Post not found.");
      }
      return post;
    },
  });
};

// LISTINGS

export const listingQueryOptions = (itemId: number) => {
  return queryOptions({
    queryKey: ["listing", itemId],
    queryFn: async () => {
      const res = await api.market.listings[":itemId"].$get({
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

export const listingsByCategoryQueryOptions = (
  category: ListingCategory,
  orderBy: "cheapest" | "mostRecent",
) => {
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
