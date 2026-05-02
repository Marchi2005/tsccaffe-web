"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import clsx from "clsx";

export default function ScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Appare dopo 400px
      setShowScrollTop(window.scrollY > 400);

      // Calcola l'offset se il footer entra nello schermo
      const footer = document.querySelector("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (footerRect.top < windowHeight) {
          setFooterOffset(windowHeight - footerRect.top);
        } else {
          setFooterOffset(0);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Init
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={clsx(
        "fixed right-6 z-40 p-4 rounded-full bg-brand-dark text-white shadow-2xl transition-all duration-300 hover:bg-brand-coffee border border-white/10",
        showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{
        bottom: '24px', 
        transform: showScrollTop ? `translateY(-${footerOffset}px)` : 'translateY(100px)'
      }}
      aria-label="Torna su"
    >
      <ArrowUp size={24} />
    </button>
  );
}