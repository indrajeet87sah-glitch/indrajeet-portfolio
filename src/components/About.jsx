import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { aboutHighlights } from "../data/aboutHighlights";

export default function About() {
  // Simulator for a live terminal building/testing environment
  const [compilingStatus, setCompilingStatus] = useState("Build Successful");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCompilingStatus("Compiling assets...");
      setTimeout(() => {
        setCompilingStatus("Build Successful");
      }, 1500);
    }, 12000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-24 lg:py-22 relative bg-[#060913] border-b border-white/5 overflow-hidden" id="about">
      
      {/* Background Animated Atmosphere */}
      <div className="absolute top-10 left-1/4 w-[450px] h-[450px] bg-[#38bdf8]/5 rounded-full blur-[130px] animate-pulse pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-purple-700/5 rounded-full blur-[130px] animate-pulse pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col space-y-16">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start space-y-5 w-full lg:max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-ping"></span>
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#38bdf8] uppercase">About Me</span>
          </div>
          
          <h2 className="text-[32px] sm:text-5xl md:text-[50px] lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Turning Ideas Into
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#c084fc] drop-shadow-[0_0_15px_rgba(56,189,248,0.2)] md:whitespace-nowrap">
              Exceptional Web Experiences
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal tracking-wide max-w-4xl pt-2">
            Experienced Front-End Developer with 14+ years of expertise in building modern, responsive, and high-performance websites. Strong foundation in core web technologies combined with a continuous drive to adopt modern UI frameworks. Proven ability to convert creative concepts into scalable, user-focused digital solutions.
          </p>
        </motion.div>

        {/* 2-Column Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-stretch justify-between mt-6 w-full">
          
          {/* ========================================= */}
          {/* ANIMATED MAC TERMINAL (Left Slide-in) */}
          {/* ========================================= */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[55%] flex flex-col"
          >
            <div className="flex-grow rounded-[20px] bg-[#090d16]/95 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-3xl overflow-hidden flex flex-col hover:border-[#38bdf8]/35 transition-all duration-500 group/term">
              
              {/* Terminal Title Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 bg-[#0a0f1c] border-b border-white/5 select-none relative gap-2 sm:gap-0">
                <div className="flex gap-2 self-start sm:self-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:shadow-[0_0_8px_#ff5f56] transition-all"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:shadow-[0_0_8px_#ffbd2e] transition-all"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:shadow-[0_0_8px_#27c93f] transition-all"></div>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                  <span className="material-symbols-outlined text-[14px] text-purple-400 animate-spin">data_object</span>
                  DeveloperProfile.jsx
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500 font-mono tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">terminal</span>
                  ES6 Modules
                </div>
              </div>

              {/* Code Workspace */}
              <div className="p-4 sm:p-8 font-mono text-[11.5px] sm:text-[14.5px] leading-relaxed text-slate-300 overflow-x-auto flex-grow bg-radial-at-t from-[#0a1020] to-[#080d16]">
                <div className="space-y-1">
                  
                  {/* Imports */}
                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">01</span>
                    <p><span className="text-[#f43f5e]">import</span> &#123; <span className="text-purple-400">WebEngineer</span> &#125; <span className="text-[#f43f5e]">from</span> <span className="text-emerald-400">'frontend-core'</span>;</p>
                  </div>
                  
                  {/* Comments */}
                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">02</span>
                    <p className="text-slate-500 font-italic">// 14+ Years HTML/CSS/JS • Actively building with React & Tailwind</p>
                  </div>

                  {/* Component Declaration */}
                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">03</span>
                    <p><span className="text-[#f43f5e]">export const</span> <span className="text-[#38bdf8] font-bold">IndrajeetProfile</span> = () =&gt; &#123;</p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">04</span>
                    <p></p>
                  </div>

                  {/* Core Foundation */}
                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-1 rounded transition-colors bg-[#38bdf8]/5 group/ln relative">
                    <span className="text-[#38bdf8] select-none pr-1">05</span>
                    <p className="pl-2 sm:pl-4 text-slate-200">
                      <span className="text-[#f43f5e]">const</span> <span className="text-[#c084fc] font-bold">coreFoundation</span> = [
                      <span className="text-emerald-400">'HTML5'</span>, 
                      <span className="text-emerald-400">'CSS3'</span>, 
                      <span className="text-emerald-400">'JavaScript'</span>
                      ];
                    </p>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping"></div>
                  </div>

                  {/* Modern Focus */}
                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-1 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">06</span>
                    <p className="pl-2 sm:pl-4">
                      <span className="text-[#f43f5e]">const</span> <span className="text-[#c084fc] font-bold">modernFocus</span> = [
                      <span className="text-emerald-400">'React.js'</span>, 
                      <span className="text-emerald-400">'Tailwind CSS'</span>
                      ];
                    </p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">07</span>
                    <p></p>
                  </div>

                  {/* Metrics */}
                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">08</span>
                    <p className="pl-2 sm:pl-4"><span className="text-[#f43f5e]">const</span> <span className="text-purple-300">careerMetrics</span> = &#123;</p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-purple-500/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-purple-400 select-none pr-1">09</span>
                    <p className="pl-4 sm:pl-8"><span className="text-[#c084fc]">totalExperience</span>: <span className="text-amber-400 font-bold">'14+ Years'</span>,</p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">10</span>
                    <p className="pl-4 sm:pl-8"><span className="text-[#c084fc]">specialization</span>: <span className="text-emerald-400">'Responsive UI Design'</span>,</p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">11</span>
                    <p className="pl-4 sm:pl-8"><span className="text-[#c084fc]">status</span>: <span className="text-emerald-400">'Continuous Learner'</span></p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">12</span>
                    <p className="pl-2 sm:pl-4">&#125;;</p>
                  </div>

                  {/* Return logic */}
                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">13</span>
                    <p></p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">14</span>
                    <p className="pl-2 sm:pl-4"><span className="text-[#f43f5e]">return</span> (</p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-1 rounded transition-colors group/ln bg-slate-800/10 border-l border-[#c084fc]">
                    <span className="text-slate-600 select-none pr-1">15</span>
                    <p className="pl-4 sm:pl-8 text-slate-100">
                      &lt;<span className="text-[#38bdf8] font-bold">WebEngineer</span> data=&#123;<span className="text-purple-300">careerMetrics</span>&#125; stack=&#123;<span className="text-purple-300">coreFoundation</span>&#125; focus=&#123;<span className="text-purple-300">modernFocus</span>&#125; /&gt;
                    </p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">16</span>
                    <p className="pl-2 sm:pl-4">);</p>
                  </div>

                  <div className="flex gap-2.5 hover:bg-white/5 px-2 py-0.5 rounded transition-colors group/ln">
                    <span className="text-slate-600 select-none pr-1">17</span>
                    <p>&#125;;<span className="inline-block w-[8px] h-4 ml-0.5 bg-cyan-400 animate-[blink_1.1s_steps(2)_infinite] align-middle"></span></p>
                  </div>

                </div>
              </div>

              {/* Status footer with simulation compiler feedback */}
              <div className="px-4 sm:px-5 py-3 bg-[#080c14] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${compilingStatus.includes('Successful') ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 animate-ping'} transition-colors duration-500`}></span>
                  <p>System Status: <span className={`${compilingStatus.includes('Successful') ? 'text-emerald-400 font-bold' : 'text-amber-300'}`}>{compilingStatus}</span></p>
                </div>
                <div>UTF-8</div>
              </div>

            </div>
          </motion.div>

          {/* ========================================= */}
          {/* HIGH-IMPACT EXTRAS/HIGHLIGHTS (Right Stagger) */}
          {/* ========================================= */}
          <div className="w-full lg:w-[45%] flex flex-col justify-between gap-6 relative">
            
            {/* Fine path Line linking cards */}
            <div className="absolute left-[24px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-blue-500/10 via-purple-500/15 to-emerald-500/10 pointer-events-none rounded-full"></div>

            {aboutHighlights.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative flex items-start gap-4 p-5 rounded-2xl bg-[#0b1120]/60 border border-white/5 backdrop-blur-3xl hover:bg-[#0f172a]/90 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden z-10 ${item.glow}`}
              >
                {/* Visual trail link trace element inside card */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#38bdf8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Floating highlight aura on hovering */}
                <div className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full bg-white/2 opacity-0 group-hover:opacity-100 blur-[30px] pointer-events-none transition-opacity duration-700"></div>

                {/* Cyber-Bullet Metrical Indicator / Icons */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br border flex items-center justify-center transition-all duration-500 shadow-md transform group-hover:scale-110 group-hover:rotate-3 ${item.color}`}>
                  <span className="material-symbols-outlined text-[24px] tracking-normal select-none">{item.icon}</span>
                </div>

                <div className="flex-grow">
                  <h4 className="text-lg font-extrabold text-white group-hover:text-[#38bdf8] transition-colors duration-300 tracking-wide leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-slate-350 text-[13px] sm:text-[14.5px] leading-relaxed font-normal tracking-wide mt-2">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>

        </div>

      </div>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}