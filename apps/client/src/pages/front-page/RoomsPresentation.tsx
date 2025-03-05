import { type FC } from "react";
import InfiniteScroll from "../../components/animations/InfiniteScroll";
import GradientText from "../../components/animations/TextGradient";
import { Card, CardDescription, CardTitle } from "../../components/ui/card";

const rooms = [
  {
    title: "Electronics Enthusiasts",
    description: "Some people have never shocked themselves. We are not those people.",
    img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740768748/Nexus/dqzz5nxzsgv2068gylit.jpg",
  },
  {
    title: "Distinguished Gentlemen",
    description: "An exclusive club reserved for the most refined gentlemen in town.",
    img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740768478/Nexus/zrpnlu4bl7rprmkiegph.jpg",
  },
  {
    title: "Retro Gamers",
    description: "The perfect spot for those to live and breathe in 8-bit.",
    img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740768655/Nexus/oam5w7g0yupojxflmbfr.jpg",
  },
  {
    title: "CatsDoingCatThings",
    description: "Blep.",
    img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740765945/Nexus/onq5fwrpusix7ytd5i0d.jpg",
  },
  {
    title: "Hikers",
    description: "Exploration is a state of mind. Adventure calls!",
    img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740768903/Nexus/hg769lz1sdcg3p3lw5zj.jpg",
  },
  {
    title: "Tabletop Fanatics",
    description: "Player rolls to touch grass. Natural one.",
    img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740827502/Nexus/y5tj34ngcn2bmxkgz7f5.jpg",
  },
  {
    title: "Trains",
    description: "We just really like trains, that's all.",
    img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740769024/Nexus/qoscupmwi7paq2xnntyh.jpg",
  },
];
export default function RoomsPresentation() {
  return (
    <div className="relative grid h-svh grid-cols-2 grid-rows-2">
      <div className="z-10 col-start-2 self-end pb-3 text-6xl">
        <div className="inline-block" data-aos="fade-down" data-aos-duration="1500">
          A
        </div>{" "}
        <div className="inline-block" data-aos="fade-left" data-aos-duration="3000">
          <GradientText>community</GradientText>
        </div>
        <br />{" "}
        <div className="inline-block" data-aos="fade-up" data-aos-duration="1500">
          for
        </div>{" "}
        <div className="inline-block" data-aos="fade-left" data-aos-duration="2000">
          communities
        </div>
      </div>
      <div className="z-10 col-start-2 text-2xl" data-aos="fade-left" data-aos-duration="3000">
        <span className="underline decoration-primary underline-offset-4">Rooms</span> are the core
        section of Nexus. Each Room is a space where users can cultivate their passions, exchange
        ideas, share their knowledge and learn from others.
        <br />
        <em className="text-sm font-light text-muted-foreground">
          (while sharing all of their best cat memes)
        </em>
      </div>
      <div className="absolute top-0 z-0 size-full">
        <InfiniteScroll
          items={rooms.map((r, i) => ({
            content: <InfiniteScrollCard img={r.img} title={r.title} description={r.description} />,
          }))}
          isTilted
          autoplay
          negativeMargin="-1rem"
        />
      </div>
    </div>
  );
}

const InfiniteScrollCard: FC<{ img: string; title: string; description: string }> = ({
  description,
  img,
  title,
}) => {
  return (
    <Card className="flex size-full items-center gap-3 border-none p-2 pt-0">
      <img src={img} className="size-20 rounded-full border-2 border-primary object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-1 text-center">
        <CardTitle className="">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </Card>
  );
};
