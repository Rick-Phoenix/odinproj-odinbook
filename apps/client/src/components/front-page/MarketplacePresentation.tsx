import { init } from "aos";
import { useEffect } from "react";
import Stack from "./CardStack";

export default function MarketplacePresentation() {
  useEffect(() => {
    init();
  }, []);
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
        className="self-end pb-3 text-6xl"
        id="deals-header"
        data-aos="fade-down"
        data-aos-duration="2000"
      >
        A hub for collectors and hobbyists
      </h1>
      <div className="col-start-2 flex text-2xl" data-aos="fade-left" data-aos-duration="2500">
        A digital neighborhood needs its own garage sales. Nexus offers a marketplace section, where
        you can buy or sell your items easily and free of charge.
      </div>
    </div>
  );
}
