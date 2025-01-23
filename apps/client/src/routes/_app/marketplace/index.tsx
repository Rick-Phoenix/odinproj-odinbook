import { createFileRoute } from "@tanstack/react-router";

import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { useState, type MouseEvent, type MouseEventHandler } from "react";
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
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export const Route = createFileRoute("/_app/marketplace/")({
  component: RouteComponent,
});

const cardRotation = 15;
const cardScale = 1.07;

function RouteComponent() {
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
    const { currentMouseX, currentMouseY } = getMousePosition(e);
    scale.set(cardScale);
  };
  const handleMouseLeave: MouseEventHandler = (e: MouseEvent) => {
    scale.set(1);
    xPcnt.set(0);
    yPcnt.set(0);
  };

  return (
    <InsetScrollArea>
      <section className="flex min-h-svh max-w-full flex-col items-center rounded-xl bg-muted/50">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          For Sale
        </h2>
        <OffersCarousel />
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Browse By Categories
        </h2>
        <div className="grid h-full w-full flex-1 auto-rows-[5rem] grid-cols-2 gap-8 p-8">
          <motion.button
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", scale }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group flex items-center justify-center rounded-xl bg-slate-300"
          >
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-primary-foreground">
              Tech
            </h4>
          </motion.button>
        </div>
      </section>
    </InsetScrollArea>
  );
}

function OffersCarousel() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="p-3">
          <Button variant={"ghost"}>
            <small className="text-sm font-medium leading-none">
              🔥 Special Offers
            </small>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          >
            {isVisible ? "Hide" : "Show"}
          </DropdownMenuItem>
          <DropdownMenuItem>All Trending</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AnimatePresence initial={false}>
        {isVisible ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="h-full w-full p-8"
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
                    <TrendingItem />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function TrendingItem() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-muted-foreground/30 p-6">
      <div className="h-40 w-40 bg-white"></div>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Price
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6">Description</p>
    </div>
  );
}
