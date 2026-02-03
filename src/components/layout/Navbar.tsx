"use client";

import Link from "next/link";
import Image from "next/image"; 
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "menu" },
    { name: "Servizi & Shop", href: "servizi" },
    { name: "Dove Siamo", href: "/" },
  ];

  return (
    <nav 
      className={clsx(
        "fixed top-0 inset-x-0 z-50 w-full transition-all duration-300",
        "rounded-b-[30px]",
        "backdrop-blur",         
        "bg-white/0",               
        "backdrop-saturate-150",     
        "border-b border-white/40"
      )}
      style={{
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.05)" 
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          
{/* LOGO SECTION */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              
              {/* MODIFICA QUI LE DIMENSIONI:
                  - h-14 w-14 (Mobile: più grande)
                  - md:h-20 md:w-20 (Desktop: molto più grande)
                  
                  Nota: Se md:h-20 è troppo grande, prova md:h-16
              */}
              <div className="relative h-14 w-14 md:h-16 md:w-20 transition-transform group-hover:scale-105">
                 <Image 
                    src="/icons/logo-navbar.svg" 
                    alt="Logo TSC" 
                    fill
                    className="object-contain"
                 />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-brand-dark font-bold text-xs md:text-sm uppercase tracking-wide group-hover:text-brand-blue transition-colors">
                  Tabacchi San Clemente
                </span>
                <span className="text-brand-coffee font-serif italic text-base md:text-lg">
                  Caffè
                </span>
              </div>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-slate-800 hover:text-brand-cyan transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            <Link 
              href="/prenota-box" 
              className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-red-700 hover:shadow-brand-red/40 transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag size={18} />
              Box San Valentino
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-800 hover:text-brand-cyan p-2 bg-white/20 rounded-lg backdrop-blur-md transition-colors"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROP */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 px-4">
            
            {/* CARD MENU MOBILE */}
            <div 
                className={clsx(
                    "overflow-hidden p-4 space-y-2 shadow-2xl",
                    "rounded-[30px]",           
                    
                    // --- SEZIONE CRITICA PER L'EFFETTO VETRO ---
                    "backdrop-blur-xl",         // Sfocatura (prova 'md', 'xl' o '3xl')
                    "bg-white/90",              // TRASPARENZA: Deve essere bassa (10-30%) per vedere attraverso!
                    "backdrop-saturate-150",    // Aumenta i colori sotto per evidenziare la distorsione
                    "border border-white/30"    // Bordo sottile
                    // ------------------------------------------
                )}
                // Aggiungiamo uno stile inline di fallback per sicurezza su alcuni browser
                style={{ WebkitBackdropFilter: "blur(20px)" }}
            >
                {navLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-bold text-slate-900 hover:bg-white hover:text-brand-cyan transition-colors"
                >
                    {link.name}
                </Link>
                ))}
                
                <Link
                    href="/prenota-box"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 block w-full text-center rounded-xl bg-brand-red px-4 py-3 text-base font-bold text-white shadow-md hover:bg-red-700"
                >
                    Prenota Box San Valentino
                </Link>
            </div>
        </div>
      )}
    </nav>
  );
}