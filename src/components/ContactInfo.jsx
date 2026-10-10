// src/components/ContactInfo.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ContactInfo() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col w-full lg:w-[48%] space-y-6"
    >
      {/* Top Category Tag */}
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span>
        <span className="text-[12px] font-mono tracking-[0.2em] text-[#38bdf8] uppercase font-bold">
          LET'S CONNECT
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
        Have a Project in Mind?
      </h2>

      {/* Description */}
      <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
        Let's discuss how my front-end development experience can help bring your next digital project to life.
      </p>

      {/* Status Box */}
      <div className="flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-[#161c2d] border border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80] flex-shrink-0"></span>
        <span className="text-[14px] sm:text-[15px] font-bold text-slate-100">
          Available for full-time roles & consulting projects
        </span>
      </div>

      {/* Email Direct Card */}
      <a
        href="mailto:indrakumar2014.sah@gmail.com"
        className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#161c2d] border border-white/5 hover:border-white/10 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-[#243048] flex items-center justify-center text-[#72bbf6] flex-shrink-0">
          <span className="material-symbols-outlined text-[24px]">alternate_email</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
            EMAIL DIRECT
          </span>
          <span className="text-base font-bold text-white group-hover:text-[#72bbf6] transition-colors mt-0.5">
            indrakumar2014.sah@gmail.com
          </span>
        </div>
      </a>

      {/* Telephone Card */}
      <a
        href="tel:+917890330625"
        className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#161c2d] border border-white/5 hover:border-white/10 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-[#2a2444] flex items-center justify-center text-[#c084fc] flex-shrink-0">
          <span className="material-symbols-outlined text-[24px]">call</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
            TELEPHONE
          </span>
          <span className="text-base font-bold text-white group-hover:text-[#c084fc] transition-colors mt-0.5">
            +91-7890330625
          </span>
        </div>
      </a>
    </motion.div>
  );
}