import { createNodeWebSocket } from "@hono/node-ws";
import type { WSContext } from "hono/ws";
import { createRouter } from "../lib/create-app";
import { protectRoute } from "../middlewares/auth-middleware";
import type { AppContextWithUser, AppOpenAPI } from "../types/app-bindings";
import { authRouter } from "./auth/authRouter";
import { chatRouter } from "./chats/chatsRouter";
import { roomsRouter } from "./rooms/roomsRouter";
import { userRouter } from "./users/usersRouter";
import { postsRouter } from './posts/postsRouter';
import { marketRouter } from './market/marketRouter';

const app = createRouter();

// eslint-disable-next-line @typescript-eslint/unbound-method
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
  app,
});
export { injectWebSocket, upgradeWebSocket };

const chatSockets = new Map<string, WSContext<WebSocket>>();

export function registerApiRoutes(app: AppOpenAPI) {
  return app
    .get(
      "/ws",
      protectRoute,
      upgradeWebSocket((c: AppContextWithUser) => {
        const { id: userId } = c.var.user;
        return {
          onOpen(evt, ws) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            chatSockets.set(userId, ws);
          },
          onMessage(event, ws) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const data: { receiver: string; chatId: number } = JSON.parse(
              // @ts-expect-error Small props mismatch for Hono's definition of the event and the event itself
              event.data
            );
            const pairedSocket = chatSockets.get(data.receiver);
            if (pairedSocket) {
              pairedSocket.send(data.chatId.toString());
            }
          },
          onClose: (ws) => {
            chatSockets.delete(userId);
          },
        };
      })
    )
    .route("/auth", authRouter)
    .route("/users", userRouter)
    .route("/chats", chatRouter)
    .route("/rooms", roomsRouter).route("/posts", postsRouter).route("/market", marketRouter);
}

export const apiRoutes = registerApiRoutes(app);
export type ApiRoutes = typeof apiRoutes;
