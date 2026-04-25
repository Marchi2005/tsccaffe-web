"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  AlertTriangle, 
  Palmtree, 
  Zap, 
  PartyPopper, 
  Coffee, 
  GlassWater, 
  PackageSearch 
} from "lucide-react";
import clsx from "clsx";

export type AnnouncementCategory = 
  | 'Chiusura Straordinaria'
  | 'Ferie'
  | 'Offerta Momento'
  | 'Evento'
  | 'Promo Colazione'
  | 'Promo Aperitivo'
  | 'Guasto Servizi Tabacchi';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: AnnouncementCategory;
}

interface Props {
  announcements: Announcement[];
}

// --- MAPPATURA UNICA: OGNI CATEGORIA HA LA SUA ICONA E IL SUO COLORE ---
const getCategoryUI = (category: AnnouncementCategory) => {
  switch (category) {
    case 'Chiusura Straordinaria':
      return { 
        icon: AlertTriangle, 
        iconColor: 'text-red-600', 
        iconBg: 'bg-red-50 border-red-100', 
        gradFrom: 'from-red-200/40' 
      };
    case 'Ferie':
      return { 
        icon: Palmtree, 
        iconColor: 'text-emerald-600', 
        iconBg: 'bg-emerald-50 border-emerald-100', 
        gradFrom: 'from-emerald-200/40' 
      };
    case 'Offerta Momento':
      return { 
        icon: Zap, 
        iconColor: 'text-yellow-600', 
        iconBg: 'bg-yellow-50 border-yellow-100', 
        gradFrom: 'from-yellow-200/40' 
      };
    case 'Evento':
      return { 
        icon: PartyPopper, 
        iconColor: 'text-purple-600', 
        iconBg: 'bg-purple-50 border-purple-100', 
        gradFrom: 'from-purple-200/40' 
      };
    case 'Promo Colazione':
      return { 
        icon: Coffee, 
        iconColor: 'text-amber-800', 
        iconBg: 'bg-amber-50 border-amber-100', 
        gradFrom: 'from-amber-200/40' 
      };
    case 'Promo Aperitivo':
      return { 
        icon: GlassWater, 
        iconColor: 'text-orange-600', 
        iconBg: 'bg-orange-50 border-orange-100', 
        gradFrom: 'from-orange-200/40' 
      };
    case 'Guasto Servizi Tabacchi':
      return { 
        icon: PackageSearch, 
        iconColor: 'text-blue-600', 
        iconBg: 'bg-blue-50 border-blue-100', 
        gradFrom: 'from-blue-200/40' 
      };
    default:
      return { 
        icon: Coffee, 
        iconColor: 'text-slate-600', 
        iconBg: 'bg-slate-50 border-slate-100', 
        gradFrom: 'from-slate-100/40' 
      };
  }
};

export default function AnnouncementModal({ announcements }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!announcements || announcements.length === 0) return;

    const hideUntil = localStorage.getItem("tsc_modal_hide_until");
    const savedIds = localStorage.getItem("tsc_modal_ids");
    const currentIds = announcements.map(a => a.id).sort().join(',');

    const now = Date.now();
    if (!hideUntil || now > parseInt(hideUntil) || savedIds !== currentIds) {
      setIsOpen(true);
    }
  }, [announcements]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("tsc_modal_hide_until", (Date.now() + 2 * 60 * 60 * 1000).toString());
    localStorage.setItem("tsc_modal_ids", announcements.map(a => a.id).sort().join(','));
  };

  if (!isMounted || !isOpen || announcements.length === 0) return null;

  const isSingle = announcements.length === 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] animate-in fade-in duration-500" onClick={handleClose} />

      {/* Modal Container: Più trasparente (bg-white/40) */}
      <div className={clsx(
        "relative bg-white/40 backdrop-blur-3xl border border-white/60 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 rounded-[30px]",
        isSingle ? "w-full max-w-lg" : "w-full max-w-4xl"
      )}>
        
        {/* Background Gradients: Continuità totale su tutto il rettangolo */}
        {!isSingle && announcements.length === 2 && (
          <>
            <div className={clsx("absolute top-0 bottom-0 left-0 right-0 md:right-1/2 bg-gradient-to-b md:bg-gradient-to-r to-transparent z-0 transition-opacity duration-1000", getCategoryUI(announcements[0].category).gradFrom)} />
            <div className={clsx("absolute top-0 bottom-0 left-0 md:left-1/2 right-0 bg-gradient-to-t md:bg-gradient-to-l to-transparent z-0 transition-opacity duration-1000", getCategoryUI(announcements[1].category).gradFrom)} />
          </>
        )}
        {isSingle && (
          <div className={clsx("absolute inset-0 bg-gradient-to-b to-transparent z-0", getCategoryUI(announcements[0].category).gradFrom)} />
        )}

        <button onClick={handleClose} className="absolute top-5 right-5 z-20 p-2 text-slate-400 hover:text-slate-800 bg-white/40 hover:bg-white rounded-full transition-all border border-white/40 shadow-sm">
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="relative z-10 flex flex-col w-full h-full">
          
          {/* Divisore centrale */}
          {!isSingle && (
            <div className="hidden md:block absolute top-12 bottom-24 left-1/2 w-px bg-white/40 z-10 -translate-x-1/2" />
          )}

          <div className="flex flex-col md:flex-row relative">
            {announcements.map((announcement) => {
              const UI = getCategoryUI(announcement.category);
              const Icon = UI.icon;
              
              return (
                <div key={announcement.id} className="flex-1 p-8 sm:p-10 pb-4 flex flex-col items-center">
                  {/* Altezza fissa su desktop per allineare il testo */}
                  <div className="flex flex-col items-center justify-start h-auto md:h-[180px] w-full">
                    <div className={clsx("w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 shadow-sm border bg-white/60", UI.iconBg, UI.iconColor)}>
                      <Icon size={26} strokeWidth={2} />
                    </div>
                    <h2 className="text-xl sm:text-[22px] font-extrabold text-slate-900 mb-4 text-center tracking-tight leading-snug">
                      {announcement.title}
                    </h2>
                  </div>

                  {/* Modificato qui: text-left e whitespace-pre-wrap per mantenere gli invii e gli spazi originali */}
                  <p className="text-[15px] sm:text-base text-slate-700 leading-relaxed text-left font-medium w-full max-w-[420px] whitespace-pre-wrap">
                    {announcement.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-8 pt-4 flex justify-center z-10 relative">
            <button 
              onClick={handleClose}
              className="px-14 py-3.5 bg-[#0A1128] text-white font-bold rounded-[18px] hover:bg-[#152040] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#0A1128]/20"
            >
              Ho capito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}