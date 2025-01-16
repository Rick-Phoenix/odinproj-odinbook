import type { User } from "@nexus/shared-schemas";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { TbSpaces } from "react-icons/tb";
import NavMenu from "../components/navMenu";
import { useUser } from "../hooks/auth";

export interface RouterAppContext {
  queryClient: QueryClient;
  user: User | null | undefined;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: Root,
});

function Root() {
  const user = useUser();
  const isAuthenticated = !!user;
  const root = window.document.documentElement;
  root.classList.add("dark");
  return (
    <>
      <header className="sticky h-[var(--header-height)] p-6 font-semibold justify-between bg-background  flex text-4xl items-center">
        <TbSpaces /> Nexus
        <NavMenu />
      </header>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
