import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { userQueryOptions } from "../hooks/auth";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions);
    if (!user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
