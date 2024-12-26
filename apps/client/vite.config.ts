import { AliasOptions, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@server": path.resolve(import.meta.dirname, "../server/src/shared/*"),
    },
  },
});
