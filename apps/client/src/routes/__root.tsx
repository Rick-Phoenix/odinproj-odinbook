import type { User } from "@nexus/shared-schemas";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Button } from "../components/ui/button";
import { handleLogout, useUser } from "../hooks/auth";

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
  const router = useRouter();
  return (
    <>
      <h3>
        {isAuthenticated ? "Welcome, " + user.username : "Welcome to Nexus!"}
      </h3>
      <div className="p-2 flex gap-2">
        <Button asChild>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
        </Button>
        {!isAuthenticated ? (
          <Button asChild>
            <Link to="/login" className="[&.active]:font-bold">
              Log In
            </Link>
          </Button>
        ) : (
          <Button
            onClick={async () => {
              await handleLogout(router);
            }}
          >
            Log Out
          </Button>
        )}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
