import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;

const client = RPC("http://localhost:5173");
const ws = client.ws.$ws();

ws.addEventListener("open", () => {
  setInterval(() => {
    ws.send(new Date().toString());
  }, 1000);
});
