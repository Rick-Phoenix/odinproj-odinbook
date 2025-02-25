import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { TbSpaces } from "react-icons/tb";
import type { User } from "../lib/api-client";
import ErrorComponent from "../pages/ErrorComponent";
import NotFoundComponent from "../pages/NotFoundComponent";

interface RouterAppContext {
  queryClient: QueryClient;
  user: User | null | undefined;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: Root,
  errorComponent: (errorData) => <ErrorComponent errorData={errorData} />,
  notFoundComponent: ({ data }) => <NotFoundComponent data={data} />,
});

function Root() {
  const root = window.document.documentElement;
  root.classList.add("dark");
  const { pathname } = useLocation();
  return (
    <>
      {pathname !== "/" && (
        <header className="sticky flex h-[var(--header-height)] items-center justify-center bg-background p-6 text-center text-3xl font-light">
          <Link to={"/"}>
            <TbSpaces />
          </Link>
        </header>
      )}
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
