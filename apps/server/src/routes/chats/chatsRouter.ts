import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { chatId, chatIdHandler } from "./$chatId";

export const chatRouter = createRouter<AppBindingsWithUser>().openapi(
  chatId,
  chatIdHandler
);
