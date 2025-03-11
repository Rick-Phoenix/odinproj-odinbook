import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import Inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  envDir: resolve(import.meta.dirname, "../.."),
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tsconfigPaths({ root: import.meta.dirname }),
    checker({ typescript: { tsconfigPath: "./tsconfig.json" } }),
    visualizer({
      open: false,
      template: "treemap",
      brotliSize: true,
      gzipSize: true,
      projectRoot: "/home/rick/nexus/apps/client",
    }),
    Inspect({}),
  ],
  build: {
    outDir: "../server/_static",
    emptyOutDir: false,
    manifest: true,
    modulePreload: { polyfill: true },
    rollupOptions: {
      input: "./src/main.tsx",
      output: {
        manualChunks: {
          zod: ["zod"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
      "/ws": {
        target: "ws://localhost:3000",
        ws: true,
      },
    },
  },
});
