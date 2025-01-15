import { jsonContent } from "stoker/openapi/helpers";

export function inputErrorResponse(schema: Zod.ZodSchema) {
  return jsonContent(
    createInputErrorSchema(schema),
    "The validation error(s)."
  );
}

import { z } from "@hono/zod-openapi";
const createInputErrorSchema = (schema: Zod.ZodSchema) => {
  const { error } = schema.safeParse(
    schema._type === z.ZodFirstPartyTypeKind.ZodArray ? [] : {}
  );
  return z
    .object({
      issues: z.array(
        z.object({
          code: z.string(),
          path: z.array(z.union([z.string(), z.number()])),
          message: z.string().optional(),
        })
      ),
      name: z.string(),
    })
    .openapi({
      example: error,
    });
};
