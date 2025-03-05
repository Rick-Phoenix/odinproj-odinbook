import Stack from "../../components/animations/CardStack";
import GradientText from "../../components/animations/TextGradient";

export default function MarketplacePresentation() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 justify-center gap-x-28 p-8">
      <div
        className="row-span-2 justify-self-end"
        data-aos="fade-right"
        data-aos-duration="3000"
        data-aos-anchor="#deals-header"
      >
        <Stack autoCycle />
      </div>
      <h1
        className="self-end pb-3 text-5xl"
        id="deals-header"
        data-aos="fade-down"
        data-aos-duration="2000"
      >
        An open <GradientText>marketplace</GradientText> for collectors and hobbyists
      </h1>
      <div className="col-start-2 text-2xl" data-aos="fade-left" data-aos-duration="2500">
        Like a true digital neighborhood, Nexus has its own form of garage sales. In the marketplace
        section , you can buy items from other Nexers (or sell your own){" "}
        <span className="inline-block underline decoration-primary underline-offset-4">
          at no additional cost.{" "}
        </span>
      </div>
    </div>
  );
}
