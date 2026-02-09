"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import localFont from 'next/font/local';

// Assicurati che il percorso dei font sia corretto
const lunaFont = localFont({
    src: [
        {
            path: '../../../fonts/mending.regular.otf', 
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-luna',
});

type StarData = {
    id: number; top: number; left: number; size: number; delay: number; duration: number; type: 'background' | 'medium' | 'bright';
};

export default function PrivacyPolicyLuna() {
    const [stars, setStars] = useState<StarData[]>([]);

    useEffect(() => {
        setStars(Array.from({ length: 80 }).map((_, i) => {
            const rand = Math.random();
            let type: 'background' | 'medium' | 'bright' = 'background';
            let size = Math.random() * 1.5 + 0.5;
            if (rand > 0.90) { type = 'bright'; size = Math.random() * 2 + 3; } 
            else if (rand > 0.65) { type = 'medium'; size = Math.random() * 2 + 1; }
            return {
                id: i, top: Math.random() * 100, left: Math.random() * 100, size,
                delay: Math.random() * 5, duration: Math.random() * 3 + 2, type,
            };
        }));
    }, []);

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
                        
                        {/* CONTENUTO LEGALE LUNA + TSC */}
                        <div className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                             <section>
                                <h2 className="text-xl font-luna text-amber-400 mt-8 mb-4" style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}>1. Titolare del Trattamento</h2>
                                <p>Il Titolare del trattamento è <strong>Tabacchi San Clemente di Ianniello Gianpaolo</strong>.<br/>P.IVA: 04124110612 - Email: tabacchisanclemente@libero.it</p>
                            </section>

                            <div className="h-px w-full bg-slate-800/50 my-6"></div>

                            <section>
                                <h2 className="text-xl font-luna text-amber-400 mt-8 mb-4" style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}>2. Dati Raccolti</h2>
                                <p>Raccogliamo dati per:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-amber-400">
                                    <li><strong>Servizio Box San Valentino:</strong> Dati di spedizione e contatto.</li>
                                    <li><strong>Preventivi Luna Events:</strong> Dati sull'evento, email e telefono.</li>
                                </ul>
                            </section>

                            <div className="h-px w-full bg-slate-800/50 my-6"></div>

                            <section>
                                <h2 className="text-xl font-luna text-amber-400 mt-8 mb-4" style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}>3. Finalità</h2>
                                <p>Gestione ordini, elaborazione preventivi, adempimenti fiscali e comunicazioni di servizio.</p>
                            </section>

                             <div className="h-px w-full bg-slate-800/50 my-6"></div>

                            <section>
                                <h2 className="text-xl font-luna text-amber-400 mt-8 mb-4" style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}>4. Diritti</h2>
                                <p>Hai diritto di accesso, rettifica e cancellazione dei dati scrivendo all'email del titolare.</p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}