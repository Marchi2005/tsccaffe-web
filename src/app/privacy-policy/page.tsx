"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Shield } from "lucide-react";
import localFont from 'next/font/local';

// --- CONFIGURAZIONE FONT LUNA ---
const lunaFont = localFont({
    src: [
        {
            path: '../../fonts/mending.regular.otf', // Verifica che il percorso per risalire sia corretto dal nuovo path
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
    const [isLuna, setIsLuna] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [stars, setStars] = useState<StarData[]>([]);
    const [homeUrl, setHomeUrl] = useState("/");

    useEffect(() => {
        setMounted(true);
        
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            // Leggiamo i parametri dall'URL (es: ?site=luna)
            const searchParams = new URLSearchParams(window.location.search);
            const isLunaQuery = searchParams.get("site") === "luna";
            
            // È Luna se siamo sul dominio in produzione, o se l'URL ha ?site=luna, o se il percorso precedente era site-luna
            const lunaActive = hostname.includes("lunaevents") || isLunaQuery;
            setIsLuna(lunaActive);

            // GESTIONE INTELLIGENTE TASTO INDIETRO
            if (hostname.includes("lunaevents")) {
                setHomeUrl("/"); // In produzione il dominio lunaevents.it ha la home alla root
            } else if (isLunaQuery) {
                setHomeUrl("/site-luna"); // In locale, se abbiamo cliccato da luna, torniamo alla sottocartella
            } else {
                setHomeUrl("/"); // Di default torna alla home di TSC
            }

            // Genera le particelle eleganti se siamo su Luna
            if (lunaActive) {
                setStars(generateStars(60));
            }
        }
    }, []);

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

    // Previene il flickering durante il caricamento client-side
    if (!mounted) return <div className="min-h-screen bg-[#FAF8F5]"></div>;

    // ------------------------------------------------------------------
    // LAYOUT 1: VERSIONE LUNA EVENTS (Nuovo Tema Chiaro ed Elegante)
    // ------------------------------------------------------------------
    if (isLuna) {
        return (
            <main className={`${lunaFont.variable} min-h-screen bg-[#FAF8F5] text-slate-800 relative overflow-hidden selection:bg-[#7A0018] selection:text-white`}>
                
                {/* Sfondo Animato Panna/Oro/Rosso */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5] z-0 pointer-events-none" />
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {stars.map((star) => (
                        <div key={star.id} className={`absolute rounded-full animate-pulse transition-all ${star.type === 'bright' ? "bg-[#7A0018]/20 blur-[1px]" : star.type === 'medium' ? "bg-[#D4AF37]/30 blur-[0.5px]" : "bg-slate-300/50"}`}
                            style={{ top: `${star.top}%`, left: `${star.left}%`, width: `${star.size}px`, height: `${star.size}px`, animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }} />
                    ))}
                </div>

                <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
                            <Link href={homeUrl} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#7A0018] transition-colors duration-300 group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Torna alla Home
                            </Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-[#E8E1D9] shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7A0018] to-transparent opacity-30" />
                            
                            <div className="flex items-center gap-4 mb-2">
                                <Lock className="text-[#7A0018]" size={32} />
                                <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-wide">Privacy Policy</h1>
                            </div>
                            <p className="text-slate-400 text-sm mb-8 font-serif italic tracking-wide">Luna Events • Aggiornamento Febbraio 2026</p>
                            
                            <PolicyContent theme="luna" />
                        </motion.div>
                    </div>
                </div>
            </main>
        );
    }

    // ------------------------------------------------------------------
    // LAYOUT 2: VERSIONE TSC CAFFÈ (Invariata)
    // ------------------------------------------------------------------
    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-700">
            <div className="pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
                        <Link href={homeUrl} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors duration-300 group">
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
                        <p className="text-slate-400 text-sm mb-8 font-medium">TSC Caffè • Aggiornato Aprile 2026</p>

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

    // Stili CSS dinamici aggiornati per il nuovo tema chiaro di Luna
    const titleClass = isLuna 
        ? "text-2xl font-serif text-[#7A0018] mt-10 mb-4" 
        : "text-lg font-bold text-slate-900 mt-8 mb-3";
    
    const textClass = isLuna 
        ? "text-slate-600 leading-relaxed font-light text-lg" 
        : "text-slate-700 leading-relaxed";

    const dividerClass = isLuna
        ? "h-px w-full bg-[#E8E1D9] my-8"
        : "h-px w-full bg-slate-100 my-6";

    const strongClass = isLuna ? "text-slate-900 font-medium" : "text-slate-900 font-bold";
    const listMarkerClass = isLuna ? "marker:text-[#7A0018]" : "marker:text-brand-red";

    return (
        <div className="text-sm sm:text-base">
            
            <section>
                <h2 className={titleClass}>
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
                <h2 className={titleClass}>
                    2. Tipologia di dati raccolti
                </h2>
                <p className={textClass}>
                    Raccogliamo dati personali forniti volontariamente dall'utente attraverso i nostri moduli digitali per l'erogazione dei servizi. Nello specifico:
                </p>
                <ul className={`list-disc pl-5 mt-4 space-y-2 ${listMarkerClass}`}>
                    <li className={textClass}>
                        <strong className={strongClass}>Servizi "Prenota Box" e "Prenota Colazione" (TSC Caffè):</strong> Nome, Cognome, Numero di telefono, Indirizzo di consegna (se applicabile), preferenze alimentari.
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
                <h2 className={titleClass}>
                    3. Finalità del trattamento
                </h2>
                <p className={textClass}>
                    I dati raccolti, sia tramite il sito TSC che Luna Events, vengono trattati esclusivamente per:
                </p>
                <ul className={`list-disc pl-5 mt-4 space-y-2 ${listMarkerClass}`}>
                    <li className={textClass}>Gestione ed evasione dell'ordine o elaborazione del preventivo richiesto.</li>
                    <li className={textClass}>Ricontatto telefonico o via email per conferme, dettagli logistici o appuntamenti.</li>
                    <li className={textClass}>Adempimenti fiscali, amministrativi e obblighi di legge (es. fatturazione).</li>
                </ul>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass}>
                    4. Modalità e conservazione
                </h2>
                <p className={textClass}>
                    I dati sono trattati con strumenti informatici idonei a garantirne la sicurezza e la riservatezza. I dati relativi agli ordini e ai preventivi verranno conservati per il tempo necessario all'espletamento del servizio e, successivamente, per i termini di legge previsti per la conservazione dei documenti fiscali (10 anni).
                </p>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass}>
                    5. Comunicazione a terzi
                </h2>
                <p className={textClass}>
                    I dati non saranno mai diffusi pubblicamente. Potranno essere comunicati a terzi solo se strettamente necessario per l'erogazione del servizio (es. personale addetto alla consegna, staff dell'evento) o per obblighi di legge (es. commercialista, autorità competenti).
                </p>
            </section>

            <div className={dividerClass}></div>

            <section>
                <h2 className={titleClass}>
                    6. Diritti dell'interessato
                </h2>
                <p className={textClass}>
                    Ai sensi del GDPR, l'utente ha diritto di chiedere al Titolare l'accesso ai propri dati, la rettifica, la cancellazione degli stessi ("diritto all'oblio") o la limitazione del trattamento. Le richieste possono essere indirizzate all'email del Titolare indicata al punto 1.
                </p>
            </section>

            {/* Footer interno della policy */}
            <div className={`mt-12 pt-6 border-t text-center ${isLuna ? "border-[#E8E1D9]" : "border-slate-100"}`}>
                <p className={`text-xs uppercase tracking-widest ${isLuna ? "text-slate-400" : "text-slate-400"}`}>
                    Tabacchi San Clemente di Ianniello Gianpaolo
                </p>
            </div>
        </div>
    );
}