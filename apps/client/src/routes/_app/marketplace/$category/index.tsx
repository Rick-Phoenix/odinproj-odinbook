import { createFileRoute, Link } from "@tanstack/react-router";
import type { FC } from "react";
import InsetScrollArea from "../../../../components/custom/inset-scrollarea";

export const Route = createFileRoute("/_app/marketplace/$category/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { category } = Route.useParams();
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 grid-cols-1 grid-rows-6 rounded-xl bg-muted/50">
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
        <ItemListing price={200} title="Camera" category={category} />
      </section>
    </InsetScrollArea>
  );
}

const ItemListing: FC<{ price: number; title: string; category: string }> = ({
  price,
  title,
  category,
}) => {
  return (
    <Link
      to="/marketplace/$category/$itemId"
      params={{ category, itemId: "1" }}
      className="group size-full p-4"
    >
      <div className="grid grid-cols-[auto_1fr] grid-rows-1 rounded-lg bg-muted">
        <div className="justify-self-center p-4">
          <div className="size-64 rounded-lg bg-white"></div>
        </div>
        <div className="grid h-full grid-cols-1 grid-rows-[auto_auto_1fr] items-start gap-3 p-8 pt-4">
          <span className="text-4xl font-semibold group-hover:underline">
            {title}
          </span>
          <span className="text-accent-foreground">London - Today 10AM</span>
          <span className="pt-6 text-3xl font-semibold">${price}</span>
        </div>
      </div>
    </Link>
  );
};
