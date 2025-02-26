import * as motion from "motion/react-client";

import type { ComponentProps } from "react";

export default function ButtonGesture({
  children,
  className,
  onClick,
}: ComponentProps<"button">) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileTap={{ scale: 0.8 }}
    >
      {children}
    </motion.button>
  );
}
