import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;

// const test = new WebSocket("/ws/1/2");
// test.addEventListener("close", (e) => console.log(e));
// test.addEventListener("error", (e) => console.log(e));

// const ws = RPC("ws://localhost:5173/");

// const ws3 = ws.ws[":chatId"].$ws({ param: { chatId: "12345" } });

// ws3.addEventListener("open", (e) => {});

// ws3.addEventListener("message", (e) => {
//   console.log(e.data);
// });
