import React from "react";
import { motion } from "framer-motion";
import { experiences } from "../data/experienceData";

export default function Experience() {
  return (
    <section className="w-full py-20 lg:py-28 relative bg-[#0b0f19]/60 backdrop-blur-md border-b border-white/5" id="experience">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col space-y-16">
        
        {/* Section Header with Scroll Fade-In */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-white/10 backdrop-blur-md shadow-xl hover:scale-105 transition-transform duration-300">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#38bdf8] to-purple-500 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold tracking-widest text-slate-300 uppercase">Career Journey</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#c084fc]">Experience</span>
          </h2>
        </motion.div>

        {/* ========================================= */}
        {/* CENTER-ALIGNED WIDE TIMELINE */}
        {/* ========================================= */}
        <div className="relative w-full max-w-7xl mx-auto mt-10">
          
          {/* Main Center Line */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[4px] md:-translate-x-1/2 bg-slate-800/80 rounded-full shadow-inner overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-transparent via-[#38bdf8] to-transparent animate-pulse opacity-70"></div>
          </div>

          <div className="space-y-12 sm:space-y-16">
            {experiences.map((exp, index) => {
              const isLeftCard = index % 2 === 0;

              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-center justify-between w-full group ${isLeftCard ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Empty space - 47% width on desktop */}
                  <div className="hidden md:block w-[47%]"></div>

                  {/* Central Timeline Icon with Pop-up Animation */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "backOut" }}
                    className="absolute left-[24px] md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20"
                  >
                    <div className={`absolute inset-0 rounded-full blur-[10px] opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse ${exp.auraColor}`}></div>
                    
                    <div className={`relative flex items-center justify-center w-14 h-14 rounded-full border-[3px] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_20px_rgba(0,0,0,0.8)] ${exp.iconBg}`}>
                      <span className="material-symbols-outlined text-[26px]">{exp.icon}</span>
                    </div>
                  </motion.div>

                  {/* Experience Card Wrapper with Directional Slide-In */}
                  <motion.div 
                    initial={{ opacity: 0, x: isLeftCard ? 45 : -45 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full pl-[80px] md:pl-0 md:w-[47%] relative z-10"
                  >
                    
                    {/* 3D SCALING CONTAINER */}
                    <div className="relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
                      
                      {/* Directional Triangle Arrow (Desktop) */}
                      <div className={`hidden md:block absolute top-10 w-0 h-0 border-y-[12px] border-y-transparent transition-colors duration-500 z-20 ${
                        isLeftCard 
                          ? `-right-[11px] border-l-[12px] ${exp.arrowRight}` 
                          : `-left-[11px] border-r-[12px] ${exp.arrowLeft}`
                      }`}></div>

                      {/* Directional Triangle Arrow (Mobile) */}
                      <div className={`block md:hidden absolute top-10 -left-[11px] w-0 h-0 border-y-[12px] border-y-transparent border-r-[12px] transition-colors duration-500 z-20 ${exp.arrowLeft}`}></div>

                      {/* Card Content Box */}
                      <div className={`p-6 sm:p-8 rounded-[24px] bg-slate-900/80 border-t border-l border-white/5 border-b-2 border-r-2 border-black/40 backdrop-blur-2xl relative overflow-hidden ${exp.cardGlow}`}>
                        
                        {/* Inner Hover Glow */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-[50px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        
                        {/* Top Header Section */}
                        <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-5 gap-3 border-b border-white/10 pb-4 relative z-10">
                          <div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">{exp.title}</h3>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{exp.company_name}</p>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/5 text-[11px] sm:text-xs font-mono font-semibold text-slate-300 w-fit whitespace-nowrap shadow-inner flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${exp.auraColor}`}></span>
                            {exp.date}
                          </div>
                        </div>

                        {/* Custom Cyber-Bullet Points */}
                        <ul className="space-y-2.5 relative z-10">
                          {exp.points.map((point, i) => (
                            <li key={i} className="flex items-start text-sm sm:text-[15px] text-slate-300 leading-relaxed">
                              <span className={`mr-3 mt-1 text-[18px] leading-none ${exp.bulletColor}`}>▹</span>
                              <span className="font-normal">{point}</span>
                            </li>
                          ))}
                        </ul>

                      </div>
                    </div>

                  </motion.div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}