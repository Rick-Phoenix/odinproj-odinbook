import { motion } from "motion/react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  durationSec?: number;
  gradientAngle?: number;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  durationSec = 8,
  gradientAngle = Math.random() * 360,
}: GradientTextProps) {
  const cos = Math.max(Math.abs(Math.cos((gradientAngle * Math.PI) / 180)), 0.1);
  const sin = Math.max(Math.abs(Math.sin((gradientAngle * Math.PI) / 180)), 0.1);
  const bgWidth = `calc((200%) / ${cos})`;
  const bgHeight = `calc((200%) / ${sin})`;
  const backgroundSize = `${bgWidth} ${bgHeight}`;

  const backgroundImage = `linear-gradient(${gradientAngle}deg, ${colors.join(", ")})`;

  return (
    <div className={`relative inline-flex overflow-hidden font-medium backdrop-blur ${className}`}>
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
