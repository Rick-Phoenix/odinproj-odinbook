import { motion } from "motion/react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  durationSec?: number;
  showBorder?: boolean;
  animationType?: "linear" | "rotate" | "wave";
  gradientAngle?: number;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  durationSec = 8,
  showBorder = false,
  animationType = "linear",
  gradientAngle = Math.random() * 360,
}: GradientTextProps) {
  const cos = Math.max(Math.abs(Math.cos((gradientAngle * Math.PI) / 180)), 0.1);
  const sin = Math.max(Math.abs(Math.sin((gradientAngle * Math.PI) / 180)), 0.1);
  const bgWidth = `calc((200%) / ${cos})`;
  const bgHeight = `calc((200%) / ${sin})`;
  const backgroundSize = `${bgWidth} ${bgHeight}`;

  const backgroundImage = `linear-gradient(${gradientAngle}deg, ${colors.join(", ")})`;

  return (
    <div
      className={`relative mx-auto inline-flex max-w-fit flex-row items-center justify-center overflow-hidden font-medium backdrop-blur transition-shadow ${className}`}
    >
      {/*{showBorder && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 bg-cover"
          style={{
            ...gradientStyle,
            backgroundSize,
            backgroundPosition: `${backGroundX.get()}% 50%`,
          }}
        >
          <div
            className="absolute inset-0 z-[-1] rounded-[1.25rem] bg-black"
            style={{
              width: "calc(100% - 2px)",
              height: "calc(100% - 2px)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>
      )}*/}

      <motion.div
        className="z-[2] text-transparent"
        style={{
          backgroundImage,
          backgroundSize,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{
          duration: durationSec,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
