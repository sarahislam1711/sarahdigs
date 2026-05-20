import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

type Tag = "h1" | "h2" | "h3" | "p";

interface TextRevealProps {
  text: string;
  className?: string;
  tag?: Tag;
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const word: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function TextReveal({
  text,
  className,
  tag = "h2",
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const MotionTag = motion[tag] as typeof motion.h2;
  const words = text.split(" ");

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span variants={word} className="inline-block">
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
