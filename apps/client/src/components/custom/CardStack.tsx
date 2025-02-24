import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState, type Ref } from "react";

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  triggerAutoDrag?: boolean;
  isFront: boolean;
  ref: Ref<{ stopAnimation: Promise<void> }>;
}

function CardRotate({ children, onSendToBack, sensitivity, triggerAutoDrag, isFront, ref }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-70, 70], [50, -50]);
  const rotateY = useTransform(x, [-70, 70], [-50, 50]);
  const cardRef = useRef<HTMLDivElement>(null);
  const targetX = (sensitivity + 1) * -1;
  const targetY = targetX / 2;

  function handleDragEnd(_: never, info: { offset: { x: number; y: number } }) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }
  useEffect(() => {
    if (triggerAutoDrag && isFront) {
      const animationX = animate(x, targetX, { duration: 1 });
      const animationY = animate(y, targetY, { duration: 1 });

      Promise.all([animationX, animationY]).then(() => {
        onSendToBack();
        const animationX = animate(x, 0, { duration: 1 });
        const animationY = animate(y, 0, { duration: 1 });
        Promise.all([animationX, animationY]);
      });

      return () => {
        animationX.complete();
        animationY.complete();
      };
    }
  }, [isFront]);
  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
      ref={cardRef}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  cardDimensions?: { width: number; height: number };
  sendToBackOnClick?: boolean;
  cardsData?: { id: number; img: string }[];
  animationConfig?: { stiffness: number; damping: number };
  autoCycle?: boolean;
}

export default function Stack({
  randomRotation = true,
  sensitivity = 100,
  cardDimensions = { width: 208, height: 416 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoCycle = false,
}: StackProps) {
  const [cards, setCards] = useState(
    cardsData.length
      ? cardsData
      : [
          { id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
          { id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
          { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
          { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" },
        ]
  );

  const cardsRef = useRef<{ stopAnimation: Promise<void> }[]>([]);

  const handleParentClick = () => {
    // Stop all card animations
    cardsRef.current.forEach(async (animation) => await animation.stopAnimation);
  };

  const sendToBack = (id: number) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  return (
    <div
      className="relative"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600,
      }}
    >
      {cards.map((card, index) => {
        const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            triggerAutoDrag={autoCycle}
            isFront={index === cards.length - 1}
            ref={(el) => {
              cardsRef.current[index] = el!;
            }}
          >
            <motion.div
              className="overflow-hidden rounded-2xl border-4 border-white"
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={{
                rotateZ: (cards.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - cards.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
              style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
              }}
            >
              <img src={card.img} alt={`card-${card.id}`} className="pointer-events-none h-full w-full object-cover" />
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
