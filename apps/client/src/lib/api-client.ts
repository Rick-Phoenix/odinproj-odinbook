import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;

const client = RPC("ws://127.0.0.1:5173");
const ws = client.ws.$ws();

const url1 = client.ws.$url();
console.log("🚀 ~ file: api-client.ts:13 ~ url1:", url1);
const url2 = client.ws2.$url();
console.log("🚀 ~ file: api-client.ts:15 ~ url2:", url2);

ws.addEventListener("open", () => {
  console.log("opened");
  setTimeout(() => {
    ws.send("Hello from client!");
  }, 200);
});

ws.addEventListener("message", (e) => {
  console.log(e.data);
});
const ws2 = client.ws2.$ws();

ws2.addEventListener("open", () => {
  console.log("opened");
  setTimeout(() => {
    ws.send("Hello from client!");
  }, 200);
});

ws2.addEventListener("message", (e) => {
  console.log(e.data);
});
