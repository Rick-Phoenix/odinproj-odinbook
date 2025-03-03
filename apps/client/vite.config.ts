import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
//import { bundleStats } from "rollup-plugin-bundle-stats";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tsconfigPaths({ root: import.meta.dirname }),
    checker({ typescript: { tsconfigPath: "./tsconfig.json" } }),
    //bundleStats(),
    visualizer({
      open: true,
      template: "treemap",
      brotliSize: true,
      gzipSize: true,
      projectRoot: "/home/rick/nexus/apps/client",
    }),
  ],
  build: {
    outDir: "../server/public",
    emptyOutDir: true,
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
