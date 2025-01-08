import * as httpCodes from "stoker/http-status-codes";
import * as httpPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const notFoundSchema = createMessageObjectSchema(httpPhrases.NOT_FOUND);

const codes = Object.entries(httpCodes);
const phrases = Object.entries(httpPhrases);

export const httpCodesMap: Map<number, string> = new Map();
for (const [codekey, code] of codes) {
  for (const [pkey, phrase] of phrases) {
    if (codekey === pkey) {
      httpCodesMap.set(code, phrase);
    }
  }
}
