import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;

const ws = new WebSocket("/api/ws");
ws.addEventListener("open", () => {
  console.log("OPENED");
  setInterval(() => {
    ws.send(new Date().toString());
  }, 1000);
});
