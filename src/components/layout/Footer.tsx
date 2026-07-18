"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, MapPin, Phone, MessageCircle, Send, Coffee } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

// --- FUNZIONE MAGICA DI RAGGRUPPAMENTO ---
function getGroupedSchedule(weekly: any[], special: any[]) {
  // 1. Generiamo i 7 giorni a partire da Lunedì della settimana corrente
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Dom, 1 = Lun...
  const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  // 2. Mappiamo ogni giorno: se c'è un evento speciale vince lui, altrimenti orario standard
  const scheduleSequence = weekDays.map(date => {
    // Formattiamo la data manualmente per essere sicuri di avere YYYY-MM-DD corretto nel fuso locale
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dStr = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${dStr}`;
    
    // Controlla se c'è una data speciale per questo giorno
    const specialMatch = special.find(s => s.closure_date === dateString);
    
    if (specialMatch) {
      return { type: 'special', date, reason: specialMatch.reason, data: null };
    }

    // Altrimenti, prendi l'orario settimanale standard
    const jsDay = date.getDay();
    const standardMatch = weekly.find(w => w.day_of_week === jsDay) || { is_closed: true };
    
    return { type: 'standard', date, reason: null, data: standardMatch };
  });

  // 3. Raggruppiamo i giorni consecutivi identici
  const grouped: any[] = [];
  if (scheduleSequence.length === 0) return grouped;

  let currentGroup = {
    type: scheduleSequence[0].type,
    startDay: scheduleSequence[0].date,
    endDay: scheduleSequence[0].date,
    reason: scheduleSequence[0].reason,
    data: scheduleSequence[0].data
  };

  for (let i = 1; i < scheduleSequence.length; i++) {
    const curr = scheduleSequence[i];
    let canGroup = false;
    
    if (curr.type === 'special' && currentGroup.type === 'special') {
      if (curr.reason === currentGroup.reason) canGroup = true;
    } 
    else if (curr.type === 'standard' && currentGroup.type === 'standard') {
      const c = curr.data;
      const g = currentGroup.data;
      if (c && g && c.is_closed === g.is_closed && c.morning_open === g.morning_open && c.morning_close === g.morning_close && c.afternoon_open === g.afternoon_open && c.afternoon_close === g.afternoon_close) {
        canGroup = true;
      }
    }

    if (canGroup) {
      currentGroup.endDay = curr.date; // Estendi il range
    } else {
      grouped.push(currentGroup);
      currentGroup = { type: curr.type, startDay: curr.date, endDay: curr.date, reason: curr.reason, data: curr.data };
    }
  }
  grouped.push(currentGroup);

  return grouped;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  
  const [isLunaDomain, setIsLunaDomain] = useState(false);
  
  // STATI PER LA LOGICA DEGLI ORARI DINAMICI
  const [weeklyHours, setWeeklyHours] = useState<any[]>([]);
  const [specialClosures, setSpecialClosures] = useState<any[]>([]);
  const [scheduleGroups, setScheduleGroups] = useState<any[]>([]);
  const [shopStatus, setShopStatus] = useState({ text: "VERIFICA...", classes: "bg-slate-300" });

  // 1. VERIFICA DOMINIO
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname.includes("lunaevents")) {
      setIsLunaDomain(true);
    }
  }, []);

  // 2. FETCH DATI DA SUPABASE (E CREAZIONE GRUPPI INTELLIGENTI)
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // 1. Chiamata a Supabase
        const { data: dbWeeklyData, error: weeklyError } = await supabase.from('weekly_hours').select('*');
        const { data: dbSpecialData, error: specialError } = await supabase.from('special_closures').select('*');

        if (weeklyError) console.error("Errore fetch weekly_hours:", weeklyError);
        if (specialError) console.error("Errore fetch special_closures:", specialError);

        // 2. DATI DI DEFAULT (di sicurezza)
        const defaultWeeklyData = [
          { day_of_week: 1, is_closed: false, morning_open: '06:30', morning_close: '13:30', afternoon_open: '15:30', afternoon_close: '20:00' },
          { day_of_week: 2, is_closed: false, morning_open: '06:30', morning_close: '13:30', afternoon_open: '15:30', afternoon_close: '20:00' },
          { day_of_week: 3, is_closed: false, morning_open: '06:30', morning_close: '13:30', afternoon_open: '15:30', afternoon_close: '20:00' },
          { day_of_week: 4, is_closed: false, morning_open: '06:30', morning_close: '13:30', afternoon_open: '15:30', afternoon_close: '20:00' },
          { day_of_week: 5, is_closed: false, morning_open: '06:30', morning_close: '13:30', afternoon_open: '15:30', afternoon_close: '20:00' },
          { day_of_week: 6, is_closed: false, morning_open: '06:30', morning_close: '13:30', afternoon_open: '15:30', afternoon_close: '20:00' },
          { day_of_week: 0, is_closed: false, morning_open: '07:30', morning_close: '14:30', afternoon_open: null, afternoon_close: null },
        ];
        const defaultSpecialData: any[] = []; 

        // 3. Usa i dati DB se esistono, altrimenti usa i default
        const activeWeeklyData = (dbWeeklyData && dbWeeklyData.length > 0) ? dbWeeklyData : defaultWeeklyData;
        const activeSpecialData = (dbSpecialData && dbSpecialData.length > 0) ? dbSpecialData : defaultSpecialData;

        setWeeklyHours(activeWeeklyData);
        setSpecialClosures(activeSpecialData);

        // --- APPLICAZIONE DELLA LOGICA MAGICA ---
        const groupedRaw = getGroupedSchedule(activeWeeklyData, activeSpecialData);

        // Helper per formattare le etichette dei giorni
        const formatRange = (start: Date, end: Date, type: string) => {
          const formatSpecial = (d: Date) => d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
          const formatStd = (d: Date) => d.toLocaleDateString('it-IT', { weekday: 'short' });
          
          const formatter = type === 'special' ? formatSpecial : formatStd;
          
          if (start.getTime() === end.getTime()) return formatter(start);
          return `${formatter(start)} - ${formatter(end)}`;
        };

        const formatTime = (t: string) => t ? t.substring(0, 5) : null;

        // Trasformiamo i dati nel formato perfetto per la UI del Footer
        const finalGroups = groupedRaw.map(g => {
          let label = formatRange(g.startDay, g.endDay, g.type);
          // Capitalizziamo per estetica
          label = label.charAt(0).toUpperCase() + label.slice(1);
          
          const isSpecial = g.type === 'special';
          const hours: string[] = [];

          if (isSpecial) {
            hours.push(g.reason || "CHIUSI");
          } else if (g.data?.is_closed) {
            hours.push("CHIUSO");
          } else {
             const mOpen = formatTime(g.data?.morning_open);
             const mClose = formatTime(g.data?.morning_close);
             const aOpen = formatTime(g.data?.afternoon_open);
             const aClose = formatTime(g.data?.afternoon_close);

             if (mOpen && mClose) hours.push(`${mOpen} - ${mClose}`);
             if (aOpen && aClose) hours.push(`${aOpen} - ${aClose}`);
          }

          return { label, hours, isSpecial };
        });

        setScheduleGroups(finalGroups);
      } catch (error) {
        console.error("Errore fetch orari:", error);
      }
    };

    fetchSchedules();
  }, []);

  // 3. LOGICA BADGE STATUS DINAMICO (Intatta)
  useEffect(() => {
    if (weeklyHours.length === 0) return;

    const updateShopStatus = () => {
      const now = new Date();
      const itTimeStr = now.toLocaleString("en-US", { timeZone: "Europe/Rome" });
      const itDate = new Date(itTimeStr);

      const day = itDate.getDay(); 
      const currentMins = itDate.getHours() * 60 + itDate.getMinutes();
      
      const year = itDate.getFullYear();
      const month = String(itDate.getMonth() + 1).padStart(2, '0');
      const d = String(itDate.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${month}-${d}`;

      const statusStyles = {
        open: { text: "APERTO ORA", classes: "bg-emerald-500 shadow-emerald-500/40" },
        closed: { text: "CHIUSO ORA", classes: "bg-rose-500 shadow-rose-500/40" },
        closing: { text: "IN CHIUSURA", classes: "bg-amber-500 shadow-amber-500/40" }, 
        opening: { text: "APRE TRA POCO", classes: "bg-blue-500 shadow-blue-500/40" }   
      };

      // 1. Verifica se oggi c'è una chiusura speciale
      const isSpecialClosed = specialClosures.some(sc => sc.closure_date === localDateStr);
      if (isSpecialClosed) return statusStyles.closed;

      // 2. Prendi orario base del giorno
      const todaySchedule = weeklyHours.find(w => w.day_of_week === day);
      if (!todaySchedule || todaySchedule.is_closed) return statusStyles.closed;

      const timeToMins = (timeStr: string) => {
        if (!timeStr) return null;
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      let isOpen = false;
      let isClosing = false;
      let isOpening = false;

      const checkPeriod = (openStr: string, closeStr: string) => {
        if (!openStr || !closeStr) return;
        const open = timeToMins(openStr);
        const close = timeToMins(closeStr);
        
        if (open && close) {
            if (currentMins >= open - 15 && currentMins < open) isOpening = true;
            if (currentMins >= close - 30 && currentMins < close) isClosing = true;
            if (currentMins >= open && currentMins < close) isOpen = true;
        }
      };

      checkPeriod(todaySchedule.morning_open, todaySchedule.morning_close);
      checkPeriod(todaySchedule.afternoon_open, todaySchedule.afternoon_close);

      if (isOpen) {
        if (isClosing) return statusStyles.closing;
        return statusStyles.open;
      }
      if (isOpening) return statusStyles.opening;
      return statusStyles.closed;
    };

    setShopStatus(updateShopStatus());
    const interval = setInterval(() => {
      setShopStatus(updateShopStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, [weeklyHours, specialClosures]);

  const isLunaPage = pathname.startsWith("/site-luna") || isLunaDomain;

  return (
    <footer className={clsx(
        "relative z-50 transition-colors duration-300",
        // TEMA CHIARO PER LUNA, TEMA SCURO PER TSC
        isLunaPage ? "bg-[#FAF8F5] text-slate-600 border-t border-[#E8E1D9]" : "bg-slate-900 text-slate-300 border-t border-slate-800"
    )}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* COLONNA 1: BRAND & STORY */}
          <div className="space-y-6">
            <div className="flex items-center flex-wrap gap-y-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-12 w-12 p-1 transition-transform group-hover:scale-110">
                        <Image 
                            src={isLunaPage ? "/icons/logo-navbar-luna-page.svg" : "/icons/logo-footbar.svg"} 
                            alt="Logo TSC" 
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className={clsx(
                            "font-bold text-sm uppercase tracking-wide transition-colors",
                            isLunaPage ? "text-slate-800 group-hover:text-[#7A0018]" : "text-white group-hover:text-brand-coffee"
                        )}>
                            Tabacchi San Clemente
                        </span>
                        <span className={clsx(
                            "font-serif italic text-lg transition-colors",
                            isLunaPage ? "text-[#7A0018]" : "text-brand-red"
                        )}>
                            Caffè
                        </span>
                    </div>
                </Link>

                {isLunaPage && (
                 <div className="flex items-center ml-4 pl-4 border-l border-[#E8E1D9] h-10 animate-in fade-in slide-in-from-left-4 duration-700">
                      <div className="relative flex items-center justify-center">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-50 pointer-events-none">
                              <Image 
                                  src="/icons/moon.svg" 
                                  alt="Luna Sfondo" 
                                  width={80} 
                                  height={80} 
                                  className="w-full h-full object-contain" 
                              />
                          </div>
                          <div className="relative z-10 flex flex-col items-center leading-none pt-1">
                              <span 
                                  className="text-[#7A0018] font-luna text-2xl leading-none drop-shadow-sm" 
                                  style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                              >
                                  Luna
                              </span>
                              <span className="text-slate-500 text-[0.4rem] uppercase tracking-[0.3em] -mt-0.5 font-serif font-light">
                                  Events
                              </span>
                          </div>
                      </div>
                 </div>
                )}
            </div>

            <p className={clsx("text-sm leading-relaxed", isLunaPage ? "text-slate-500" : "text-slate-400")}>
              {isLunaPage 
                ? "Trasformiamo i tuoi momenti speciali in ricordi indimenticabili. Eventi esclusivi, cura dei dettagli e passione."
                : "Non solo un bar, ma il tuo angolo di relax quotidiano. Tra un caffè Illy perfetto, un sorriso e i servizi di cui hai bisogno, ci prendiamo cura della tua giornata."
              }
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex space-x-4">
              <a href="https://instagram.com/tabacchisanclementecaffe" target="_blank" rel="noreferrer" className={clsx(
                  "p-2 rounded-full transition-all",
                  isLunaPage ? "bg-white border border-[#E8E1D9] text-[#7A0018] hover:bg-[#7A0018] hover:text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-brand-cyan hover:text-white"
              )}>
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/people/Tabacchi-San-Clemente/100012509505700/" target="_blank" rel="noreferrer" className={clsx(
                  "p-2 rounded-full transition-all",
                  isLunaPage ? "bg-white border border-[#E8E1D9] text-[#7A0018] hover:bg-[#7A0018] hover:text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white"
              )}>
                <Facebook size={18} />
              </a>
              <a href="https://www.tiktok.com/@tsccaffe" target="_blank" rel="noreferrer" className={clsx(
                  "p-2 rounded-full transition-all",
                  isLunaPage ? "bg-white border border-[#E8E1D9] text-[#7A0018] hover:bg-[#7A0018] hover:text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-[#ff0050] hover:text-white"
              )}>
                <TikTokIcon size={18} />
              </a>
              <a href="https://wa.me/393715428345" target="_blank" rel="noreferrer" className={clsx(
                  "p-2 rounded-full transition-all",
                  isLunaPage ? "bg-white border border-[#E8E1D9] text-[#7A0018] hover:bg-[#7A0018] hover:text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-green-500 hover:text-white"
              )}>
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* COLONNA 2: ESPLORA */}
          <div>
            <h3 className={clsx("text-sm font-bold uppercase tracking-wider mb-6", isLunaPage ? "text-[#7A0018]" : "text-white")}>Esplora</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className={clsx("transition-colors flex items-center gap-2", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-brand-cyan")}>
                  <span className={clsx("w-1 h-1 rounded-full", isLunaPage ? "bg-[#7A0018]/40" : "bg-slate-600")}></span> Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className={clsx("transition-colors flex items-center gap-2", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-brand-cyan")}>
                  <span className={clsx("w-1 h-1 rounded-full", isLunaPage ? "bg-[#7A0018]/40" : "bg-slate-600")}></span> Menù Caffetteria
                </Link>
              </li>
              <li>
                <Link href="/servizi" className={clsx("transition-colors flex items-center gap-2", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-brand-cyan")}>
                  <span className={clsx("w-1 h-1 rounded-full", isLunaPage ? "bg-[#7A0018]/40" : "bg-slate-600")}></span> Servizi & Shop
                </Link>
              </li>
              <li className="pt-2">
                {isLunaPage ? (
                    <a href="#contact" className="text-[#7A0018] font-bold hover:text-[#5C0012] transition-colors flex items-center gap-2">
                       <Send size={14} className="mt-0.5" /> Richiedi Preventivo
                    </a>
                ) : (
                    <Link href="/prenota-colazione" className="text-brand-red font-bold hover:text-rose-700 transition-colors flex items-center gap-2">
                       <Coffee size={14} className="mt-0.5" /> Prenota Colazione
                    </Link>
                )}
              </li>
            </ul>
          </div>

          {/* COLONNA 3: CONTATTI */}
          <div>
            <h3 className={clsx("text-sm font-bold uppercase tracking-wider mb-6", isLunaPage ? "text-[#7A0018]" : "text-white")}>Contatti</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className={clsx("shrink-0 mt-0.5", isLunaPage ? "text-[#7A0018]" : "text-brand-cyan")} />
                <span>Via Galatina N° 95,<br />San Clemente, 81100 Caserta (CE)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className={clsx("shrink-0", isLunaPage ? "text-[#7A0018]" : "text-brand-cyan")} />
                <a href="tel:+393715428345" className={clsx("transition-colors", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-white")}>371 542 8345</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className={clsx("shrink-0", isLunaPage ? "text-[#7A0018]" : "text-green-500")} />
                <a href="https://wa.me/393715428345" className={clsx("transition-colors", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-white")}>Scrivici su WhatsApp</a>
              </li>
            </ul>
          </div>

           {/* COLONNA 4: ORARI DINAMICI */}
          <div>
            <h3 className={clsx("text-sm font-bold uppercase tracking-wider mb-6", isLunaPage ? "text-[#7A0018]" : "text-white")}>Orari Apertura</h3>
            <div className={clsx(
                "p-5 rounded-2xl text-slate-900 transition-colors duration-300",
                isLunaPage ? "bg-white border border-[#E8E1D9] shadow-sm" : "bg-slate-50 border border-slate-200/10 shadow-lg"
            )}>
              <div className="space-y-3 text-sm">
                
                {/* RENDER DINAMICO DEI GRUPPI */}
                {scheduleGroups.length > 0 ? scheduleGroups.map((group, idx) => (
                  <div key={idx} className={clsx("flex justify-between items-start", idx < scheduleGroups.length - 1 ? "pb-3 border-b border-slate-200" : "pt-1")}>
                    <span className={clsx("font-bold", group.isSpecial ? "text-rose-600" : "text-slate-800")}>
                      {group.label}
                    </span>
                    <div className="text-right space-y-1 font-medium text-slate-600">
                      {group.hours.map((line: string, i: number) => (
                        <p key={i} className={group.isSpecial ? "text-rose-500 font-bold" : ""}>{line}</p>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-slate-500 text-xs py-2">Caricamento orari...</div>
                )}

              </div>
              
              {/* STATUS BADGE DINAMICO */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                 <div className="flex items-center justify-center gap-2.5 w-full bg-white shadow-sm py-2.5 px-3 rounded-xl border border-slate-100">
                    <span className={clsx("w-2.5 h-2.5 rounded-full shadow-lg animate-pulse", shopStatus.classes)}></span>
                    <span className="text-xs font-bold text-slate-700 tracking-wide">{shopStatus.text}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEGAL BOTTOM */}
        <div className={clsx(
            "border-t pt-8 flex flex-col items-center text-center mt-12",
            isLunaPage ? "border-[#E8E1D9]" : "border-slate-800"
        )}>
          <div className="flex flex-col items-center gap-1 mb-4">
            <p className={clsx("text-sm font-bold tracking-tight", isLunaPage ? "text-slate-800" : "text-slate-200")}>
              Tabacchi San Clemente di Ianniello Gianpaolo
            </p>
            <p className="text-slate-500 text-[13px]">
              © {currentYear} — Tutti i diritti riservati • P.IVA: 04124110612
            </p>
          </div>

          <div className="mb-6">
            <div className={clsx(
                "text-xs flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border",
                isLunaPage ? "bg-white border-[#E8E1D9] text-slate-500 shadow-sm" : "bg-slate-800/50 border-slate-700 text-slate-400"
            )}>
              Realizzato con ❤️ da 
              <a href="https://github.com/Marchi2005" target="_blank" rel="noopener noreferrer" className={clsx(
                  "font-bold transition-all duration-300 hover:underline decoration-2 underline-offset-4",
                  isLunaPage ? "text-[#7A0018] hover:text-[#5C0012]" : "text-rose-500 hover:text-rose-600"
              )}>
                Marco Ianniello
              </a>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 text-slate-500 text-xs uppercase tracking-widest font-medium">
              <Link 
                href={isLunaPage ? "/privacy-policy?site=luna" : "/privacy-policy?site=tsc"} 
                className={clsx("transition-colors", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-rose-500")}
              >
                Privacy Policy
              </Link>
              
              <span className={clsx(isLunaPage ? "text-slate-300" : "text-slate-700")}>|</span>
              
              <Link 
                href={isLunaPage ? "/cookie-policy?site=luna" : "/cookie-policy?site=tsc"} 
                className={clsx("transition-colors", isLunaPage ? "hover:text-[#7A0018]" : "hover:text-rose-500")}
              >
                Cookie Policy
              </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}