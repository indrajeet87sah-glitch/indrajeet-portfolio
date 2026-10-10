// src/components/ScrollProgress.jsx
import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  // Smooth buttery-spring motion ke liye
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] origin-left z-[9999] shadow-[0_0_12px_rgba(56,189,248,0.8)]"
    />
  );
}