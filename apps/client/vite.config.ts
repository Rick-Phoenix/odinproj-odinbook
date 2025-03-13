import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(import.meta.dirname, "../.."));
  const isRemoteDev = env.VITE_REMOTE_DEV === "true";
  return {
    envDir: resolve(import.meta.dirname, "../.."),
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tsconfigPaths({ root: import.meta.dirname, configNames: ["tsconfig.app.json"] }),
      checker({ typescript: { tsconfigPath: "./tsconfig.json" } }),
      visualizer({
        open: false,
        template: "treemap",
        brotliSize: true,
        gzipSize: true,
      }),
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
    base: isRemoteDev ? "/vite" : "/",
    server: isRemoteDev
      ? {
          host: "0.0.0.0",
          hmr: { protocol: "wss" },
        }
      : {
          proxy: {
            "/api": {
              target: "http://localhost:3000",
            },
            "/ws": {
              target: "ws://localhost:3000",
              ws: true,
            },
          },
          host: "0.0.0.0",
        },
    // Not necessary for remote hmr at the moment, leaving for reference
    //watch: { usePolling: true },
    //strictPort: true,
    //port: 5173,
  };
});
