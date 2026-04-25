"use client";

import Link from "next/link";
import Image from "next/image"; 
import { Menu, X, ShoppingBag, Send, Coffee } from "lucide-react"; 
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // --- FIX DOMINIO LUNA ---
  const [isLunaDomain, setIsLunaDomain] = useState(false);

  useEffect(() => {
    // Controllo se siamo sul dominio lunaevents
    if (typeof window !== "undefined" && window.location.hostname.includes("lunaevents")) {
      setIsLunaDomain(true);
    }
  }, []);

  // La pagina è Luna SE: il percorso inizia con /site-luna (sviluppo) OPPURE siamo sul dominio lunaevents (produzione)
  const isLunaPage = pathname.startsWith("/site-luna") || isLunaDomain;

  // URL del sito principale per i redirect
  const TSC_URL = "https://www.tsccaffe.it";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: isLunaPage ? `${TSC_URL}/menu` : "/menu" },
    { name: "Servizi & Shop", href: isLunaPage ? `${TSC_URL}/servizi` : "/servizi" },
  ];

  return (
    // Rimosso il backdrop-blur da qui! Il <nav> ora fa solo da contenitore invisibile.
    <nav className="fixed top-0 inset-x-0 z-50 w-full transition-all duration-300">
      
      {/* 1. SFONDO DELLA NAVBAR (SEPARATO)
        Questo div gestisce solo il vetro della barra superiore (h-20).
        Risolve il bug dei browser impedendo che il menu a tendina erediti blocchi di blur.
      */}
      <div 
        className={clsx(
          "absolute top-0 left-0 w-full h-20 transition-all duration-300 -z-10",
          "rounded-b-[30px]",
          "backdrop-blur-lg backdrop-saturate-150 border-b",
          isLunaPage ? "bg-slate-900/40 border-white/10" : "bg-white/00 border-white/50"
        )}
        style={{ boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.05)" }}
      />

      {/* 2. CONTENUTO DELLA NAVBAR (Logo e Pulsanti) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex h-20 justify-between items-center">
          
          {/* LOGO SECTION */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 md:h-12 md:w-12 transition-transform group-hover:scale-105">
                 <Image 
                   src={isLunaPage ? "/icons/logo-navbar-luna-page.svg" : "/icons/logo-navbar.svg"}
                   alt="Logo TSC" 
                   fill
                   className="object-contain"
                 />
              </div>
              <div className="flex flex-col leading-none">
                <span className={clsx(
                  "font-bold text-[10px] md:text-xs uppercase tracking-wide transition-colors",
                  isLunaPage ? "text-slate-300 group-hover:text-white" : "text-brand-dark group-hover:text-brand-blue"
                )}>
                  Tabacchi San Clemente
                </span>
                <span className={clsx(
                  "font-serif italic text-sm md:text-base transition-colors",
                  isLunaPage ? "text-amber-400" : "text-brand-coffee"
                )}>
                  Caffè
                </span>
              </div>
            </Link>

            {/* LOGO LUNA EVENTS */}
            {isLunaPage && (
              <div className="flex items-center ml-4 pl-4 border-l border-white/20 h-10 animate-in fade-in slide-in-from-left-4 duration-700">
                  <div className="relative flex items-center justify-center">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 opacity-50 pointer-events-none">
                          <Image src="/icons/moon.svg" alt="Luna Sfondo" width={120} height={120} className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center leading-none pt-2">
                          <span className="text-amber-400 font-luna text-3xl md:text-4xl leading-none drop-shadow-md" style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}>
                              Luna
                          </span>
                          <span className="text-white text-[0.5rem] md:text-[0.6rem] uppercase tracking-[0.3em] -mt-1 shadow-black drop-shadow-md font-serif font-light">
                              Events
                          </span>
                      </div>
                  </div>
              </div>
            )}
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={clsx("text-sm font-bold transition-colors", isLunaPage ? "text-white hover:text-amber-400" : "text-slate-800 hover:text-brand-cyan")}>
                {link.name}
              </Link>
            ))}
            
            {isLunaPage ? (
                <a href="#contact" className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-amber-300 transition-all transform hover:-translate-y-0.5">
                  <Send size={16} strokeWidth={2.5} /> Richiedi Preventivo
                </a>
            ) : (
                <Link href="/prenota-colazione" className="inline-flex items-center gap-2 bg-brand-coffee text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-amber-900 transition-all transform hover:-translate-y-0.5">
                  <Coffee size={18} /> Prenota Colazione
                </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={clsx(
                "p-2 rounded-xl backdrop-blur-md transition-colors border relative z-20", // Z-20 per stare sopra
                isLunaPage ? "text-white bg-white/10 hover:text-amber-400 border-white/20" : "text-slate-800 bg-white/20 hover:text-brand-cyan border-white/20 shadow-sm"
              )}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE MENU DROP (EFFETTO VETRO ORA FUNZIONANTE!)
        Essendo svincolato dallo sfondo del genitore, ora il browser processerà
        il backdrop-blur in maniera pulita ed efficace.
      */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 px-4 animate-in slide-in-from-top-4 fade-in duration-300 z-50">
            <div 
                className={clsx(
                  "overflow-hidden p-5 space-y-2 relative",
                  "rounded-[30px] border",
                  "backdrop-blur-lg backdrop-saturate-150", // Magia Apple
                  isLunaPage 
                    ? "bg-slate-900/40 border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]" 
                    : "bg-white/00 border-white/60 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)]" // Colore corretto, no interferenze
                )}
            >
                {navLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                        "block rounded-xl px-4 py-3 text-base font-bold transition-all",
                        isLunaPage ? "text-white hover:bg-white/10 hover:text-amber-400" : "text-slate-900 hover:bg-white/50 hover:text-brand-cyan"
                    )}
                >
                    {link.name}
                </Link>
                ))}
                
                {/* BUTTON MOBILE */}
                {isLunaPage ? (
                   <a
                     href="#contact"
                     onClick={() => setIsOpen(false)}
                     className="mt-4 flex items-center justify-center gap-2 w-full text-center rounded-xl bg-amber-400 px-5 py-3 text-base font-bold text-slate-950 shadow-lg hover:bg-amber-300 hover:-translate-y-0.5 transition-all"
                   >
                     <Send size={18} /> Richiedi Preventivo
                   </a>
                ) : (
                   <Link
                     href="/prenota-colazione"
                     onClick={() => setIsOpen(false)}
                     className="mt-4 flex items-center justify-center gap-2 w-full text-center rounded-xl bg-brand-coffee text-white px-5 py-3 text-base font-bold shadow-lg hover:bg-amber-900 hover:-translate-y-0.5 transition-all"
                   >
                     <Coffee size={18} /> Prenota Colazione
                   </Link>
                )}
            </div>
        </div>
      )}
    </nav>
  );
}