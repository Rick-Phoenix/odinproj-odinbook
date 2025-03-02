import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  autoCycle?: boolean;
  isFront: boolean;
}

function CardRotate({ children, onSendToBack, sensitivity, autoCycle, isFront }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-70, 70], [50, -50]);
  const rotateY = useTransform(x, [-70, 70], [-50, 50]);
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
    if (autoCycle && isFront) {
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
  cardDimensions = { width: 250, height: 416 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoCycle = false,
}: StackProps) {
  const [cards, setCards] = useState([
    {
      id: 1,
      img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740763642/Nexus/z3ixh0pi1udti743ut80.jpg",
      title: "Professional Microphone",
      price: 120,
    },
    {
      id: 2,
      img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740763643/Nexus/wsnmvsdi5srbtqkx70gy.jpg",
      title: "Mechanical Keyboard",
      price: 85,
    },
    {
      id: 3,
      img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740763643/Nexus/yn3fg4auxygm6cegwutr.jpg",
      title: "DSLR Camera",
      price: 700,
    },
    {
      id: 4,
      img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740763643/Nexus/sbc3snegbypxz2fmxohc.jpg",
      title: "iPhone",
      price: 750,
    },
    {
      id: 6,
      img: "https://res.cloudinary.com/dqjizh49f/image/upload/v1740763643/Nexus/xmj4ps3bbutupdhnfjra.jpg",
      title: "Acoustic Guitar",
      price: 200,
    },
  ]);

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
            autoCycle={autoCycle}
            isFront={index === cards.length - 1}
          >
            <motion.div
              className="group flex flex-col items-center justify-center gap-5 rounded-xl border-2 border-primary bg-gray-800 p-6 py-10 text-center"
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
              <img
                src={card.img}
                alt={`card-${card.id}`}
                className="h-fit max-h-[200px] w-fit max-w-full rounded-md object-contain"
              />
              <h4 className="line-clamp-2 min-w-0 max-w-full scroll-m-20 break-words text-2xl tracking-tight transition-all group-hover:underline">
                {card.title}
              </h4>
              <h4 className="max-w-[6ch] text-center text-xl font-semibold leading-7">
                ${card.price}
              </h4>
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
