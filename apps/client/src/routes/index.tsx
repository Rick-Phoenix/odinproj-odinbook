import { userQueryOptions } from "@/lib/queries/queryOptions";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { init } from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import GradientText from "../components/animations/TextGradient";
import FeaturesAnimatedBeams from "../pages/front-page/FeaturesCircles";
import FrontPageFooter from "../pages/front-page/FrontPageFooter";
import MainHero from "../pages/front-page/MainHero";
import MarketplacePresentation from "../pages/front-page/MarketplacePresentation";
import { MockChat } from "../pages/front-page/MockChat";
import RoomsPresentation from "../pages/front-page/RoomsPresentation";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions);
    if (user) {
      throw redirect({
        to: "/rooms",
        search: { orderBy: "likesCount" },
      });
    }
  },
  component: Index,
});

function Index() {
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-[90vh] w-full">
      <MainHero />
      <div className="my-12 flex flex-col items-center">
        <div className="text-5xl">
          <div data-aos="fade-right" className="inline-block" data-aos-duration="3000">
            One <GradientText>hub</GradientText>,
          </div>{" "}
          <div data-aos="fade-left" className="inline-block" data-aos-duration="4000">
            many features
          </div>
        </div>
        <FeaturesAnimatedBeams />
      </div>
      <RoomsPresentation />
      <div data-aos="fade-up" data-aos-duration="2000">
        <MockChat messages={["Hello there!", "General Kenobi.", "You are a bold one."]} />
      </div>
      <MarketplacePresentation />
      <FrontPageFooter />
    </div>
  );
}
