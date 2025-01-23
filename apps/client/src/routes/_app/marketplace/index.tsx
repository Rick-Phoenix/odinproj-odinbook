import { createFileRoute, Link } from "@tanstack/react-router";

import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { type FC, type MouseEvent, type MouseEventHandler } from "react";
import {
  Autoplay,
  EffectCoverflow,
  Mousewheel,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { InsetScrollArea } from "../../../components/custom/sidebar-wrapper";

export const Route = createFileRoute("/_app/marketplace/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <InsetScrollArea>
      <section className="flex min-h-svh max-w-full flex-col items-center rounded-xl bg-muted/50">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Promotions
        </h2>
        <OffersCarousel />
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Browse By Category
        </h2>
        <div className="grid w-full auto-rows-[5rem] grid-cols-2 gap-8 p-8">
          <CategoryCard articleText={"Technology"} />
          <CategoryCard articleText={"Videogames"} />
          <CategoryCard articleText={"Fashion"} />
          <CategoryCard articleText={"Collectibles"} />
          <CategoryCard articleText={"Books"} />
          <CategoryCard articleText={"Motors"} />
        </div>
      </section>
    </InsetScrollArea>
  );
}

const CategoryCard: React.FC<
  React.ComponentProps<"button"> & { articleText: string }
> = ({ articleText, children, ...props }) => {
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
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-primary-foreground">
        {articleText}
      </h4>
    </motion.button>
  );
};

function OffersCarousel() {
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="h-full w-full p-8 [--swiper-pagination-bottom:-5px] [--swiper-pagination-bullet-horizontal-gap:0.5rem] [--swiper-pagination-color:hsl(var(--primary))] [&_.swiper]:pb-8"
        >
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
            {Array.from({ length: 12 }).map((e, i) => {
              return (
                <SwiperSlide key={i}>
                  <PromotionItem
                    price={10000}
                    name="Occaecat velit quis nisi nisi do et. Irure quis tempor fugiat non aliquip. Nisi culpa esse est nostrud veniam dolore duis nisi magna. Consequat est Lorem qui commodo ea elit veniam dolor est ad sit.

Voluptate voluptate do ea eu. Et dolore pariatur esse occaecat aliqua consectetur voluptate et et aliquip sint consectetur. Id magna cillum pariatur Lorem voluptate proident. Id minim magna ipsum id cillum irure. Adipisicing laborum magna labore commodo ullamco adipisicing proident ad enim amet sint non incididunt fugiat. Voluptate ipsum incididunt ut aliqua. Aliqua culpa ea commodo consequat quis et sint fugiat ipsum."
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

const PromotionItem: FC<{ price: number; name: string }> = ({
  price,
  name,
}) => {
  return (
    <Link
      to={"/marketplace/$category/$itemId"}
      params={{ category: "foo", itemId: "1" }}
      className="flex flex-col items-center gap-3 rounded-xl bg-muted-foreground/30 p-6"
    >
      <div className="h-40 w-40 bg-white"></div>
      <h4 className="line-clamp-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        {name}
      </h4>
      <h4 className="max-w-[6ch] text-center text-xl font-semibold leading-7">
        ${price}
      </h4>
    </Link>
  );
};
