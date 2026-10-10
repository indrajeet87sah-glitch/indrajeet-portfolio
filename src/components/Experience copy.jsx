import React from "react";

export default function Experience() {
  return (
    <section className="w-full py-20 relative bg-slate-950/70 border-y border-white/5" id="experience">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col space-y-12">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[#38bdf8] font-mono text-xs uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>
            CAREER JOURNEY
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">14+ Years of Building for the Web</h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">Proven history of front-end leadership and consistent high-quality delivery across agencies and global clients.</p>
        </div>

        <div className="relative pl-6 md:pl-10 space-y-10">
          <div className="absolute left-2.5 md:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#38bdf8] via-purple-600 to-slate-700"></div>

          {/* Role 1 */}
          <div className="relative group">
            <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.6)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-ping"></span>
              <span className="absolute w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-white/10 shadow-xl hover:border-[#38bdf8]/40 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] text-xs font-mono font-semibold uppercase tracking-wider mb-2">CURRENT ROLE</span>
                  <h3 className="text-2xl text-white font-bold">Front End Developer</h3>
                  <div className="text-lg text-sky-400 font-semibold">RedReefPixel</div>
                </div>
                <div className="text-left md:text-right text-sm text-slate-300">
                  <div className="font-semibold text-white flex items-center md:justify-end gap-1.5 font-mono">
                    <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">calendar_today</span>January 2020 – Present
                  </div>
                  <div className="flex items-center md:justify-end gap-1.5 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>Kolkata, India
                  </div>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-slate-200 text-sm md:text-base">
                {["Lead front-end development for responsive websites and custom web applications.",
                  "Designed and implemented intuitive UI solutions for web and desktop platforms.",
                  "Transformed creative concepts into scalable, high-performance digital products.",
                  "Delivered corporate websites, web portals, and brand identity assets for international clients.",
                  "Ensured cross-browser compatibility, performance optimization, and modern web standards."].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#38bdf8] text-[20px] mt-0.5">check_circle</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Role 2 */}
          <div className="relative group">
            <div className="absolute -left-[30px] md:-left-[38px] top-1.5 w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.5)]">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-white/10 shadow-xl hover:border-purple-400/40 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">8 YEARS OF TENURE</span>
                  <h3 className="text-2xl text-white font-bold">Front End Developer</h3>
                  <div className="text-lg text-purple-300 font-semibold">Dream Computer</div>
                </div>
                <div className="text-left md:text-right text-sm text-slate-300">
                  <div className="font-semibold text-white flex items-center md:justify-end gap-1.5 font-mono">
                    <span className="material-symbols-outlined text-[16px] text-purple-400">calendar_today</span>July 2012 – January 2020
                  </div>
                  <div className="flex items-center md:justify-end gap-1.5 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>Kolkata, India
                  </div>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-slate-200 text-sm md:text-base">
                {["Developed and maintained responsive websites, web portals, and custom applications.",
                  "Designed intuitive interfaces for web and desktop environments.",
                  "Translated design concepts into clean, efficient, and scalable front-end code.",
                  "Delivered corporate identity designs and branding assets for clients.",
                  "Coordinated with stakeholders to meet project requirements and quality standards."].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-purple-400 text-[20px] mt-0.5">check_circle</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}