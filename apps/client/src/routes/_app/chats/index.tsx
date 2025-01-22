import { createFileRoute } from "@tanstack/react-router";
import Chat from "../../../pages/Chat";

export const Route = createFileRoute("/_app/chats/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}
