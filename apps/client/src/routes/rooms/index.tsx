import { createFileRoute } from "@tanstack/react-router";
import SidebarWrapper from "../../components/ui/custom/SidebarWrapper";
import MetaNexusMain from "../../pages/MetaNexusMain";

export const Route = createFileRoute("/rooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarWrapper>
      <MetaNexusMain />
    </SidebarWrapper>
  );
}
