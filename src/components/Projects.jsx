// src/components/Projects.jsx

import React, { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { PROJECTS_DATA, EXTENDED_CLIENT_PROJECTS } from "../data/projectsData";

export default function Projects() {

  const tabs = [

    { id: "all", label: "All Projects" },

    { id: "tech", label: "Tech & Consulting" },

    { id: "dental", label: "Healthcare & Dental" },

    { id: "services", label: "Commercial Services" }

  ];

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [showExtended, setShowExtended] = useState(false);
  const highlightAnimationRef = useRef(null);
  const focusTimerRef = useRef(null);

  // Listen for navigation requests from AIChatBot.jsx.
  // Switch to All Projects first, so a filtered-out card becomes visible.
  useEffect(() => {
    const focusProject = (event) => {
      const id = Number(event.detail?.projectId);
      if (!PROJECTS_DATA.some((project) => project.id === id)) return;

      setActiveTabIndex(0);
      window.clearTimeout(focusTimerRef.current);

      focusTimerRef.current = window.setTimeout(() => {
        const card = document.getElementById(`project-${id}`);
        if (!card) return;

        card.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'center'
        });

        highlightAnimationRef.current?.cancel();
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        highlightAnimationRef.current = card.animate([
          { boxShadow: '0 0 0px rgba(56,189,248,0)', outline: '2px solid transparent' },
          { boxShadow: '0 0 45px rgba(56,189,248,0.75)', outline: '2px solid #38bdf8' },
          { boxShadow: '0 0 0px rgba(56,189,248,0)', outline: '2px solid transparent' }
        ], { duration: 2600, easing: 'ease-in-out', iterations: 1 });
      }, 180);
    };

    window.addEventListener('portfolio:focus-project', focusProject);
    return () => {
      window.removeEventListener('portfolio:focus-project', focusProject);
      window.clearTimeout(focusTimerRef.current);
      highlightAnimationRef.current?.cancel();
    };
  }, []);

  const activeTab = tabs[activeTabIndex].id;

  const handlePrevTab = () => {

    setActiveTabIndex((prev) => (prev === 0 ? tabs.length - 1 : prev - 1));

  };

  const handleNextTab = () => {

    setActiveTabIndex((prev) => (prev === tabs.length - 1 ? 0 : prev + 1));

  };

  const filteredProjects = PROJECTS_DATA.filter((project) => {

    if (activeTab === "all") return true;

    return project.category === activeTab;

  });

  return (

    <section className="w-full py-24 lg:py-32 relative bg-[#060913] border-b border-white/5 overflow-hidden" id="projects">

      {/* Background Glows */}

      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#38bdf8]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-purple-700/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col">

        {/* Section Header with Scroll Fade-In */}

        <motion.div 

          initial={{ opacity: 0, y: 35 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true, amount: 0.2 }}

          transition={{ duration: 0.6 }}

          className="flex flex-col items-center text-center space-y-5 mb-16"

        >

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-xl">

            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_10px_#38bdf8]"></span>

            <span className="text-[11px] font-mono font-bold tracking-widest text-[#38bdf8] uppercase">Showcase</span>

          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">

            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#c084fc]">Works</span>

          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal tracking-wide max-w-2xl mx-auto">

            A curated selection of robust web applications, commercial portals, and client-facing digital experiences built with modern UI frameworks and pixel-perfect precision.

          </p>

        </motion.div>

        {/* Tabs Bar with Delay Fade-In */}

        <motion.div

          initial={{ opacity: 0, scale: 0.95 }}

          whileInView={{ opacity: 1, scale: 1 }}

          viewport={{ once: true, amount: 0.2 }}

          transition={{ duration: 0.5, delay: 0.15 }}

        >

          {/* Mobile View Slider */}

          <div className="flex sm:hidden items-center justify-center gap-4 mb-12 w-full max-w-xs mx-auto px-2">

            <button

              onClick={handlePrevTab}

              className="w-10 h-10 flex-shrink-0 rounded-full bg-[#0b1120] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:border-[#38bdf8]/50"

            >

              <span className="material-symbols-outlined text-[20px]">chevron_left</span>

            </button>

            <div className="flex-1 overflow-hidden relative">

              <div 

                className="flex transition-transform duration-300 ease-in-out"

                style={{ transform: `translateX(-${activeTabIndex * 100}%)` }}

              >

                {tabs.map((tab) => (

                  <div key={tab.id} className="w-full min-w-full flex-shrink-0 px-1 flex justify-center">

                    <button className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#38bdf8] to-[#c084fc] text-white font-bold text-sm tracking-wide shadow-[0_0_18px_rgba(56,189,248,0.3)] text-center truncate border border-white/10">

                      {tab.label}

                    </button>

                  </div>

                ))}

              </div>

            </div>

            <button

              onClick={handleNextTab}

              className="w-10 h-10 flex-shrink-0 rounded-full bg-[#0b1120] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:border-[#38bdf8]/50"

            >

              <span className="material-symbols-outlined text-[20px]">chevron_right</span>

            </button>

          </div>

          {/* Desktop View Tabs */}

          <div className="hidden sm:flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 p-2 rounded-full bg-[#0b1120]/80 border border-white/5 backdrop-blur-md w-fit mx-auto shadow-lg">

            {tabs.map((tab, idx) => (

              <button

                key={tab.id}

                onClick={() => setActiveTabIndex(idx)}

                className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${

                  activeTabIndex === idx

                    ? "bg-gradient-to-r from-[#38bdf8] to-[#c084fc] text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]"

                    : "text-slate-400 hover:text-white hover:bg-white/5"

                }`}

              >

                {tab.label}

              </button>

            ))}

          </div>

        </motion.div>

        {/* Project Cards Grid (Har card step-by-step stagger karke aayega) */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">

          {filteredProjects.map((project, index) => (

            <motion.div

              key={project.id}
                id={`project-${project.id}`}
                data-project-id={project.id}
                data-project-title={project.title}

              initial={{ opacity: 0, y: 40 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true, amount: 0.15 }}

              transition={{ duration: 0.5, delay: (index % 3) * 0.15 }} // Step-by-step delay (0s, 0.15s, 0.3s)

              className={`group relative w-full scroll-mt-28 rounded-[28px] bg-[#0b1120]/80 border ${project.isPrimaryBorder ? 'border-[#38bdf8]/40 shadow-[0_0_30px_rgba(56,189,248,0.1)]' : 'border-white/10'} backdrop-blur-xl p-2 hover:bg-[#0f172a]/90 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] hover:border-[#38bdf8]/50 flex flex-col`}

            >

              {/* Card Header Container */}

              <div className="relative w-full h-[200px] rounded-[22px] bg-gradient-to-br from-slate-800/40 to-slate-950/80 border border-white/5 flex flex-col items-center justify-center overflow-hidden">

                <div className="absolute top-4 left-4 flex gap-2 z-20">

                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>

                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>

                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>

                </div>

                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 border border-white/5 backdrop-blur-md z-20">

                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">{project.domain}</span>

                </div>

                <div className="relative z-10 w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#38bdf8]/30 group-hover:bg-[#38bdf8]/10 transition-colors duration-500 shadow-xl">

                  <span className="material-symbols-outlined text-[42px] text-slate-300 group-hover:text-[#38bdf8] transition-colors duration-500">

                    {project.icon}

                  </span>

                </div>

              </div>

              {/* Content Section */}

              <div className="p-6 flex flex-col flex-grow relative z-10">

                <div className="flex items-center gap-2.5 mb-4">

                  <span className="px-2.5 py-1 rounded-[6px] text-[10px] uppercase tracking-widest bg-gradient-to-r from-[#38bdf8]/10 to-[#c084fc]/10 text-[#38bdf8] font-bold border border-[#38bdf8]/20">

                    {project.category}

                  </span>

                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-[#38bdf8] transition-colors duration-300">

                  {project.title}

                </h3>

                <p className="mt-3 text-[15px] text-slate-300 leading-relaxed font-normal tracking-wide line-clamp-3">

                  {project.description}

                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">

                  <div className="flex flex-wrap items-center gap-2">

                    {project.tech.map((techItem, idx) => (

                      <span key={idx} className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-slate-800/60 border border-white/5 text-slate-300">

                        {techItem}

                      </span>

                    ))}

                  </div>

                  <a

                    href={project.link}

                    target="_blank"

                    rel="noreferrer"

                    className="flex items-center justify-center w-10 h-10 min-w-[40px] rounded-full bg-white/5 hover:bg-[#38bdf8] text-slate-400 hover:text-slate-950 transition-colors duration-300 border border-white/5 hover:border-[#38bdf8]"

                  >

                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>

                  </a>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

        {/* Explore Archive Button */}

        <motion.div 

          initial={{ opacity: 0, y: 30 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.5, delay: 0.2 }}

          className="flex justify-center mt-16 pt-10 border-t border-white/10"

        >

          <button

            onClick={() => setShowExtended(!showExtended)}

            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0b1120] border border-[#38bdf8]/30 hover:border-[#38bdf8] hover:bg-[#38bdf8]/10 transition-all duration-500 text-slate-300 hover:text-white font-bold tracking-wide shadow-lg"

          >

            <span className="relative z-10 material-symbols-outlined text-[#38bdf8]">

              {showExtended ? "folder_off" : "folder_open"}

            </span>

            <span className="relative z-10">

              {showExtended ? "Hide Extended Archive" : "Explore Extended Archive"}

            </span>

            <span className={`relative z-10 material-symbols-outlined text-slate-500 transition-transform duration-500 ${showExtended ? "rotate-180" : ""}`}>

              expand_more

            </span>

          </button>

        </motion.div>

        {/* Extended Directory List with AnimatePresence */}

        <AnimatePresence>

          {showExtended && (

            <motion.div 

              initial={{ opacity: 0, height: 0 }}

              animate={{ opacity: 1, height: "auto" }}

              exit={{ opacity: 0, height: 0 }}

              transition={{ duration: 0.4 }}

              className="mt-12 flex flex-col gap-3 max-w-5xl mx-auto w-full overflow-hidden"

            >

              {EXTENDED_CLIENT_PROJECTS.map((ext, idx) => (

                <motion.a 

                  initial={{ opacity: 0, x: -20 }}

                  animate={{ opacity: 1, x: 0 }}

                  transition={{ delay: idx * 0.05 }}

                  href={ext.link} 

                  target="_blank" 

                  rel="noreferrer"

                  key={idx}

                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0b1120]/40 border border-white/5 hover:bg-[#0f172a]/90 hover:border-[#38bdf8]/40 transition-all duration-300"

                >

                  <div className="flex items-center gap-5">

                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#38bdf8]/10 group-hover:text-[#38bdf8] transition-colors">

                      <span className="material-symbols-outlined text-[24px]">{ext.icon}</span>

                    </div>

                    <div>

                      <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors">{ext.name}</h4>

                      <p className="text-[13px] text-slate-400 font-normal mt-0.5">{ext.desc}</p>

                    </div>

                  </div>

                  <div className="hidden sm:flex items-center gap-8">

                    <span className="text-xs font-mono font-semibold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">

                      {ext.tech}

                    </span>

                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#38bdf8] transition-colors">

                      <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-950">arrow_forward</span>

                    </div>

                  </div>

                </motion.a>

              ))}

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </section>

  );

}