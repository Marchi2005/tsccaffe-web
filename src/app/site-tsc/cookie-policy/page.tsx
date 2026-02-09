"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Cookie, ShieldCheck, Info } from "lucide-react";
import localFont from 'next/font/local';
import { usePathname } from "next/navigation";

// --- CONFIGURAZIONE FONT LUNA ---
const lunaFont = localFont({
    src: [
        {
            path: '../../../fonts/mending.regular.otf', // Assicurati che il percorso font sia corretto per la tua struttura
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-luna',
});

// --- TIPI PER LE STELLE (Solo per Luna) ---
type StarData = {
    id: number;
    top: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
    type: 'background' | 'medium' | 'bright';
};

export default function CookiePolicy() {
    const pathname = usePathname();
    const [isLuna, setIsLuna] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [stars, setStars] = useState<StarData[]>([]);

    useEffect(() => {
        setMounted(true);
        // LOGICA DI ROUTER INTERNO: Controllo dove siamo
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            if (hostname.includes("lunaevents") || pathname.includes("site-luna")) {
                setIsLuna(true);
                // Genera stelle solo se siamo su Luna
                setStars(generateStars(80));
            } else {
                setIsLuna(false);
            }
        }
    }, [pathname]);

    // Helper generazione stelle
    const generateStars = (count: number): StarData[] => {
        return Array.from({ length: count }).map((_, i) => {
            const rand = Math.random();
            let type: 'background' | 'medium' | 'bright' = 'background';
            let size = Math.random() * 1.5 + 0.5;
            if (rand > 0.90) { type = 'bright'; size = Math.random() * 2 + 3; } 
            else if (rand > 0.65) { type = 'medium'; size = Math.random() * 2 + 1; }
            return {
                id: i, top: Math.random() * 100, left: Math.random() * 100, size,
                delay: Math.random() * 5, duration: Math.random() * 3 + 2, type,
            };
        });
    };

    if (!mounted) return null; // Evita sfarfallii iniziale

    // ------------------------------------------------------------------
    // LAYOUT 1: VERSIONE LUNA EVENTS (Dark, Stelle, Elegante)
    // ------------------------------------------------------------------
    if (isLuna) {
        return (
            <main className={`${lunaFont.variable} min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden`}>
                {/* Sfondo Stelle */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none" />
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {stars.map((star) => (
                        <div key={star.id} className={`absolute rounded-full animate-pulse ${star.type === 'bright' ? "bg-amber-200 blur-[0.5px]" : "bg-slate-400/40"}`}
                            style={{ top: `${star.top}%`, left: `${star.left}%`, width: `${star.size}px`, height: `${star.size}px`, animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }} />
                    ))}
                </div>

                <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
                            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-amber-400 transition-colors duration-300 group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Torna alla Home
                            </Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="flex items-center gap-4 mb-2">
                                <Cookie className="text-amber-400" size={32} />
                                <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">Cookie Policy</h1>
                            </div>
                            <p className="text-amber-400/80 text-sm mb-8 font-mono tracking-widest uppercase">Luna Events • Febbraio 2026</p>
                            
                            {/* Contenuto Testuale Luna */}
                            <PolicyContent theme="luna" />
                        </motion.div>
                    </div>
                </div>
            </main>
        );
    }

    // ------------------------------------------------------------------
    // LAYOUT 2: VERSIONE TSC CAFFÈ (Light, Pulita, Brand)
    // ------------------------------------------------------------------
    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-700">
            <div className="pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors duration-300 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Torna alla Home
                        </Link>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm relative">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-full">
                                <ShieldCheck className="text-blue-600" size={32} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900">Cookie Policy</h1>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 font-medium">TSC Caffè • Aggiornato Febbraio 2026</p>

                        {/* Contenuto Testuale TSC */}
                        <PolicyContent theme="tsc" />
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

// ------------------------------------------------------------------
// COMPONENTE CONTENUTO CONDIVISO (IL TESTO È LO STESSO, CAMBIA LO STILE CSS)
// ------------------------------------------------------------------
function PolicyContent({ theme }: { theme: 'luna' | 'tsc' }) {
    const isLuna = theme === 'luna';

    // Classi CSS dinamiche in base al tema
    const titleClass = isLuna 
        ? "text-xl font-luna text-amber-400 mt-8 mb-4" 
        : "text-lg font-bold text-slate-900 mt-8 mb-3";
    
    const textClass = isLuna 
        ? "text-slate-300 leading-relaxed font-light" 
        : "text-slate-600 leading-relaxed";

    const dividerClass = isLuna
        ? "h-px w-full bg-slate-800/50 my-6"
        : "h-px w-full bg-slate-100 my-6";

    const boxClass = isLuna
        ? "bg-slate-950/50 p-4 rounded-xl border border-slate-800 mt-4"
        : "bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-4";

    return (
        <div className="text-sm sm:text-base">
            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    1. Cosa sono i cookie
                </h2>
                <p className={textClass}>
                    I cookie sono piccoli file di testo che i siti visitati dagli utenti inviano ai loro terminali, dove vengono memorizzati per essere ritrasmessi agli stessi siti in occasione di visite successive.
                </p>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    2. Tipologie di cookie utilizzati
                </h2>
                <p className={textClass}>
                    Questo sito utilizza esclusivamente <strong className={isLuna ? "text-white" : "text-slate-900"}>Cookie Tecnici</strong>, strettamente necessari per il corretto funzionamento del sito e per l'erogazione del servizio (es. navigazione sicura, gestione sessioni).
                </p>
                <div className={boxClass}>
                    <p className={isLuna ? "text-slate-400 text-sm" : "text-slate-600 text-sm"}>
                        <Info size={16} className={`inline mr-2 -mt-0.5 ${isLuna ? "text-amber-400" : "text-blue-500"}`} />
                        <strong>Nota Bene:</strong> Non vengono utilizzati cookie di profilazione per scopi pubblicitari o di marketing tracciante.
                    </p>
                </div>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    3. Terze Parti
                </h2>
                <p className={textClass}>
                    Alcuni servizi integrati (come mappe o video) potrebbero installare cookie tecnici gestiti da terze parti.
                </p>
                <ul className={`list-disc pl-5 mt-2 space-y-2 ${isLuna ? "marker:text-amber-400" : "marker:text-blue-500"}`}>
                    <li className={textClass}>
                        <strong className={isLuna ? "text-white" : "text-slate-900"}>Vercel / Hosting:</strong> Cookie tecnici per performance e sicurezza.
                    </li>
                </ul>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    4. Gestione del consenso
                </h2>
                <p className={textClass}>
                    Poiché utilizziamo solo cookie tecnici essenziali, la normativa vigente non richiede un consenso preventivo esplicito (banner di blocco), ma solo l'informativa. Puoi comunque disabilitare i cookie dalle impostazioni del tuo browser.
                </p>
            </section>
        </div>
    );
}