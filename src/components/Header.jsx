// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    // Agar URL mein pehle se koi #id hai toh use bhi hata dega
    window.history.replaceState(null, "", window.location.pathname);
  };

  // NEW: Bina URL mein #id laaye smooth scroll karne ka function
  const scrollToSection = (e, href, label = "") => {
    e.preventDefault(); // URL mein #contact aane se rokega
    setIsMobileMenuOpen(false); // Mobile menu खुला ho toh band kar dega

    if (label === "Home" || href === "#hero") {
      scrollToTop();
      return;
    }

    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      // URL ko hamesha clean rakhega
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? "pt-2 px-3 sm:pt-4 sm:px-8" : "pt-4 px-3 sm:pt-6 sm:px-12"
        }`}
    >
      {/* Navbar Container */}
      <div
        className={`relative mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 ease-in-out ${scrolled
            ? "bg-[#080e1a]/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-full px-3 py-2 sm:px-5 sm:py-3"
            : "bg-transparent border-transparent rounded-none px-1 py-2 sm:px-2"
          }`}
      >

        {/* LOGO & NAME AREA */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={scrollToTop}
          className="flex items-center gap-2 sm:gap-3 md:gap-4 cursor-pointer group select-none min-w-0"
        >
          <div className="relative shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#38bdf8] to-[#c084fc] rounded-full blur-md opacity-0 group-hover:opacity-40 transition duration-500"></div>
            <img src={logo} className="relative w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-lg" alt="IK Monogram Logo" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[20px] sm:text-lg font-bold tracking-tight text-white leading-tight truncate">Indrajeet Sah</span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#38bdf8]/10 to-[#c084fc]/10 border border-[#38bdf8]/30 text-[#38bdf8] text-[10px] md:text-[11px] font-mono tracking-widest uppercase font-bold shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                Sr. Dev
              </span>
            </div>
            <span className={`hidden md:block font-mono text-[11px] text-slate-400 tracking-wider leading-none mt-1 transition-all duration-300 ${scrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"}`}>
              Senior Front-End Developer
            </span>
          </div>
        </motion.div>

        {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1.5 backdrop-blur-md shadow-inner"
        >
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href, item.label)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + index * 0.06 }}
              className="relative px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group cursor-pointer"
            >
              {item.label}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#38bdf8] to-[#c084fc] rounded-full transition-all duration-300 opacity-0 group-hover:w-1/2 group-hover:opacity-100 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
            </motion.a>
          ))}
        </motion.nav>

        {/* CTA BUTTONS & USER ICON */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-1.5 sm:gap-2.5 shrink-0"
        >
          {/* Download CV Button */}
          <a
            href="/Resume.pdf"
            download="Indrajeet_Sah_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[14px] sm:text-xs font-bold text-slate-200 bg-slate-900/90 border border-white/10 hover:border-[#38bdf8]/60 hover:text-white hover:bg-slate-800 transition-all duration-300 shadow-sm group active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[16px] text-[#38bdf8] group-hover:-translate-y-0.5 transition-transform duration-300">
              download
            </span>
            <span className="hidden sm:inline">Download</span> CV
          </a>

          {/* Get in Touch Button (Desktop Only) */}
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#0b0f19] bg-gradient-to-r from-[#38bdf8] to-[#00d4ff] hover:from-[#7dd3fc] hover:to-[#38bdf8] transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.7)] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            Get in Touch
          </a>

          {/* Desktop Back to Top Icon (Hidden on Mobile) */}
          <div
            onClick={scrollToTop}
            title="Back to Top"
            className="hidden lg:flex w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 border border-white/10 items-center justify-center text-[#38bdf8] hover:bg-slate-800 hover:border-[#38bdf8]/50 hover:text-white hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all cursor-pointer backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[20px]">person</span>
          </div>

          {/* Mobile Hamburger Menu Toggle Icon (Mobile Only) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-[#38bdf8] hover:bg-slate-800 hover:border-[#38bdf8]/50 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[20px]">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </motion.div>

        {/* MOBILE DROPDOWN MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[120%] left-0 right-0 p-4 rounded-2xl bg-[#080e1a]/95 backdrop-blur-xl border border-white/10 shadow-2xl lg:hidden flex flex-col gap-1 overflow-hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href, item.label)}
                  className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile Menu CTA */}
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="mt-3 flex items-center justify-center w-full px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0b0f19] bg-gradient-to-r from-[#38bdf8] to-[#00d4ff] active:scale-95 transition-transform cursor-pointer"
              >
                Get in Touch
              </a>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
}