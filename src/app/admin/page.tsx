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
  Archive
} from "lucide-react";
import clsx from "clsx";

// --- CONFIGURAZIONE FONT LUNA ---
const lunaFont = localFont({
    src: [
        {
            path: '../../fonts/mending.regular.otf', // Verifica il percorso!
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
      href: "/admin/colazioni", // <-- Modifica se la pagina l'hai chiamata diversamente
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "hover:border-amber-200",
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
      id: "luna",
      title: "Luna Events",
      desc: "Gestione eventi, prenotazioni e gallery.",
      icon: Moon,
      href: "/admin/luna-events",
      style: "dark" // Card speciale scura
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
            
            // Render Card "Luna Events"
            if (mod.style === "dark") {
              return (
                <Link 
                  key={mod.id} 
                  href={mod.href}
                  className="group relative bg-[#050A18] rounded-3xl p-8 border border-[#C4A052]/20 shadow-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                >
                   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#050A18] to-[#050A18] opacity-50" />
                   <div className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" />
                   <div className="absolute bottom-10 left-10 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
                   
                   <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start mb-6">
                         <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#C4A052]/10 border border-[#C4A052]/30 text-[#C4A052]">
                            <mod.icon size={28} strokeWidth={1.5} />
                         </div>
                         <div className="bg-[#C4A052]/20 text-[#C4A052] px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 border border-[#C4A052]/30">
                            <Sparkles size={10} /> Premium
                         </div>
                      </div>
                      
                      <div>
                        <div className="mb-2">
                             <span className="text-4xl text-[#C4A052]" style={{ fontFamily: 'var(--font-luna)' }}>Luna</span>
                             <span className="text-lg text-white/90 uppercase tracking-[0.2em] font-light ml-2">Events</span>
                        </div>
                        <p className="text-indigo-200/70 text-sm leading-relaxed mb-6 border-l-2 border-[#C4A052]/30 pl-3">
                           {mod.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-[#C4A052] text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                         Accedi al modulo <ChevronRight size={14} />
                      </div>
                   </div>
                </Link>
              );
            }

            // Render Card Classiche
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