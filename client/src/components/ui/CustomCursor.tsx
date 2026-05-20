import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const OXBLOOD = "#6B1421";
const OXBLOOD_RGBA = "107, 20, 33";
const HOVER_SELECTOR = "a, button, [role='button'], .tag";

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const ringX = useSpring(dotX, { damping: 20, stiffness: 150 });
  const ringY = useSpring(dotY, { damping: 20, stiffness: 150 });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = () => setIsDesktop(mq.matches);
    handleChange();
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    const handleMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target && target.closest(HOVER_SELECTOR)) {
        setIsHovering(true);
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target && target.closest(HOVER_SELECTOR)) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      document.body.style.cursor = previousCursor;
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [isDesktop, dotX, dotY]);

  if (!isDesktop) return null;

  return (
    <>
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: OXBLOOD,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[5px] w-[5px] rounded-full"
      />
      <motion.div
        animate={{
          scale: isHovering ? 1.6 : 1,
          backgroundColor: isHovering
            ? `rgba(${OXBLOOD_RGBA}, 0.12)`
            : `rgba(${OXBLOOD_RGBA}, 0)`,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: OXBLOOD,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[32px] w-[32px] rounded-full border"
      />
    </>
  );
}
