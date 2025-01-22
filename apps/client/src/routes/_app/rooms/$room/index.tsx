import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/rooms/$room/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { room } = useParams({ strict: false });
  return <div>{"This is the room for " + room}</div>;
}
