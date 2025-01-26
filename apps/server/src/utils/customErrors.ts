import { z } from "@hono/zod-openapi";
import { BAD_REQUEST, CONFLICT, UNAUTHORIZED } from "stoker/http-status-codes";
import { httpCodesMap } from "../lib/constants";

export type CustomError = {
  message: string;
  path?: string[] | number[];
};

export function customError(error: CustomError, code: number) {
  const httpStatusName = httpCodesMap.get(code)!;

  const errorSchema = z.object({
    issues: z.array(
      z
        .object({
          code: z.string(),
          path: z.array(z.union([z.string(), z.number()])).optional(),
          message: z.string(),
        })
        .openapi({
          example: {
            code: httpStatusName,
            ...(error.path && { path: error.path }),
            message: error.message,
          },
        })
    ),
    name: z.string().openapi({ example: httpStatusName }),
  });

  const content = {
    issues: [
      {
        code: httpStatusName,
        ...(error.path && { path: error.path }),
        message: error.message,
      },
    ],
    name: httpStatusName,
  };

  return {
    template: {
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
      description: "The error message.",
    },
    content,
  };
}
export const alreadyLoggedError = customError(
  { message: "User is already logged in." },
  CONFLICT
);
export const accessDeniedError = customError(
  { message: "Access denied." },
  UNAUTHORIZED
);

export const badRequestError = customError(
  {
    message: "Invalid request.",
  },
  BAD_REQUEST
);
