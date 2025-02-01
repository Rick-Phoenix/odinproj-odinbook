import { createNodeWebSocket } from "@hono/node-ws";
import type { WSContext } from "hono/ws";
import { createRouter } from "../lib/create-app";
import { verifyChatAccess } from "../middlewares/auth-middleware";
import type { AppContextWithUser, AppOpenAPI } from "../types/app-bindings";
import { authRouter } from "./auth/authRouter";
import { chatRouter } from "./chats/chatsRouter";
import { userRouter } from "./users/userRouter";

const app = createRouter();

// eslint-disable-next-line @typescript-eslint/unbound-method
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
  app,
});
export { injectWebSocket, upgradeWebSocket };

const chatRooms = new Map<number, Set<WSContext<WebSocket>>>();
const chatConnection = new Map();

export function registerApiRoutes(app: AppOpenAPI) {
  return app
    .route("/auth", authRouter)
    .route("/users", userRouter)
    .route("/chats", chatRouter)
    .get(
      "/ws/:chatId",
      verifyChatAccess,
      upgradeWebSocket((c: AppContextWithUser) => {
        return {
          onOpen(evt, ws) {
            const { id: userId, username } = c.var.user;
            const chatId = +c.req.param("chatId");
            if (!chatRooms.has(chatId)) {
              chatRooms.set(chatId, new Set());
            }
            chatRooms.get(chatId)!.add(ws);
            ws.send(`Welcome to chat ${chatId}, User ${username}!`);
          },
          onMessage(event, ws) {
            const chatId = +c.req.param("chatId");
            const { id: userId, username } = c.var.user;

            // Broadcast message to everyone in the chat except sender
            chatRooms.get(chatId)?.forEach((client) => {
              if (client !== ws && client.readyState === 1) {
                client.send(event.data);
              }
            });
          },
          onClose: (ws) => {
            const chatId = +c.req.param("chatId");
            chatRooms.get(chatId)?.delete(ws);

            // If no more users, clean up chat room
            if (chatRooms.get(chatId)?.size === 0) {
              chatRooms.delete(chatId);
            }
            console.log(`Connection closed for chat ${chatId}`);
          },
        };
      })
    );
}

export const apiRoutes = registerApiRoutes(app);
export type ApiRoutes = typeof apiRoutes;
