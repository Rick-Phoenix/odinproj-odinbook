import { schemas } from "@nexus/shared-schemas";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useSpring, useTransform } from "motion/react";
import { type FC, type MouseEvent, type MouseEventHandler } from "react";
import { Autoplay, EffectCoverflow, Mousewheel, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CreateListingDialog from "../../../components/dialogs/custom/CreateListingDialog";
import InsetScrollArea from "../../../components/dialogs/custom/inset-scrollarea";
import { api, type Listing, type ListingCategory } from "../../../lib/api-client";

export const Route = createFileRoute("/_app/marketplace/")({
  component: RouteComponent,
  loader: async (c) => {
    const { favoriteListingsCategory } = c.context.user!;
    const res = await api.market.listings.suggested.$get({
      query: { category: favoriteListingsCategory || undefined },
    });
    const data = await res.json();
    if ("issues" in data) {
      throw new Error("Error while fetching suggested listings.");
    }
    return data;
  },
});

function RouteComponent() {
  const suggestedListings = Route.useLoaderData();
  return (
    <InsetScrollArea>
      <section className="flex min-h-svh max-w-full flex-col items-center rounded-xl border bg-gray-800/20">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Marketplace
        </h2>
        <SuggestedListingsCarousel listings={suggestedListings} />
        <div className="flex h-40 w-full items-center justify-center p-8">
          <CreateListingDialog />
        </div>
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Browse By Category
        </h2>
        <div className="grid w-full auto-rows-[5rem] grid-cols-2 gap-8 p-8">
          {schemas.marketplaceCategories.map((cat) => (
            <CategoryCard key={cat} category={cat} />
          ))}
        </div>
      </section>
    </InsetScrollArea>
  );
}

const CategoryCard: React.FC<React.ComponentProps<"button"> & { category: ListingCategory }> = ({
  category,
  children,
}) => {
  const cardRotation = 15;
  const cardScale = 1.05;

  const xPcnt = useSpring(0, { bounce: 0 });
  const yPcnt = useSpring(0, { bounce: 0 });
  const scale = useSpring(1, { bounce: 0 });

  const rotateX = useTransform(yPcnt, [-0.5, 0.5], [`-${cardRotation}deg`, `${cardRotation}deg`]);
  const rotateY = useTransform(xPcnt, [-0.5, 0.5], [`-${cardRotation}deg`, `${cardRotation}deg`]);

  const getMousePosition = (e: MouseEvent) => {
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
    const currentMouseX = e.clientX - left;
    const currentMouseY = e.clientY - top;

    return {
      currentMouseX,
      currentMouseY,
      containerWidth: width,
      containerHeight: height,
    };
  };

  const handleMouseMove: MouseEventHandler = (e: MouseEvent) => {
    const { currentMouseX, currentMouseY, containerWidth, containerHeight } = getMousePosition(e);

    xPcnt.set(currentMouseX / containerWidth - 0.5);
    yPcnt.set(currentMouseY / containerHeight - 0.5);
  };
  const handleMouseEnter: MouseEventHandler = (e: MouseEvent) => {
    scale.set(cardScale);
  };
  const handleMouseLeave: MouseEventHandler = (e: MouseEvent) => {
    scale.set(1);
    xPcnt.set(0);
    yPcnt.set(0);
  };
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", scale, transition: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex items-center justify-center rounded-xl bg-slate-300"
    >
      <Link
        to="/marketplace/$category"
        params={{ category }}
        className="flex size-full scroll-m-20 items-center justify-center text-xl font-semibold tracking-tight text-primary-foreground"
      >
        {category}
      </Link>
    </motion.button>
  );
};

const SuggestedListingsCarousel: FC<{
  listings: Listing[];
}> = ({ listings }) => {
  return (
    <>
      <div className="h-full w-full p-8 [--swiper-pagination-bottom:-5px] [--swiper-pagination-bullet-horizontal-gap:0.5rem] [--swiper-pagination-color:hsl(var(--primary))] [&_.swiper]:pb-8">
        <Swiper
          modules={[Autoplay, EffectCoverflow, Pagination, Mousewheel]}
          mousewheel={{
            invert: false,
          }}
          effect={"coverflow"}
          loop={true}
          breakpoints={{
            320: {
              spaceBetween: 10,
              slidesPerView: 1,
            },
            1024: {
              spaceBetween: 15,
              slidesPerView: 1,
            },
            1400: {
              spaceBetween: 30,
              slidesPerView: 3,
            },
          }}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          centeredSlides={true}
          grabCursor={true}
          coverflowEffect={{
            rotate: 50,
            slideShadows: false,
          }}
        >
          {listings.map((lis, i) => {
            return (
              <SwiperSlide key={i}>
                <SuggestedListing listing={lis} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

const SuggestedListing: FC<{ listing: Listing }> = ({ listing }) => {
  return (
    <Link
      to={"/marketplace/$category/$itemId"}
      params={{ category: listing.category, itemId: listing.id }}
      className="group flex flex-col items-center justify-center gap-5 rounded-xl border-2 border-primary bg-gray-800/70 p-6 py-10 text-center"
    >
      <img src={listing.picUrl} className="aspect-square max-h-full max-w-full object-contain" />

      <h4 className="line-clamp-2 min-w-0 max-w-full scroll-m-20 break-words text-2xl tracking-tight transition-all group-hover:underline">
        {listing.title}
      </h4>
      <h4 className="max-w-[6ch] text-center text-xl font-semibold leading-7">${listing.price}</h4>
    </Link>
  );
};
