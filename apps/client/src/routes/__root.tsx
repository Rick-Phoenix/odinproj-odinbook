import type { User } from "@nexus/shared-schemas";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TbSpaces } from "react-icons/tb";
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
      <header className="sticky h-[var(--header-height)] justify-between p-6 font-light  bg-background text-center flex text-3xl items-center">
        <Link to={"/"}>
          <TbSpaces />
        </Link>
        <span>Nexus</span>
        <NavMenu />
      </header>
      <hr />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
