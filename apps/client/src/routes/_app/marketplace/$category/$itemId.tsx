import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import InsetScrollArea from "../../../../components/custom/inset-scrollarea";
import SaveListingButton from "../../../../components/custom/SaveListingButton";
import { Button } from "../../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../../../components/ui/table";
import { useUser } from "../../../../hooks/auth";
import { api, type Chat } from "../../../../lib/api-client";
import { cacheChat, chatsQueryOptions } from "../../../../lib/chatQueries";
import { listingQueryOptions } from "../../../../lib/queryOptions";

export const Route = createFileRoute("/_app/marketplace/$category/$itemId")({
  component: RouteComponent,
  params: { parse: ({ category, itemId }) => ({ category, itemId: +itemId }) },
  loader: async (c) => {
    const listing = await c.context.queryClient.fetchQuery(
      listingQueryOptions(c.params.itemId),
    );
    return listing;
  },
});

function RouteComponent() {
  const listing = Route.useLoaderData();
  const { username } = useUser()!;

  const queryClient = useQueryClient();
  const nav = useNavigate();
  const createChat = useMutation({
    mutationKey: ["chat"],
    mutationFn: async (v: { contactUsername: string }) => {
      const { contactUsername } = v;
      const res = await api.chats.$post({ json: { contactUsername } });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error(data.issues[0].message);
      }
      return data;
    },
    onSuccess(data) {
      queryClient.setQueryData(["chats"], (old: Chat[]) => [...old, data]);
      cacheChat(data);
      nav({ to: "/chats/$chatId", params: { chatId: data.id } });
    },
  });

  const handleSendMessage = async () => {
    const chats = await queryClient.fetchQuery(chatsQueryOptions);
    const existingChat = chats.find(
      (chat) => chat.contact.username === listing.seller,
    );
    if (existingChat)
      return nav({ to: "/chats/$chatId", params: { chatId: existingChat.id } });
    createChat.mutate({ contactUsername: listing.seller });
  };
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full grid-cols-1 grid-rows-[auto_1fr] rounded-xl bg-muted/50">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          {listing.title}
        </h2>
        <div className="grid grid-cols-1 grid-rows-[auto_1fr] justify-center gap-x-8 p-8 xl:grid-cols-[auto_1fr] xl:grid-rows-1">
          <div className="flex flex-col items-center gap-5">
            <div className="grid max-h-full w-full min-w-0 max-w-80 justify-center [--swiper-navigation-color:hsl(var(--primary))] [&_.swiper]:max-w-full">
              <img src={listing.picUrl} alt={listing.title} />
            </div>
            <div className="flex w-full flex-col items-center gap-5">
              <h2 className="text-2xl">{listing.title}</h2>
              <h2 className="text-2xl">${listing.price}</h2>
              <Table className="w-full *:text-xl">
                <TableBody>
                  <TableRow>
                    <TableCell>Seller:</TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="link" className="p-0 text-xl">
                            {listing.seller}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                          <Button variant={"ghost"} asChild>
                            <Link
                              to="/users/$username"
                              params={{ username: listing.seller }}
                            >
                              View seller's profile
                            </Link>
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Item's conditions</TableCell>
                    <TableCell className="text-right">
                      {listing.condition}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Listed On</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(listing.createdAt), "dd MMM y")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell className="text-right">
                      {listing.location}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {listing.sold ? (
              <div className="italic">This item has been sold.</div>
            ) : listing.seller !== username ? (
              <>
                <div className="mt-2 flex gap-3">
                  <Button>Buy</Button>
                  <Button onClick={handleSendMessage}>Contact</Button>
                </div>
                <div className="mt-2 flex gap-3">
                  <SaveListingButton listing={listing} />
                </div>
              </>
            ) : null}
          </div>
          <div className="flex size-full flex-col gap-10 p-2 pt-0">
            <div className="justify-center text-center text-lg">
              {listing.description}
            </div>
          </div>
        </div>
      </section>
    </InsetScrollArea>
  );
}
