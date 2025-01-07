import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

export function zodErrorResponse(schema: Zod.ZodSchema) {
  return jsonContent(createErrorSchema(schema), "The validation error(s).");
}
