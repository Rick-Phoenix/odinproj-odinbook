import { createFileRoute } from "@tanstack/react-router";
import MetaNexusMain from "../../../pages/MetaNexusMain";

export const Route = createFileRoute("/_app/rooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MetaNexusMain />;
}
