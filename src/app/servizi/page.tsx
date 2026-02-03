"use client";

import Navbar from "@/components/layout/Navbar";
import {
  CreditCard,
  Smartphone,
  Package,
  Files,
  Zap,
  Ticket,
  MapPin,
  Flame,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";

// --- DATI DEI SERVIZI ---

const PAYMENT_SERVICES = [
  {
    icon: CreditCard,
    title: "Pagamenti Bollettini",
    desc: "PagoPA, MAV, RAV e bollettini postali. Paga in sicurezza e salta la fila.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: Smartphone,
    title: "Ricariche Telefoniche",
    desc: "Tutti i gestori disponibili: TIM, Vodafone, WindTre, Iliad, Kena, Ho.",
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    icon: Zap,
    title: "Ricariche Conto & Carte",
    desc: "Postepay, PayPal, Mooney e carte prepagate internazionali.",
    color: "bg-amber-50 text-amber-600"
  },
  {
    icon: Ticket,
    title: "Biglietteria",
    desc: "Biglietti Trenitalia, UnicoCampania e abbonamenti per il trasporto locale.",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: Files,
    title: "Servizi Digitali",
    desc: "Marche da bollo telematiche e invio documenti.",
    color: "bg-slate-100 text-slate-600"
  }
];

// --- DATI AGGIORNATI CON SCONTI E LOGHI ---

const PRODUCT_OFFERS = [
  {
    id: "glo-hilo-plus",
    isNew: true, // Questo avrà il badge
    brandLogo: "/icons/glo-logo.svg",
    brandName: "GLO",
    model: "glo™ HILO PLUS",
    fullPrice: "69,00€",
    discountPrice: "49,00€",
    hasDiscount: true,
    colors: ["bg-[#751423]", "bg-[#F1BA94]", "bg-[#2B6651]", "bg-[#272727]", "bg-[#D5A596]", "bg-[#422E4D]", "bg-[#202843]"],
    image: "/images/hilo-plus/ruby-hilo-plus-pen_charger_2.png", // Immagine principale per la card
    images: [
      "/images/hilo-plus/ruby-hilo-plus_2.png",
      "/images/hilo-plus/ruby-hilo-plus-pen_2.png",
      "/images/hilo-plus/amber-hilo-plus-pen_charger_2.png",
      "/images/hilo-plus/coral-hilo-plus-pen_charger_2.png",
      "/images/hilo-plus/emerald-hilo-plus-pen_charger_2.png",
      "/images/hilo-plus/sapphire-hilo-plus-pen_charger_2.png",
      "/images/hilo-plus/onyx-hilo-plus-pen_charger_3.png",
      "/images/hilo-plus/amethyst-hilo-plus-pen_charger_2.png"
    ],
    bg: "bg-[#f4f4f7]",
    tag: "Sconto Nuovi Clienti",
    description: [
      { type: "title", content: "La rivoluzione del gusto" },
      { type: "paragraph", content: "Gusto intenso, dall’inizio alla fine. ​Modalità standard e boost, scegli quella giusta per te. Compatibile esclusivamente con virto™ e rivo™." },
      { type: "title", content: "TurboStart™" },
      { type: "paragraph", content: "Dallo start al gusto in 5 secondi." },
      { type: "title", content: "EasyView™" },
      { type: "paragraph", content: "Controllo completo e un’interfaccia semplice e intuitiva grazie allo schermo LED." },
      { type: "title", content: "EasySwitch™​" },
      { type: "paragraph", content: "Scegli se utilizzare il pennino dentro o fuori dal case di ricarica, anche nel mezzo della sessione." },
      { type: "title", content: "Super compatto" },
      { type: "paragraph", content: "Il dispositivo 2 pezzi super compatto.​"}
    ],
    features: ["Accendi, inserisci e parti!", "2 modalità: Standard e Boost", "Solo 5 Secondi di attesa", "App myGlo per gestire e trovare il dispositivo"],
    note: ""
  },
  {
    id: "glo-hilo",
    isNew: true,
    brandLogo: "/icons/glo-logo.svg",
    brandName: "GLO",
    model: "glo™ HILO",
    fullPrice: "29,00€",
    discountPrice: "19,00€",
    hasDiscount: true,
    colors: ["bg-[#751423]", "bg-[#F1BA94]", "bg-[#2B6651]", "bg-[#272727]", "bg-[#D5A596]", "bg-[#422E4D]", "bg-[#202843]"],
    image: "/images/hilo/ruby_2.png", // Immagine principale per la card
    images: [
      "/images/hilo/ruby_1.png",
      "/images/hilo/amber.png",
      "/images/hilo/coral.png",
      "/images/hilo/emerald.png",
      "/images/hilo/sapphire.png",
      "/images/hilo/onyx.png",
      "/images/hilo/amethyst.png"
    ],
    bg: "bg-[#f4f4f7]",
    tag: "Sconto Nuovi Clienti",
    description: [
      { type: "title", content: "La rivoluzione del gusto" },
      { type: "paragraph", content: "Gusto intenso, dall’inizio alla fine. ​Modalità standard e boost, scegli quella giusta per te. Compatibile esclusivamente con virto™ e rivo™." },
      { type: "title", content: "TurboStart™" },
      { type: "paragraph", content: "Dallo start al gusto in 5 secondi." },
      { type: "title", content: "EasyView™" },
      { type: "paragraph", content: "Controllo completo e un’interfaccia semplice e intuitiva grazie allo schermo LED." }
    ],
    features: ["Accendi, inserisci e parti!", "2 modalità: Standard e Boost", "Solo 5 Secondi di attesa", "App myGlo per gestire e trovare il dispositivo"],
    note: "Offerta Soggetta a limitazioni, solo Per Nuovi Clienti glo™"
  },
  {
    id: "iqos-iluma-i",
    isNew: false,
    brandLogo: "/icons/iqos-logo.svg",
    brandName: "IQOS",
    model: "ILUMA i",
    discountPrice: "59,00€",
    hasDiscount: false,
    colors: ["bg-[#D1F0F2]", "bg-[#575B69]"],
    image: "/images/iqos-iluma-i/iqos-iluma-i-main.png", // Immagine principale per la card
    images: [
      "/images/iqos-iluma-i/iqos-iluma-i-breezeblue-1.png",
      "/images/iqos-iluma-i/iqos-iluma-i-breezeblue-2.png",
      "/images/iqos-iluma-i/iqos-iluma-i-midnightblack-1.png",
      "/images/iqos-iluma-i/iqos-iluma-i-midnightblack-2.png"
    ],
    bg: "bg-[#f4f4f7]",
    tag: "Sconto Trade-in",
    description: "Iconico. Avanzato. Il nuovo dispositivo della linea IQOS ILUMA i, che unisce nuove funzionalità avanzate all'affidabilità della tecnologia SMARTCORE INDUCTION SYSTEM™ per un'esperienza di utilizzo avanzata, pensata per te. Pieno controllo del dispositivo con Touch Screen, maggiore flessibilità con Pause Mode , fino a 3 utilizzi consecutivi con una sola ricarica grazie alla funzionalità FlexBattery. L' adattatore di alimentazione non è incluso.",
    features: ["Modalità Pausa", "Touch Screen", "Senza lamina, nessuna pulizia"],
    note: ""
  },
  {
    id: "iqos-iluma-i-one",
    isNew: false,
    brandLogo: "/icons/iqos-logo.svg",
    brandName: "IQOS",
    model: "ILUMA i ONE",
    discountPrice: "29,00€",
    hasDiscount: false,
    colors: ["bg-[#D1F0F2]", "bg-[#575B69]"],
    image: "/images/iqos-iluma-i-one/iqos-iluma-i-one-main.png", // Immagine principale per la card
    images: [
      "/images/iqos-iluma-i-one/iqos-iluma-i-one-breezeblue-1.png",
      "/images/iqos-iluma-i-one/iqos-iluma-i-one-breezeblue-2.png",
      "/images/iqos-iluma-i-one/iqos-iluma-i-one-midnightblack-1.png",
      "/images/iqos-iluma-i-one/iqos-iluma-i-one-midnightblack-2.png"
    ],
    bg: "bg-[#f4f4f7]",
    tag: "Sconto Trade-in",
    description: "Compatto, evoluto. Il nuovo dispositivo della linea IQOS ILUMA i che unisce nuove funzionalità avanzate all'affidabilità della tecnologia SMARTCORE INDUCTION SYSTEM™ per un'esperienza di utilizzo avanzata, pensata per te. IQOS ILUMA i ONE consente 20 utilizzi consecutivi con una sola ricarica e ora, grazie all' Accensione Automatica, permette di preriscaldare lo stick una volta inserito, senza dover premere alcun tasto, per un utilizzo più semplice e intuitivo. L'adattore di alimentazione non è inlcuso.",
    features: ["Accensione automatica", "Touch Screen", "Senza lamina, nessuna pulizia"],
    note: ""
  },

];

// --- COMPONENTI UI ---

function ServiceCard({ service }: { service: typeof PAYMENT_SERVICES[0] }) {
  const Icon = service.icon;
  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300">
      <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", service.color)}>
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="text-slate-900 font-bold text-lg mb-2">{service.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
    </div>
  );
}

export default function ServicesPage() {
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCT_OFFERS[0] | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0); // Gestisce quale foto mostrare

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">

      <main className="flex-grow">

        {/* HEADER HERO */}
        <section className="bg-white pt-32 pb-16 lg:pt-40 lg:pb-24 border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6">
              <ShoppingBag size={14} />
              Multiservizi & Store
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Più di un semplice <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
                Tabacchi di quartiere.
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Dalle spedizioni ai pagamenti, passando per la nostra selezione di articoli per fumatori.
              Tutto quello che ti serve, in un unico posto.
            </p>
          </div>
        </section>

        {/* SEZIONE 1: SERVIZI UTILI (GRID) */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Servizi Rapidi</h2>
                <p className="text-slate-500 mt-2">Salta la fila in posta. Gestisci tutto dal nostro terminale.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PAYMENT_SERVICES.map((service, idx) => (
                <ServiceCard key={idx} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* SEZIONE 2: SPEDIZIONI (FEATURED) */}
        <section className="py-20 bg-slate-900 text-slate-300 relative overflow-hidden">
          {/* Pattern sfondo opzionale */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                  <Package size={16} /> Hub Spedizioni
                </div>
                <h2 className="text-4xl font-bold text-white leading-tight">
                  Invia e ricevi i tuoi pacchi <br />
                  senza stress.
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Siamo un punto di ritiro e spedizione certificato per Poste Italiane e Amazon Hub.
                  Affidaci i tuoi pacchi e approfitta dei nostri servizi di reso facili e veloci.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="text-white font-bold mb-1">Punto di Ritiro</div>
                    <div className="text-xs text-slate-400">Amazon, UPS, DHL, Poste Italiane, GLS</div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="text-white font-bold mb-1">Resi Facili</div>
                    <div className="text-xs text-slate-400">Stampa etichetta in sede con codice digitale</div>
                  </div>
                </div>
              </div>

              {/* Box visivo / Illustrativo */}
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl relative">
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  APERTO ORA
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                      <MapPin className="text-emerald-400" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Punto Tabacchi San Clemente / Ricevitoria N.29</h4>
                      <p className="text-sm text-slate-400">Utilizza il nostro indirizzo per i tuoi ordini online.</p>
                    </div>
                  </div>
                  <hr className="border-slate-700" />
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span>Punto Poste</span>
                      <span className="text-emerald-400 font-medium">Attivo</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Amazon Hub</span>
                      <span className="text-emerald-400 font-medium">Attivo</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Vinted</span>
                      <span className="text-emerald-400 font-medium">Attivo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* SEZIONE OFFERTE */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Le nostre offerte.</h2>
            <p className="text-slate-500 mb-12">Clicca su una card per scoprire tutti i dettagli.</p>

            {/* Container Carosello con padding per non tagliare l'ombra */}
            <div className="flex overflow-x-auto pb-12 pt-4 gap-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
              {PRODUCT_OFFERS.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={clsx(
                    "snap-center shrink-0 w-[85vw] md:w-[400px] h-[500px] rounded-[2.5rem] cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 relative overflow-hidden group",
                    product.bg
                  )}
                >
                  {/* Badge "NEW" - Appare solo se isNew è true */}
                  {product.isNew && (
                    <div className="absolute top-6 right-6 z-20">
                      <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg animate-in fade-in zoom-in duration-300">
                        NEW
                      </span>
                    </div>
                  )}

                  {/* Immagine Main */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <img
                      src={product.image}
                      className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
                      alt={product.model}
                    />
                  </div>

                  {/* Overlay Testuale Superiore */}
                  <div className="relative z-10 p-8 bg-gradient-to-b from-white/40 via-transparent to-transparent">
                    <div className="h-6 mb-3">
                      <img src={product.brandLogo} alt={product.brandName} className="h-full opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{product.model}</h3>

                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xl font-bold text-slate-800">
                        {product.discountPrice }
                        {product.fullPrice && <span className="text-blue-500 ml-0.5">*</span>}
                      </span>

                      {/* Prezzo Pieno (Visualizzato solo se esiste) */}
                      {product.fullPrice && (
                        <span className="text-sm text-slate-400 line-through decoration-slate-300 font-medium">
                          {product.fullPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Inferiori */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex justify-between items-end bg-gradient-to-t from-white/20 to-transparent">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-slate-100 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                      Scopri di più
                    </span>

                    <div className="flex gap-1.5 bg-white/50 backdrop-blur-md p-2 rounded-full border border-white/50">
                      {product.colors.map((colorClass, i) => (
                        <div key={i} className={clsx("w-3.5 h-3.5 rounded-full border border-white shadow-sm", colorClass)} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LEGENDA NOTE ESTERNA (Sotto il carosello) */}
            <div className="mt-8 space-y-2 border-t border-slate-100 pt-8">
              {PRODUCT_OFFERS.map((p) => p.note && (
                <p key={p.id} className="text-xs text-slate-400 font-medium">
                  <span className="text-blue-500 font-bold mr-1">*</span> {p.note}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* --- OVERLAY DETTAGLI CON SLIDER IMMAGINI --- */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300"
              onClick={() => setSelectedProduct(null)}
            />

            <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-400">

              {/* Bottone Chiudi */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-30 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-slate-100 transition-all shadow-sm"
              >
                <span className="text-xl">✕</span>
              </button>

              {/* LATO SINISTRO: GALLERY CON FRECCE */}
              <div className={clsx("w-full md:w-3/5 relative group flex items-center justify-center overflow-hidden", selectedProduct.bg)}>

                {/* Immagine Attuale con Animazione */}
                <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center p-12">
                  <img
                    key={currentImgIndex}
                    src={selectedProduct.images[currentImgIndex]}
                    className="max-h-full object-contain drop-shadow-3xl animate-in fade-in zoom-in-95 duration-500"
                    alt={selectedProduct.model}
                  />
                </div>

                {/* Freccia Sinistra (appare al hover) */}
                {currentImgIndex > 0 && (
                  <button
                    onClick={() => setCurrentImgIndex(prev => prev - 1)}
                    className="absolute left-6 z-30 w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50"
                  >
                    ←
                  </button>
                )}

                {/* Freccia Destra (appare al hover) */}
                {currentImgIndex < selectedProduct.images.length - 1 && (
                  <button
                    onClick={() => setCurrentImgIndex(prev => prev + 1)}
                    className="absolute right-6 z-30 w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50"
                  >
                    →
                  </button>
                )}

                {/* Indicatori (Pallini cliccabili) */}
                <div className="absolute bottom-8 flex gap-2.5 z-30">
                  {selectedProduct.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImgIndex(idx)}
                      className={clsx(
                        "h-1.5 transition-all duration-300 rounded-full",
                        currentImgIndex === idx ? "w-8 bg-slate-800" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* LATO DESTRO: INFO (Sticky su desktop) */}
              <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                <div className="sticky top-0 bg-white z-10 pb-4">
                  <img src={selectedProduct.brandLogo} className="h-5 mb-6 opacity-40" alt="" />
                  <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">{selectedProduct.model}</h2>

                  <div className="flex items-center gap-4 mb-8">
                    <p className="text-3xl font-bold text-blue-600">
                      {selectedProduct.discountPrice}
                      {selectedProduct.note && <span className="text-blue-500 ml-0.5">*</span>}
                    </p>
                    <div className="flex gap-1.5 border-l pl-4 border-slate-200">
                      {selectedProduct.colors.map((c, i) => (
                        <div key={i} className={clsx("w-4 h-4 rounded-full border border-slate-200 shadow-sm", c)} />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Dettagli Prodotto</h4>

                  <div className="space-y-6">
                    {Array.isArray(selectedProduct.description) ? (
                      selectedProduct.description.map((item, idx) => (
                        <div key={idx}>
                          {item.type === "title" ? (
                            <h5 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                              {item.content}
                            </h5>
                          ) : (
                            <p className="text-slate-600 leading-relaxed text-lg mb-4">
                              {item.content}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      // Questo serve come "paracadute" se la descrizione è ancora una stringa semplice
                      <p className="text-slate-600 leading-relaxed text-lg">{selectedProduct.description}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Specifiche Tecniche</h4>
                  <ul className="space-y-4">
                    {selectedProduct.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-700">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        </div>
                        <span className="font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-10 border-t border-slate-100 pb-4">
                  <Link
                    href={`https://wa.me/39XXXXXXXXXX?text=Ciao! Vorrei informazioni su ${selectedProduct.brandName} ${selectedProduct.model}`}
                    target="_blank"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg"
                  >
                    <Smartphone size={22} />
                    Chiedi in negozio
                  </Link>
                  {selectedProduct.note && (
                    <p className="text-[11px] text-slate-400 mt-6 text-center leading-relaxed italic">
                      <span className="text-blue-500 font-bold mr-1">*</span> {selectedProduct.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
        }
      </main >
    </div >
  );
}