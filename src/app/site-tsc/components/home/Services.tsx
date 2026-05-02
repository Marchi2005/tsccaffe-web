"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Coffee, Sparkles, Check } from "lucide-react";

export default function Services() {
  return (
    <section id="servizi" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">I Nostri Servizi</h2>
          <p className="mt-4 text-lg text-slate-600">Tutto ciò di cui hai bisogno in un'unica sosta.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Servizi & Shop */}
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-md flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-brand-cyan/15 lg:hover:-translate-y-2 z-10">
            
            {/* Effetti di luce Sfondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-cyan/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

            {/* Icona Animata */}
            <div className="relative mb-6 bg-slate-50 border border-slate-100 text-brand-cyan w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
               <Package size={30} className="group-hover:text-slate-800 transition-colors duration-500" />
               <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-cyan rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
               <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-3 relative z-10">Servizi & Shop</h3>
            <p className="text-slate-600 mb-6 text-[15px] leading-relaxed relative z-10 flex-grow">
               Il tuo punto di riferimento quotidiano. Dal pagamento bollettini alle ricariche, fino all'esclusivo mondo dei dispositivi.
            </p>

            {/* Lista Servizi Premium */}
            <ul className="space-y-3 mb-8 relative z-10">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 group/item">
                    <div className="w-5 h-5 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan group-hover/item:bg-brand-cyan group-hover/item:text-white transition-colors">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    glo™ Premium Partner
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 group/item">
                    <div className="w-5 h-5 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan group-hover/item:bg-brand-cyan group-hover/item:text-white transition-colors">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    IQOS Partner Ufficiale
                </li>
            </ul>

            {/* CTA Button */}
            <div className="relative mt-auto z-10 w-full">
               <Link 
                  href="/servizi" 
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl hover:bg-brand-cyan hover:text-white hover:border-brand-cyan transition-all duration-300 active:scale-95 group/item-btn"
               >
                  <span className="font-bold text-sm tracking-wide">Scopri tutti i servizi</span>
                  <ArrowRight size={16} className="group-hover/item-btn:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>

          {/* Card 2: Bar & Caffetteria */}
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-brand-coffee/20 p-6 sm:p-8 shadow-xl md:scale-105 z-20 flex flex-col text-center items-center justify-center transition-all duration-500 hover:shadow-2xl hover:shadow-brand-coffee/20 lg:hover:-translate-y-2">
            
            {/* Effetti di luce Sfondo */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-coffee/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-coffee/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

            {/* Icona Animata */}
            <div className="relative mb-6 bg-gradient-to-br from-brand-coffee/20 to-brand-coffee/5 text-brand-coffee w-20 h-20 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
               <Coffee size={36} className="group-hover:-rotate-12 transition-transform duration-500" />
               <Sparkles size={14} className="absolute top-2 right-2 text-amber-600 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-3 relative z-10">Bar & Caffetteria</h3>
            <p className="text-slate-600 mb-8 text-[15px] leading-relaxed max-w-xs mx-auto relative z-10 flex-grow">
               Il cuore del nostro locale. Inizia la giornata col profumo del caffè appena macinato e brioche calde, oppure prenota la tua colazione d'asporto.
            </p>

            {/* Doppia CTA (Tasti) */}
            <div className="w-full flex flex-col gap-3 relative mt-auto z-10">
               <Link 
                  href="/prenota-colazione" 
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-coffee text-white rounded-xl shadow-md hover:bg-amber-900 hover:shadow-lg transition-all active:scale-95 group/item-btn"
               >
                  <span className="font-bold text-sm tracking-wide">Ordina Colazione</span>
                  <ArrowRight size={16} className="group-hover/item-btn:translate-x-1 transition-transform" />
               </Link>
               
               <Link 
                  href="/menu" 
                  className="w-full flex items-center justify-center px-6 py-3 border-2 border-brand-coffee/15 text-brand-coffee rounded-xl hover:bg-brand-coffee/5 hover:border-brand-coffee/30 transition-colors active:scale-95"
               >
                  <span className="font-bold text-sm">Sfoglia il Menù</span>
               </Link>
            </div>
          </div>

          {/* Card 3: LUNA EVENTS SPOILER (RIDISEGNATA E ARMONIZZATA) */}
          <div className="group relative overflow-hidden rounded-3xl bg-[#FAF8F5] border border-[#E8E1D9] p-6 sm:p-8 shadow-lg flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-[#7A0018]/15 lg:hover:-translate-y-2 cursor-default z-10">
            
            {/* Effetti di luce Sfondo - Sincronizzati con le altre card */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7A0018]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#7A0018]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" style={{ animationDelay: '1s' }}></div>

            {/* Badge In Arrivo */}
            <div className="flex justify-center mb-4 z-10 relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#7A0018]/20 bg-white/70 backdrop-blur-sm shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Sparkles size={12} className="text-[#7A0018]" />
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#7A0018]">In Arrivo</span>
                </div>
            </div>

            {/* AREA SPOILER: Logo Luna Interattivo */}
            <div className="relative flex flex-col items-center justify-center py-6 mb-2 lg:group-hover:scale-105 lg:group-hover:-translate-y-1 transition-all duration-700">
                
                {/* Watermark Logo SVG - Animazione opacità all'hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none">
                    <Image
                        src="/icons/moon.svg"
                        alt="Sfondo Luna"
                        width={220}
                        height={220}
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                    />
                </div>
                
                {/* Testi Logo */}
                <h2
                    className="font-luna text-5xl md:text-6xl text-[#7A0018] relative z-10 leading-none drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-500"
                    style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                >
                    Luna
                </h2>
                <span className="text-[#7A0018] font-serif uppercase text-[0.6rem] md:text-xs tracking-[0.5em] relative z-10 mt-[-3px] pl-1 opacity-90 block text-center font-bold">
                    Events
                </span>
            </div>

            {/* Descrizione Servizio */}
            <div className="relative text-center mb-8 z-10 flex-grow">
              <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                L'eleganza incontra la magia. <br className="hidden sm:block"/>
                Un'esperienza esclusiva e curata nei minimi dettagli per i tuoi eventi.
              </p>
            </div>

            {/* Area Azione: Bottone Premium Armonizzato */}
            <div className="relative mt-auto z-10 flex justify-center w-full">
               <Link 
                  href="/site-luna" 
                  className="relative w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#7A0018] text-white rounded-xl shadow-md hover:bg-[#5C0012] hover:shadow-lg hover:shadow-[#7A0018]/20 transition-all duration-300 active:scale-95 group/item-btn"
               >
                  <span className="text-xs sm:text-sm uppercase tracking-widest font-bold">
                     Scopri l'anteprima
                  </span>
                  <ArrowRight size={18} className="group-hover/item-btn:translate-x-1 transition-transform duration-300" />
               </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}