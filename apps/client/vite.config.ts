import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import Inspect from "vite-plugin-inspect";
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
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
        purgeCSSPlugin({
          content: ["./index.html", "./src/**/*.{tsx,js,jsx}"],
          fontFace: true,
          keyframes: true,
          variables: true,
          safelist: [/row-end-\d+/],
        }),
        cssnano({ preset: "default" }),
      ],
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
