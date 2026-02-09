"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Shield, UserCheck, FileText, Mail, MapPin } from "lucide-react";
import localFont from 'next/font/local';
import { usePathname } from "next/navigation";

// --- CONFIGURAZIONE FONT LUNA ---
const lunaFont = localFont({
    src: [
        {
            path: '../../../fonts/mending.regular.otf', // Assicurati che il percorso relative ai font sia corretto
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

export default function PrivacyPolicy() {
    const pathname = usePathname();
    const [isLuna, setIsLuna] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [stars, setStars] = useState<StarData[]>([]);

    useEffect(() => {
        setMounted(true);
        // LOGICA DI ROUTER INTERNO
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            if (hostname.includes("lunaevents") || pathname.includes("site-luna")) {
                setIsLuna(true);
                setStars(generateStars(80));
            } else {
                setIsLuna(false);
            }
        }
    }, [pathname]);

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

    if (!mounted) return null;

    // ------------------------------------------------------------------
    // LAYOUT 1: VERSIONE LUNA EVENTS (Dark, Stelle, Elegante)
    // ------------------------------------------------------------------
    if (isLuna) {
        return (
            <main className={`${lunaFont.variable} min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden selection:bg-amber-400 selection:text-slate-950`}>
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
                                <Lock className="text-amber-400" size={32} />
                                <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide">Privacy Policy</h1>
                            </div>
                            <p className="text-amber-400/80 text-sm mb-8 font-mono tracking-widest uppercase">Luna Events • Aggiornamento Febbraio 2026</p>
                            
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
                            <div className="bg-brand-red/10 p-3 rounded-full">
                                <Shield className="text-brand-red" size={32} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 font-medium">TSC Caffè • Aggiornato Febbraio 2026</p>

                        <PolicyContent theme="tsc" />
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

// ------------------------------------------------------------------
// COMPONENTE CONTENUTO CONDIVISO
// ------------------------------------------------------------------
function PolicyContent({ theme }: { theme: 'luna' | 'tsc' }) {
    const isLuna = theme === 'luna';

    // Stili CSS dinamici
    const titleClass = isLuna 
        ? "text-xl font-luna text-amber-400 mt-8 mb-4" 
        : "text-lg font-bold text-slate-900 mt-8 mb-3";
    
    const textClass = isLuna 
        ? "text-slate-300 leading-relaxed font-light" 
        : "text-slate-700 leading-relaxed";

    const dividerClass = isLuna
        ? "h-px w-full bg-slate-800/50 my-6"
        : "h-px w-full bg-slate-100 my-6";

    const strongClass = isLuna ? "text-white font-medium" : "text-slate-900 font-bold";
    const listMarkerClass = isLuna ? "marker:text-amber-400" : "marker:text-brand-red";

    return (
        <div className="text-sm sm:text-base">
            
            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    1. Titolare del Trattamento
                </h2>
                <p className={textClass}>
                    Il Titolare del trattamento dei dati è: <br />
                    <strong className={strongClass}>Tabacchi San Clemente di Ianniello Gianpaolo</strong> <br />
                    Indirizzo: Via Galatina 95, 81100 San Clemente, Caserta (CE) <br />
                    P.IVA: 04124110612 <br />
                    Email di contatto: tabacchisanclemente@libero.it
                </p>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    2. Tipologia di dati raccolti
                </h2>
                <p className={textClass}>
                    Raccogliamo dati personali forniti volontariamente dall'utente attraverso i nostri moduli digitali per l'erogazione dei servizi. Nello specifico:
                </p>
                <ul className={`list-disc pl-5 mt-4 space-y-2 ${listMarkerClass}`}>
                    <li className={textClass}>
                        <strong className={strongClass}>Servizio "Prenota Box" (TSC Caffè):</strong> Nome, Cognome, Numero di telefono, Indirizzo di consegna (se applicabile), preferenze alimentari.
                    </li>
                    <li className={textClass}>
                        <strong className={strongClass}>Servizio "Preventivi Eventi" (Luna Events):</strong> Nome, Cognome, Email, Numero di telefono, Dettagli sull'evento (data, tipo di cerimonia, numero ospiti) inseriti nel modulo di contatto dedicato.
                    </li>
                    <li className={textClass}>
                        <strong className={strongClass}>Dati tecnici:</strong> Indirizzo IP e dati di navigazione necessari alla sicurezza del sito (gestiti tramite Vercel/Supabase).
                    </li>
                </ul>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    3. Finalità del trattamento
                </h2>
                <p className={textClass}>
                    I dati raccolti, sia tramite il sito TSC che Luna Events, vengono trattati esclusivamente per:
                </p>
                <ul className={`list-disc pl-5 mt-2 space-y-1 ${listMarkerClass}`}>
                    <li className={textClass}>Gestione ed evasione dell'ordine o elaborazione del preventivo richiesto.</li>
                    <li className={textClass}>Ricontatto telefonico o via email per conferme, dettagli logistici o appuntamenti.</li>
                    <li className={textClass}>Adempimenti fiscali, amministrativi e obblighi di legge (es. fatturazione).</li>
                </ul>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    4. Modalità e conservazione
                </h2>
                <p className={textClass}>
                    I dati sono trattati con strumenti informatici idonei a garantirne la sicurezza e la riservatezza. I dati relativi agli ordini e ai preventivi verranno conservati per il tempo necessario all'espletamento del servizio e, successivamente, per i termini di legge previsti per la conservazione dei documenti fiscali (10 anni).
                </p>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    5. Comunicazione a terzi
                </h2>
                <p className={textClass}>
                    I dati non saranno mai diffusi pubblicamente. Potranno essere comunicati a terzi solo se strettamente necessario per l'erogazione del servizio (es. personale addetto alla consegna, staff dell'evento) o per obblighi di legge (es. commercialista, autorità competenti).
                </p>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass} style={isLuna ? { fontFeatureSettings: '"liga" 1, "calt" 1' } : {}}>
                    6. Diritti dell'interessato
                </h2>
                <p className={textClass}>
                    Ai sensi del GDPR, l'utente ha diritto di chiedere al Titolare l'accesso ai propri dati, la rettifica, la cancellazione degli stessi ("diritto all'oblio") o la limitazione del trattamento. Le richieste possono essere indirizzate all'email del Titolare indicata al punto 1.
                </p>
            </section>

            {/* Footer interno della policy */}
            <div className={`mt-12 pt-6 border-t text-center ${isLuna ? "border-slate-800" : "border-slate-100"}`}>
                <p className={`text-xs uppercase tracking-widest ${isLuna ? "text-slate-500" : "text-slate-400"}`}>
                    Tabacchi San Clemente di Ianniello Gianpaolo
                </p>
            </div>
        </div>
    );
}