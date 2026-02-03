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

const SHOP_CATEGORIES = [
  {
    title: "Vape & E-Cig",
    items: ["IQOS", "glo", "Liquidi Certificati", "Dispositivi Usa e Getta"],
    // image: "/images/vape-store.jpg", 
    icon: Zap
  },
  {
    title: "Accessori Fumo & Zippo",
    items: ["Accendini Clipper/Bic", "Zippo Originali", "Cartine & Filtri", "Idee Regalo"],
    // image: "/images/lighters.jpg",
    icon: Flame
  }
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
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

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

        {/* SEZIONE 3: SHOP & VETRINA */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl font-bold text-slate-900 mb-4">Lo Shop</h2>
               <p className="text-slate-500">
                 Una selezione curata di articoli per fumatori e accessori.
                 Vieni a trovarci per scoprire l'assortimento completo.
               </p>
            </div>

            {/* Layout Shop centrato con max-width per 2 elementi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               {SHOP_CATEGORIES.map((cat, idx) => (
                 <div key={idx} className="group relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all duration-300 h-80 lg:h-96">
                    {/* Background decorativo */}
                    <div className="absolute inset-0 bg-slate-100 group-hover:bg-slate-200 transition-colors" />
                    
                    {/* Overlay Contenuto */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                          <cat.icon size={24} className="text-slate-900" />
                       </div>
                       
                       <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:translate-x-1 transition-transform">{cat.title}</h3>
                          <ul className="space-y-2">
                             {cat.items.map((item, i) => (
                                <li key={i} className="text-slate-600 text-sm flex items-center gap-2">
                                   <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                   {item}
                                </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Banner Avviso Legale Discreto */}
            <div className="mt-12 p-4 bg-slate-50 rounded-xl text-center max-w-2xl mx-auto">
               <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  I prodotti del tabacco e da inalazione non sono venduti online. Acquisto riservato ai maggiorenni in negozio.
               </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
           <div className="mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Hai bisogno di altro?</h2>
              <p className="text-slate-600 mb-8">
                 Siamo sempre disponibili per informazioni su spedizioni specifiche, disponibilità prodotti o servizi particolari.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link 
                    href="/#contatti" 
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                 >
                    Contattaci
                 </Link>
                 <Link 
                    href="/" 
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-50 transition-all"
                 >
                    Torna alla Home
                 </Link>
              </div>
           </div>
        </section>

      </main>
      
      {/* Footer gestito dal Layout */}
    </div>
  );
}