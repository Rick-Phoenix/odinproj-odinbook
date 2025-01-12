import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  context({ context }) {
    const foo = context.foo;
  },
});
function RouteComponent() {
  return <div>Hello "/login"!</div>;
}
