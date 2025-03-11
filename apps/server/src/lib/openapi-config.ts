import { swaggerUI } from "@hono/swagger-ui";
import { apiReference } from "@scalar/hono-api-reference";
import packageJSON from "../../package.json" with { type: "json" };
import type { AppOpenAPI } from "../types/app-bindings.js";

export default function configureOpenApiReference(app: AppOpenAPI) {
  app.doc31("/doc", {
    openapi: "3.1.0",
    info: {
      version: packageJSON.version,
      title: "Nexus API",
    },
  });

  app.get("/ui", swaggerUI({ url: "/doc" }));

  app.get(
    "/reference",
    apiReference({
      pageTitle: "Hono API Reference",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/doc",
      },
    })
  );
}
