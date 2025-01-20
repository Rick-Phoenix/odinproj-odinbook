import * as motion from "motion/react-client";
import type { ReactNode } from "react";

export default function Gestures({ children }: { children: ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
      {children}
    </motion.div>
  );
}
