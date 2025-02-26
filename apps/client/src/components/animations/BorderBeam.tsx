import { motion, type MotionStyle, type Transition } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/shadcn-helper";

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number;
  /**
   * The duration of the border beam.
   */
  duration?: number;
  /**
   * The delay of the border beam.
   */
  delay?: number;
  /**
   * The color of the border beam from.
   */
  colorFrom?: string;
  /**
   * The color of the border beam to.
   */
  colorTo?: string;
  /**
   * The motion transition of the border beam.
   */
  transition?: Transition;
  /**
   * The class name of the border beam.
   */
  className?: string;
  /**
   * The style of the border beam.
   */
  style?: React.CSSProperties;
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean;
  /**
   * The initial offset position (0-100).
   */
  initialOffset?: number;
}

export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
}: BorderBeamProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn(
          "absolute aspect-square",
          "bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
};

interface MovingGradientProps extends ComponentPropsWithoutRef<"div"> {
  animated?: boolean;
  gradientClassName?: string;
}

export function MovingGradient({
  children,
  className,
  animated = true,
  gradientClassName,
  ...props
}: MovingGradientProps) {
  const backgroundClassName = "pointer-events-none absolute h-full w-full";
  return (
    <div {...props} className={cn("relative overflow-hidden bg-white", className)}>
      <div
        className={cn(
          "bg-size bg-gradient-to-r from-yellow-500 from-30% via-yellow-700 via-50% to-pink-500 to-80% opacity-15",
          {
            [backgroundClassName]: true,
            "animate-bg-position bg-[length:300%_auto]": animated,
          },
          gradientClassName
        )}
      />
      <div className={cn(backgroundClassName, "z-1 blur-lg")} />
      {children}
    </div>
  );
}
