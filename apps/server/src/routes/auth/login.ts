import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../../lib/create-app";
import { httpCodes, notFoundSchema } from "@/lib/constants";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import type { AppRouteHandler } from "../../types/app-bindings";
import { hashPassword } from "../../utils/password";
import db from "../../db/dbConfig";
import { entryExists, lowercase } from "../../utils/db-methods";
import { OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { createErrorSchema } from "stoker/openapi/schemas";
import { zodErrorResponse } from "../../utils/zodErrorResponse";

const tags = ["auth"];

export const loginValidationSchema = z
  .object({
    username: z.string().trim().toLowerCase(),
    password: z.string(),
  })
  .superRefine(async ({ username, password }, ctx) => {
    const hash = await hashPassword(password);
    const user = await db.query.userTable.findFirst({
      where(existingUser, { eq }) {
        return eq(lowercase(existingUser.username), username);
      },
    });

    if (!user) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "This user does not exist.",
        fatal: true,
        path: ["username"],
        params: { test: 1 },
      });

      return z.NEVER;
    }

    if (user.hash !== hash) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid password.",
        path: ["password"],
      });
    }
  });

export const login = createRoute({
  path: "/login",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(loginValidationSchema, "The user's credentials."),
  },
  responses: {
    [OK]: jsonContent(z.string(), "The session data."),
    [UNPROCESSABLE_ENTITY]: zodErrorResponse(loginValidationSchema),
  },
});

export const loginHandler: AppRouteHandler<typeof login> = (c) => {
  if (c.req.valid("json")) console.log("1");
};
