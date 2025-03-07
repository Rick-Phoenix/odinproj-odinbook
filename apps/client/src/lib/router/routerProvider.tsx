import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../../routeTree.gen";
import { queryClient } from "../queries/queryClient";

type AppRouter = typeof router;
declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    user: undefined!,
  },
  defaultPreloadStaleTime: 0,
  notFoundMode: "root",
});
