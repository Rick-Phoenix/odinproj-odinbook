import { userQueryOptions } from "@/lib/queryOptions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import SidebarWrapper from "../components/custom/sidebar/sidebar-wrapper";

export const Route = createFileRoute("/_app")({
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
  return (
    <SidebarWrapper>
      <Outlet />
    </SidebarWrapper>
  );
}
