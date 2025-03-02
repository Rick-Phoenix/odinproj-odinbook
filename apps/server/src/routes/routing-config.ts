import { createNodeWebSocket } from "@hono/node-ws";
import type { WSContext } from "hono/ws";
import { createRouter } from "../lib/create-app";
import { protectRoute } from "../middlewares/auth-middleware";
import type { AppContextWithUser, AppOpenAPI } from "../types/app-bindings";
import { authRouter } from "./auth/__auth-router";
import { chatRouter } from "./chats/__chats-router";
import { listingsRouter } from "./listings/__listings-router";
import { postsRouter } from "./posts/__posts-router";
import { roomsRouter } from "./rooms/__rooms-router.ts";
import { userRouter } from "./users/__users-router.ts";

const app = createRouter();

// eslint-disable-next-line @typescript-eslint/unbound-method
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
  app,
});
export { injectWebSocket, upgradeWebSocket };

const chatSockets = new Map<string, WSContext<WebSocket>>();

const chatsWebSocketHandler = upgradeWebSocket((c: AppContextWithUser) => {
  const { id: userId } = c.var.user;
  return {
    onOpen(evt, ws) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      chatSockets.set(userId, ws);
    },
    onMessage(event, ws) {
      const data = JSON.parse(
        // @ts-expect-error Small props mismatch for Hono's definition of the event and the event itself
        event.data
      ) as { receiver: string; chatId: number };
      const pairedSocket = chatSockets.get(data.receiver);
      if (pairedSocket) {
        pairedSocket.send(data.chatId.toString());
      }
    },
    onClose: (ws) => {
      chatSockets.delete(userId);
    },
  };
});

export function registerApiRoutes(app: AppOpenAPI) {
  return app
    .get("/ws", protectRoute, chatsWebSocketHandler)
    .route("/auth", authRouter)
    .route("/users", userRouter)
    .route("/chats", chatRouter)
    .route("/rooms", roomsRouter)
    .route("/posts", postsRouter)
    .route("/listings", listingsRouter);
}

export const apiRoutes = registerApiRoutes(app);
export type ApiRoutes = typeof apiRoutes;
