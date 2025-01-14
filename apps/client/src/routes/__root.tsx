import type { User } from "@nexus/shared-schemas";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Button } from "../components/ui/button";

export interface RouterAppContext {
  queryClient: QueryClient;
  user: User | null | undefined;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: App,
});

function App() {
  return (
    <>
      <div className="p-2 flex gap-2">
        <Button asChild>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
        </Button>
        <Button asChild>
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </Button>
        <Button asChild>
          <Link to="/third" className="[&.active]:font-bold">
            third
          </Link>
        </Button>
        <Button asChild>
          <Link to="/dash" className="[&.active]:font-bold">
            dash
          </Link>
        </Button>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
