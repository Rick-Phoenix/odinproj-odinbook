import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;
export type Profile = z.infer<typeof schemas.profileSchema>;

export const wsRPC = RPC("ws://localhost:5173/");
