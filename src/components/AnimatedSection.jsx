// src/components/AnimatedSection.jsx
import React from "react";
import { motion } from "framer-motion";

export default function AnimatedSection({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Page load ya screen se bahar hone par niche aur invisible
      whileInView={{ opacity: 1, y: 0 }} // Jab user scroll karke section par aaye to reveal ho
      viewport={{ once: true, amount: 0.15 }} // "once: true" ka matlab animate sirf ek baar hoga aur flickr nahi karega
      transition={{
        duration: 0.7,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1], // Smooth cinematic cubic bezier curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}