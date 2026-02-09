"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Hammer, Construction } from "lucide-react";
import localFont from 'next/font/local';
import { motion } from "framer-motion";
import clsx from "clsx";

// --- CONFIGURAZIONE FONT (Match esatto con il sito pubblico) ---
// Assicurati che il percorso del font sia corretto rispetto a dove si trova questo file
const lunaFont = localFont({
    src: [
        {
            path: '../../../fonts/mending.regular.otf', // Verifica il percorso nel tuo progetto!
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-luna',
});

// --- COMPONENTE STELLE (Semplificato per l'admin) ---
const StarField = () => {
    const [stars, setStars] = useState<{ id: number; top: number; left: number; size: number; delay: number }[]>([]);

    useEffect(() => {
        const count = 50; // Meno stelle rispetto alla home per non appesantire
        const newStars = Array.from({ length: count }).map((_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 5,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    initial={{ opacity: 0.2, scale: 0.8 }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: star.delay }}
                    className="absolute bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                    }}
                />
            ))}
        </div>
    );
};

export default function LunaEventsAdminWIP() {
    return (
        <div className={clsx("min-h-screen bg-[#050A18] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans", lunaFont.variable)}>
            
            {/* Sfondo identico alla Landing */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050A18] via-[#0A1125] to-[#050A18] z-0" />
            <StarField />

            {/* Contenuto Centrale */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center px-6 max-w-2xl w-full"
            >
                {/* Badge "Admin Area" */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C4A052]/30 bg-[#C4A052]/10 backdrop-blur-md mb-10">
                    <Sparkles size={12} className="text-[#C4A052]" />
                    <span className="text-[#C4A052] text-[10px] uppercase tracking-[0.2em] font-medium">Admin Dashboard</span>
                </div>

                {/* LOGO LUNA EVENTS (Stesso stile della home) */}
                <div className="mb-8 select-none">
                    <h1 className="text-[5rem] md:text-[7rem] leading-none text-[#C4A052] font-normal drop-shadow-[0_0_15px_rgba(196,160,82,0.3)]" style={{ fontFamily: 'var(--font-luna)' }}>
                        Luna
                    </h1>
                    <h2 className="text-xl md:text-2xl text-white/90 uppercase tracking-[0.4em] font-light -mt-2 ml-2">
                        Events
                    </h2>
                </div>

                {/* Messaggio WIP */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden group">
                    {/* Effetto luce al passaggio del mouse */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#C4A052]/0 via-[#C4A052]/5 to-[#C4A052]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#C4A052]/10 flex items-center justify-center border border-[#C4A052]/30 mb-2">
                            <Construction className="text-[#C4A052] w-8 h-8" strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-2xl font-light text-white">Stiamo creando la magia.</h3>
                        <p className="text-slate-400 font-light leading-relaxed max-w-md mx-auto">
                            Il modulo di gestione eventi è attualmente in fase di sviluppo. 
                            Presto potrai gestire prenotazioni, gallery e dettagli direttamente da qui.
                        </p>
                    </div>
                </div>

                {/* Tasto Torna Indietro (Stile Premium) */}
                <Link 
                    href="/admin"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-[#C4A052] text-[#C4A052] rounded-full hover:bg-[#C4A052] hover:text-[#050A18] transition-all duration-500 group relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2 font-medium tracking-wide text-sm">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        TORNA ALLA DASHBOARD
                    </span>
                </Link>

            </motion.div>

            {/* Footer decorativo */}
            <div className="absolute bottom-6 text-[#C4A052]/30 text-[10px] uppercase tracking-[0.3em] font-light">
                Coming Soon
            </div>
        </div>
    );
}