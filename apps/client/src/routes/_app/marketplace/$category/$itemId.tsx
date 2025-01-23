import { createFileRoute } from "@tanstack/react-router";
import { InsetScrollArea } from "../../../../components/custom/sidebar-wrapper";

export const Route = createFileRoute("/_app/marketplace/$category/$itemId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <InsetScrollArea>
      <section className="grid h-max max-w-full auto-rows-auto grid-cols-1 rounded-xl bg-muted/50">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Promotions
        </h2>
        <div className="grid grid-cols-1 grid-rows-2 place-items-center p-8">
          <div className="grid grid-cols-1 grid-rows-[auto_20%_20%] place-items-center">
            <div className="flex size-full items-center justify-center">
              <div className="size-56 rounded-lg bg-white"></div>
            </div>
            <h2 className="text-2xl">Item Title</h2>
            <div>Buy</div>
          </div>
          <div className="grid grid-cols-1 p-2">
            Anim in mollit culpa irure reprehenderit anim culpa. Ullamco labore
            mollit voluptate id labore id adipisicing ex. Eiusmod do ullamco est
            non ut proident elit in do Lorem ad cillum enim esse. Quis laboris
            voluptate dolore cillum eu sunt cupidatat deserunt. Dolore labore
            aute deserunt eu culpa sint minim non officia minim deserunt nulla.
            Laboris eu quis ipsum cupidatat voluptate aliqua. Consectetur
            nostrud aliquip nisi commodo eiusmod laborum amet aliquip veniam.
          </div>
        </div>
      </section>
    </InsetScrollArea>
  );
}
