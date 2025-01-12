import {
  createRootRoute,
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Button } from "../components/ui/button";
import type { QueryClient } from "@tanstack/react-query";

export interface RouterAppContext {
  queryClient: QueryClient;
  foo: number;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: App,
});

function App() {
  return (
    <>
      <div className="p-2 flex gap-2">
        <Button>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
        </Button>
        <Button>
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </Button>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
