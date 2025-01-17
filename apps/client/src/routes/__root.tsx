import type { User } from "@nexus/shared-schemas";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TbSpaces } from "react-icons/tb";
import Sidebar from "../app/dashboard/Sidebar";
import NavMenu from "../components/navMenu";

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
      <header className="sticky h-[var(--header-height)] justify-between p-6 font-light  bg-background  flex text-3xl items-center">
        <TbSpaces /> Nexus
        <NavMenu />
      </header>
      <hr />
      <Sidebar>
        <Outlet />
      </Sidebar>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
