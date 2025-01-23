import { createFileRoute } from "@tanstack/react-router";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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

function RouteComponent() {
  return (
    <InsetScrollArea>
      <section className="flex min-h-svh max-w-full flex-col items-center rounded-xl bg-muted/50">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          For Sale
        </h2>
        <TrendingCarousel />
      </section>
    </InsetScrollArea>
  );
}

function TrendingCarousel() {
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
            className="h-full w-full p-20"
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
              <SwiperSlide>
                <TrendingItem />
              </SwiperSlide>
              <SwiperSlide>
                <TrendingItem />
              </SwiperSlide>
              <SwiperSlide>
                <TrendingItem />
              </SwiperSlide>
              <SwiperSlide>
                <TrendingItem />
              </SwiperSlide>
              <SwiperSlide>
                <TrendingItem />
              </SwiperSlide>
              <SwiperSlide>
                <TrendingItem />
              </SwiperSlide>
              <SwiperSlide>
                <TrendingItem />
              </SwiperSlide>
              <SwiperSlide>
                <TrendingItem />
              </SwiperSlide>
              <SwiperSlide>
                <TrendingItem />
              </SwiperSlide>
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
