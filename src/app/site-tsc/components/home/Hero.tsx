"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, Facebook } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

// Icona TikTok personalizzata
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
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

export default function Hero() {
  const [socialHandle, setSocialHandle] = useState("@tabacchisanclementecaffe");
  const [isTikTokHovered, setIsTikTokHovered] = useState(false);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-28 lg:pb-32">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-4 leading-tight">
              Il buongiorno inizia <br />
              <span className="text-brand-cyan">da Noi.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Benvenuti a casa. Qui il caffè è un abbraccio e ogni pausa è un sorriso. 
              Siamo il tuo punto di riferimento quotidiano: dalle colazioni artigianali 
              ai servizi utili. Siamo orgogliosamente <strong>GLO™ & IQOS Partner</strong>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <Link 
                href="/prenota-colazione" 
                className="inline-flex justify-center items-center px-8 py-3.5 text-base font-bold text-white bg-brand-coffee rounded-xl shadow-lg hover:bg-amber-900 transition-all hover:-translate-y-1"
              >
                Prenota la tua Colazione
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="#location" 
                className="inline-flex justify-center items-center px-8 py-3.5 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
              >
                Vieni a trovarci
              </Link>
            </div>
          </div>

          {/* LOGO SVG AREA & SOCIAL BANNER */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-full flex flex-col justify-center items-center order-1 lg:order-2">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-cyan/10 to-amber-900/5 rounded-full blur-3xl -z-10"></div>
              
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 animate-fade-in mb-8">
                <Image 
                  src="/icons/logo.svg" 
                  alt="TSC Caffè Logo" 
                  fill 
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>

              {/* Social Banner INTERATTIVO */}
              <div className="flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Seguici sui social</span>
                
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 p-1.5 pr-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  
                  {/* Instagram */}
                  <a 
                    href="https://instagram.com/tabacchisanclementecaffe" 
                    target="_blank"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-gradient-to-tr hover:from-purple-500 hover:to-orange-500 hover:text-white transition-all text-slate-600"
                    title="Instagram"
                    onMouseEnter={() => {
                        setSocialHandle("@tabacchisanclementecaffe");
                        setIsTikTokHovered(false);
                    }}
                  >
                    <Instagram size={20} />
                  </a>

                  {/* TikTok */}
                  <a 
                    href="https://www.tiktok.com/@tsccaffe" 
                    target="_blank"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-[#ff0050] hover:text-white transition-all text-slate-600"
                    title="TikTok"
                    onMouseEnter={() => {
                        setSocialHandle("@tsccaffe");
                        setIsTikTokHovered(true);
                    }}
                    onMouseLeave={() => {
                        setSocialHandle("@tabacchisanclementecaffe");
                        setIsTikTokHovered(false);
                    }}
                  >
                     <TikTokIcon size={20} />
                  </a>

                  {/* Facebook */}
                  <a 
                    href="https://www.facebook.com/people/Tabacchi-San-Clemente/100012509505700/" 
                    target="_blank"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-blue-600 hover:text-white transition-all text-slate-600"
                    title="Facebook"
                     onMouseEnter={() => {
                        setSocialHandle("@tabacchisanclementecaffe");
                        setIsTikTokHovered(false);
                    }}
                  >
                    <Facebook size={20} />
                  </a>

                  <div className="h-8 w-px bg-slate-200 mx-2"></div>
                  
                  <span 
                    className={clsx(
                        "text-xs font-bold transition-colors duration-300 min-w-[150px]", 
                        isTikTokHovered ? "text-[#ff0050]" : "text-slate-700"
                    )}
                  >
                    {socialHandle}
                  </span>

                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}