import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;

const client = RPC("ws://127.0.0.1:5173/api");
const ws = client.ws.$ws();

ws.addEventListener("open", () => {
  console.log("opened");
  setTimeout(() => {
    ws.send("Hello from client!");
  }, 200);
});

ws.addEventListener("message", (e) => {
  console.log(e.data);
});
