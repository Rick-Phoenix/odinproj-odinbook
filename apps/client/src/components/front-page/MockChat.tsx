import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import GradientText from "./TextGradient";

export const MockChat = ({ messages }: { messages: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const { scrollYProgress: scrollYProgressViewport } = useScroll();
  const [activeMessages, setActiveMessages] = useState<number[]>([]);

  useMotionValueEvent(scrollYProgressViewport, "change", (c) => {
    if (containerRef.current) {
      const { top, height } = containerRef.current.getBoundingClientRect();
      const containerOffset = top - height;
      if (containerOffset <= 0) {
        const scrollPctg = (containerOffset * -1) / height;
        messages.forEach((m, i, arr) => {
          const breakPoint = i / arr.length;
          if (scrollPctg >= breakPoint && !activeMessages.includes(i))
            setActiveMessages((old) => [...old, i]);
        });
      }
    }
  });

  useMotionValueEvent(scrollYProgress, "change", (scrollPctg) => {
    messages.forEach((m, i, arr) => {
      const breakPoint = i / arr.length;
      if (scrollPctg >= breakPoint && !activeMessages.includes(i))
        setActiveMessages((old) => [...old, i]);
      if (scrollPctg < breakPoint && activeMessages.includes(i))
        setActiveMessages((old) => old.filter((ind) => ind !== i));
    });
  });

  return (
    <div
      ref={containerRef}
      className="relative my-32 h-[50vh] w-full overflow-y-auto px-8 scrollbar-hidden"
    >
      <div
        className="grid-4 justify-items-center gap-x-28"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="col-start-2 row-span-2 w-fit">
          <div className="sticky flex flex-col gap-3 center-y">
            <span className="text-6xl">
              A place for creating{" "}
              <span data-aos="fade-left" data-aos-duration="3000">
                <GradientText>connections</GradientText>
              </span>
            </span>
            <span className="text-2xl">
              With its integrated chat functionality, Nexus is built to enable users to create and
              foster new connections.
            </span>
          </div>
        </div>

        <div className="relative row-span-2 row-start-1 h-[150vh] justify-self-end">
          <motion.div className="sticky grid auto-rows-auto grid-cols-2 gap-y-8 px-5 center-y">
            {messages.map((message, index) => {
              const isLeft = !(index === 0);
              const gridColumn = isLeft ? "2/3" : "1/2";
              const justifySelf = isLeft ? "end" : "start";
              const gridRowStart = index + 1;
              const msgType = isLeft
                ? "message-user rounded-tr-none"
                : "message-contact rounded-tl-none ";
              return (
                <motion.div
                  key={index}
                  className={`${msgType} mock relative z-0 size-fit overflow-visible rounded-xl bg-foreground`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeMessages.includes(index) ? 1 : 0 }}
                  style={{
                    padding: "12px 16px",
                    color: "black",
                    gridColumn,
                    gridRowStart,
                    justifySelf,
                  }}
                >
                  {message}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
