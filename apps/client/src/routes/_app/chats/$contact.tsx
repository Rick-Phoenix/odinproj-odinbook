import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { title } from "radashi";
import type { FC } from "react";
import { StaticInset } from "../../../components/custom/sidebar-wrapper";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";

export const Route = createFileRoute("/_app/chats/$contact")({
  component: RouteComponent,
});

function RouteComponent() {
  const { contact } = Route.useParams();
  return (
    <Chat
      contactName={title(contact)}
      contactAvatar="https://github.com/shadcn.png"
    />
  );
}

const Chat: FC<{ contactAvatar: string; contactName: string }> = ({
  contactAvatar,
  contactName,
}) => {
  return (
    <StaticInset>
      <section className="flex h-full flex-col justify-between rounded-xl bg-muted/50">
        <div className="flex h-28 w-full items-center justify-between rounded-xl rounded-b-none bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground">
          <Avatar>
            <AvatarImage
              src={contactAvatar}
              alt={`${contactName} profile picture`}
            />
          </Avatar>
          <div className="text-lg font-semibold">{contactName}</div>
        </div>

        <ScrollArea className="h-full w-full">
          <div className="grid w-full gap-5 rounded-xl p-8">
            <div className="message-contact relative flex max-h-max items-end rounded-2xl rounded-tl-none bg-muted-foreground/30 p-3">
              <div>
                Commodo quis anim Lorem ad id non ut dolore officia cillum
                aliqua cupidatat amet mollit. Eu quis occaecat eu velit. Aute et
                non sit laborum proident amet adipisicing Lorem fugiat non esse
                nisi. Eu aute pariatur incididunt occaecat elit eu consequat
                aute velit enim reprehenderit labore est incididunt. Qui mollit
                non velit ea magna do consectetur eu. Eiusmod incididunt aute
                excepteur nisi anim reprehenderit dolor voluptate aliqua. Lorem
                eiusmod aliqua non Lorem sint mollit do qui adipisicing tempor.
                Ad ad laborum quis ad velit ut sit enim labore ex minim eu
                nostrud labore.
              </div>
            </div>
            <div className="message-user relative flex max-h-max items-end rounded-2xl rounded-tr-none bg-muted-foreground/30 p-3">
              <div>
                Commodo quis anim Lorem ad id non ut dolore officia cillum
                aliqua cupidatat amet mollit. Eu quis occaecat eu velit. Aute et
                non sit laborum proident amet adipisicing Lorem fugiat non esse
                nisi. Eu aute pariatur incididunt occaecat elit eu consequat
                aute velit enim reprehenderit labore est incididunt. Qui mollit
                non velit ea magna do consectetur eu. Eiusmod incididunt aute
                excepteur nisi anim reprehenderit dolor voluptate aliqua. Lorem
                eiusmod aliqua non Lorem sint mollit do qui adipisicing tempor.
                Ad ad laborum quis ad velit ut sit enim labore ex minim eu
                nostrud labore.
              </div>
            </div>
          </div>
        </ScrollArea>

        <form action="" className="flex items-center">
          <Input
            className="rounded-l-xl rounded-r-none border-r-0 p-8"
            placeholder="Write a message..."
          />
          <Button
            variant={"ghost"}
            className="aspect-square h-full rounded-l-none rounded-r-xl border border-l-0 hover:bg-muted-foreground/30 focus:bg-muted-foreground/30"
          >
            <Send />
          </Button>
        </form>
      </section>
    </StaticInset>
  );
};
