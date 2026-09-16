"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, Facebook, Sparkles, MapPin, Coffee, X } from "lucide-react";

// Icona TikTok personalizzata
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

// Partner del Tabacchi San Clemente Caffè
const PARTNERS = [
  { src: "/icons/illy.svg", alt: "Illy", w: 72, h: 30 },
  { src: "/icons/iqos-complete.svg", alt: "IQOS", w: 72, h: 30 },
  { src: "/icons/glo-logo.svg", alt: "GLO", w: 72, h: 30 },
];

export default function ScopriPage() {
  const [activeBrand, setActiveBrand] = useState<"luna" | "tsc" | null>(null);

  const handleSelect = (brand: "luna" | "tsc") => {
    setActiveBrand((prev) => (prev === brand ? null : brand));
  };

  return (
    <main className="w-screen h-screen overflow-hidden flex flex-col md:flex-row bg-slate-100 font-sans select-none">
      {/* ====================================================================
          1. SEZIONE LUNA EVENTS
         ==================================================================== */}
      <section
        onClick={() => handleSelect("luna")}
        className={`relative transition-all duration-700 ease-in-out cursor-pointer overflow-y-auto overflow-x-hidden md:overflow-hidden flex flex-col justify-between p-5 sm:p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#E8E1D9]
          ${
            activeBrand === "luna"
              ? "h-[78vh] md:h-full md:w-[78vw] bg-[#FAF8F5]"
              : activeBrand === "tsc"
              ? "h-[22vh] md:h-full md:w-[22vw] bg-[#F5F0E8] opacity-60 hover:opacity-100"
              : "h-[50vh] md:h-full md:w-[50vw] bg-[#FAF8F5]"
          }`}
      >
        {/* Soft blur di sfondo */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#7A0018]/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Intestazione / Badge */}
        <div className="relative z-50 flex justify-between items-center w-full gap-2 mt-6 md:mt-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7A0018]/20 bg-white/80 shadow-sm backdrop-blur-md">
            <Sparkles size={13} className="text-[#7A0018] animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#7A0018] whitespace-nowrap">
              Apecar & Events
            </span>
          </div>

          {activeBrand === "luna" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveBrand(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm hover:bg-slate-50 transition-all hover:scale-105 shrink-0"
            >
              <X size={14} /> Chiudi
            </button>
          )}
        </div>

        {/* Contenuto centrale: logo & testo */}
        <div
          className={`relative z-40 my-auto w-full max-w-lg mx-auto transition-all duration-700 ease-in-out ${
            activeBrand === "luna" ? "text-center md:text-left md:mx-0" : "text-center"
          }`}
        >
          <div
            className={`relative transition-all duration-700 ease-out mx-auto ${
              activeBrand === "luna"
                ? "w-52 sm:w-72 md:w-96 h-16 sm:h-20 md:h-24 md:mx-0 mb-3"
                : "w-44 sm:w-60 md:w-72 h-14 sm:h-16 md:h-20 mb-3"
            }`}
          >
            <Image
              src="/icons/logo_luna.png"
              alt="Logo Luna Events"
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>

          <p className="text-slate-700 text-sm sm:text-base font-medium mt-3 px-2 break-words">
            L&apos;eleganza incontra la magia. Un&apos;esperienza esclusiva per i tuoi eventi.
          </p>

          {/* Dettagli espansi con glassmorphism protettivo su mobile */}
          <div
            className={`transition-all duration-500 transform ${
              activeBrand === "luna"
                ? "opacity-100 translate-y-0 max-h-[600px] mt-5 p-4 sm:p-5 md:p-0 bg-[#FAF8F5]/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-2xl md:rounded-none pointer-events-auto border border-[#E8E1D9]/50 md:border-transparent shadow-sm md:shadow-none relative z-50"
                : "opacity-0 translate-y-6 max-h-0 pointer-events-none overflow-hidden"
            }`}
          >
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 max-w-md mx-auto md:mx-0 break-words">
              Cocktail bar itinerante su Apecar vintage, catering scenografico e servizio beverage su misura per matrimoni, feste private ed eventi aziendali.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                href="/site-luna"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 bg-[#7A0018] hover:bg-[#5C0012] text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 relative z-30"
              >
                Scopri l&apos;anteprima <ArrowRight size={16} />
              </Link>
            </div>

            {/* Social Luna Events */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2 mt-5 text-slate-600 text-xs font-semibold relative z-30">
              <span className="text-[10px] uppercase tracking-widest text-[#7A0018] font-bold w-full md:w-auto text-center md:text-left">
                Seguici:
              </span>
              <a
                href="https://instagram.com/lunaevents.it"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-[#7A0018] transition-colors flex items-center gap-1"
              >
                <Instagram size={15} /> @lunaevents.it
              </a>
              <a
                href="https://tiktok.com/@lunaevents.it"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-[#7A0018] transition-colors flex items-center gap-1"
              >
                <TikTokIcon size={15} /> @lunaevents.it
              </a>
              <a
                href="https://facebook.com/lunaevents.it"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-[#7A0018] transition-colors flex items-center gap-1"
              >
                <Facebook size={15} /> @lunaevents.it
              </a>
            </div>
          </div>
        </div>

        {/* Apecar decorativa */}
        <div
          className={`absolute bottom-0 right-0 pointer-events-none transition-all duration-1000 ease-out delay-100 z-10 ${
            activeBrand === "luna"
              ? "w-40 sm:w-64 md:w-[26rem] h-40 sm:h-64 md:h-[26rem] opacity-30 md:opacity-100 translate-x-4 translate-y-4"
              : "w-32 h-32 opacity-10 translate-x-10 translate-y-10"
          }`}
        >
          <Image src="/images/apecar.png" alt="Apecar Luna Events" fill className="object-contain drop-shadow-xl" />
        </div>

        {!activeBrand && (
          <div className="relative z-20 text-center md:text-left text-[11px] text-[#7A0018] font-bold uppercase tracking-widest animate-pulse">
            Tocca per scoprire
          </div>
        )}
      </section>

      {/* ====================================================================
          2. SEZIONE TABACCHI SAN CLEMENTE CAFFÈ
         ==================================================================== */}
      <section
        onClick={() => handleSelect("tsc")}
        className={`relative transition-all duration-700 ease-in-out cursor-pointer overflow-y-auto overflow-x-hidden md:overflow-hidden flex flex-col justify-between p-5 sm:p-8 md:p-12
          ${
            activeBrand === "tsc"
              ? "h-[78vh] md:h-full md:w-[78vw] bg-white"
              : activeBrand === "luna"
              ? "h-[22vh] md:h-full md:w-[22vw] bg-slate-100 opacity-60 hover:opacity-100"
              : "h-[50vh] md:h-full md:w-[50vw] bg-slate-50"
          }`}
      >
        {/* Soft blur di sfondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-900/5 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Linee animate incrociate */}
        <div
          className={`absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-1000 ease-out z-10 ${
            activeBrand === "tsc" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`absolute top-10 md:top-28 left-0 h-[3px] bg-cyan-500 transition-all duration-1000 delay-100 ${
              activeBrand === "tsc" ? "w-20 md:w-40 translate-x-0" : "w-0 -translate-x-full"
            }`}
          />
          <div
            className={`absolute top-0 left-6 md:left-24 w-[3px] bg-[#E3000F] transition-all duration-1000 delay-200 ${
              activeBrand === "tsc" ? "h-20 md:h-40 translate-y-0" : "h-0 -translate-y-full"
            }`}
          />
        </div>

        <div
          className={`absolute bottom-0 right-0 w-full h-full pointer-events-none transition-all duration-1000 ease-out z-10 ${
            activeBrand === "tsc" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`absolute bottom-10 md:bottom-28 right-0 h-[3px] bg-[#003B73] transition-all duration-1000 delay-300 ${
              activeBrand === "tsc" ? "w-24 md:w-52 translate-x-0" : "w-0 translate-x-full"
            }`}
          />
          <div
            className={`absolute bottom-0 right-8 md:right-36 w-[3px] bg-[#4A2E1B] transition-all duration-1000 delay-400 ${
              activeBrand === "tsc" ? "h-24 md:h-52 translate-y-0" : "h-0 translate-y-full"
            }`}
          />
        </div>

        {/* PARTNER — cascata verticale su desktop (assoluta, non copre mai il testo) */}
        <div
          className={`hidden md:flex flex-col gap-4 absolute top-28 right-8 z-20 ${
            activeBrand === "tsc" ? "" : "pointer-events-none"
          }`}
        >
          {PARTNERS.map((p, i) => (
            <div
              key={p.alt}
              className={`bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-md px-4 py-2.5 flex items-center justify-center transition-all duration-700 ease-out ${
                activeBrand === "tsc" ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
              }`}
              style={{
                marginLeft: `${i * 20}px`,
                transitionDelay: activeBrand === "tsc" ? `${200 + i * 150}ms` : "0ms",
              }}
            >
              <Image src={p.src} alt={p.alt} width={p.w} height={p.h} className="object-contain" />
            </div>
          ))}
        </div>

        {/* Intestazione / Badge */}
        <div className="relative z-50 flex justify-between items-center w-full gap-2 mt-6 md:mt-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white/90 shadow-sm backdrop-blur-md">
            <Coffee size={13} className="text-amber-800 shrink-0" />
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-800 whitespace-nowrap">
              San Clemente (CE)
            </span>
          </div>

          {activeBrand === "tsc" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveBrand(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm hover:bg-slate-200 transition-all hover:scale-105 shrink-0"
            >
              <X size={14} /> Chiudi
            </button>
          )}
        </div>

        {/* Contenuto centrale: logo & testo */}
        <div
          className={`relative z-40 my-auto w-full max-w-lg mx-auto transition-all duration-700 ease-in-out ${
            activeBrand === "tsc" ? "text-center md:text-left md:mx-0" : "text-center"
          }`}
        >
          <div
            className={`relative transition-all duration-700 ease-out mx-auto ${
              activeBrand === "tsc"
                ? "w-60 sm:w-72 md:w-96 h-20 sm:h-24 md:h-28 md:mx-0 mb-3"
                : "w-52 sm:w-64 md:w-80 h-16 sm:h-20 mb-3"
            }`}
          >
            <Image
              src="/icons/logo.svg"
              alt="Tabacchi San Clemente Caffè Logo"
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>

          <p className="text-slate-800 text-sm sm:text-base font-semibold mt-3 px-2 break-words">
            Il buongiorno inizia da Noi.
          </p>

          {/* Dettagli espansi con glassmorphism protettivo su mobile */}
          <div
            className={`transition-all duration-500 transform ${
              activeBrand === "tsc"
                ? "opacity-100 translate-y-0 max-h-[600px] mt-5 p-4 sm:p-5 md:p-0 bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-2xl md:rounded-none pointer-events-auto border border-slate-200/50 md:border-transparent shadow-sm md:shadow-none relative z-50"
                : "opacity-0 translate-y-6 max-h-0 pointer-events-none overflow-hidden"
            }`}
          >
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 max-w-md mx-auto md:mx-0 break-words">
              La tua pausa quotidiana a San Clemente. Colazioni artigianali, aperitivi, articoli da regalo, tabacchi e tutti i tuoi servizi di ricarica e bollettini in un unico posto.
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-slate-700 font-medium mb-5 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg max-w-full">
              <MapPin size={14} className="text-cyan-600 shrink-0" />
              <span className="break-words">Via Galatina N° 95, San Clemente (CE)</span>
            </div>

            {/* PARTNER — versione mobile: in linea nel flusso, non in overlay */}
            <div className="flex md:hidden flex-wrap items-center justify-center gap-2.5 mb-5">
              {PARTNERS.map((p) => (
                <div
                  key={p.alt}
                  className="bg-white border border-slate-200 rounded-lg shadow-sm px-2.5 py-1.5 flex items-center justify-center"
                >
                  <Image src={p.src} alt={p.alt} width={p.w} height={p.h} className="object-contain h-5 w-auto" />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                href="/site-tsc"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 relative z-30"
              >
                Entra nel Sito <ArrowRight size={16} />
              </Link>
            </div>

            {/* Social TSC */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2 mt-5 text-slate-600 text-xs font-semibold relative z-30">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold w-full md:w-auto text-center md:text-left">
                Social:
              </span>
              <a
                href="https://instagram.com/tsccaffe"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-cyan-600 transition-colors flex items-center gap-1"
              >
                <Instagram size={15} /> @tsccaffe
              </a>
              <a
                href="https://www.tiktok.com/@tsccaffe"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-[#ff0050] transition-colors flex items-center gap-1"
              >
                <TikTokIcon size={15} /> @tsccaffe
              </a>
              <a
                href="https://facebook.com/tsccaffe"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Facebook size={15} /> @tsccaffe
              </a>
            </div>
          </div>
        </div>

        {!activeBrand && (
          <div className="relative z-20 text-center md:text-left text-[11px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
            Tocca per scoprire
          </div>
        )}
      </section>
    </main>
  );
}