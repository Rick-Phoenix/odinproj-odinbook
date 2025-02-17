import { queryOptions } from "@tanstack/react-query";
import { api, type ListingCategory, type PostBasic } from "./api-client";
import { cacheChats } from "./chatQueries";
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
      ownChats,
      ...userData
    } = data;

    cacheChats(ownChats);

    const initialFeedTrending: PostBasic[] = [];
    const initialFeedNewest: PostBasic[] = [];

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
      posts.forEach((post, i) => {
        if (i < 20) initialFeedTrending.push(post);
        else initialFeedNewest.push(post);
        queryClient.setQueryData(["post", post.id], post);
        queryClient.setQueryData(["postLikes", post.id], {
          isLiked: post.isLiked,
          likesCount: post.likesCount,
        });
      });
    }

    queryClient.setQueryData(["initialFeed", "likesCount"], {
      posts: initialFeedTrending,
      total: data.totalFeedPosts,
    });

    queryClient.setQueryData(["initialFeed", "createdAt"], {
      posts: initialFeedNewest.sort((a, b) =>
        new Date(b.createdAt) > new Date(a.createdAt) ? 1 : -1
      ),
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

// ROOMS

export const roomQueryOptions = (
  roomName: string,
  orderBy: "likesCount" | "createdAt" = "likesCount"
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
    queryKey: ["postFull", postId],
    queryFn: async () => {
      const res = await api.posts[":postId"].$get({ param: { postId } });
      const post = await res.json();
      if ("issues" in post) {
        throw new Error("Post not found.");
      }

      queryClient.setQueryData(["postLikes", post.id], {
        isLiked: post.isLiked,
        likesCount: post.likesCount,
      });
      queryClient.setQueryData(["roomPreview", post.room.name], post.room);

      return post;
    },
  });
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

export const listingsByCategoryQueryOptions = (
  category: ListingCategory,
  orderBy: "cheapest" | "mostRecent"
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
