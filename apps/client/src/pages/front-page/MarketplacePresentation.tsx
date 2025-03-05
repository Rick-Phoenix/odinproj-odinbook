import Stack from "../../components/animations/CardStack";
import GradientText from "../../components/animations/TextGradient";

export default function MarketplacePresentation() {
  return (
    <div className="grid grid-rows-2 justify-center gap-x-28 p-8 md:grid-cols-2 md:grid-rows-1">
      <div
        className="pointer-events-none row-start-2 mt-5 md:pointer-events-auto md:row-span-2 md:row-start-1 md:mt-0 md:justify-self-end"
        data-aos="fade-right"
        data-aos-duration="3000"
        data-aos-anchor="#deals-header"
      >
        <Stack autoCycle />
      </div>
      <div className="flex flex-col">
        <h1
          className="pb-3 text-5xl md:self-end md:text-start md:text-5xl"
          id="deals-header"
          data-aos="fade-down"
          data-aos-duration="2000"
        >
          An open <GradientText>marketplace</GradientText> for collectors and hobbyists
        </h1>
        <div
          className="text-lg md:col-start-2 md:text-2xl"
          data-aos="fade-left"
          data-aos-duration="2500"
        >
          Like a true digital neighborhood, Nexus has its own form of garage sales. In the
          marketplace section , you can buy items from other Nexers (or sell your own){" "}
          <span className="inline-block underline decoration-primary underline-offset-4">
            at no additional cost.{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
