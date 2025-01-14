import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useFetchUser } from "../hooks/auth";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const user = context.queryClient.getQueryData(["user"]);
    if (!user) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: "/",
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <div>Hello auth</div>
      <Outlet />
    </div>
  );
}
