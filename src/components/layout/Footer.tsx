"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, MapPin, Phone, MessageCircle, Send } from "lucide-react";
import { StatusBadge } from '@/components/ui/status-badge';
import clsx from "clsx";

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
  
  // Logica per determinare se siamo nella sezione Luna Events
  const isLunaPage = pathname === "/site-luna" || pathname.startsWith("/site-luna/");

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 relative z-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* COLONNA 1: BRAND & STORY */}
          <div className="space-y-6">
            <div className="flex items-center flex-wrap gap-y-4">
                
                {/* LOGO TSC IBRIDO (Cambia se siamo su Luna) */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-12 w-12 p-1 transition-transform group-hover:scale-150">
                        <Image 
                            // QUI LA MODIFICA: Usa lo stesso SVG della navbar quando è su Luna
                            src={isLunaPage ? "/icons/logo-navbar-luna-page.svg" : "/icons/logo-footbar.svg"} 
                            alt="Logo TSC" 
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className={clsx(
                            "font-bold text-sm uppercase tracking-wide transition-colors",
                            // Su Luna testo grigio chiaro che diventa bianco, su TSC bianco che diventa rosso
                            isLunaPage ? "text-slate-300 group-hover:text-white" : "text-white group-hover:text-brand-red"
                        )}>
                            Tabacchi San Clemente
                        </span>
                        <span className={clsx(
                            "font-serif italic text-lg transition-colors",
                            // QUI LA MODIFICA: Giallo (amber-400) su Luna, Rosso su TSC
                            isLunaPage ? "text-amber-400" : "text-brand-red"
                        )}>
                            Caffè
                        </span>
                    </div>
                </Link>

                {/* --- LOGO LUNA EVENTS AGGIUNTIVO (Visibile solo su site-luna) --- */}
                {isLunaPage && (
                 <div className="flex items-center ml-4 pl-4 border-l border-slate-700 h-10 animate-in fade-in slide-in-from-left-4 duration-700">
                     <div className="relative flex items-center justify-center">
                         {/* Luna Sfondo */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-40 pointer-events-none">
                             <Image 
                                 src="/icons/moon.svg" 
                                 alt="Luna Sfondo" 
                                 width={80} 
                                 height={80} 
                                 className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" 
                             />
                         </div>
                         {/* Testo Luna */}
                         <div className="relative z-10 flex flex-col items-center leading-none pt-1">
                             <span 
                                 className="text-amber-400 font-luna text-2xl leading-none drop-shadow-md" 
                                 style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                             >
                                 Luna
                             </span>
                             <span className="text-white text-[0.4rem] uppercase tracking-[0.3em] -mt-0.5 shadow-black drop-shadow-md font-serif font-light">
                                 Events
                             </span>
                         </div>
                     </div>
                 </div>
                )}
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {isLunaPage 
                ? "Trasformiamo i tuoi momenti speciali in ricordi indimenticabili. Eventi esclusivi, cura dei dettagli e passione."
                : "Non solo un bar, ma il tuo angolo di relax quotidiano. Tra un caffè Illy perfetto, un sorriso e i servizi di cui hai bisogno, ci prendiamo cura della tua giornata."
              }
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/tabacchisanclementecaffe" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 p-2 rounded-full hover:bg-brand-cyan hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.facebook.com/people/Tabacchi-San-Clemente/100012509505700/" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              
              <a 
                href="https://www.tiktok.com/@tsccaffe" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 p-2 rounded-full hover:bg-[#ff0050] hover:text-white transition-all"
                aria-label="TikTok"
              >
                <TikTokIcon size={18} />
              </a>

              <a 
                href="https://wa.me/393715428345" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 p-2 rounded-full hover:bg-green-500 hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* COLONNA 2: ESPLORA */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Esplora</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-brand-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Menù Caffetteria
                </Link>
              </li>
              <li>
                <Link href="/servizi" className="hover:text-brand-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Servizi & Shop
                </Link>
              </li>
              
              {/* LINK DINAMICO: SAN VALENTINO (TSC) vs PREVENTIVO (LUNA) */}
              <li>
                {isLunaPage ? (
                    <a href="#contact" className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-2">
                       <Send size={14} className="mt-0.5" /> Richiedi Preventivo
                    </a>
                ) : (
                    <Link href="/prenota-box" className="text-brand-red font-bold hover:text-red-400 transition-colors flex items-center gap-2">
                       San Valentino ❤️
                    </Link>
                )}
              </li>
            </ul>
          </div>

          {/* COLONNA 3: CONTATTI */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Contatti</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-cyan shrink-0 mt-0.5" />
                <span>Via Galatina N° 95,<br />San Clemente, 81100 Caserta (CE)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-cyan shrink-0" />
                <a href="tel:+393715428345" className="hover:text-white transition-colors">371 542 8345</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-green-500 shrink-0" />
                <a href="https://wa.me/393715428345" className="hover:text-white transition-colors">Scrivici su WhatsApp</a>
              </li>
            </ul>
          </div>

           {/* COLONNA 4: ORARI DI APERTURA */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Orari Apertura</h3>
            
            {/* Card Orari */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/10 shadow-lg text-slate-900">
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

              <div className="mt-4 pt-2 border-t border-slate-100">
                 <StatusBadge className="w-full justify-center bg-white shadow-sm" />
              </div>
            </div>
          </div>

        </div>

        {/* LEGAL BOTTOM */}
        <div className="border-t border-slate-800 pt-8 flex flex-col items-center text-center">
          <div className="flex flex-col items-center gap-1 mb-4">
            <p className="text-slate-200 text-sm font-bold tracking-tight">
              Tabacchi San Clemente di Ianniello Gianpaolo
            </p>
            <p className="text-slate-500 text-[13px]">
              © {currentYear} — Tutti i diritti riservati • P.IVA: 04124110612
            </p>
          </div>

          <div className="mb-6">
            <div className="text-slate-400 text-xs flex items-center justify-center gap-1.5 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
              Realizzato con ❤️ da 
              <a 
                href="https://github.com/Marchi2005"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rose-500 hover:text-rose-600 font-bold transition-all duration-300 hover:underline decoration-2 underline-offset-4"
              >
                Marco Ianniello
              </a>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 text-slate-500 text-xs uppercase tracking-widest font-medium">
             <Link href="/privacy-policy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link>
             <span className="text-slate-700">|</span>
             <Link href="/cookie-policy" className="hover:text-rose-500 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}