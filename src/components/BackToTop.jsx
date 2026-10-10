// src/components/BackToTop.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [showButton, setShowButton] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); 

  useEffect(() => {
    const handleChatState = (e) => {
      setIsChatOpen(e.detail);
    };
    
    window.addEventListener("chatStateChange", handleChatState);
    return () => window.removeEventListener("chatStateChange", handleChatState);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      // Height wahi rakhi hai jo pehle thi
      const scrollThreshold = isMobile ? 1200 : 350;

      if (window.scrollY > scrollThreshold) {
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
      {/* Jab Chat open hoga to yeh hide ho jayega */}
      {showButton && !isChatOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          // Yahan position change karke bottom-[85px] aur bottom-[95px] (Chatbot ke upar) set ki hai
          className="fixed bottom-[85px] right-5 sm:bottom-[95px] sm:right-6 z-40 w-14 h-14 sm:w-14 sm:h-14 rounded-full bg-[#0b1120]/90 border border-white/10 text-[#38bdf8] hover:text-white hover:bg-[#38bdf8] hover:border-[#38bdf8] shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] backdrop-blur-xl flex items-center justify-center transition-all duration-300 group cursor-pointer"
          aria-label="Back to Top"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[24px] group-hover:-translate-y-1 transition-transform duration-300">
            arrow_upward
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}