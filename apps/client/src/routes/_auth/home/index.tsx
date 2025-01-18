import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { createFileRoute, Link } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export const Route = createFileRoute("/_auth/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"ghost"}>
            <small className="text-sm font-medium leading-none ">
              🔥 Trending
            </small>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Hide</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Carousel>
        <CarouselContent>
          <CarouselItem className="basis-1/3">
            <Link
              to={"/post"}
              className="flex flex-col justify-end aspect-video rounded-xl bg-muted/50"
            >
              {/* <div className="aspect-video rounded-xl bg-muted/50">opst 1</div> */}

              <CardContent>Blah</CardContent>
              <CardHeader>
                <CardTitle>Post 1</CardTitle>
                <CardDescription>Post description</CardDescription>
              </CardHeader>
            </Link>
          </CarouselItem>
          <CarouselItem className="basis-1/3">
            <div className="aspect-video rounded-xl bg-muted/50" />
          </CarouselItem>
          <CarouselItem className="basis-1/3">
            <div className="aspect-video rounded-xl bg-muted/50" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </main>
  );
}
