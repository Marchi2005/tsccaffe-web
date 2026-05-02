"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Cookie, ShieldCheck, Info } from "lucide-react";
import localFont from 'next/font/local';

// --- CONFIGURAZIONE FONT LUNA ---
const lunaFont = localFont({
    src: [{ path: '../../fonts/mending.regular.otf', weight: '400', style: 'normal' }], // non toccare, altrimenti non funziona il font
    variable: '--font-luna',
});

// --- TIPI PER LE PARTICELLE (Solo per Luna) ---
type StarData = {
    id: number;
    top: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
    type: 'background' | 'medium' | 'bright';
};

export default function CookiePolicyCondivisa() {
    const [isLuna, setIsLuna] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [stars, setStars] = useState<StarData[]>([]);
    // Aggiunto lo stato per gestire il link della home
    const [homeUrl, setHomeUrl] = useState("/");

    useEffect(() => {
        setMounted(true);
        
        if (typeof window !== "undefined") {
            const hostname = window.location.hostname;
            // Leggiamo i parametri dall'URL (es: ?site=luna)
            const searchParams = new URLSearchParams(window.location.search);
            const isLunaQuery = searchParams.get("site") === "luna";
            
            // È Luna se siamo sul dominio in produzione, o se l'URL ha ?site=luna
            const lunaActive = hostname.includes("lunaevents") || isLunaQuery;
            setIsLuna(lunaActive);

            // --- GESTIONE INTELLIGENTE TASTO INDIETRO ---
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

    // Helper generazione particelle eleganti
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

    // --- CONFIGURAZIONE STILI DINAMICI ---
    const config = {
        bg: isLuna ? "bg-[#FAF8F5]" : "bg-slate-50",
        text: isLuna ? "text-slate-800" : "text-slate-700",
        card: isLuna ? "bg-white/90 backdrop-blur-md border-[#E8E1D9] shadow-xl" : "bg-white border-slate-200 shadow-sm",
        accent: isLuna ? "text-[#7A0018]" : "text-blue-600",
        accentBg: isLuna ? "" : "bg-blue-50 p-3 rounded-full",
        btnHover: isLuna ? "hover:text-[#7A0018]" : "hover:text-slate-900"
    };

    return (
        <main className={`${isLuna ? lunaFont.variable : ""} min-h-screen ${config.bg} ${config.text} relative overflow-hidden transition-colors duration-500`}>
            
            {/* SFONDO ANIMATO SOLO PER LUNA */}
            {isLuna && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5] z-0 pointer-events-none" />
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        {stars.map((star) => (
                            <div key={star.id} className={`absolute rounded-full animate-pulse transition-all ${star.type === 'bright' ? "bg-[#7A0018]/20 blur-[1px]" : star.type === 'medium' ? "bg-[#D4AF37]/30 blur-[0.5px]" : "bg-slate-300/50"}`}
                                style={{ top: `${star.top}%`, left: `${star.left}%`, width: `${star.size}px`, height: `${star.size}px`, animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }} />
                        ))}
                    </div>
                </>
            )}

            <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    
                    {/* TASTO INDIETRO INTELLIGENTE */}
                    <Link href={homeUrl} className={`inline-flex items-center gap-2 text-sm font-bold text-slate-500 ${config.btnHover} mb-8 transition-colors group`}>
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Torna alla Home
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-8 sm:p-12 rounded-3xl border ${config.card} relative overflow-hidden`}>
                        {/* Riga sfumata in alto stile Luna */}
                        {isLuna && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7A0018] to-transparent opacity-30" />}
                        
                        <div className="flex items-center gap-4 mb-2">
                            <div className={config.accentBg}>
                                {isLuna ? <Cookie className={config.accent} size={32} /> : <ShieldCheck className={config.accent} size={32} />}
                            </div>
                            <h1 className={`text-3xl md:text-4xl font-bold ${isLuna ? "font-serif tracking-wide text-slate-900" : "font-extrabold text-slate-900"}`}>
                                Cookie Policy
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 italic">
                            {isLuna ? "Luna Events" : "TSC Caffè"} • Aggiornato 2026
                        </p>

                        {/* CONTENUTO DELLA POLICY */}
                        <PolicyContent isLuna={isLuna} />
                        
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

// ------------------------------------------------------------------
// COMPONENTE CONTENUTO (IL TESTO È LO STESSO, CAMBIA LO STILE CSS)
// ------------------------------------------------------------------
function PolicyContent({ isLuna }: { isLuna: boolean }) {
    // Classi CSS dinamiche in base al tema
    const titleClass = isLuna 
        ? "text-xl font-serif text-[#7A0018] mt-8 mb-4" 
        : "text-lg font-bold text-slate-900 mt-8 mb-3";
    
    const textClass = isLuna 
        ? "text-slate-600 leading-relaxed font-light text-lg" 
        : "text-slate-600 leading-relaxed";

    const dividerClass = isLuna
        ? "h-px w-full bg-[#E8E1D9] my-6"
        : "h-px w-full bg-slate-100 my-6";

    const boxClass = isLuna
        ? "bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E1D9] mt-4"
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
                    Questo sito utilizza esclusivamente <strong className="text-slate-900 font-medium">Cookie Tecnici</strong>, strettamente necessari per il corretto funzionamento del sito e per l'erogazione del servizio (es. navigazione sicura, gestione sessioni).
                </p>
                <div className={boxClass}>
                    <p className={isLuna ? "text-slate-500 text-sm" : "text-slate-600 text-sm"}>
                        <Info size={16} className={`inline mr-2 -mt-0.5 ${isLuna ? "text-[#7A0018]" : "text-blue-500"}`} />
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
                <ul className={`list-disc pl-5 mt-2 space-y-2 ${isLuna ? "marker:text-[#7A0018]" : "marker:text-blue-500"}`}>
                    <li className={textClass}>
                        <strong className="text-slate-900 font-medium">Vercel / Hosting:</strong> Cookie tecnici per performance e sicurezza.
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