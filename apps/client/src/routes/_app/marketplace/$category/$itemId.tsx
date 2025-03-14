import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import DeleteListingButton from "../../../../components/custom-ui-blocks/buttons/DeleteListingButton";
import MarkAsSoldButton from "../../../../components/custom-ui-blocks/buttons/MarkAsSoldButton";
import SaveListingButton from "../../../../components/custom-ui-blocks/buttons/SaveListingButton";
import InsetScrollArea from "../../../../components/custom-ui-blocks/inset-area/InsetScrollarea";
import { Button } from "../../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { useUser } from "../../../../hooks/auth";
import type { Chat } from "../../../../lib/db-types";
import { chatsQueryOptions } from "../../../../lib/queries/chatQueries";
import { listingQueryOptions } from "../../../../lib/queries/queryOptions";

export const Route = createFileRoute("/_app/marketplace/$category/$itemId")({
  component: RouteComponent,
  params: { parse: ({ category, itemId }) => ({ category, itemId: +itemId }) },
  loader: async (c) => {
    try {
      return await c.context.queryClient.fetchQuery(listingQueryOptions(c.params.itemId));
    } catch (error) {
      throw notFound();
    }
  },
});

function RouteComponent() {
  const listing = Route.useLoaderData();
  const { username } = useUser()!;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    const chats: Chat[] = await queryClient.fetchQuery(chatsQueryOptions);
    const existingChat = chats.find((chat) => chat.contact.username === listing.seller.username);
    if (existingChat)
      return navigate({
        to: "/chats/$chatId",
        params: { chatId: existingChat.id },
      });
    void navigate({ to: "/chats/new", search: { contactUsername: listing.seller.username } });
  };
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full grid-cols-1 grid-rows-[auto_1fr] rounded-xl bg-muted/50">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          {listing.title}
        </h2>
        <div className="grid grid-cols-1 grid-rows-[auto_1fr] justify-center gap-x-8 p-8 xl:grid-cols-[auto_1fr] xl:grid-rows-1">
          <div className="mb-5 flex flex-col items-center gap-5">
            <div className="grid max-h-full w-full min-w-0 max-w-80 justify-center [--swiper-navigation-color:hsl(var(--primary))] [&_.swiper]:max-w-full">
              <img src={listing.picUrl} className="rounded-sm object-cover" alt={listing.title} />
            </div>
            <div className="flex max-w-80 flex-col gap-5">
              <h2 className="self-center text-2xl">${listing.price}</h2>
              {listing.sold ? (
                <div className="self-center italic">This item has been sold.</div>
              ) : listing.seller.username !== username ? (
                <div className="gap-5 flex-center">
                  <div className="mt-2 self-center">
                    <Button className="rounded-3xl" onClick={handleSendMessage}>
                      Contact
                    </Button>
                  </div>
                  <div className="mt-2 self-center">
                    <SaveListingButton listing={listing} />
                  </div>
                </div>
              ) : (
                <div className="gap-5 flex-center">
                  <DeleteListingButton listing={listing} withText={true} />
                  <MarkAsSoldButton withText={true} listing={listing} />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Seller</span>
                <span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="link" className="p-0 text-xl">
                        {listing.seller.username}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                      <Button variant={"ghost"} asChild>
                        <Link to="/users/$username" params={{ username: listing.seller.username }}>
                          {" View seller's profile"}
                        </Link>
                      </Button>
                    </PopoverContent>
                  </Popover>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Conditions</span> <span>{listing.condition}</span>
              </div>
              <div className="flex justify-between">
                <span>Listed On</span>{" "}
                <span> {format(new Date(listing.createdAt), "dd MMM y")}</span>
              </div>
              <div className="flex justify-between gap-6 break-words [word-break:break-word]">
                <span className="min-w-fit">Location</span> <span>{listing.location}</span>
              </div>
            </div>
          </div>
          <div className="flex size-full flex-col gap-3 p-2 pt-0">
            <h1 className="w-fit self-center rounded-2xl bg-muted p-1 px-2 text-sm flex-center">
              Description
            </h1>
            <div className="justify-center text-center text-lg">{listing.description}</div>
          </div>
        </div>
      </section>
    </InsetScrollArea>
  );
}
