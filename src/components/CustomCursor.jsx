// src/components/CustomCursor.jsx
import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    // Touch device par disable rakhein
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const spotlight = spotlightRef.current;
    if (!dot || !ring || !spotlight) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let spotX = mouseX;
    let spotY = mouseY;
    let isVisible = false;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        spotlight.style.opacity = "1";
      }

      // 1. Center Dot: Instant zero-latency movement
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    // 2. Smooth 60/120fps Loop for Outer Ring & Background Spotlight
    const render = () => {
      // Ring smooth interpolation
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      // Spotlight ultra-smooth interpolation
      spotX += (mouseX - spotX) * 0.12;
      spotY += (mouseY - spotY) * 0.12;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      spotlight.style.transform = `translate3d(${spotX}px, ${spotY}px, 0)`;

      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);

    // 3. Direct DOM Class Toggle (No React useState = Zero Lag!)
    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest(
        "a, button, input, textarea, select, [role='button'], .cursor-pointer"
      );
      if (isInteractive) {
        dot.firstElementChild.classList.add("scale-0");
        ring.firstElementChild.classList.add(
          "w-12",
          "h-12",
          "border-[#c084fc]",
          "bg-[#38bdf8]/15"
        );
        ring.firstElementChild.classList.remove("w-8", "h-8", "border-[#38bdf8]/70");
      } else {
        dot.firstElementChild.classList.remove("scale-0");
        ring.firstElementChild.classList.remove(
          "w-12",
          "h-12",
          "border-[#c084fc]",
          "bg-[#38bdf8]/15"
        );
        ring.firstElementChild.classList.add("w-8", "h-8", "border-[#38bdf8]/70");
      }
    };

    const handleMouseDown = () => {
      ring.firstElementChild.classList.add("scale-75");
    };

    const handleMouseUp = () => {
      ring.firstElementChild.classList.remove("scale-75");
    };

    const handleMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      spotlight.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block overflow-hidden">
      {/* 1. GPU-Accelerated Background Spotlight (Zero Repaint Lag) */}
      <div
        ref={spotlightRef}
        style={{ left: 0, top: 0, opacity: 0, willChange: "transform" }}
        className="fixed pointer-events-none transition-opacity duration-500 -z-10"
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(192, 132, 252, 0.05) 40%, transparent 70%)"
          }}
        />
      </div>

      {/* 2. Center Solid Mini Dot */}
      <div
        ref={dotRef}
        style={{ left: 0, top: 0, opacity: 0, willChange: "transform" }}
        className="fixed pointer-events-none transition-opacity duration-150"
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8] transition-transform duration-150 ease-out" />
      </div>

      {/* 3. Outer Smooth Following Ring */}
      <div
        ref={ringRef}
        style={{ left: 0, top: 0, opacity: 0, willChange: "transform" }}
        className="fixed pointer-events-none transition-opacity duration-150"
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#38bdf8]/70 transition-[width,height,border-color,background-color,transform] duration-200 ease-out" />
      </div>
    </div>
  );
}