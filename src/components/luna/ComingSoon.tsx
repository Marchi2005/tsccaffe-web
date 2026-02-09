"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link"; // Aggiunto Link per la navigazione interna
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Calendar, Send, Instagram, MessageCircle, ChevronLeft, ChevronRight, Mail, Clock, Check, ArrowRight, Loader2, ArrowLeft, } from "lucide-react";
import localFont from 'next/font/local';

// --- CONFIGURAZIONE FONT ---
const lunaFont = localFont({
    src: [
        {
            path: '../../fonts/mending.regular.otf', // Assicurati che il percorso sia corretto
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-luna',
});

// --- TIPI ---
type StarData = {
    id: number;
    top: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
    type: 'background' | 'medium' | 'bright';
};

// --- FUNZIONE HELPERS ---
const generateStars = (count: number): StarData[] => {
    return Array.from({ length: count }).map((_, i) => {
        const rand = Math.random();
        let type: 'background' | 'medium' | 'bright' = 'background';
        let size = Math.random() * 1.5 + 0.5;

        if (rand > 0.90) {
            type = 'bright';
            size = Math.random() * 2 + 3;
        } else if (rand > 0.65) {
            type = 'medium';
            size = Math.random() * 2 + 1;
        }

        return {
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: size,
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2,
            type: type,
        };
    });
};

const MONTHS = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

// --- COMPONENTE DATE PICKER PERSONALIZZATO (Mantenuto per struttura, anche se non usato) ---
const CustomDatePicker = ({
    selectedDate,
    onChange
}: {
    selectedDate: string;
    onChange: (date: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        const formatted = `${year}-${month}-${d}`;

        onChange(formatted);
        setIsOpen(false);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const checkDate = new Date(year, month, d);
            const yearStr = checkDate.getFullYear();
            const monthStr = String(checkDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(d).padStart(2, '0');
            const dateString = `${yearStr}-${monthStr}-${dayStr}`;

            const isSelected = selectedDate === dateString;
            const now = new Date();
            const isToday = now.getDate() === d && now.getMonth() === month && now.getFullYear() === year;

            days.push(
                <button
                    key={d}
                    type="button"
                    onClick={() => handleDayClick(d)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
            ${isSelected ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            ${isToday && !isSelected ? 'border border-amber-400/50 text-amber-400' : ''}
          `}
                >
                    {d}
                </button>
            );
        }
        return days;
    };

    const displayDate = selectedDate
        ? new Date(selectedDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
        : "";

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-slate-950 border rounded-lg pl-12 pr-4 py-4 text-white cursor-pointer flex items-center transition-all group
          ${isOpen ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-800 hover:border-slate-600'}
        `}
            >
                <Calendar className={`absolute left-4 transition-colors ${isOpen ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-400'}`} size={20} />
                <span className={displayDate ? "text-white" : "text-slate-700"}>
                    {displayDate || "Seleziona data..."}
                </span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 top-full mt-2 left-0 w-full md:w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-white font-serif text-lg capitalize">
                                {MONTHS[currentDate.getMonth()]} <span className="text-amber-400 font-luna ml-1">{currentDate.getFullYear()}</span>
                            </span>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(day => (
                                <span key={day} className="text-xs font-bold text-slate-500">{day}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 place-items-center">
                            {renderCalendar()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- COMPONENTE LOADING (Mantenuto Invariato) ---
const LunaLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [stars, setStars] = useState<StarData[]>([]);

    useEffect(() => {
        setStars(generateStars(100));
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
        >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className={`absolute rounded-full animate-pulse ${star.type === 'bright' ? "bg-amber-200 blur-[0.5px]" :
                            star.type === 'medium' ? "bg-amber-400/80" : "bg-slate-300/40"
                            }`}
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDuration: `${star.duration}s`,
                            opacity: star.type === 'background' ? Math.random() * 0.5 + 0.2 : 1,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute z-0 flex items-center justify-center"
            >
                <Image
                    src="/icons/moon.svg"
                    alt="Luna Sfondo"
                    width={800}
                    height={800}
                    className="w-[400px] h-[400px] md:w-[700px] md:h-[700px] object-contain opacity-40 drop-shadow-[0_0_60px_rgba(251,191,36,0.15)]"
                />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center text-center mt-10">
                <motion.h1
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="font-luna text-[9rem] md:text-[13rem] leading-none text-amber-400 drop-shadow-2xl"
                    style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                >
                    Luna
                </motion.h1>

                <motion.span
                    initial={{ opacity: 0, letterSpacing: "0em", y: -20 }}
                    animate={{ opacity: 1, letterSpacing: "0.6em", y: 0 }}
                    transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                    onAnimationComplete={() => setTimeout(onComplete, 1000)}
                    className="text-white font-serif uppercase text-sm md:text-xl font-light tracking-widest relative -top-4 md:-top-8"
                >
                    Events
                </motion.span>
            </div>
        </motion.div>
    );
};

export default function LunaEventsPage() {
    const [loading, setLoading] = useState(true);
    const [stars, setStars] = useState<StarData[]>([]);

    useEffect(() => {
        if (loading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        setStars(generateStars(150));
    }, [loading]);

    // Dati form mantenuti ma non usati per non rompere il codice
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", type: "Matrimonio", message: "", specificDate: "", periodYear: "", periodMonth: "", periodTime: ""
    });

    return (
        <>
            <main className={`${lunaFont.variable} min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-400 selection:text-slate-950`}>

                <AnimatePresence>
                    {loading && <LunaLoader onComplete={() => setLoading(false)} />}
                </AnimatePresence>

                {/* HERO SECTION */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />

                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        {stars.map((star) => (
                            <div
                                key={star.id}
                                className={`absolute rounded-full animate-pulse transition-all ${star.type === 'bright'
                                    ? "bg-amber-200 shadow-[0_0_25px_rgba(251,191,36,1)] blur-[0.5px] z-10"
                                    : star.type === 'medium'
                                        ? "bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.6)] blur-[0px]"
                                        : "bg-slate-300/40"
                                    }`}
                                style={{
                                    top: `${star.top}%`,
                                    left: `${star.left}%`,
                                    width: `${star.size}px`,
                                    height: `${star.size}px`,
                                    animationDelay: `${star.delay}s`,
                                    animationDuration: `${star.duration}s`,
                                    opacity: star.type === 'background' ? Math.random() * 0.5 + 0.2 : 1,
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-6xl mx-auto mt-0">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* --- MODIFICA 1: TITOLO --- */}
                            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight leading-tight">
                                Qualcosa di Magico <br />
                                <span
                                    className="text-amber-400 font-luna text-7xl md:text-9xl block mt-4"
                                    style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                                >
                                    Sta Arrivando
                                </span>
                            </h1>

                            {/* --- MODIFICA 2: DESCRIZIONE --- */}
                            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                                Stiamo lavorando per portare online un'esperienza esclusiva.
                                <br className="hidden md:block"/>
                                Il nuovo sito di Luna Events sarà presto disponibile.
                            </p>

                            {/* --- MODIFICA 3: PULSANTI --- */}
                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                {/* Tasto WhatsApp */}
                                <a
                                    href="https://wa.me/393715428345"
                                    target="_blank"
                                    className="w-full sm:w-auto px-10 py-4 bg-amber-400 text-slate-950 font-bold rounded-full hover:bg-amber-300 transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={20} />
                                    Scrivici su WhatsApp
                                </a>
                                
                                {/* Tasto Torna a TSC */}
                                <Link
                                    href="/"
                                    className="w-full sm:w-auto px-10 py-4 border border-slate-700 text-slate-300 rounded-full hover:border-amber-400 hover:text-amber-400 transition-colors duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={20} />
                                    Torna a TSC Caffè
                                </Link>
                            </div>

                            <div className="relative flex flex-col items-center justify-center mt-24 md:mt-32">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
                                    <Image
                                        src="/icons/moon.svg"
                                        alt=""
                                        width={300}
                                        height={300}
                                        className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]"
                                    />
                                </div>
                                <h2
                                    className="font-luna text-6xl md:text-8xl text-amber-400 relative z-10 leading-none drop-shadow-lg"
                                    style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                                >
                                    Luna
                                </h2>
                                <span className="text-white font-serif uppercase text-xs md:text-sm tracking-[0.5em] relative z-10 mt-[-5px] md:mt-[-10px] pl-2">
                                    Events
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </>
    );
}