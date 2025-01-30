import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;

const ws = RPC("ws://127.0.0.1:5173");

const test = new WebSocket("/ws/3/2");

const ws3 = ws.ws[":chatId"].$ws({ param: { chatId: "12345" } });

ws3.addEventListener("open", () => {
  console.log("opened");
  setTimeout(() => {
    ws3.send("Hello from client!");
  }, 200);
});

ws3.addEventListener("message", (e) => {
  console.log(e.data);
});

const ws4 = ws.ws[":chatId"].$ws({ param: { chatId: "ws4" } });

ws4.addEventListener("open", () => {
  console.log("opened");
  setTimeout(() => {
    ws4.send("Hello from client!");
  }, 200);
});

ws4.addEventListener("message", (e) => {
  console.log(e.data);
});
