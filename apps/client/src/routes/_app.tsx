import { userQueryOptions } from "@/lib/queries/queryOptions";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import SidebarWrapper from "../components/custom-ui-blocks/sidebar/SidebarWrapper";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions);
    if (!user) {
      throw redirect({ to: "/" });
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
