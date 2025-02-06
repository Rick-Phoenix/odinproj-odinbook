import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;
export type Profile = z.infer<typeof schemas.profileSchema>;
export type PostBasic = z.infer<typeof schemas.basicPostSchema>;
export type PostFull = z.infer<typeof schemas.fullPostSchema>;
export type Room = z.infer<typeof schemas.roomSchema>;
export interface InitialFeed {
  posts: PostBasic[];
  total: number;
}
export type SortingOrder = "likes" | "time";

export const wsRPC = RPC("ws://localhost:5173/");
