import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 py-10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
            <span className="text-lg text-[#38bdf8] font-bold">IK</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white">Indrajeet Kumar Sah</span>
            <span className="text-xs text-slate-400">Crafting high-scale cinematic web interfaces for 14+ years.</span>
          </div>
        </div>
        <div className="text-center md:text-right text-xs text-slate-400">
          <p>© 2025 Indrajeet Kumar Sah. All rights reserved.</p>
          <p className="mt-1 text-[#38bdf8] font-mono">System Node v14.2 // Active Telemetry</p>
        </div>
      </div>
    </footer>
  );
}