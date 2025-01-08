import { z } from "@hono/zod-openapi";
import { httpCodesMap } from "../lib/constants";

export type ZodCustomError = {
  message: string;
  path: string[] | number[];
};

export function customError(error: ZodCustomError, code: number) {
  const httpStatusName = httpCodesMap.get(code)!;

  const errorSchema = z.object({
    issues: z.array(
      z
        .object({
          code: z.string(),
          path: z.array(z.union([z.string(), z.number()])),
          message: z.string(),
        })
        .openapi({
          example: {
            code: httpStatusName,
            path: error.path,
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
        path: error.path,
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
