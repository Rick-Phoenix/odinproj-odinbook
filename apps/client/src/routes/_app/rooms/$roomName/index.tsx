import { createFileRoute } from "@tanstack/react-router";
import { title } from "radashi";
import { useState } from "react";
import { PostPreview } from "../../../../components/custom/post-preview";
import { InsetScrollArea } from "../../../../components/custom/sidebar-wrapper";
import ButtonGesture from "../../../../components/motion/gestures";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { api } from "../../../../lib/api-client";
import { roomQueryOptions } from "../../../../main";
import { lorem2par } from "../../../../utils/lorem";

export const Route = createFileRoute("/_app/rooms/$roomName/")({
  component: RouteComponent,
  loader: async (c) => {
    const { roomName } = c.params;
    const room = await c.context.queryClient.fetchQuery(
      roomQueryOptions(roomName),
    );
    console.log(room);
    return room;
  },
});

function RouteComponent() {
  const { name, avatar } = Route.useLoaderData();
  return (
    <InsetScrollArea>
      <section className="flex h-full flex-col justify-between gap-8 rounded-xl bg-transparent">
        <header className="flex h-28 w-full items-center justify-between rounded-xl bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground">
          <Avatar className="h-full w-auto">
            <AvatarImage src={avatar} alt={`${name} avatar`} />
          </Avatar>
          <div className="text-center text-2xl font-semibold">
            r/{title(name)}
          </div>
          <SubscribeButton />
        </header>
        <PostPreview title={lorem2par} text={lorem2par} room={name} />
        <PostPreview title={lorem2par} text={lorem2par} room={name} />
        <PostPreview title={lorem2par} text={lorem2par} room={name} />
        <PostPreview title={lorem2par} text={lorem2par} room={name} />
      </section>
    </InsetScrollArea>
  );
}

const SubscribeButton = () => {
  const [isSubscribed, setIsSubcribed] = useState(false);

  const handleSubscribe = async () => {
    if (!isSubscribed) {
      await api.rooms[":roomId"].subscribe.$post({ param: { roomId: 1 } });
    }
    setIsSubcribed(!isSubscribed);
  };
  return (
    <>
      {isSubscribed ? (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"lg"} variant={"outline"}>
                Subscribed
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger asChild>
                <DropdownMenuItem className="w-full">
                  Unsubcribe
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                Are you sure you want to unsubcribe?
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center gap-3">
              <DialogClose asChild>
                <Button variant={"secondary"} size={"lg"}>
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant={"destructive"}
                  onClick={handleSubscribe}
                  size={"lg"}
                >
                  Continue
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Button asChild size={"lg"} onClick={handleSubscribe}>
          <ButtonGesture>Subscribe</ButtonGesture>
        </Button>
      )}
    </>
  );
};
