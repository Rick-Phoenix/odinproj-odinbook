import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useUser } from "../hooks/auth";

export const Route = createFileRoute("/third")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    console.log("🚀 ~ Route ~ preload context.user:", context.user);
    const userSync = context.queryClient.getQueryData(["user"]);
    console.log("🚀 ~ Route ~ userSync:", userSync);
    if (!userSync) {
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
  const context = Route.useRouteContext({});
  console.log("🚀 ~ RouteComponent ~ context.user:", context.user);
  const queryClient = useQueryClient();
  const user = useUser();
  const router = useRouter();
  async function logout() {
    queryClient.setQueryData(["user"], (old) => {
      return null;
    });
    await router.navigate({ to: "/" });
    // await router.invalidate();
  }

  async function login() {
    await queryClient.invalidateQueries({ queryKey: ["user"] });
  }

  return (
    <div>
      Hello!
      {user && user.username}
      <Button type="button" onClick={logout}>
        Logout
      </Button>
      <Button type="button" onClick={login}>
        login
      </Button>
    </div>
  );
}
