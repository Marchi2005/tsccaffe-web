"use client";

import Link from "next/link";
import Image from "next/image"; 
import { Menu, X, ShoppingBag, Send } from "lucide-react"; 
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isLunaPage = pathname === "/site-luna" || pathname.startsWith("/site-luna/");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Servizi & Shop", href: "/servizi" },
  ];

  return (
    <nav 
      className={clsx(
        "fixed top-0 inset-x-0 z-50 w-full transition-all duration-300",
        "rounded-b-[30px]",
        "backdrop-blur",         
        isLunaPage ? "bg-slate-900/40 border-white/10" : "bg-white/0 border-white/40", // NAVBAR ORIGINALE (Trasparente)             
        "backdrop-saturate-150",     
        "border-b"
      )}
      style={{
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.05)" 
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          
          {/* LOGO SECTION (SINISTRA) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              
              {/* LOGO TSC ICONA */}
              <div className="relative h-10 w-10 md:h-12 md:w-12 transition-transform group-hover:scale-105">
                 <Image 
                   src={isLunaPage ? "/icons/logo-navbar-luna-page.svg" : "/icons/logo-navbar.svg"}
                   alt="Logo TSC" 
                   fill
                   className="object-contain"
                 />
              </div>

              {/* TESTO TSC */}
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

            {/* --- LOGO LUNA EVENTS (VERSIONE MAXI - COME RICHIESTO) --- */}
            {isLunaPage && (
              <div className="flex items-center ml-4 pl-4 border-l border-white/20 h-10 animate-in fade-in slide-in-from-left-4 duration-700">
                  <div className="relative flex items-center justify-center">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 opacity-50 pointer-events-none">
                          <Image 
                              src="/icons/moon.svg" 
                              alt="Luna Sfondo" 
                              width={120} 
                              height={120} 
                              className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" 
                          />
                      </div>
                      <div className="relative z-10 flex flex-col items-center leading-none pt-2">
                          <span 
                              className="text-amber-400 font-luna text-3xl md:text-4xl leading-none drop-shadow-md" 
                              style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                          >
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
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "text-sm font-bold transition-colors",
                  isLunaPage
                    ? "text-white hover:text-amber-400" 
                    : "text-slate-800 hover:text-brand-cyan" 
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {/* PULSANTE DESKTOP */}
            {isLunaPage ? (
                <a 
                  href="#contact" 
                  className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-amber-300 hover:shadow-amber-400/30 transition-all transform hover:-translate-y-0.5"
                >
                  <Send size={16} strokeWidth={2.5} />
                  Richiedi Preventivo
                </a>
            ) : (
                <Link 
                  href="/prenota-box" 
                  className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-red-700 hover:shadow-brand-red/40 transition-all transform hover:-translate-y-0.5"
                >
                  <ShoppingBag size={18} />
                  Box San Valentino
                </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={clsx(
                "p-2 rounded-lg backdrop-blur-md transition-colors",
                isLunaPage
                  ? "text-white bg-white/10 hover:text-amber-400" 
                  : "text-slate-800 bg-white/20 hover:text-brand-cyan" 
              )}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROP - MODIFICATO SOLO QUESTO */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 px-4">
            <div 
                className={clsx(
                  "overflow-hidden p-4 space-y-2 shadow-2xl",
                  "rounded-[30px]",
                  "backdrop-blur-xl", // Aumento il blur per compensare la trasparenza
                  "border",
                  // QUI CAMBIA: Uso gli stessi colori base della navbar ma con una trasparenza media (/60 o /70)
                  // Invece di bg-white/95 (che era quasi solido), ora è vetro.
                  isLunaPage 
                    ? "bg-slate-900/60 border-white/10" 
                    : "bg-white/60 border-white/40"    
                )}
            >
                {navLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                        "block rounded-xl px-4 py-3 text-base font-bold transition-colors",
                        isLunaPage 
                           ? "text-white hover:bg-white/10 hover:text-amber-400" 
                           : "text-slate-900 hover:bg-white/40 hover:text-brand-cyan"
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
                     className="mt-4 flex items-center justify-center gap-2 w-full text-center rounded-xl bg-amber-400 px-4 py-3 text-base font-bold text-slate-950 shadow-md hover:bg-amber-300"
                   >
                     <Send size={18} /> Richiedi Preventivo
                   </a>
                ) : (
                   <Link
                     href="/prenota-box"
                     onClick={() => setIsOpen(false)}
                     className="mt-4 flex items-center justify-center gap-2 w-full text-center rounded-xl bg-brand-red px-4 py-3 text-base font-bold text-white shadow-md hover:bg-red-700"
                   >
                     <ShoppingBag size={18} /> Prenota Box San Valentino
                   </Link>
                )}
            </div>
        </div>
      )}
    </nav>
  );
}