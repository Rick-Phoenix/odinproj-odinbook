import { createFileRoute } from "@tanstack/react-router";
import { InsetScrollArea } from "../../../../components/custom/sidebar-wrapper";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";

export const Route = createFileRoute("/_app/rooms/$room/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { room } = Route.useParams();
  return (
    <InsetScrollArea>
      <section className="flex h-full flex-col justify-between rounded-xl bg-muted/50">
        <div className="grid h-28 w-full grid-cols-[auto_1fr] items-center rounded-xl bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground">
          <Avatar>
            <AvatarImage
              src={"https://github.com/shadcn.png"}
              alt={`profile picture`}
            />
          </Avatar>
          <div className="text-center text-2xl font-semibold">Cats</div>
        </div>
      </section>
    </InsetScrollArea>
  );
}
