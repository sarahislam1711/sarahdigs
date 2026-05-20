import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "0% 50%",
      }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#6B1421] z-[9999] pointer-events-none"
    />
  );
}
