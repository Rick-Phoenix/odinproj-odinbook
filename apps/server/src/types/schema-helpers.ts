import { z } from "@hono/zod-openapi";

export const numberParamSchema = z.coerce
  .number()
  .openapi({ param: { required: true }, type: "number" });
