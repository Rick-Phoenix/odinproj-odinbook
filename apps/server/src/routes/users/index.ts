import { createRouter } from "@/lib/create-app.js";
import { getUser, usersList } from "./routes.js";
import {
  getUserHandler,
  // usersCreateHandler,
  usersListHandler,
} from "./handlers.js";

export const usersRouter = createRouter()
  .openapi(usersList, usersListHandler)
  // .openapi(usersCreate, usersCreateHandler)
  .openapi(getUser, getUserHandler);
