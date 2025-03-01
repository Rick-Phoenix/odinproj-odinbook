import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import DeleteListingButton from "../../../../components/dialogs/custom/DeleteListingButton";
import InsetScrollArea from "../../../../components/dialogs/custom/inset-scrollarea";
import SaveListingButton from "../../../../components/dialogs/custom/SaveListingButton";
import { Button } from "../../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { Table, TableBody, TableCell, TableRow } from "../../../../components/ui/table";
import { useUser } from "../../../../hooks/auth";
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
    const chats = await queryClient.fetchQuery(chatsQueryOptions);
    const existingChat = chats.find((chat) => chat.contact.username === listing.seller);
    if (existingChat)
      return navigate({
        to: "/chats/$chatId",
        params: { chatId: existingChat.id },
      });
    navigate({ to: "/chats/new", search: { contactUsername: listing.seller } });
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
              <img src={listing.picUrl} className="rounded-sm object-cover" alt={listing.title} />
            </div>
            <div className="flex max-w-80 flex-col items-center gap-5 break-words">
              <h2 className="text-2xl">${listing.price}</h2>
              <Table className="max-w-full break-words *:text-xl">
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
                            <Link to="/users/$username" params={{ username: listing.seller }}>
                              View seller's profile
                            </Link>
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Item's conditions</TableCell>
                    <TableCell className="text-right">{listing.condition}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Listed On</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(listing.createdAt), "dd MMM y")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Location</TableCell>
                    <TableCell className="text-right">{listing.location}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {listing.sold ? (
              <div className="italic">This item has been sold.</div>
            ) : listing.seller !== username ? (
              <>
                <div className="mt-2 flex gap-3">
                  <Button onClick={handleSendMessage}>Contact</Button>
                </div>
                <div className="mt-2 flex gap-3">
                  <SaveListingButton listing={listing} />
                </div>
              </>
            ) : (
              <DeleteListingButton listing={listing} withText={true} />
            )}
          </div>
          <div className="flex size-full flex-col gap-10 p-2 pt-0">
            <div className="justify-center text-center text-lg">{listing.description}</div>
          </div>
        </div>
      </section>
    </InsetScrollArea>
  );
}
