import { schemas } from "@nexus/shared-schemas";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useSpring, useTransform } from "motion/react";
import { type FC, type MouseEvent, type MouseEventHandler } from "react";
import {
  Autoplay,
  EffectCoverflow,
  Mousewheel,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import InsetScrollArea from "../../../components/custom/inset-scrollarea";
import CreateListingDialog from "../../../components/custom/listing-dialog";
import type { ListingCategory } from "../../../lib/api-client";

export const Route = createFileRoute("/_app/marketplace/")({
  component: RouteComponent,
});

function RouteComponent() {
  const listings = Array.from({ length: 10 }, () => ({
    id: 1,
    title: "Example",
    price: 100,
  }));
  return (
    <InsetScrollArea>
      <section className="flex min-h-svh max-w-full flex-col items-center rounded-xl bg-muted/50">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Marketplace
        </h2>
        <OffersCarousel listings={listings} />
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

const CategoryCard: React.FC<
  React.ComponentProps<"button"> & { category: ListingCategory }
> = ({ category, children, ...props }) => {
  const cardRotation = 15;
  const cardScale = 1.05;

  const xPcnt = useSpring(0, { bounce: 0 });
  const yPcnt = useSpring(0, { bounce: 0 });
  const scale = useSpring(1, { bounce: 0 });

  const rotateX = useTransform(
    yPcnt,
    [-0.5, 0.5],
    [`-${cardRotation}deg`, `${cardRotation}deg`],
  );
  const rotateY = useTransform(
    xPcnt,
    [-0.5, 0.5],
    [`-${cardRotation}deg`, `${cardRotation}deg`],
  );

  const getMousePosition = (e: MouseEvent) => {
    const { width, height, left, top } =
      e.currentTarget.getBoundingClientRect();
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
    const { currentMouseX, currentMouseY, containerWidth, containerHeight } =
      getMousePosition(e);

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
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", scale }}
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

const OffersCarousel: FC<{
  listings: { title: string; id: number; price: number }[];
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
              slidesPerView: 2,
            },
            1536: {
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
                <PromotionItem
                  price={lis.price}
                  id={lis.id}
                  title={lis.title}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

const PromotionItem: FC<{ price: number; title: string; id: number }> = ({
  price,
  title,
  id,
}) => {
  return (
    <Link
      to={"/marketplace/$category/$itemId"}
      params={{ category: "foo", itemId: id }}
      className="flex flex-col items-center gap-5 rounded-xl border-background bg-muted-foreground/30 p-6 py-8"
    >
      <div className="aspect-square h-full w-full bg-white"></div>
      <h4 className="line-clamp-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        {title}
      </h4>
      <h4 className="max-w-[6ch] text-center text-xl font-semibold leading-7">
        ${price}
      </h4>
    </Link>
  );
};
