import { userQueryOptions } from "@/lib/queries/queryOptions";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { init } from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import FrontPageFooter from "../components/front-page/FrontPageFooter";
import MainHero from "../components/front-page/MainHero";
import MarketplacePresentation from "../components/front-page/MarketplacePresentation";
import { MockChat } from "../components/front-page/MockChat";
import RoomsPresentation from "../components/front-page/RoomsPresentation";

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
      <RoomsPresentation />
      <div data-aos="fade-up" data-aos-duration="2000">
        <MockChat messages={["Hello there!", "General Kenobi.", "Good to see you here."]} />
      </div>
      <MarketplacePresentation />
      <FrontPageFooter />
    </div>
  );
}
