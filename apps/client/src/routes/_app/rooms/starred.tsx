import { createFileRoute, Link } from "@tanstack/react-router";
import { InsetScrollArea } from "../../../components/custom/sidebar-wrapper";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";

export const Route = createFileRoute("/_app/rooms/starred")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <InsetScrollArea>
      <section className="grid min-h-[80vh] max-w-full flex-1 grid-cols-1 grid-rows-6 gap-4 rounded-xl bg-muted/50 p-4">
        <Link
          to={"/"}
          className="flex h-28 w-full items-center justify-between gap-8 rounded-xl bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground"
        >
          <Avatar className="h-full w-auto">
            <AvatarImage
              src={
                "data:image/svg+xml,%3Csvg%20%20xmlns=%22http://www.w3.org/2000/svg%22%20%20width=%2224%22%20%20height=%2224%22%20%20viewBox=%220%200%2024%2024%22%20%20fill=%22none%22%20%20stroke=%22currentColor%22%20%20stroke-width=%222%22%20%20stroke-linecap=%22round%22%20%20stroke-linejoin=%22round%22%20%20class=%22icon%20icon-tabler%20icons-tabler-outline%20icon-tabler-spaces%22%3E%3Cpath%20stroke=%22none%22%20d=%22M0%200h24v24H0z%22%20fill=%22none%22/%3E%3Cpath%20d=%22M6.045%209.777a6%206%200%201%200%205.951%20.023%22%20/%3E%3Cpath%20d=%22M11.997%2020.196a6%206%200%201%200%20-2.948%20-5.97%22%20/%3E%3Cpath%20d=%22M17.95%209.785q%20.05%20-.386%20.05%20-.785a6%206%200%201%200%20-3.056%205.23%22%20/%3E%3C/svg%3E"
              }
              alt={` profile picture`}
            />
          </Avatar>
          <div className="flex w-1/2 flex-col items-end gap-3">
            <div className="text-lg font-semibold">{}</div>
            <div className="line-clamp-1 text-end font-semibold text-muted-foreground">
              {}
            </div>
          </div>
        </Link>
      </section>
    </InsetScrollArea>
  );
}
