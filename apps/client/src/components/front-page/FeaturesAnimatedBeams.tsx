import { init } from "aos";
import { MessageSquareText } from "lucide-react";
import React, { forwardRef, useEffect, useRef } from "react";
import { FaRegHandshake } from "react-icons/fa6";
import {
  TbBallAmericanFootball,
  TbMessageFilled,
  TbSpaces,
  TbUpload,
  TbUserPlus,
} from "react-icons/tb";
import { cn } from "../../utils/shadcn-helper";
import AnimatedBeam from "../animations/AnimatedBeams";
import FloatingDiv from "../animations/FloatingDix";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; text?: string }
>(({ className, children, text }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group relative z-10 size-12 rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] flex-center",
        className
      )}
    >
      <span className="z-10">{children}</span>
      {text && (
        <div className="absolute left-[calc(100%+0.5rem)] z-50 min-w-[100px] max-w-fit rounded-xl bg-foreground p-2 text-center text-xs italic text-muted opacity-0 transition-opacity duration-500 flex-center group-hover:opacity-100">
          {text}
        </div>
      )}
    </div>
  );
});

Circle.displayName = "Circle";

export function FeaturesAnimatedBeams({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  const duration = 3;

  useEffect(() => {
    init();
  }, []);

  return (
    <div
      data-aos="fade-up"
      data-aos-duration="3000"
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden p-10 text-black",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10 [&_svg]:size-8">
        <div className="flex flex-col justify-center">
          <FloatingDiv>
            <Circle ref={div7Ref} text={"This is you! &#x1F389;"}>
              <Icons.user />
            </Circle>
          </FloatingDiv>
        </div>
        <div className="flex flex-col justify-center">
          <FloatingDiv>
            <Circle ref={div6Ref} className="size-16">
              <Icons.nexus />
            </Circle>
          </FloatingDiv>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <FloatingDiv>
            <Circle ref={div3Ref} text="Forge new friendships">
              <Icons.friends />
            </Circle>
          </FloatingDiv>
          <FloatingDiv>
            <Circle ref={div1Ref} text="Create new connections">
              <Icons.messenger />
            </Circle>
          </FloatingDiv>
          <FloatingDiv>
            <Circle ref={div2Ref} text="Share exciting content">
              <Icons.share />
            </Circle>
          </FloatingDiv>
          <FloatingDiv>
            <Circle ref={div4Ref} text="Find new passions">
              <Icons.hobbies />
            </Circle>
          </FloatingDiv>
          <FloatingDiv>
            <Circle ref={div5Ref} text="Find great deals">
              <Icons.deals />
            </Circle>
          </FloatingDiv>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={duration}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={duration}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={duration}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={duration}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={duration}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={duration}
      />
    </div>
  );
}

const Icons = {
  nexus: () => <TbSpaces />,
  chat: () => <MessageSquareText />,
  friends: () => <TbUserPlus />,
  share: () => <TbUpload />,
  deals: () => <FaRegHandshake />,
  messenger: () => <TbMessageFilled />,
  hobbies: () => <TbBallAmericanFootball />,
  user: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};
