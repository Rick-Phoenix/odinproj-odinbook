import { createNodeWebSocket } from "@hono/node-ws";
import { createRouter } from "../lib/create-app";
import type { AppOpenAPI } from "../types/app-bindings";
import { authRouter } from "./auth/authRouter";
import { chatRouter } from "./chats/chatsRouter";
import { userRouter } from "./users/userRouter";

const app = createRouter();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({
  app,
});
export { injectWebSocket, upgradeWebSocket };

export function registerApiRoutes(app: AppOpenAPI) {
  return app
    .route("/auth", authRouter)
    .route("/users", userRouter)
    .route("/chats", chatRouter)
    .get(
      "/ws",
      upgradeWebSocket((c) => {
        return {
          onOpen(evt, ws) {
            console.log(`connection open!!!!!`);
            ws.send("Hello from serve11111!");
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
    )
    .get(
      "/ws2",
      upgradeWebSocket((c) => {
        return {
          onOpen(evt, ws) {
            console.log(`connection open!!!!!`);
            ws.send("Hello from server22222!");
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
