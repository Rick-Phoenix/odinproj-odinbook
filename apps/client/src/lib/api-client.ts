import RPC, { schemas } from "@nexus/shared-schemas";
import { z } from "zod";

export const api = RPC("/api");

export type Message = z.infer<typeof schemas.messagesSchema>;
export type Chat = z.infer<typeof schemas.chatSchema>;

export const wsRPC = RPC("ws://localhost:5173/");

// const webSocket = wsRPC.ws[":chatId"].$ws({ param: { chatId: "2" } });

// const user = await api.users.user.$get();
// const user2 = await user.json();

// webSocket.addEventListener("open", (e) => {
//   const msg = `Hello from ${user2.username}`;
//   setInterval(() => {
//     webSocket.send(msg);
//     console.log(`Sent message: ${msg}`);
//   }, 5000);
// });

// webSocket.addEventListener("message", (e) => {
//   console.log(`Received message: ${e.data}`);
// });
