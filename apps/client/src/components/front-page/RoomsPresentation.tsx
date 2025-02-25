import { init } from "aos";
import { useEffect } from "react";
import InfiniteScroll from "../dialogs/custom/InfiniteScroll";
import GradientText from "../dialogs/custom/TextGradient";
import { Card } from "../ui/card";

export default function RoomsPresentation() {
  useEffect(() => {
    init();
  }, []);
  return (
    <div className="relative grid h-[500px] grid-cols-2 grid-rows-2">
      <div className="z-10 col-start-2 self-end pb-3 text-6xl">
        <div className="inline-block" data-aos="fade-down" data-aos-duration="1500">
          An
        </div>{" "}
        <div className="inline-block" data-aos="fade-left" data-aos-duration="3000">
          <GradientText>ocean</GradientText>
        </div>
        <br />{" "}
        <div className="inline-block" data-aos="fade-up" data-aos-duration="1500">
          of
        </div>{" "}
        <div className="inline-block" data-aos="fade-left" data-aos-duration="2000">
          passions
        </div>
      </div>
      <div className="z-10 col-start-2 text-2xl" data-aos="fade-left" data-aos-duration="3000">
        Nexus is a community for communities. A place for sharing passions, ideas, solutions and much more. Every user
        can create their own Room, which is a space dedicated to any topic imaginable.
      </div>
      <div className="absolute top-0 z-0 size-full">
        <InfiniteScroll items={[{ content: <Card>Oh hello there</Card> }]} isTilted autoplay />
      </div>
    </div>
  );
}
