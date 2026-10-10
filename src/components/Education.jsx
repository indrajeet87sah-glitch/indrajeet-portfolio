// src/components/Education.jsx
import React from "react";
import { motion } from "framer-motion";
import { educationData } from "../data/educationData";

export default function Education() {
  return (
    <section className="w-full py-20 relative bg-slate-950/60 border-y border-white/5" id="education">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col space-y-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-2 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 text-[#38bdf8] font-mono text-xs uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>FOUNDATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Education & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#c084fc]">Qualifications</span>
          </h2>
        </motion.div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 rounded-2xl bg-slate-900 border border-white/10 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#38bdf8]/40 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="space-y-2">
                <span className={`px-3 py-1 rounded-full font-mono text-xs font-semibold inline-block ${item.badgeColor}`}>
                  {item.year}
                </span>
                <h3 className="text-xl text-white font-bold">{item.title}</h3>
                <p className="text-slate-300 text-sm">{item.institution}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-white/5">
                <span className={`material-symbols-outlined text-[18px] ${item.iconColor}`}>
                  {item.icon}
                </span>
                {item.certificate}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}