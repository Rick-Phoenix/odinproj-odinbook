import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import GradientText from "../../components/animations/TextGradient";

export const MockChat = ({ messages }: { messages: string[] }) => {
  const scrollViewPortRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollViewPortRef });
  const { scrollYProgress: scrollYProgressViewport } = useScroll();
  const [activeMessages, setActiveMessages] = useState<number[]>([]);

  useMotionValueEvent(scrollYProgressViewport, "change", (c) => {
    if (scrollViewPortRef.current && scrollAreaRef.current) {
      if (activeMessages.length === 3) {
        if (scrollAreaRef.current.style.height !== "50vh")
          scrollAreaRef.current.style.height = "50vh";
        return;
      }

      const { top, height } = scrollViewPortRef.current.getBoundingClientRect();
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
    if (scrollViewPortRef.current && scrollAreaRef.current) {
      if (activeMessages.length === 3) {
        if (scrollAreaRef.current.style.height !== "50vh")
          scrollAreaRef.current.style.height = "50vh";
        return;
      }
      messages.forEach((m, i, arr) => {
        const breakPoint = i / arr.length;
        if (scrollPctg >= breakPoint && !activeMessages.includes(i))
          setActiveMessages((old) => [...old, i]);
      });
    }
  });

  return (
    <div
      ref={scrollViewPortRef}
      className="relative my-32 h-[50vh] w-full overflow-y-auto px-4 pr-2 scrollbar-hidden md:px-8"
    >
      <div
        className="grid h-[150vh] w-full grid-cols-2 grid-rows-1 justify-items-center md:gap-x-28"
        data-aos="fade-up"
        data-aos-duration="1000"
        id="chat-sticky"
        ref={scrollAreaRef}
      >
        <div className="relative col-start-2 row-start-1">
          <div className="sticky top-0 flex size-fit flex-col gap-3">
            <span className="text-3xl md:text-5xl">
              A place for creating{" "}
              <span data-aos="fade-left" data-aos-duration="3000">
                <GradientText>connections</GradientText>
              </span>
            </span>
            <span className="md:text-2xl">
              With its{" "}
              <span className="underline decoration-primary underline-offset-4">
                integrated chat
              </span>{" "}
              functionality, Nexus is built to enable users to create and foster new connections.
            </span>
          </div>
        </div>

        <div className="relative row-start-1 w-full md:w-fit md:justify-self-end">
          <motion.div className="sticky top-5 grid w-full auto-rows-auto grid-cols-[100%] gap-y-8 px-5 pl-2 text-sm md:grid-cols-2 md:pl-5 md:text-base">
            {messages.map((message, index) => {
              const isLeft = !(index === 0);
              const gridColumn = isLeft ? "col-start-2" : "col-start-1";
              const textAlign = isLeft ? "end" : "start";
              const gridRowStart = index + 1;
              const msgType = isLeft
                ? "message-user rounded-tr-none"
                : "message-contact rounded-tl-none";

              return (
                <motion.div
                  key={index}
                  className={`${msgType} md:${gridColumn} mock relative z-0 break-normal rounded-xl bg-foreground p-2 md:col-span-1 md:w-fit md:p-[12px_16px]`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeMessages.includes(index) ? 1 : 0 }}
                  style={{
                    padding: "",
                    color: "black",
                    gridRowStart,
                    textAlign,
                    justifySelf: textAlign,
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
