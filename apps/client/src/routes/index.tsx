import { userQueryOptions } from "@/lib/queries/queryOptions";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { init } from "aos";
import "aos/dist/aos.css";
import {
  AnimatePresence,
  frame,
  motion,
  stagger,
  useAnimate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import Stack from "../components/custom/CardStack";
import InfiniteScroll from "../components/custom/InfiniteScroll";
import LoginDialog from "../components/custom/LoginDialog";
import CircularText from "../components/custom/RotatingText";
import SignupDialog from "../components/custom/SignupDialog";
import GradientText from "../components/custom/TextGradient";
import Threads from "../components/custom/Threads";
import { Card } from "../components/ui/card";
import { cn } from "../utils/shadcn-helper";

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
      <BackgroundGradientAnimation
        interactive={false}
        className="relative flex w-full flex-col items-center justify-center gap-4 p-4"
        gradientBackgroundEnd="rgb(30, 41, 59)"
        gradientBackgroundStart="rgb(2, 8, 23)"
      >
        <TypewriterEffect
          words={[
            { text: "This", className: "font-thin" },
            { text: "is", className: "font-thin" },
            { text: "Nexus.", className: "dark:text-sky-500" },
          ]}
          className="mt-0 text-4xl tracking-tight"
        />
        <div
          className="relative size-[500px] bg-black"
          style={{
            mask: `url("data:image/svg+xml, %3Csvg stroke='white' fill='none' strokeWidth='2' viewBox='0 0 24 24' strokeLinecap='round' strokeLinejoin='round' height='100%' width='100%' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M6.045 9.777a6 6 0 1 0 5.951 .023' %3E%3C/path%3E%3Cpath d='M11.997 20.196a6 6 0 1 0 -2.948 -5.97' %3E%3C/path%3E%3Cpath d='M17.95 9.785q .05 -.386 .05 -.785a6 6 0 1 0 -3.056 5.23'%3E%3C/path%3E%3C/svg%3E")`,
          }}
        >
          <BackgroundGradientAnimation
            gradientBackgroundEnd="rgb(30, 41, 59)"
            gradientBackgroundStart="rgb(38, 98, 217)"
          />

          <Drag />
        </div>
        <span className="z-20 mb-2 text-3xl italic leading-tight tracking-tight">
          Exchange
          <FlipWords
            words={["passions", "connections", "deals", "views", "opinions", "solutions"]}
            duration={2000}
            className="text-3xl"
          />
        </span>
        <div className="z-20 flex gap-4">
          <SignupDialog />
          <LoginDialog />
        </div>
        <div className="absolute -bottom-[100px] z-10 h-[500px] w-full opacity-20">
          <Threads amplitude={3} color={[59, 65, 73]} />
        </div>
      </BackgroundGradientAnimation>
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
      <div className="grid grid-cols-2 grid-rows-2 justify-center gap-x-28 p-8">
        <div
          className="row-span-2 justify-self-end"
          data-aos="fade-right"
          data-aos-duration="3000"
          data-aos-anchor="#deals-header"
        >
          <Stack autoCycle />
        </div>
        <h1 className="self-end pb-3 text-6xl" id="deals-header" data-aos="fade-down" data-aos-duration="2000">
          A digital flea market
        </h1>
        <div className="col-start-2 flex text-2xl" data-aos="fade-left" data-aos-duration="2500">
          A digital neighborhood needs its own garage sales. Nexus offers a marketplace section, where you can buy or
          sell your items easily and free of charge.
        </div>
      </div>
      <ChatContainer messages={["Hello there", "General Kenobi.", "Good to see you here."]} />
      <div className="relative mt-12">
        <CircularText text={"*DISCOVER*SHARE*LEARN"} />
        <div className="text-2xl absolute-center">
          <button className="relative p-[3px]">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-600 to-teal-500" />
            <div className="group relative rounded-[6px] bg-gray-950 px-8 py-2 font-semibold text-white transition duration-200 hover:bg-transparent">
              Come join us!
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

const ChatContainer = ({ messages }: { messages: string[] }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [activeMessages, setActiveMessages] = useState<number[]>([]);

  useMotionValueEvent(scrollYProgress, "change", (scrollPctg) => {
    messages.forEach((m, i, arr) => {
      const breakPoint = i / arr.length;
      if (scrollPctg >= breakPoint && !activeMessages.includes(i)) setActiveMessages((old) => [...old, i]);
      if (scrollPctg < breakPoint && activeMessages.includes(i))
        setActiveMessages((old) => old.filter((ind) => ind !== i));
    });
  });

  return (
    <div ref={containerRef} className="relative my-10 h-[30vh] w-full overflow-y-auto px-8 scrollbar-hidden">
      <div className="grid-4 gap-x-28">
        <div className="relative col-start-2 row-span-2 w-fit">
          <div className="sticky top-0 flex flex-col gap-3">
            <span className="text-6xl">Connect</span>
            <span className="text-2xl">Our chat is really cool</span>
          </div>
        </div>

        <div className="relative row-span-2 row-start-1 h-[100vh]">
          <motion.div className="sticky top-0 flex flex-col px-5">
            {messages.map((message, index) => {
              const alignSelf = index % 2 ? "end" : "start";
              return (
                <motion.div
                  className="size-fit bg-foreground"
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeMessages.includes(index) ? 1 : 0 }}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "20px",
                    color: "black",
                    alignSelf,
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

function Drag() {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useFollowPointer(ref);

  const ball = {
    width: 200,
    height: 200,
    borderRadius: "50%",
  };

  return (
    <motion.div
      className="absolute bg-sky-500 blur-lg"
      ref={ref}
      style={{
        ...ball,
        width: 100,
        height: 100,
        x,
        y,
      }}
    />
  );
}

const spring = { damping: 5, stiffness: 50, restDelta: 0.001 };
function useFollowPointer(ref: RefObject<HTMLDivElement | null>) {
  const xPoint = useMotionValue(0);
  const yPoint = useMotionValue(0);
  const x = useSpring(xPoint, spring);
  const y = useSpring(yPoint, spring);

  useEffect(() => {
    if (!ref.current || !ref.current.offsetParent?.getBoundingClientRect()) return;

    const handlePointerMove = ({ clientX, clientY }: MouseEvent) => {
      const element = ref.current!;
      const parentRect = element.offsetParent!.getBoundingClientRect();
      const scrollWidth = document.body.scrollWidth;
      const scrollHeight = document.body.scrollHeight;
      frame.read(() => {
        xPoint.set(
          Math.min(
            clientX - element.offsetLeft - parentRect.x - element.offsetWidth / 2,
            scrollWidth - element.offsetLeft - element.offsetWidth * 1.5
          )
        );
        yPoint.set(
          Math.min(
            clientY - element.offsetTop - parentRect.y - element.offsetHeight / 2,
            scrollHeight - element.offsetTop - element.offsetHeight * 1.5 - 50
          )
        );
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return { x, y };
}

const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // thanks for the fix Julian - https://github.com/Julian-AT
  const startAnimation = useCallback(() => {
    const word = words[words.indexOf(currentWord) + 1] || words[0];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating)
      setTimeout(() => {
        startAnimation();
      }, duration);
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: "blur(8px)",
          scale: 2,
          position: "absolute",
        }}
        className={cn("relative z-10 inline-block px-2 text-left text-neutral-900 dark:text-neutral-100", className)}
        key={currentWord}
      >
        {/* edit suggested by Sajal: https://x.com/DewanganSajal */}
        {currentWord.split(" ").map((word, wordIndex) => (
          <motion.span
            key={word + wordIndex}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: wordIndex * 0.3,
              duration: 0.3,
            }}
            className="inline-block whitespace-nowrap"
          >
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={word + letterIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: wordIndex * 0.3 + letterIndex * 0.05,
                  duration: 0.2,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "86, 3, 252",
  thirdColor = "100, 220, 255",
  fourthColor = "3, 252, 157",
  fifthColor = "3, 10, 107",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  useEffect(() => {
    document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart);
    document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, []);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) {
        return;
      }
      setCurX(curX + (tgX - curX) / 20);
      setCurY(curY + (tgY - curY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    }

    move();
  }, [tgX, tgY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "relative left-0 top-0 h-screen w-screen overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn("", className)}>{children}</div>
      <div
        className={cn(
          "gradients-container h-full w-full blur-lg",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
        )}
      >
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:center_center]`,
            `animate-first`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%-400px)]`,
            `animate-second`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%+400px)]`,
            `animate-third`,
            `opacity-100`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%-200px)]`,
            `animate-fourth`,
            `opacity-70`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
            `left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] [mix-blend-mode:var(--blending-value)]`,
            `[transform-origin:calc(50%-800px)_calc(50%+800px)]`,
            `animate-fifth`,
            `opacity-100`
          )}
        ></div>

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `-left-1/2 -top-1/2 h-full w-full [mix-blend-mode:var(--blending-value)]`,
              `opacity-70`
            )}
          ></div>
        )}
      </div>
    </div>
  );
};

const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(`hidden text-black opacity-0 dark:text-white`, word.className)}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div className={cn("text-center text-base font-bold sm:text-xl md:text-3xl lg:text-5xl", className)}>
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn("inline-block h-4 w-[4px] rounded-sm bg-blue-500 md:h-6 lg:h-10", cursorClassName)}
      ></motion.span>
    </div>
  );
};
