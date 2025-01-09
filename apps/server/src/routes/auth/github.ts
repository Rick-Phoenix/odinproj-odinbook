/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Necessary to avoid Eslint yelling about type of json response

import { createRoute, z } from "@hono/zod-openapi";
import {
  BAD_REQUEST,
  CONFLICT,
  MOVED_TEMPORARILY,
  OK,
} from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { AppRouteHandler } from "../../types/app-bindings";
import { webcrypto } from "crypto";
import env from "../../types/env";
import { getCookie, setCookie } from "hono/cookie";
import { alreadyLoggedError, invalidRequestError } from "@/utils/customErrors";
import { createRouter } from "../../lib/create-app";
import chalk from "chalk";

const tags = ["auth"];

export const github = createRoute({
  path: "/github",
  method: "get",
  tags,
  request: {},
  responses: {
    [MOVED_TEMPORARILY]: { description: "Redirecting to Github's OAUTH page." },
  },
});

export const githubHandler: AppRouteHandler<typeof github> = (c) => {
  const state = webcrypto.randomUUID();
  const authorizationURL = new URL("https://github.com/login/oauth/authorize");
  authorizationURL.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorizationURL.searchParams.set("redirect_uri", env.GITHUB_CALLBACK_URI);
  authorizationURL.searchParams.set("state", state);
  // authorizationURL.searchParams.set("scope", "user:email repo");

  setCookie(c, "github_oauth_state", state, {
    maxAge: 60 * 10,
    httpOnly: true,
    path: "/",
    // secure: true, // only add when deploying with https (prod)
    sameSite: "lax",
  });

  return c.redirect(authorizationURL);
};

export const githubCallback = createRoute({
  path: "/github/callback",
  method: "get",
  tags,
  request: {
    query: z.object({
      code: z.string(),
      state: z.string(),
    }),
  },
  responses: {
    [BAD_REQUEST]: invalidRequestError.template,
  },
});

export const githubCallbackHandler: AppRouteHandler<
  typeof githubCallback
> = async (c) => {
  const { code, state } = c.req.valid("query");
  const storedState = getCookie(c, "github_oauth_state");

  if (state !== storedState)
    return c.json(invalidRequestError.content, BAD_REQUEST);

  const body = new URLSearchParams({
    code,
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
    redirect_uri: env.GITHUB_CALLBACK_URI,
  });

  const accessTokenRequest = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    }
  );

  const result = await accessTokenRequest.json();
  if (result?.error) {
    return c.json(invalidRequestError.content, BAD_REQUEST);
  }

  const accessToken = result.access_token;
  return c.json("test");
};
