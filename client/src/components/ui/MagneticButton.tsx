import { useEffect, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
}

export default function MagneticButton({ children, className }: MagneticButtonProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 200, damping: 18 });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handle = () => setIsDesktop(mq.matches);
    handle();
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  if (!isDesktop) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      style={{ scale: springScale, transformOrigin: "center" }}
      onMouseEnter={() => scale.set(1.04)}
      onMouseLeave={() => scale.set(1)}
      className={className}
    >
      {children}
    </motion.div>
  );
}
