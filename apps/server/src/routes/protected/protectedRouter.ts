/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createRouter } from "../../lib/create-app";
import { protectRoute } from "../../utils/session";
import { home, homeHandler } from "./home";

export const protectedRouter = createRouter()
  .use(protectRoute)
  //@ts-expect-error (Chaining with .use breaks openapi functions)
  .openapi(home, homeHandler);
