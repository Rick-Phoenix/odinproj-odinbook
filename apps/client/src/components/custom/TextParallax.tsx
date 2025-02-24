import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

function RoomsHeading() {
  return (
    <span>
      Share your <span className="text-primary">passions</span> with others.
    </span>
  );
}
function MarketplaceHeading() {
  return (
    <span>
      A marketplace based on <span className="text-primary">credibility.</span>
    </span>
  );
}
function ChatsHeading() {
  return (
    <span>
      An integrated chat application designed to promote a{" "}
      <span className="text-primary">fluid exchange of ideas.</span>
    </span>
  );
}

export const ParallaxContent = () => {
  return (
    <div className="bg-[hsl(219, 41%, 13%)]">
      <TextParallaxContent
        imgUrl="https://res.cloudinary.com/dqjizh49f/image/upload/v1740062357/Nexus/je1guzrymohmwrcsgdfn.png"
        subheading=""
        heading="Connect."
      >
        <ParallaxTextContent
          heading={<RoomsHeading />}
          description="Nexus' Rooms are virtual spaces where you can discuss, debate and share your ideas about all of your favorite topics."
          footer="Create your own community or take part in others'"
        />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://res.cloudinary.com/dqjizh49f/image/upload/v1740062105/Nexus/texzkg7hll4arsepdhfr.png"
        subheading="Connect"
        heading="Interact with other members of your favorite communities."
      >
        <ParallaxTextContent
          heading={<ChatsHeading />}
          description="There's no need to use a separate app for chatting with the other members of your communities."
          footer="Nexus comes with an integrated chat that allows you to keep in touch with all the other members that you rill run across as part of your experience with Nexus."
        />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://res.cloudinary.com/dqjizh49f/image/upload/v1740060158/Nexus/gy6km5iudqtzakxrltlg.png"
        subheading="Exchange"
        heading="Get the best deals, as a buyer and as a seller."
      >
        <div>
          <ParallaxTextContent
            heading={<MarketplaceHeading />}
            description="We at Nexus think that forums and social platforms are some of the best avenues for peer-to-peer commerce."
            footer="By being able to check the seller's posting (as well as selling) history, buyers can ensure that the other party is serious and trustworthy, and may sometimes even offer additional expertise."
          />
        </div>
      </TextParallaxContent>
    </div>
  );
};

const IMG_PADDING = 12;

const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children,
}: {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: ReactNode;
}) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }: { imgUrl: string }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }: { subheading: string; heading: string }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl tracking-wider md:mb-4 md:text-3xl">{subheading}</p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const ParallaxTextContent = ({
  heading,
  description,
  footer,
}: {
  footer: string;
  heading: ReactNode;
  description: string;
}) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4">{heading}</h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-muted-foreground md:text-2xl">{description}</p>
      <p className="mb-8 text-xl text-muted-foreground md:text-2xl">{footer}</p>
    </div>
  </div>
);
