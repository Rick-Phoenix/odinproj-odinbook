import React, { type CSSProperties } from "react";

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  containerClassName?: string;
  fontSizeRem?: number;
  spacingRem?: number;
}

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  fontSizeRem = 1,
  spacingRem = 1.5,
  containerClassName,
}) => {
  const letters = Array.from(text);
  const containerSize = (letters.length * (fontSizeRem + spacingRem)) / Math.PI;

  return (
    <div
      className={`relative will-change-transform ${containerClassName}`}
      style={
        {
          "--total": `${letters.length}`,
          fontSize: `${fontSizeRem}rem`,
          "--inner-angle": `calc((360 / var(--total)) * 1deg)`,
          "--radius": `calc(1 / sin(var(--inner-angle)) * -${fontSizeRem + spacingRem}rem)`,
          width: `${containerSize + fontSizeRem}rem`,
          height: `${containerSize + fontSizeRem}rem`,
          animation: `spin ${spinDuration}s infinite linear`,
        } as CSSProperties
      }
    >
      {letters.map((letter, i) => {
        return (
          <span
            className="absolute left-1/2 top-1/2 min-w-min"
            key={i}
            style={
              {
                "--index": `${i}`,
                transform: `translate(-50%, -50%) rotate(calc(var(--inner-angle) * var(--index))) translateY(var(--radius))`,
              } as CSSProperties
            }
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

export default CircularText;
