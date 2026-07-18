"use client";

import Link from "next/link";
import localFont from 'next/font/local';
import {
  Heart,
  Mail,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Sparkles,
  Moon,
  Coffee,
  Archive,
  Megaphone,
  Ticket,
  ShieldCheck,
  Clock
} from "lucide-react";
import clsx from "clsx";

// --- CONFIGURAZIONE FONT LUNA ---
const lunaFont = localFont({
  src: [
    {
      path: '../../fonts/mending.regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-luna',
});

export default function AdminDashboard() {

  // --- MODULI ATTIVI ---
  const activeModules = [
    {
      id: "colazioni",
      title: "Ordini Colazioni",
      desc: "Gestisci le prenotazioni quotidiane, incassa, visualizza gli scontrini e stampa le comande.",
      icon: Coffee,
      href: "/admin/colazioni",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "hover:border-amber-200",
      style: "light"
    },
    {
      id: "coupons",
      title: "Coupon & Sconti",
      desc: "Crea e gestisci i codici promozionali, gli sconti fissi o percentuali per il checkout.",
      icon: Ticket,
      href: "/admin/coupons",
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "hover:border-rose-200",
      style: "light"
    },
    {
      id: "announcements",
      title: "Avvisi & Popup",
      desc: "Gestisci i popup del sito: comunicazioni urgenti, promozioni e guasti.",
      icon: Megaphone,
      href: "/admin/announcements",
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "hover:border-violet-200",
      style: "light"
    },
    {
      id: "prodotti",
      title: "Gestione Prodotti Web",
      desc: "Aggiorna prezzi, attiva sconti e modifica lo stato 'Novità' per il sito vetrina.",
      icon: ShoppingBag,
      href: "/admin/products",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-200",
      style: "light"
    },
    {
      id: "email",
      title: "Invia Email",
      desc: "Invia comunicazioni ai clienti o notifiche di servizio.",
      icon: Mail,
      href: "/admin/email",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "hover:border-emerald-200",
      style: "light"
    },
    {
      id: "quick-services",
      title: "Servizi Rapidi",
      desc: "Gestisci bollettini, ricariche, titoli, descrizioni e metodi di pagamento accettati.",
      icon: ShieldCheck,
      href: "/admin/quick-services",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "hover:border-cyan-200",
      style: "light"
    },
    {
      id: "luna",
      title: "Luna Events",
      desc: "Gestione richieste, elaborazione e invio preventivi personalizzati.",
      icon: Moon, 
      href: "/admin/luna-events/preventivi", // REINDIRIZZA DIRETTAMENTE ALLA LISTA PREVENTIVI
      style: "luna-brand" // Identificatore per la nuova card
    },
    {
      id: "orari",
      title: "Gestione Orari",
      desc: "Modifica gli orari settimanali del locale e aggiungi chiusure straordinarie (ferie, festività).",
      icon: Clock,
      href: "/admin/orari",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "hover:border-indigo-200",
      style: "light"
    }
  ];

  // --- MODULI ARCHIVIATI (Disattivati) ---
  const archivedModules = [
    {
      id: "san-valentino",
      title: "San Valentino 2026",
      desc: "Archivio ordini e statistiche dell'evento concluso.",
      icon: Heart,
      href: "/admin/san-valentino"
    }
  ];

  return (
    <div className={clsx("min-h-screen bg-slate-50 p-6 md:p-12 font-sans", lunaFont.variable)}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">
              Admin Area
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Benvenuto nell'area di gestione centralizzata.</p>
          </div>
          {/* IL POVERO TASTO ESCI È TORNATO ESATTAMENTE COME PRIMA */}
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors font-medium text-sm bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-red-50 hover:border-red-200"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Esci</span>
          </Link>
        </div>

        {/* --- GRID MODULI ATTIVI --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {activeModules.map((mod) => {

            // --- NUOVA CARD LUNA EVENTS (Panna & Bordeaux) ---
            if (mod.style === "luna-brand") {
              return (
                <Link
                  key={mod.id}
                  href={mod.href}
                  className="group relative bg-[#FAF8F5] rounded-3xl p-8 border-2 border-[#E8E1D9] shadow-lg overflow-hidden hover:border-[#7A0018]/40 hover:shadow-xl hover:shadow-[#7A0018]/5 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Sfumatura elegante di sfondo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FAF8F5] to-[#F5EFE6] opacity-80" />

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start mb-6">
                      
                      {/* Logo Luna Events */}
                      <div className="h-16 w-[120px] flex items-center justify-center">
                        <img 
                          src="/icons/logo_luna.png" 
                          alt="Luna Events Logo" 
                          className="w-full h-full object-contain" 
                        />
                      </div>

                      {/* Badge in stile Bordeaux */}
                      <div className="bg-[#7A0018]/10 text-[#7A0018] px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 border border-[#7A0018]/20">
                        <Sparkles size={10} /> Area Dedicata
                      </div>
                    </div>

                    <div>
                      <div className="mb-2">
                        <h3 className="text-2xl font-serif font-bold text-[#7A0018]">Gestione Preventivi</h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 border-l-2 border-[#7A0018]/30 pl-3">
                        {mod.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[#7A0018] text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                      Accedi al Modulo <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            }

            // --- Render Card Classiche ---
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={mod.href}
                className={`
                  group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm 
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${mod.border}
                `}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${mod.bg} ${mod.color}`}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                  {mod.title}
                </h2>
                <p className="text-slate-500 leading-relaxed text-sm mb-6">
                  {mod.desc}
                </p>

                <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ChevronRight size={18} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* --- SEZIONE ARCHIVIO (San Valentino ecc.) --- */}
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-4 px-2">
            <Archive size={16} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Archivio Eventi Passati</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {archivedModules.map((mod) => (
              <Link
                key={mod.id}
                href={mod.href}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-200/50 border border-slate-200 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all"
              >
                <div className="p-3 bg-slate-300 text-slate-500 rounded-xl">
                  <mod.icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">{mod.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{mod.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}