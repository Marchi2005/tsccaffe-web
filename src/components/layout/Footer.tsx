"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, MapPin, Phone, MessageCircle, Send, Coffee } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";

// Icona TikTok personalizzata stile Lucide
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  
  // --- FIX DOMINIO LUNA ---
  const [isLunaDomain, setIsLunaDomain] = useState(false);
  const [shopStatus, setShopStatus] = useState({ text: "VERIFICA...", classes: "bg-slate-300" });

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname.includes("lunaevents")) {
      setIsLunaDomain(true);
    }

    // LOGICA ORARI APERTURA AVANZATA
    const updateShopStatus = () => {
      const now = new Date();
      const itTimeStr = now.toLocaleString("en-US", { timeZone: "Europe/Rome" });
      const itDate = new Date(itTimeStr);

      const day = itDate.getDay(); 
      const minutes = itDate.getHours() * 60 + itDate.getMinutes();

      const statusStyles = {
        open: { text: "APERTO ORA", classes: "bg-emerald-500 shadow-emerald-500/40" },
        closed: { text: "CHIUSO ORA", classes: "bg-rose-500 shadow-rose-500/40" },
        closing: { text: "IN CHIUSURA", classes: "bg-amber-500 shadow-amber-500/40" }, 
        opening: { text: "APRE TRA POCO", classes: "bg-blue-500 shadow-blue-500/40" }   
      };

      if (day === 0) {
        if (minutes >= 435 && minutes < 450) return statusStyles.opening;
        if (minutes >= 840 && minutes < 870) return statusStyles.closing;
        if (minutes >= 450 && minutes < 870) return statusStyles.open;
        return statusStyles.closed;
      }

      if (minutes >= 375 && minutes < 390) return statusStyles.opening;
      if (minutes >= 780 && minutes < 810) return statusStyles.closing;
      if (minutes >= 390 && minutes < 810) return statusStyles.open;

      if (minutes >= 915 && minutes < 930) return statusStyles.opening;
      if (minutes >= 1170 && minutes < 1200) return statusStyles.closing;
      if (minutes >= 930 && minutes < 1200) return statusStyles.open;

      return statusStyles.closed;
    };

    setShopStatus(updateShopStatus());
    const interval = setInterval(() => {
      setShopStatus(updateShopStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const isLunaPage = pathname.startsWith("/site-luna") || isLunaDomain;

  return (
    <footer className={clsx(
        "relative z-50 transition-colors duration-300",
        // TEMA CHIARO PER LUNA, TEMA SCURO PER TSC
        isLunaPage ? "bg-[#FAF8F5] text-slate-600 border-t border-[#E8E1D9]" : "bg-slate-900 text-slate-300 border-t border-slate-800"
    )}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* COLONNA 1: BRAND & STORY */}
          <div className="space-y-6">
            <div className="flex items-center flex-wrap gap-y-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-12 w-12 p-1 transition-transform group-hover:scale-110">
                        <Image 
                            src={isLunaPage ? "/icons/logo-navbar-luna-page.svg" : "/icons/logo-footbar.svg"} 
                            alt="Logo TSC" 
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className={clsx(
                            "font-bold text-sm uppercase tracking-wide transition-colors",
                            // Testo Scuro per Luna, Bianco per TSC
                            isLunaPage ? "text-slate-800 group-hover:text-[#7A0018]" : "text-white group-hover:text-brand-coffee"
                        )}>
                            Tabacchi San Clemente
                        </span>
                        <span className={clsx(
                            "font-serif italic text-lg transition-colors",
                            isLunaPage ? "text-[#7A0018]" : "text-brand-red"
                        )}>
                            Caffè
                        </span>
                    </div>
                </Link>

                {isLunaPage && (
                 <div className="flex items-center ml-4 pl-4 border-l border-[#E8E1D9] h-10 animate-in fade-in slide-in-from-left-4 duration-700">
                      <div className="relative flex items-center justify-center">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-50 pointer-events-none">
                              <Image 
                                  src="/icons/moon.svg" 
                                  alt="Luna Sfondo" 
                                  width={80} 
                                  height={80} 
                                  className="w-full h-full object-contain" 
                              />
                          </div>
                          <div className="relative z-10 flex flex-col items-center leading-none pt-1">
                              <span 
                                  className="text-[#7A0018] font-luna text-2xl leading-none drop-shadow-sm" 
                                  style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                              >
                                  Luna
                              </span>
                              <span className="text-slate-500 text-[0.4rem] uppercase tracking-[0.3em] -mt-0.5 font-serif font-light">
                                  Events
                              </span>
                          </div>
                      </div>
                 </div>
                )}
            </div>

            <p className={clsx("text-sm leading-relaxed", isLunaPage ? "text-slate-500" : "text-slate-400")}>
              {isLunaPage 
                ? "Trasformiamo i tuoi momenti speciali in ricordi indimenticabili. Eventi esclusivi, cura dei dettagli e passione."
                : "Non solo un bar, ma il tuo angolo di relax quotidiano. Tra un caffè Illy perfetto, un sorriso e i servizi di cui hai bisogno, ci prendiamo cura della tua giornata."
              }
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex space-x-4">
              <a href="https://instagram.com/tabacchisanclementecaffe" target="_blank" rel="noreferrer" className={clsx(
                  "p-2 rounded-full transition-all",
                  isLunaPage ? "bg-white border border-[#E8E1D9] text-[#7A0018] hover:bg-[#7A0018] hover:text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-brand-cyan hover:text-white"
              )}>
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/people/Tabacchi-San-Clemente/100012509505700/" target="_blank" rel="noreferrer" className={clsx(
                  "p-2 rounded-full transition-all",
                  isLunaPage ? "bg-white border border-[#E8E1D9] text-[#7A0018] hover:bg-[#7A0018] hover:text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white"
              )}>
                <Facebook size={18} />
              </a>
              <a href="https://www.tiktok.com/@tsccaffe" target="_blank" rel="noreferrer" className={clsx(
                  "p-2 rounded-full transition-all",
                  isLunaPage ? "bg-white border border-[#E8E1D9] text-[#7A0018] hover:bg-[#7A0018] hover:text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-[#ff0050] hover:text-white"
              )}>
                <TikTokIcon size={18} />
              </a>
              <a href="https://wa.me/393715428345" target="_blank" rel="noreferrer" className={clsx(
                  "p-2 rounded-full transition-all",
                  isLunaPage ? "bg-white border border-[#E8E1D9] text-[#7A0018] hover:bg-[#7A0018] hover:text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-green-500 hover:text-white"
              )}>
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* COLONNA 2: ESPLORA */}
          <div>
            <h3 className={clsx("text-sm font-bold uppercase tracking-wider mb-6", isLunaPage ? "text-[#7A0018]" : "text-white")}>Esplora</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className={clsx("transition-colors flex items-center gap-2", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-brand-cyan")}>
                  <span className={clsx("w-1 h-1 rounded-full", isLunaPage ? "bg-[#7A0018]/40" : "bg-slate-600")}></span> Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className={clsx("transition-colors flex items-center gap-2", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-brand-cyan")}>
                  <span className={clsx("w-1 h-1 rounded-full", isLunaPage ? "bg-[#7A0018]/40" : "bg-slate-600")}></span> Menù Caffetteria
                </Link>
              </li>
              <li>
                <Link href="/servizi" className={clsx("transition-colors flex items-center gap-2", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-brand-cyan")}>
                  <span className={clsx("w-1 h-1 rounded-full", isLunaPage ? "bg-[#7A0018]/40" : "bg-slate-600")}></span> Servizi & Shop
                </Link>
              </li>
              <li className="pt-2">
                {isLunaPage ? (
                    <a href="#contact" className="text-[#7A0018] font-bold hover:text-[#5C0012] transition-colors flex items-center gap-2">
                       <Send size={14} className="mt-0.5" /> Richiedi Preventivo
                    </a>
                ) : (
                    <Link href="/prenota-colazione" className="text-brand-red font-bold hover:text-rose-700 transition-colors flex items-center gap-2">
                       <Coffee size={14} className="mt-0.5" /> Prenota Colazione
                    </Link>
                )}
              </li>
            </ul>
          </div>

          {/* COLONNA 3: CONTATTI */}
          <div>
            <h3 className={clsx("text-sm font-bold uppercase tracking-wider mb-6", isLunaPage ? "text-[#7A0018]" : "text-white")}>Contatti</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className={clsx("shrink-0 mt-0.5", isLunaPage ? "text-[#7A0018]" : "text-brand-cyan")} />
                <span>Via Galatina N° 95,<br />San Clemente, 81100 Caserta (CE)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className={clsx("shrink-0", isLunaPage ? "text-[#7A0018]" : "text-brand-cyan")} />
                <a href="tel:+393715428345" className={clsx("transition-colors", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-white")}>371 542 8345</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className={clsx("shrink-0", isLunaPage ? "text-[#7A0018]" : "text-green-500")} />
                <a href="https://wa.me/393715428345" className={clsx("transition-colors", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-white")}>Scrivici su WhatsApp</a>
              </li>
            </ul>
          </div>

           {/* COLONNA 4: ORARI */}
          <div>
            <h3 className={clsx("text-sm font-bold uppercase tracking-wider mb-6", isLunaPage ? "text-[#7A0018]" : "text-white")}>Orari Apertura</h3>
            <div className={clsx(
                "p-5 rounded-2xl text-slate-900 transition-colors duration-300",
                isLunaPage ? "bg-white border border-[#E8E1D9] shadow-sm" : "bg-slate-50 border border-slate-200/10 shadow-lg"
            )}>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start pb-3 border-b border-slate-200">
                  <span className="font-bold text-slate-800">Lun - Sab</span>
                  <div className="text-right space-y-1 text-slate-600 font-medium">
                    <p>06:30 - 13:30</p>
                    <p>15:30 - 20:00</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-800">Domenica</span>
                  <span className="text-slate-600 font-medium">07:30 - 14:30</span>
                </div>
              </div>
              
              {/* STATUS BADGE DINAMICO */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                 <div className="flex items-center justify-center gap-2.5 w-full bg-white shadow-sm py-2.5 px-3 rounded-xl border border-slate-100">
                    <span className={clsx("w-2.5 h-2.5 rounded-full shadow-lg animate-pulse", shopStatus.classes)}></span>
                    <span className="text-xs font-bold text-slate-700 tracking-wide">{shopStatus.text}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEGAL BOTTOM */}
        <div className={clsx(
            "border-t pt-8 flex flex-col items-center text-center mt-12",
            isLunaPage ? "border-[#E8E1D9]" : "border-slate-800"
        )}>
          <div className="flex flex-col items-center gap-1 mb-4">
            <p className={clsx("text-sm font-bold tracking-tight", isLunaPage ? "text-slate-800" : "text-slate-200")}>
              Tabacchi San Clemente di Ianniello Gianpaolo
            </p>
            <p className="text-slate-500 text-[13px]">
              © {currentYear} — Tutti i diritti riservati • P.IVA: 04124110612
            </p>
          </div>

          <div className="mb-6">
            <div className={clsx(
                "text-xs flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border",
                isLunaPage ? "bg-white border-[#E8E1D9] text-slate-500 shadow-sm" : "bg-slate-800/50 border-slate-700 text-slate-400"
            )}>
              Realizzato con ❤️ da 
              <a href="https://github.com/Marchi2005" target="_blank" rel="noopener noreferrer" className={clsx(
                  "font-bold transition-all duration-300 hover:underline decoration-2 underline-offset-4",
                  isLunaPage ? "text-[#7A0018] hover:text-[#5C0012]" : "text-rose-500 hover:text-rose-600"
              )}>
                Marco Ianniello
              </a>
            </div>
          </div>

          {/* QUI I LINK AGGIORNATI CON IL PARAMETRO ?site= */}
          <div className="flex justify-center items-center gap-4 text-slate-500 text-xs uppercase tracking-widest font-medium">
              <Link 
                href={isLunaPage ? "/privacy-policy?site=luna" : "/privacy-policy?site=tsc"} 
                className={clsx("transition-colors", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-rose-500")}
              >
                Privacy Policy
              </Link>
              
              <span className={clsx(isLunaPage ? "text-slate-300" : "text-slate-700")}>|</span>
              
              <Link 
                href={isLunaPage ? "/cookie-policy?site=luna" : "/cookie-policy?site=tsc"} 
                className={clsx("transition-colors", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-rose-500")}
              >
                Cookie Policy
              </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}