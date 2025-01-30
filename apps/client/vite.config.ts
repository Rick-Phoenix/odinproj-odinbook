import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tsconfigPaths({ root: import.meta.dirname }),
    TanStackRouterVite(),
  ],
  build: {
    outDir: "../server/public",
    emptyOutDir: true,
    manifest: true,
    modulePreload: { polyfill: true },
    rollupOptions: {
      input: "./src/main.tsx",
    },
  },
  server: {
    // origin: "http://localhost:3000",
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        // ws: true,
        // changeOrigin: true,
      },
      "/api/ws": {
        target: "ws://127.0.0.1:3000",
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // changeOrigin: true,
      },
    },
  },
});
