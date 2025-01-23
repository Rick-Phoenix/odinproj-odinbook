import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag } from "lucide-react";
import { PiStar } from "react-icons/pi";
import { InsetScrollArea } from "../../../../components/custom/sidebar-wrapper";
import { Button } from "../../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";

export const Route = createFileRoute("/_app/marketplace/$category/$itemId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full grid-cols-1 grid-rows-[auto_1fr] rounded-xl bg-muted/50">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Promotions
        </h2>
        <div className="grid grid-cols-1 grid-rows-[auto_1fr] justify-center gap-x-8 p-8 xl:grid-cols-[auto_1fr] xl:grid-rows-1">
          <div className="flex flex-col items-center gap-5">
            <div className="flex justify-center">
              <div className="size-80 rounded-lg bg-white"></div>
            </div>
            <div className="flex flex-col items-center gap-5">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-3 text-xl *:text-xl">
                    Seller: <Button variant="link">Seller</Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <Button variant={"ghost"} asChild>
                    <Link to="/">View seller's profile</Link>
                  </Button>
                </PopoverContent>
              </Popover>
              <h2 className="text-2xl">Camera</h2>
              <h2 className="text-2xl">$200</h2>
            </div>
            <div className="mt-2 flex gap-3">
              <Button>Buy</Button>
              <Button>Contact</Button>
            </div>
            <div className="mt-2 flex gap-3">
              <Button
                variant={"ghost"}
                className="w-min rounded-full"
                title="Save"
              >
                <PiStar />
              </Button>
              <Button
                variant={"ghost"}
                className="= w-min rounded-full"
                title="Report"
              >
                <Flag />
              </Button>
            </div>
          </div>
          <div className="flex size-full flex-col gap-10 p-2 pt-0">
            <div className="text-lg">
              Anim in mollit culpa irure reprehenderit anim culpa. Ullamco
              labore mollit voluptate id labore id adipisicing ex. Eiusmod do
              ullamco est non ut proident elit in do Lorem ad cillum enim esse.
              Quis laboris voluptate dolore cillum eu sunt cupidatat deserunt.
              Dolore labore aute deserunt eu culpa sint minim non officia minim
              deserunt nulla. Laboris eu quis ipsum cupidatat voluptate aliqua.
              Consectetur nostrud aliquip nisi commodo eiusmod laborum amet
              aliquip veniam. Anim in mollit culpa irure reprehenderit anim
              culpa. Ullamco labore mollit voluptate id labore id adipisicing
              ex. Eiusmod do ullamco est non ut proident elit in do Lorem ad
              cillum enim esse. Quis laboris voluptate dolore cillum eu sunt
              cupidatat deserunt. Dolore labore aute deserunt eu culpa sint
              minim non officia minim deserunt nulla. Laboris eu quis ipsum
              cupidatat voluptate aliqua. Consectetur nostrud aliquip nisi
              commodo eiusmod laborum amet aliquip veniam. aliquip veniam. Anim
              in mollit culpa irure reprehenderit anim culpa. Ullamco labore
              mollit voluptate id labore id adipisicing ex. Eiusmod do ullamco
              est non ut proident elit in do Lorem ad cillum enim esse. Quis
              laboris voluptate dolore cillum eu sunt cupidatat deserunt. Dolore
              labore aute deserunt eu culpa sint minim non officia minim
              deserunt nulla. Laboris eu quis ipsum cupidatat voluptate aliqua.
              Consectetur nostrud aliquip nisi commodo eiusmod laborum amet
              cupidatat deserunt. Dolore labore aute deserunt eu culpa sint
              minim non officia minim deserunt nulla. Laboris eu quis ipsum
              cupidatat voluptate aliqua. Consectetur nostrud aliquip nisi
              commodo eiusmod laborum amet aliquip veniam. aliquip veniam. Anim
              in mollit culpa irure reprehenderit anim culpa. Ullamco labore
              mollit voluptate id labore id adipisicing ex. Eiusmod do ullamco
              est non ut proident elit in do Lorem ad cillum enim esse. Quis
              laboris voluptate dolore cillum eu sunt cupidatat deserunt. Dolore
              labore aute deserunt eu culpa sint minim non officia minim
              deserunt nulla. Laboris eu quis ipsum cupidatat voluptate aliqua.
              Consectetur nostrud aliquip nisi commodo eiusmod laborum amet
              cupidatat deserunt. Dolore labore aute deserunt eu culpa sint
              minim non officia minim deserunt nulla. Laboris eu quis ipsum
              cupidatat voluptate aliqua. Consectetur nostrud aliquip nisi
              commodo eiusmod laborum amet aliquip veniam. aliquip veniam. Anim
              in mollit culpa irure reprehenderit anim culpa. Ullamco labore
              mollit voluptate id labore id adipisicing ex. Eiusmod do ullamco
              est non ut proident elit in do Lorem ad cillum enim esse. Quis
              laboris voluptate dolore cillum eu sunt cupidatat deserunt. Dolore
              labore aute deserunt eu culpa sint minim non officia minim
              deserunt nulla. Laboris eu quis ipsum cupidatat voluptate aliqua.
              Consectetur nostrud aliquip nisi commodo eiusmod laborum amet
              aliquip veniam.
            </div>
          </div>
        </div>
      </section>
    </InsetScrollArea>
  );
}
