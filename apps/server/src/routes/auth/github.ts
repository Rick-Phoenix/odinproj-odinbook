import { invalidRequestError } from "@/utils/customErrors";
import { createRoute, z } from "@hono/zod-openapi";
import { encodeBase64 } from "@oslojs/encoding";
import { webcrypto } from "crypto";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import {
  BAD_REQUEST,
  CREATED,
  MOVED_TEMPORARILY,
  OK,
} from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/dbConfig";
import { findUserByOauthCredentials } from "../../db/queries";
import { userTable } from "../../db/schema";
import type { AppRouteHandler } from "../../types/app-bindings";
import env from "../../types/env";
import type {
  githubTokenResponse,
  githubUserData,
} from "../../types/oauth-responses";
import { selectUserSchema } from "../../types/zod-schemas";
import { createSession } from "../../utils/session";

const tags = ["auth"];

export const github = createRoute({
  path: "/github",
  method: "get",
  tags,
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
    [OK]: jsonContent(selectUserSchema, "The user's data."),
    [CREATED]: jsonContent(selectUserSchema, "The user's data."),
  },
});

export const githubCallbackHandler: AppRouteHandler<
  typeof githubCallback
> = async (c) => {
  const { code, state } = c.req.valid("query");
  const storedState = getCookie(c, "github_oauth_state");

  if (state !== storedState)
    return c.json(invalidRequestError.content, BAD_REQUEST);

  deleteCookie(c, "github_oauth_state");

  const body = new URLSearchParams({
    code,
    client_id: env.GITHUB_CLIENT_ID,
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
        Authorization: `Basic ${encodeBase64(
          new TextEncoder().encode(
            env.GITHUB_CLIENT_ID + ":" + env.GITHUB_CLIENT_SECRET
          )
        )}`,
      },
    }
  );

  const accessTokenResponse =
    (await accessTokenRequest.json()) as githubTokenResponse;

  if ("error" in accessTokenResponse) {
    return c.json(invalidRequestError.content, BAD_REQUEST);
  }

  const accessToken = accessTokenResponse.access_token;

  const userInfoRequest = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userInfoResponse = (await userInfoRequest.json()) as githubUserData;

  const {
    login: githubUsername,
    email,
    avatar_url: avatarUrl,
    id: githubUserId,
  } = userInfoResponse;

  let user = await findUserByOauthCredentials("github", githubUserId);
  let userIsNew = false;

  if (!user) {
    const userDetails = {
      id: webcrypto.randomUUID(),
      email,
      avatarUrl,
      username:
        githubUsername.length <= 31
          ? githubUsername
          : githubUsername.slice(0, 31),
      oauthId: githubUserId,
      oauthProvider: "github",
    };

    const [newUser] = await db
      .insert(userTable)
      .values(userDetails)
      .returning();

    user = newUser;
    userIsNew = true;
  }

  await createSession(c, user.id);
  return c.json(user, userIsNew ? CREATED : OK);
};
