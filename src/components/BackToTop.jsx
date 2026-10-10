// src/components/BackToTop.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 350px se niche scroll hone par button show hoga
      if (window.scrollY > 350) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#0b1120]/90 border border-white/10 text-[#38bdf8] hover:text-white hover:bg-[#38bdf8] hover:border-[#38bdf8] shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 group cursor-pointer"
          aria-label="Back to Top"
        >
          <span className="material-symbols-outlined text-[24px] group-hover:-translate-y-1 transition-transform duration-300">
            arrow_upward
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}