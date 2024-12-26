import { createRouter } from "@/lib/create-app.js";
import { createRoute } from "@hono/zod-openapi";
import { OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema as exampleMessageSchema } from "stoker/openapi/schemas";

const router = createRouter().openapi(
  createRoute({
    method: "get",
    tags: ["Index"],
    path: "/",
    responses: {
      [OK]: jsonContent(
        exampleMessageSchema("This is the index for the nexus API."),
        "Displays the API Index"
      ),
    },
  }),
  (c) => {
    return c.json(
      {
        message: "This is the index for the nexus API.",
      },
      200
    );
  }
);

export default router;
