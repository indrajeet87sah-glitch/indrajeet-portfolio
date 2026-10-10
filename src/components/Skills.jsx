import React from "react";
import { motion } from "framer-motion";
import { rowOneSkills, rowTwoSkills } from "../data/skillsData";

export default function Skills() {
  const topRow = [...rowOneSkills, ...rowOneSkills];
  const bottomRow = [...rowTwoSkills, ...rowTwoSkills];

  return (
    <section className="w-full py-24 lg:py-32 bg-[#060913] border-b border-white/5 overflow-hidden flex flex-col items-center relative" id="skills">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#38bdf8]/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ========================================= */}
      {/* HEADER SECTION (Scroll Fade-Up) */}
      {/* ========================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16 flex flex-col items-center text-center max-w-3xl px-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></span>
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#38bdf8] uppercase">Technical Expertise</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
          Technologies <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#c084fc]">I Work With</span>
        </h2>
        <p className="text-[13px] sm:text-[15px] text-slate-300 font-normal tracking-wide">
          Strictly mastery-driven tools and libraries powering 14+ years of commercial web delivery.
        </p>
      </motion.div>

      {/* ========================================= */}
      {/* DUAL SCROLLING ROWS (Smooth Reveal) */}
      {/* ========================================= */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full flex flex-col gap-5 sm:gap-6 max-w-[100vw] overflow-hidden"
      >
        
        {/* Fading Edges for Premium Look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-r from-[#060913] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-l from-[#060913] to-transparent z-10 pointer-events-none"></div>

        {/* Row 1: Moves Left */}
        <div className="flex w-max animate-scroll-left hover:[animation-play-state:paused]">
          {topRow.map((skill, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 px-5 py-3 sm:px-6 sm:py-4 mx-2.5 rounded-xl sm:rounded-2xl bg-[#0b1120]/60 border border-white/5 backdrop-blur-md transition-all hover:bg-[#0f172a] hover:border-white/20 min-w-[240px] sm:min-w-[280px] group cursor-default shadow-lg"
            >
              {/* Colored Icon - ALWAYS VISIBLE */}
              <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border ${skill.bg} ${skill.color} ${skill.border} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner`}>
                <span className="material-symbols-outlined text-[20px] sm:text-[24px]">{skill.icon}</span>
              </div>
              
              {/* Highly Visible Text */}
              <div className="flex flex-col">
                <h4 className="text-[15px] sm:text-[16px] font-extrabold text-white tracking-wide transition-colors">{skill.title}</h4>
                <p className="text-[12px] sm:text-[13px] text-slate-300 font-medium mt-0.5">{skill.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Moves Right */}
        <div className="flex w-max animate-scroll-right hover:[animation-play-state:paused]">
          {bottomRow.map((skill, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 px-5 py-3 sm:px-6 sm:py-4 mx-2.5 rounded-xl sm:rounded-2xl bg-[#0b1120]/60 border border-white/5 backdrop-blur-md transition-all hover:bg-[#0f172a] hover:border-white/20 min-w-[240px] sm:min-w-[280px] group cursor-default shadow-lg"
            >
              {/* Colored Icon - ALWAYS VISIBLE */}
              <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border ${skill.bg} ${skill.color} ${skill.border} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner`}>
                <span className="material-symbols-outlined text-[20px] sm:text-[24px]">{skill.icon}</span>
              </div>
              
              {/* Highly Visible Text */}
              <div className="flex flex-col">
                <h4 className="text-[15px] sm:text-[16px] font-extrabold text-white tracking-wide transition-colors">{skill.title}</h4>
                <p className="text-[12px] sm:text-[13px] text-slate-300 font-medium mt-0.5">{skill.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

      </motion.div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 35s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 35s linear infinite;
        }
      `}</style>
    </section>
  );
}