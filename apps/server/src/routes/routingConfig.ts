import { createNodeWebSocket } from "@hono/node-ws";
import type { WSContext } from "hono/ws";
import { createRouter } from "../lib/create-app";
import { protectRoute } from "../middlewares/auth-middleware";
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

const chatRooms = new Map<string, Set<WSContext<WebSocket>>>();

export function registerApiRoutes(app: AppOpenAPI) {
  return app
    .route("/auth", authRouter)
    .route("/users", userRouter)
    .route("/chats", chatRouter)
    .get(
      "/ws/:chatId",
      protectRoute,
      upgradeWebSocket((c: AppContextWithUser) => {
        return {
          async onOpen(evt, ws) {
            const user = c.var.user;
            const chatId = c.req.param("chatId");
            if (!chatRooms.has(chatId)) {
              chatRooms.set(chatId, new Set());
            }
            chatRooms.get(chatId)!.add(ws);

            console.log(`User ${user.id} connected to chat ${chatId}`);

            ws.send(`Welcome to chat ${chatId}, User ${user.id}!`);
          },
          onMessage(event, ws) {
            console.log(`Message from client: ${event.data}`);
            ws.send("Hello from server!");
          },
          onClose: () => {
            console.log("Connection closed");
          },
        };
      })
    );
}

export const apiRoutes = registerApiRoutes(app);
export type ApiRoutes = typeof apiRoutes;
