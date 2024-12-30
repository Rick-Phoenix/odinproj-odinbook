import { createMessageObjectSchema } from "stoker/openapi/schemas";
import * as httpPhrases from "stoker/http-status-phrases";
export * as httpPhrases from "stoker/http-status-phrases";
import * as httpCodes from "stoker/http-status-codes";
export * as httpCodes from "stoker/http-status-codes";

export const notFoundSchema = createMessageObjectSchema(httpPhrases.NOT_FOUND);
