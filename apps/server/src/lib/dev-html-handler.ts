import type { Handler } from "hono";
import { html } from "hono/html";
import env from "../types/env";

export const devHtmlHandler: Handler = (c) => {
  const viteServerPath = env.VITE_REMOTE_DEV ? "/vite" : "http://localhost:5173";
  console.log(env.VITE_REMOTE_DEV);
  return c.html(html`<!doctype html>
    <html lang="en">
      <head>
        <title>Nexus</title>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <script type="module">
          import RefreshRuntime from "${viteServerPath}/@react-refresh";
          RefreshRuntime.injectIntoGlobalHook(window);
          window.$RefreshReg$ = () => {};
          window.$RefreshSig$ = () => (type) => type;
          window.__vite_plugin_react_preamble_installed__ = true;
        </script>
        <script type="module" src="${viteServerPath}/@vite/client"></script>
        <script type="module" src="${viteServerPath}/src/main.tsx"></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>`);
};
