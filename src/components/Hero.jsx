// src/components/Hero.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import profileImg from '../assets/profile.jpg';

export default function Hero() {
  const [typewriterText, setTypewriterText] = useState("");

  useEffect(() => {
    const phrases = ["Front-End Developer", "UI/UX Designer", "React Developer"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer;

    const tick = () => {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        setTypewriterText(current.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypewriterText(current.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? 45 : 95;

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        speed = 1800;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
      }
      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full py-16 lg:py-36 relative flex items-center border-b border-white/5 overflow-hidden" id="hero">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Right Column (Image & Floating Badges): Mobile: 1st, Desktop: 2nd */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 order-1 lg:order-2 relative flex items-center justify-center pt-6 lg:pt-0"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-[#38bdf8]/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

          {/* Main Portrait Frame */}
          <div className="relative w-64 sm:w-80 lg:w-96 h-[380px] sm:h-[450px] lg:h-[500px] p-[2px] rounded-3xl bg-gradient-to-b from-white/25 via-white/10 to-transparent shadow-2xl group">

            {/* Corner Accents */}
            <div className="absolute -top-2.5 -left-2.5 w-6 h-6 border-t-2 border-l-2 border-[#38bdf8]/70 rounded-tl-xl pointer-events-none z-20"></div>
            <div className="absolute -bottom-2.5 -right-2.5 w-6 h-6 border-b-2 border-r-2 border-purple-400/70 rounded-br-xl pointer-events-none z-20"></div>

            <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 relative flex flex-col justify-end">
              <img
                alt="Indrajeet Kumar Sah"
                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                src={profileImg}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-[22px]"></div>
            </div>
          </div>

          {/* ========================================= */}
          {/* FLOATING BADGES (Animated Entrance) */}
          {/* ========================================= */}

          {/* React.js Learning Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-2 -left-4 sm:top-6 sm:-left-8 px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-md shadow-2xl flex items-center gap-2 border border-purple-500/30 z-25 animate-bounce"
            style={{ animationDuration: '4s' }}
          >
            <span className="material-symbols-outlined text-purple-400 text-[20px]">school</span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-white">React.js</span>
              <span className="text-[10px] font-mono text-purple-300">Learning</span>
            </div>
          </motion.div>

          {/* JavaScript Badge */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute top-1/3 -right-4 sm:-right-8 px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-md shadow-2xl flex items-center gap-2 border border-[#38bdf8]/30 z-25 animate-bounce"
            style={{ animationDuration: '5s' }}
          >
            <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">code</span>
            <span className="text-xs font-semibold text-white">JavaScript</span>
          </motion.div>

          {/* CSS3 / Tailwind Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute bottom-20 -left-4 sm:bottom-24 sm:-left-8 px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-md shadow-2xl flex items-center gap-2 border border-purple-500/30 z-25 animate-bounce"
            style={{ animationDuration: '4.5s' }}
          >
            <span className="material-symbols-outlined text-purple-400 text-[20px]">palette</span>
            <span className="text-xs font-semibold text-white">Tailwind CSS</span>
          </motion.div>

          {/* Experience Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -bottom-6 sm:-bottom-8 px-5 py-3 rounded-2xl bg-slate-950/95 backdrop-blur-xl shadow-2xl flex items-center gap-3 border border-white/15 z-25"
          >
            <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/15 flex items-center justify-center text-[#38bdf8]">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div>
              <div className="text-lg text-[#38bdf8] font-bold leading-none font-mono">Frontend</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-medium mt-0.5">UI/UX & Web Dev</div>
            </div>
          </motion.div>

        </motion.div>

        {/* Left Column (Content): Mobile: 2nd, Desktop: 1st */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 order-2 lg:order-1 flex flex-col space-y-6 sm:space-y-8"
        >
          {/* Status pill tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-800/80 border border-white/10 backdrop-blur-md w-fit shadow-md"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#38bdf8]"></span>
            </span>
            <span className="text-xs font-mono font-semibold tracking-widest text-[#38bdf8]">HELLO, I AM</span>
          </motion.div>

          {/* Heading & Typewriter Role */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Indrajeet Kumar Sah
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xl sm:text-3xl font-semibold text-[#38bdf8] min-h-[45px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#c084fc]">
                {typewriterText}
              </span>
              <span className="w-1 h-6 sm:h-9 bg-[#38bdf8] animate-pulse inline-block"></span>
              <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse self-center"></span> React.js • Learning
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
            Building modern, responsive, and high-performance digital experiences with clean front-end code and user-focused UI/UX design.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <a
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold text-slate-950 bg-[#38bdf8] hover:bg-[#7dd3fc] active:scale-95 transition-all shadow-[0_0_25px_rgba(56,189,248,0.45)] cursor-pointer"
              href="#projects"
            >
              View My Work
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </a>
            <a
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 active:scale-95 transition-all shadow-md cursor-pointer"
              href="#contact"
            >
              Get in Touch
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </a>
          </div>

          {/* Contact Info Badges */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-center gap-3 pt-2">
            <a className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-white/5 text-slate-300 hover:text-[#38bdf8] transition-colors text-xs sm:text-sm shadow-sm" href="mailto:indrakumar2014.sah@gmail.com">
              <span className="material-symbols-outlined text-[#38bdf8] text-[18px]">email</span>
              <span>indrakumar2014.sah@gmail.com</span>
            </a>
            <a className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-white/5 text-slate-300 hover:text-[#38bdf8] transition-colors text-xs sm:text-sm shadow-sm" href="tel:+917890330625">
              <span className="material-symbols-outlined text-[#38bdf8] text-[18px]">phone</span>
              <span>+91-7890330625</span>
            </a>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-white/5 text-slate-300 text-xs sm:text-sm shadow-sm">
              <span className="material-symbols-outlined text-[#38bdf8] text-[18px]">location_on</span>
              <span>West Bengal, India</span>
            </span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}