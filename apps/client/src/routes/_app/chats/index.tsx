import { AvatarImage } from "@radix-ui/react-avatar";
import { createFileRoute } from "@tanstack/react-router";
import { StaticInset } from "../../../components/custom/sidebar-wrapper";
import { Avatar } from "../../../components/ui/avatar";
import { Input } from "../../../components/ui/input";

export const Route = createFileRoute("/_app/chats/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <StaticInset>
      <section className="flex h-full flex-col justify-between rounded-xl bg-muted/50">
        <div className="flex h-28 w-full items-center justify-between rounded-xl rounded-b-none bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          </Avatar>
          <div className="text-lg font-semibold">Nickname</div>
        </div>
        <div className="h-full w-full rounded-xl pt-8"></div>
        <Input className="p-8" />
      </section>
    </StaticInset>
  );
}
