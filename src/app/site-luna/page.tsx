"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import localFont from 'next/font/local';

// Importazione Componenti Modulari
import LunaLoader from "./components/home/LunaLoader";
import Hero from "./components/home/Hero";
import Concept from "./components/home/Concept";
import Gallery from "./components/home/Gallery";
import Contact from "./components/home/Contact";

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

export default function LunaEventsPage() {
    const [loading, setLoading] = useState(true);

    // Blocco scorrimento pagina durante il caricamento iniziale
    useEffect(() => {
        if (loading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [loading]);

    return (
        <main className={`${lunaFont.variable} min-h-screen bg-[#FAF8F5] text-slate-800 selection:bg-[#7A0018] selection:text-white`}>
            
            <AnimatePresence>
                {loading && <LunaLoader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            <Hero />
            <Concept />
            <Gallery />
            <Contact />

        </main>
    );
}