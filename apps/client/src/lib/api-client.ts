import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;

const ws = RPC("ws://localhost:5173/");

const ws3 = ws.ws[":chatId"].$ws({ param: { chatId: "12345" } });

ws3.addEventListener("open", (e) => {
  console.log("opened");
  console.log(e);
  setTimeout(() => {
    ws3.send("Hello from client!");
  }, 200);
  console.log(ws3);
});

ws3.addEventListener("message", (e) => {
  console.log(e.data);
});
