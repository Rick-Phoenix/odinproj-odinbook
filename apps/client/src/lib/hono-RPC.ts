import RPC from "@nexus/shared-schemas";

export const api = RPC("/api");

export const wsRPC = RPC(
  import.meta.env.DEV && import.meta.env.VITE_REMOTE_DEV !== "true"
    ? "ws://localhost:3000"
    : `wss://${import.meta.env.VITE_DOMAIN}/`
);
