"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wifi, Package, Coffee, MapPin, ArrowUp, Eye, Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
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

export default function Home() {
  const [showWifiPass, setShowWifiPass] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // STATO PER GESTIRE IL NOME SOCIAL
  const [socialHandle, setSocialHandle] = useState("@tabacchisanclementecaffe");
  const [isTikTokHovered, setIsTikTokHovered] = useState(false);

  // Gestione apparizione tasto "Torna su"
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans relative">

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-28 lg:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
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
                  ai servizi utili. Siamo orgogliosamente <strong>GLO Partner</strong>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                  <Link 
                    href="/prenota-box" 
                    className="inline-flex justify-center items-center px-8 py-3.5 text-base font-bold text-white bg-brand-red rounded-xl shadow-lg hover:bg-red-700 transition-all hover:-translate-y-1"
                  >
                    Prenota Box San Valentino
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
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-cyan/10 to-brand-red/5 rounded-full blur-3xl -z-10"></div>
                  
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 animate-fade-in mb-8">
                    <Image 
                      src="/icons/logo.svg" 
                      alt="TSC Caffè Logo" 
                      fill 
                      className="object-contain drop-shadow-xl"
                      priority
                    />
                  </div>

                  {/* NUOVO: Social Banner INTERATTIVO */}
                  <div className="flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Seguici sui social</span>
                    
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 p-1.5 pr-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      
                      {/* Instagram */}
                      <a 
                        href="https://instagram.com/tabacchisanclementecaffe" 
                        target="_blank"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-gradient-to-tr hover:from-purple-500 hover:to-orange-500 hover:text-white transition-all text-slate-600"
                        title="Instagram"
                        // Quando torno sugli altri social, rimetto il nome lungo
                        onMouseEnter={() => {
                            setSocialHandle("@tabacchisanclementecaffe");
                            setIsTikTokHovered(false);
                        }}
                      >
                        <Instagram size={20} />
                      </a>

                      {/* TikTok - QUI avviene la magia */}
                      <a 
                        href="https://www.tiktok.com/@tssccaffe" 
                        target="_blank"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-[#ff0050] hover:text-white transition-all text-slate-600"
                        title="TikTok"
                        onMouseEnter={() => {
                            setSocialHandle("@tssccaffe");
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
                      
                      {/* Testo che cambia colore e contenuto */}
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

        {/* FEATURES GRID */}
        <section id="servizi" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">I Nostri Servizi</h2>
              <p className="mt-4 text-lg text-slate-600">Tutto ciò di cui hai bisogno in un'unica sosta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* Card 1: Servizi & Shop */}
              <div className="group relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm text-brand-dark group-hover:scale-110 transition-transform">
                   <Package size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Servizi & Shop</h3>
                <p className="text-slate-600 mb-6 flex-grow text-sm leading-relaxed">
                   Punto vendita autorizzato <strong>GLO</strong>. 
                   Pagamento bollettini, ricariche telefoniche e valori bollati. 
                   Tutto quello che serve per semplificare la tua giornata.
                </p>
                <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                        Glo Partner Ufficiale
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                        Pagamenti & Ricariche
                    </li>
                </ul>
                <Link href="#" className="mt-auto inline-flex items-center text-sm font-bold text-brand-cyan hover:text-brand-dark transition-colors">
                   Vedi le offerte dedicate <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>

              {/* Card 2: Bar & Caffetteria */}
              <div className="group relative overflow-hidden rounded-3xl bg-white border-2 border-brand-coffee/10 p-8 shadow-lg md:scale-105 z-10 flex flex-col text-center items-center justify-center">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-coffee to-transparent opacity-50"></div>
                <div className="mb-6 bg-brand-coffee/10 text-brand-coffee w-20 h-20 rounded-full flex items-center justify-center animate-pulse-slow">
                   <Coffee size={40} />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Bar & Caffetteria</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed max-w-xs mx-auto">
                   Il cuore del nostro locale. <br/>
                   Gustati una colazione lenta con le nostre brioche appena sfornate o un pranzo veloce e gustoso.
                </p>
                <Link href="/menu" className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-brand-coffee text-white font-bold text-sm hover:bg-amber-900 transition-colors shadow-md">
                   Vedi il Menù <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>

              {/* Card 3: WiFi */}
              <div className="group relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm text-brand-cyan group-hover:scale-110 transition-transform">
                   <Wifi size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Free WiFi Zone</h3>
                <p className="text-slate-600 mb-6 flex-grow text-sm leading-relaxed">
                   Devi lavorare o semplicemente navigare? 
                   Offriamo una connessione ultraveloce gratuita per tutti i nostri clienti.
                </p>
                <div className="mt-auto">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password Ospiti</p>
                  <button 
                    onClick={() => setShowWifiPass(!showWifiPass)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-brand-cyan transition-all group/btn"
                  >
                    <span className={clsx("font-mono text-sm font-bold", showWifiPass ? "text-brand-dark" : "text-slate-400")}>
                        {showWifiPass ? "TSCAP2025" : "Clicca per mostrare"}
                    </span>
                    <Eye size={16} className="text-slate-400 group-hover/btn:text-brand-cyan" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* LOCATION SECTION */}
        <section id="location" className="py-24 bg-slate-50 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
             <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-[2.5rem] p-4 shadow-xl overflow-hidden border border-slate-100">
                
                {/* Info Text */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                   <div className="inline-flex items-center gap-2 text-brand-cyan font-bold mb-2">
                      <MapPin size={20} />
                      <span>Raggiungici facilmente</span>
                   </div>
                   <h2 className="text-3xl font-bold text-slate-900 mb-6">Siamo a San Clemente</h2>
                   <p className="text-slate-600 mb-8 leading-relaxed">
                      Situati in Via Galatina 95, con facilità di parcheggio proprio di fronte all'ingresso. 
                      Ideale per una sosta veloce o una pausa relax.
                   </p>
                   
                   <div className="space-y-6">
                      <div className="flex items-start gap-4">
                         <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                            <MapPin size={24} />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-lg">Indirizzo</p>
                            <p className="text-slate-600">Via Galatina N° 95<br/>San Clemente, 81100 Caserta (CE)</p>
                         </div>
                      </div>
                      
                      <a 
                        href="https://maps.app.goo.gl/htWFNedwt93ESmYG6" 
                        target="_blank"
                        className="mt-6 w-full bg-slate-900 text-white text-center py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                      >
                          Apri in Google Maps <ArrowRight size={18} />
                      </a>
                   </div>
                </div>

                {/* Map Placeholder */}
                <div className="relative min-h-[400px] w-full bg-slate-200 rounded-3xl overflow-hidden">
                   <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.1896677162376!2d14.36590531301392!3d41.064846571223335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133a550011ef672f%3A0x4422ca38b38954bd!2sTabacchi%20San%20Clemente%20Caff%C3%A8!5e0!3m2!1sit!2sit!4v1770066540980!5m2!1sit!2sit" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                   ></iframe>
                </div>

             </div>
          </div>
        </section>

      </main>

      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className={clsx(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full bg-brand-dark text-white shadow-2xl transition-all duration-500 hover:bg-brand-red border border-white/10",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        aria-label="Torna su"
      >
        <ArrowUp size={24} />
      </button>

    </div>
  );
}