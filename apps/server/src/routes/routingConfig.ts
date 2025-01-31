import { createNodeWebSocket } from "@hono/node-ws";
import { createRouter } from "../lib/create-app";
import { getUser } from "../middlewares/auth-middleware";
import type { AppContext, AppOpenAPI } from "../types/app-bindings";
import { authRouter } from "./auth/authRouter";
import { chatRouter } from "./chats/chatsRouter";
import { userRouter } from "./users/userRouter";

const app = createRouter();

// eslint-disable-next-line @typescript-eslint/unbound-method
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
      "/ws/:chatId",
      upgradeWebSocket((c: AppContext) => {
        return {
          async onOpen(evt, ws) {
            const user = await getUser(c);
            const chatId = c.req.param("chatId");
            console.log(`connection open!!!!!`);
            console.log(ws.url);
            setTimeout(() => {
              ws.send(`Param is ${chatId}`);
            }, 200);
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
