import { createFileRoute } from "@tanstack/react-router";
import InsetScrollArea from "../../../components/custom/inset-scrollarea";
import MetaNexusMain from "../../../pages/MetaNexusMain";

export const Route = createFileRoute("/_app/rooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <InsetScrollArea>
      <MetaNexusMain />
    </InsetScrollArea>
  );
}
