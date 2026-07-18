"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Sun,
  Flame,
  PartyPopper, 
  Coffee, 
  GlassWater, 
  Wrench,
  Clock 
} from "lucide-react";
import clsx from "clsx";

export type AnnouncementCategory = 
  | 'Chiusura Straordinaria'
  | 'Ferie'
  | 'Offerta Momento'
  | 'Evento'
  | 'Promo Colazione'
  | 'Promo Aperitivo'
  | 'Guasto Servizi Tabacchi'
  | 'Variazione Orari'; 

export interface ScheduleEntry {
  day: string;
  hours: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: AnnouncementCategory;
  schedule?: any; 
}

interface Props {
  announcements: Announcement[];
}

const getCategoryUI = (category: AnnouncementCategory) => {
  switch (category) {
    case 'Chiusura Straordinaria':
      return { icon: AlertTriangle, iconColor: 'text-red-700', iconBg: 'bg-red-100 border-red-200', gradFrom: 'from-red-200/40' };
    case 'Ferie':
      return { icon: Sun, iconColor: 'text-sky-700', iconBg: 'bg-sky-100 border-sky-200', gradFrom: 'from-sky-200/40' };
    case 'Offerta Momento':
      return { icon: Flame, iconColor: 'text-orange-700', iconBg: 'bg-orange-100 border-orange-200', gradFrom: 'from-orange-200/40' };
    case 'Evento':
      return { icon: PartyPopper, iconColor: 'text-violet-700', iconBg: 'bg-violet-100 border-violet-200', gradFrom: 'from-violet-200/40' };
    case 'Promo Colazione':
      return { icon: Coffee, iconColor: 'text-amber-700', iconBg: 'bg-amber-100 border-amber-200', gradFrom: 'from-amber-200/40' };
    case 'Promo Aperitivo':
      return { icon: GlassWater, iconColor: 'text-pink-700', iconBg: 'bg-pink-100 border-pink-200', gradFrom: 'from-pink-200/40' };
    case 'Guasto Servizi Tabacchi':
      return { icon: Wrench, iconColor: 'text-yellow-800', iconBg: 'bg-yellow-100 border-yellow-200', gradFrom: 'from-yellow-200/40' };
    case 'Variazione Orari': 
      return { icon: Clock, iconColor: 'text-indigo-700', iconBg: 'bg-indigo-100 border-indigo-200', gradFrom: 'from-indigo-200/40' };
    default:
      return { icon: Coffee, iconColor: 'text-slate-600', iconBg: 'bg-slate-50 border-slate-100', gradFrom: 'from-slate-100/40' };
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
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] animate-in fade-in duration-500" onClick={handleClose} />

      <div className={clsx(
        "relative bg-white/40 backdrop-blur-3xl border border-white/60 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 rounded-[30px]",
        isSingle ? "w-full max-w-lg" : "w-full max-w-4xl"
      )}>
        
        {/* Gradients */}
        {!isSingle && announcements.length === 2 && (
          <>
            <div className={clsx("absolute top-0 bottom-0 left-0 right-0 md:right-1/2 bg-gradient-to-b md:bg-gradient-to-r to-transparent z-0 transition-opacity duration-1000", getCategoryUI(announcements[0].category).gradFrom)} />
            <div className={clsx("absolute top-0 bottom-0 left-0 md:left-1/2 right-0 bg-gradient-to-t md:bg-gradient-to-l to-transparent z-0 transition-opacity duration-1000", getCategoryUI(announcements[1].category).gradFrom)} />
          </>
        )}
        {isSingle && (
          <div className={clsx("absolute inset-0 bg-gradient-to-b to-transparent z-0", getCategoryUI(announcements[0].category).gradFrom)} />
        )}

        <div className="relative z-10 flex flex-col w-full h-full">
          {!isSingle && <div className="hidden md:block absolute top-12 bottom-24 left-1/2 w-px bg-white/40 z-10 -translate-x-1/2" />}

          <div className="flex flex-col md:flex-row relative">
            {announcements.map((announcement) => {
              const UI = getCategoryUI(announcement.category);
              const Icon = UI.icon;

              // Parsing dati orari
              let parsedSchedule: ScheduleEntry[] = [];
              if (announcement.schedule) {
                if (typeof announcement.schedule === 'string') {
                  try { parsedSchedule = JSON.parse(announcement.schedule); } catch (e) { parsedSchedule = []; }
                } else if (Array.isArray(announcement.schedule)) {
                  parsedSchedule = announcement.schedule;
                }
              }

              const hasSchedule = announcement.category === 'Variazione Orari' && parsedSchedule && parsedSchedule.length > 0;
              
              return (
                <div key={announcement.id} className="flex-1 p-8 sm:p-10 pb-4 flex flex-col items-center">
                  <div className="flex flex-col items-center justify-start h-auto md:h-[180px] w-full shrink-0">
                    <div className={clsx("w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 shadow-sm border bg-white/60", UI.iconBg, UI.iconColor)}>
                      <Icon size={26} strokeWidth={2} />
                    </div>
                    <h2 className="text-xl sm:text-[22px] font-extrabold text-slate-900 mb-4 text-center tracking-tight leading-snug">
                      {announcement.title}
                    </h2>
                  </div>

                  {announcement.description && (
                    <p className={clsx("text-[15px] sm:text-base text-slate-700 leading-relaxed text-left font-medium w-full max-w-[420px] whitespace-pre-wrap", hasSchedule ? "mb-4 text-center" : "")}>
                      {announcement.description}
                    </p>
                  )}

                  {/* TABELLA ORARI */}
                  {hasSchedule && (
                    <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm overflow-hidden mt-2">
                      {parsedSchedule.map((entry, index) => (
                        <div key={index} className={clsx("flex justify-between items-center p-3 sm:px-4 hover:bg-white/50 transition-colors", index % 2 === 0 ? "bg-slate-50/40" : "bg-transparent", index !== parsedSchedule.length - 1 && "border-b border-slate-200/50")}>
                          <span className="font-semibold text-slate-800 text-sm">{entry.day}</span>
                          <span className={clsx("font-medium text-sm text-right", entry.hours?.toLowerCase() === 'chiuso' ? "text-red-600 font-bold" : "text-slate-600")}>{entry.hours}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 🔍 BOX DI DIAGNOSTICA TEMPORANEO */}
                  {announcement.category === 'Variazione Orari' && !hasSchedule && (
                    <div className="w-full max-w-[420px] bg-slate-900 text-red-400 border border-red-900/50 rounded-2xl p-4 mt-4 text-left text-xs font-mono shadow-inner">
                      <p className="text-red-500 font-bold mb-1.5 flex items-center gap-1">⚠️ DIAGNOSTICA APPLICAZIONE:</p>
                      <p className="text-slate-300 mb-1">La categoria è corretta ("Variazione Orari"), ma la tabella non compare perché la proprietà <code className="text-white bg-slate-800 px-1 rounded">schedule</code> contiene:</p>
                      <pre className="bg-slate-950 p-2 rounded mt-1 overflow-x-auto text-white">
                        {announcement.schedule === undefined ? 'undefined (La colonna NON viene letta dal DB!)' : JSON.stringify(announcement.schedule, null, 2)}
                      </pre>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          <div className="p-8 pt-4 flex justify-center z-10 relative mt-auto">
            <button onClick={handleClose} className="px-14 py-3.5 bg-[#0A1128] text-white font-bold rounded-[18px] hover:bg-[#152040] transition-all shadow-xl">
              Ho capito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}