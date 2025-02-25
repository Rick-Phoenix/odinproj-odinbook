import { frame, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, type RefObject } from "react";

export default function DraggableElement() {
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
