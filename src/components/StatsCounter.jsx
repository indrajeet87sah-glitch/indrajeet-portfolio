// src/components/StatsCounter.jsx
import React from "react";
import { motion } from "framer-motion";
import { STATS_DATA } from "../data/statsData";

export default function StatsCounter() {
  return (
    <section className="w-full pt-15 pb-15 relative bg-[#060913]/90">
      
      {/* Dynamic Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {STATS_DATA.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative p-6 rounded-[24px] bg-[#0b1120]/60 border border-white/5 backdrop-blur-3xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:border-white/20 transition-all duration-500 group hover:-translate-y-2 overflow-hidden flex flex-col justify-between"
            >
              
              {/* Premium Glow Aura Layer */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10`}
              />

              {/* Upper Section: Big Icon & Tiny pulsing Dot */}
              <div className="flex items-center justify-between mb-6">
                
                {/* Visual Glass Base for Giant Icons */}
                <div className={`w-14 h-14 rounded-2xl bg-[#141b2e]/80 flex items-center justify-center border border-white/5 group-hover:border-[#38bdf8]/30 group-hover:bg-[#1a253f] transition-all duration-500 shadow-lg ${item.iconColor} group-hover:scale-115`}>
                  <span className="material-symbols-outlined text-[34px] sm:text-[38px] drop-shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-transform duration-500 group-hover:rotate-6">
                    {item.icon}
                  </span>
                </div>
                
                {/* Decorative Status Dot */}
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#38bdf8] animate-pulse transition-colors duration-500"></span>
                </div>
              </div>

              {/* Center Content: Huge Text & Label */}
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono drop-shadow-md group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-350 transition-all">
                  {item.value}
                </div>

                <h4 className="text-base font-extrabold text-slate-100 mt-2 tracking-wide group-hover:text-[#38bdf8] transition-colors duration-300">
                  {item.label}
                </h4>

                <p className="text-[12px] text-slate-405 mt-1 leading-relaxed font-normal text-slate-400">
                  {item.subtext}
                </p>
              </div>

              {/* Aesthetic Card Edge line for Premium finish */}
              <div className="absolute left-0 bottom-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-[#38bdf8]/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}