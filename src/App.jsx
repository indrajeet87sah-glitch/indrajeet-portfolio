// src/App.jsx
import React, { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StatsCounter from "./components/StatsCounter";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import AIChatBot from "./components/AIChatBot";

export default function App() {
  useEffect(() => {
    // Global Clean Smooth Scroll (Kisi bhi #link par click karne se URL mein #id nahi aayega)
    const handleCleanScroll = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    document.addEventListener("click", handleCleanScroll);
    return () => document.removeEventListener("click", handleCleanScroll);
  }, []);

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-screen relative overflow-hidden selection:bg-[#38bdf8] selection:text-[#0b0f19]">
      <ScrollProgress />
      <CustomCursor />

      {/* Optimized Background Ambience Layer (GPU Friendly) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-35"></div>
        <div className="absolute inset-0 bg-stars-pattern animate-twinkle opacity-60"></div>

        {/* Removed mix-blend-screen & reduced excessive blur radius to prevent GPU frame drops */}
        <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#38bdf8]/20 rounded-full blur-[110px] transform-gpu"></div>
        <div className="absolute top-[15%] right-[-5%] w-[500px] h-[500px] bg-[#c084fc]/20 rounded-full blur-[110px] transform-gpu"></div>
        <div className="absolute top-[55%] right-[10%] w-[450px] h-[450px] bg-[#00d4ff]/15 rounded-full blur-[100px] transform-gpu"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[500px] h-[500px] bg-[#818cf8]/15 rounded-full blur-[110px] transform-gpu"></div>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="w-full pt-20 overflow-x-hidden">
          <Hero />
          <StatsCounter />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Contact />
        </main>

        <Footer />
      </div>

      <AIChatBot />
      <BackToTop />
    </div>
  );
}