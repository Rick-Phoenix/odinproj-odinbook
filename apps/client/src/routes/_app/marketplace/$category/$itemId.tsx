import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Flag } from "lucide-react";
import { PiStar } from "react-icons/pi";
import InsetScrollArea from "../../../../components/custom/inset-scrollarea";
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
                            Seller
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                          <Button variant={"ghost"} asChild>
                            <Link to="/">View seller's profile</Link>
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Item's conditions</TableCell>
                    <TableCell className="text-right">New</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Listed On</TableCell>
                    <TableCell className="text-right">
                      {format(new Date(listing.createdAt), "HHH mm do")}
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
            <div className="mt-2 flex gap-3">
              <Button>Buy</Button>
              <Button>Contact</Button>
            </div>
            <div className="mt-2 flex gap-3">
              <Button
                variant={"ghost"}
                size={"icon"}
                className="rounded-full p-6 [&_svg]:size-6"
                title="Save"
              >
                <PiStar />
              </Button>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="rounded-full p-6 [&_svg]:size-6"
                title="Report"
              >
                <Flag />
              </Button>
            </div>
          </div>
          <div className="flex size-full flex-col gap-10 p-2 pt-0">
            <div className="text-lg">{listing.description}</div>
          </div>
        </div>
      </section>
    </InsetScrollArea>
  );
}
