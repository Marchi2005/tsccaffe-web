"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Calendar, Send, Instagram, MessageCircle, ChevronLeft, ChevronRight, Mail, Clock, Check, ArrowRight, Loader2, } from "lucide-react";
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

// --- COMPONENTE DATE PICKER PERSONALIZZATO ---
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
        // Imposta la data come stringa locale per evitare problemi di fuso orario
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
            // Costruiamo la data locale per il confronto
            const checkDate = new Date(year, month, d);
            const yearStr = checkDate.getFullYear();
            const monthStr = String(checkDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(d).padStart(2, '0');
            const dateString = `${yearStr}-${monthStr}-${dayStr}`;

            const isSelected = selectedDate === dateString;

            // Controllo "Oggi"
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

// --- COMPONENTE LOADING ---
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

// --- DATI GALLERY ---
const GALLERY_IMAGES = [
    "/images/luna-1.jpg",
    "/images/luna-2.jpg",
    "/images/luna-3.jpg",
    "/images/luna-4.jpg",
];

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

    // Genera anni dal 2026 al 2035
    const YEARS = Array.from({ length: 10 }, (_, i) => String(2026 + i));

    // Opzioni per il periodo del mese
    const PERIOD_OPTIONS = [
        "Inizio Mese",
        "Metà Mese",
        "Fine Mese",
        "Indifferente / Tutto il mese"
    ];

    // Stato del form
    const [dateMode, setDateMode] = useState<'specific' | 'period'>('specific');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "Matrimonio",
        message: "",
        specificDate: "",
        periodYear: "",
        periodMonth: "",
        periodTime: "" // Rinominato da periodWeek a periodTime per chiarezza
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: string) => {
        setFormData({ ...formData, specificDate: date });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validazione
        if (dateMode === 'specific' && !formData.specificDate) {
            alert("Per favore, seleziona una data specifica.");
            return;
        }
        // Validazione Periodo: Ora controlliamo periodTime invece di week
        if (dateMode === 'period' && (!formData.periodYear || !formData.periodMonth || !formData.periodTime)) {
            alert("Per favore, indica Anno, Mese e la preferenza sul periodo.");
            return;
        }

        setFormStatus('sending');

        // Simulazione invio
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("Dati Inviati:", formData);
        setFormStatus('success');

        // Reset opzionale
        setTimeout(() => setFormStatus('idle'), 5000);
    };

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
                            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight leading-tight">
                                Il Tuo Evento <br />
                                <span
                                    className="text-amber-400 font-luna text-7xl md:text-9xl block mt-4"
                                    style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                                >
                                    Ovunque Tu Voglia
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                                Portiamo l'eleganza del TSC Caffè ovunque tu voglia.
                                Il nostro allestimento Apecar esclusivo per rendere i tuoi eventi indimenticabili.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                <a
                                    href="#contact"
                                    className="w-full sm:w-auto px-10 py-4 bg-amber-400 text-slate-950 font-bold rounded-full hover:bg-amber-300 transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] transform hover:-translate-y-1"
                                >
                                    Richiedi Preventivo
                                </a>
                                <a
                                    href="#gallery"
                                    className="w-full sm:w-auto px-10 py-4 border border-slate-700 text-slate-300 rounded-full hover:border-amber-400 hover:text-amber-400 transition-colors duration-300 backdrop-blur-sm"
                                >
                                    Guarda le Foto
                                </a>
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

                {/* CONCEPT SECTION */}
                <section className="py-24 bg-slate-900/30 border-y border-slate-900/50">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group"
                        >
                            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center group-hover:bg-slate-800/80 transition-colors">
                                <span className="text-slate-600 flex flex-col items-center gap-2">
                                    <Camera size={48} />
                                    <span className="text-xs uppercase tracking-widest">Foto Apecar</span>
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-5xl font-serif text-white">
                                Un tocco <span className="text-amber-400 font-luna text-5xl md:text-6xl px-2" style={{ fontFeatureSettings: '"liga" 1' }}>Chic</span> & Vintage
                            </h2>
                            <div className="space-y-4 text-slate-400 leading-relaxed text-lg font-light">
                                <p>
                                    <strong className="text-white">Luna Events</strong> nasce dalla passione per i dettagli. Abbiamo trasformato un'iconica Apecar in un bar mobile di lusso, pronto a servire bollicine, cocktail e finger food.
                                </p>
                                <p>
                                    Non portiamo solo bevande, portiamo un'atmosfera. L'illuminazione calda, i dettagli in legno e ottone, la professionalità dei nostri barman.
                                </p>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-4">Perfetto per</h3>
                                <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {['Matrimoni', 'Compleanni', 'Inaugurazioni', 'Feste Private', 'Aperitivi Aziendali', 'Lauree'].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-slate-300">
                                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#fbbf24]"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* GALLERY SECTION */}
                <section id="gallery" className="py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase border border-amber-400/30 px-3 py-1 rounded-full">Portfolio</span>
                            <h2 className="text-4xl md:text-6xl font-serif text-white mt-6">I Nostri Allestimenti</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {GALLERY_IMAGES.map((src, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative h-80 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg hover:shadow-amber-900/20 transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                                        <Camera size={32} opacity={0.5} />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-white text-sm font-medium">Evento {index + 1}</p>
                                        <p className="text-amber-400 text-xs">San Clemente</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CONTACT SECTION */}
                <section id="contact" className="py-24 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[100px] -z-10" />

                    <div className="max-w-4xl mx-auto px-6">
                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />

                            <div className="relative flex flex-col items-center justify-center mb-10 pt-4">
                                <h2
                                    className="font-luna text-6xl md:text-7xl text-amber-400 relative z-10 leading-none drop-shadow-lg"
                                    style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                                >
                                    Contattaci
                                </h2>
                            </div>

                            <div className="text-center mb-12">
                                <p className="text-slate-400 max-w-lg mx-auto font-light">
                                    I campi con l'asterisco (*) sono obbligatori.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* RIGA 1: NOME E TELEFONO */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Nome *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-700"
                                            placeholder="Mario Rossi"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Telefono *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-700"
                                            placeholder="+39 333 ..."
                                        />
                                    </div>
                                </div>

                                {/* RIGA 2: EMAIL E TIPO EVENTO */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Email *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-4 text-slate-500" size={20} />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-700"
                                                placeholder="mario@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Tipo Evento</label>
                                        <div className="relative">
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer appearance-none"
                                            >
                                                <option>Matrimonio</option>
                                                <option>Compleanno</option>
                                                <option>Laurea</option>
                                                <option>Evento Aziendale</option>
                                                <option>Altro</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <ChevronRight className="rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGA 3: LOGICA DATA/PERIODO AGGIORNATA */}
                                <div className="space-y-4 pt-4 border-t border-slate-800/50 mt-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                        <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1 whitespace-nowrap">Quando? *</label>
                                        <div className="flex bg-slate-950 border border-slate-800 rounded-full p-1 w-fit">
                                            <button
                                                type="button"
                                                onClick={() => setDateMode('specific')}
                                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${dateMode === 'specific' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                Data Esatta
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDateMode('period')}
                                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${dateMode === 'period' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                Non ho la data
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative z-20 min-h-[60px]">
                                        {dateMode === 'specific' ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <CustomDatePicker
                                                    selectedDate={formData.specificDate}
                                                    onChange={handleDateChange}
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                            >
                                                {/* SELECT ANNO 2026-2035 */}
                                                <div className="relative group">
                                                    <Clock className="absolute left-4 top-4 text-slate-500 z-10 group-focus-within:text-amber-400 transition-colors" size={20} />
                                                    <select
                                                        name="periodYear"
                                                        value={formData.periodYear}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Anno</option>
                                                        {YEARS.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-slate-500" size={16} />
                                                </div>

                                                {/* SELECT MESE */}
                                                <div className="relative">
                                                    <select
                                                        name="periodMonth"
                                                        value={formData.periodMonth}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Mese</option>
                                                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-slate-500" size={16} />
                                                </div>

                                                {/* SELECT PERIODO (INIZIO/META/FINE) */}
                                                <div className="relative">
                                                    <select
                                                        name="periodTime"
                                                        value={formData.periodTime}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Periodo</option>
                                                        {PERIOD_OPTIONS.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-slate-500" size={16} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Messaggio</label>
                                    <textarea
                                        rows={4}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-700 resize-none"
                                        placeholder="Raccontaci i dettagli (location, idee, orari)..."
                                    ></textarea>
                                </div>

                                {/* PULSANTE ANIMATO */}
                                <motion.button
                                    type="submit"
                                    disabled={formStatus === 'sending' || formStatus === 'success'}
                                    whileTap={{ scale: 0.97 }}
                                    animate={formStatus === 'success' ? { backgroundColor: "#10B981", borderColor: "#10B981" } : { backgroundColor: "#fbbf24" }}
                                    className={`w-full font-bold text-lg h-16 rounded-lg transition-all shadow-xl flex items-center justify-center gap-3 relative overflow-hidden
                    ${formStatus === 'success' ? 'text-white' : 'text-slate-950 hover:bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]'}
                  `}
                                >
                                    <AnimatePresence mode="wait">
                                        {formStatus === 'idle' && (
                                            <motion.div
                                                key="idle"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="tracking-wide">INVIA RICHIESTA</span>
                                                <ArrowRight size={20} />
                                            </motion.div>
                                        )}

                                        {formStatus === 'sending' && (
                                            <motion.div
                                                key="sending"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                            >
                                                <Loader2 className="animate-spin" size={26} />
                                            </motion.div>
                                        )}

                                        {formStatus === 'success' && (
                                            <motion.div
                                                key="success"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1.2, opacity: 1 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check strokeWidth={4} size={28} />
                                                <span className="text-xl font-bold">INVIATO!</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </form>

                            <div className="mt-16 pt-10 border-t border-slate-800 flex flex-col items-center gap-6">
                                <p className="text-slate-500 text-sm tracking-wide">Preferisci parlare subito con noi?</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <a href="https://wa.me/393715428345" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-green-400 rounded-full border border-slate-700 hover:border-green-500 hover:bg-slate-800 transition-all group">
                                        <MessageCircle size={20} className="group-hover:scale-110 transition-transform" /> <span className="text-slate-300 group-hover:text-white transition-colors">WhatsApp</span>
                                    </a>
                                    <a href="https://instagram.com/tuo_profilo" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-pink-400 rounded-full border border-slate-700 hover:border-pink-500 hover:bg-slate-800 transition-all group">
                                        <Instagram size={20} className="group-hover:scale-110 transition-transform" /> <span className="text-slate-300 group-hover:text-white transition-colors">Instagram</span>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}