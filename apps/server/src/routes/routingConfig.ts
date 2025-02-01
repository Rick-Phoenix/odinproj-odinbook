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

interface chatConnection {
  userId: string;
  socket: WSContext<WebSocket>;
}
const chatRooms = new Map<number, Set<chatConnection>>();

export function registerApiRoutes(app: AppOpenAPI) {
  return app
    .route("/auth", authRouter)
    .route("/users", userRouter)
    .route("/chats", chatRouter)
    .get(
      "/ws/:chatId",
      verifyChatAccess,
      upgradeWebSocket((c: AppContextWithUser) => {
        const { id: userId, username } = c.var.user;
        const chatId = +c.req.param("chatId");
        return {
          onOpen(evt, ws) {
            if (!chatRooms.has(chatId)) {
              chatRooms.set(chatId, new Set());
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            chatRooms.get(chatId)!.add({ userId, socket: ws });
            ws.send(`Welcome to chat ${chatId}, User ${username}!`);
          },
          onMessage(event, ws) {
            chatRooms.get(chatId)?.forEach((connection) => {
              if (
                connection.userId !== userId &&
                connection.socket.readyState === 1
              ) {
                // @ts-expect-error Small props mismatch for Hono's definition of the event and the event itself
                connection.socket.send(event.data);
              }
            });
          },
          onClose: (ws) => {
            const chatConnections = chatRooms.get(chatId)!;
            chatConnections.forEach((connection) => {
              if (connection.userId === userId)
                chatConnections.delete(connection);
            });
            if (chatConnections.size === 0) {
              chatRooms.delete(chatId);
            }
          },
        };
      })
    );
}

export const apiRoutes = registerApiRoutes(app);
export type ApiRoutes = typeof apiRoutes;
