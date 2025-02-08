import type { User } from "@nexus/shared-schemas";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { TbSpaces } from "react-icons/tb";

export interface RouterAppContext {
  queryClient: QueryClient;
  user: User | null | undefined;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: Root,
});

function Root() {
  const root = window.document.documentElement;
  root.classList.add("dark");
  return (
    <>
      <header className="sticky flex h-[var(--header-height)] items-center justify-center bg-background p-6 text-center text-3xl font-light">
        <Link to={"/"}>
          <TbSpaces />
        </Link>
      </header>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
