import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeIn" } }}
      style={{ position: "relative" }}
    >
      {children}
    </motion.div>
  );
}
