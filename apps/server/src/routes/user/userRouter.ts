import { createRouter } from "../../lib/create-app";
import { userRoot, userRootHandler } from "./userRoot";

export const userRouter = createRouter().openapi(userRoot, userRootHandler);
