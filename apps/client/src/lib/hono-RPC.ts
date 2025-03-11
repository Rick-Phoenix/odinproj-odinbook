import RPC from "@nexus/shared-schemas";

export const api = RPC("/api");

export const wsRPC = RPC(
  `ws://${import.meta.env.dev ? "localhost:3000" : import.meta.env.VITE_DOMAIN}/`
);
