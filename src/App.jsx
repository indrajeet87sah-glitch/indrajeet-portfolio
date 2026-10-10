// src/App.jsx
import React, { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StatsCounter from "./components/StatsCounter"; // 👈 Yahan import karein
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
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-screen relative overflow-hidden selection:bg-[#38bdf8] selection:text-[#0b0f19]">
      <ScrollProgress />
      <CustomCursor />

      {/* Background Ambience Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 mouse-spotlight transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-35"></div>
        <div className="absolute inset-0 bg-stars-pattern animate-twinkle opacity-60"></div>
        
        <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-[#38bdf8] rounded-full mix-blend-screen blur-[160px] opacity-25 animate-blob"></div>
        <div className="absolute top-[15%] right-[-5%] w-[600px] h-[600px] bg-[#c084fc] rounded-full mix-blend-screen blur-[170px] opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[55%] right-[10%] w-[550px] h-[550px] bg-[#00d4ff] rounded-full mix-blend-screen blur-[160px] opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[600px] h-[600px] bg-[#818cf8] rounded-full mix-blend-screen blur-[180px] opacity-20 animate-blob"></div>
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="w-full pt-20 overflow-x-hidden">
          <Hero />
          
          {/* 👇 Hero ke theek baad Impact Numbers bar */}
          <StatsCounter />

          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Contact />
          <AIChatBot />
        </main>

        <Footer />
      </div>

      <BackToTop />
    </div>
  );
}