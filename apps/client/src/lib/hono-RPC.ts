import RPC from "@nexus/shared-schemas";

export const api = RPC("/api");

export const wsRPC = RPC("ws://localhost:3000/");
