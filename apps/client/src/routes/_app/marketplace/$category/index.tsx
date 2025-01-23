import { createFileRoute } from "@tanstack/react-router";
import { InsetScrollArea } from "../../../../components/custom/sidebar-wrapper";

export const Route = createFileRoute("/_app/marketplace/$category/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full grid-cols-1 grid-rows-[auto_1fr] rounded-xl bg-muted/50"></section>
    </InsetScrollArea>
  );
}
