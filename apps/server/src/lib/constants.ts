import * as httpPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
export * as httpCodes from "stoker/http-status-codes";
export * as httpPhrases from "stoker/http-status-phrases";

export const notFoundSchema = createMessageObjectSchema(httpPhrases.NOT_FOUND);
