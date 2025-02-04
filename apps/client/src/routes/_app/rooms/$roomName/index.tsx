import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { title } from "radashi";
import { useState, type FC } from "react";
import InsetScrollArea from "../../../../components/custom/inset-scrollarea";
import { PostPreview } from "../../../../components/custom/post-preview";
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
import { roomQueryOptions } from "../../../../lib/queryOptions";

export const Route = createFileRoute("/_app/rooms/$roomName/")({
  component: RouteComponent,
  loader: async (c) => {
    const { roomName } = c.params;
    const room = await c.context.queryClient.fetchQuery(
      roomQueryOptions(roomName),
    );
    return room;
  },
});

function RouteComponent() {
  const { roomName } = Route.useParams();
  const {
    name,
    avatar,
    posts,
    isSubscribed,
    id: roomId,
  } = Route.useLoaderData();

  return (
    <InsetScrollArea>
      <section className="flex h-full flex-col justify-between gap-8 rounded-xl bg-transparent">
        <header className="flex h-28 w-full items-center justify-between rounded-xl bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground">
          <Avatar className="h-full w-auto">
            <AvatarImage src={avatar} alt={`${name} avatar`} />
          </Avatar>
          <Link
            to="/rooms/$roomName"
            params={{ roomName }}
            className="text-center text-2xl font-semibold hover:underline"
          >
            r/{title(name)}
          </Link>
          <SubscribeButton roomId={roomId} isSubscribed={isSubscribed} />
        </header>
        {posts.map((post) => (
          <PostPreview
            author={post.author.username}
            createdAt={post.createdAt}
            likesCount={post.likesCount}
            postId={post.id}
            roomName={roomName}
            text={post.text}
            title={post.title}
            key={post.id}
          />
        ))}
      </section>
    </InsetScrollArea>
  );
}

const SubscribeButton: FC<{ isSubscribed: boolean; roomId: number }> = ({
  isSubscribed,
  roomId,
}) => {
  const [userIsSubscribed, setUserIsSubscribed] = useState(isSubscribed);

  const subscribeMutation = useMutation({
    mutationKey: ["subscription", roomId],
    mutationFn: async () => {
      const action = !userIsSubscribed ? "add" : "remove";
      const res = await api.rooms[":roomId"].subscribe.$post({
        param: { roomId },
        query: { action },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Could not register the like. Try again later.");
      }
      return data;
    },
    onSuccess: () => {
      setUserIsSubscribed((old) => !old);
    },
  });

  return (
    <>
      {userIsSubscribed ? (
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
                  onClick={() => subscribeMutation.mutate()}
                  size={"lg"}
                >
                  Continue
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Button asChild size={"lg"} onClick={() => subscribeMutation.mutate()}>
          <ButtonGesture>Subscribe</ButtonGesture>
        </Button>
      )}
    </>
  );
};
