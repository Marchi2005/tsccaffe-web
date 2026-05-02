"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { generateStars, StarData } from "../../utils/helpers";

export default function Hero() {
    const [stars, setStars] = useState<StarData[]>([]);

    useEffect(() => {
        setStars(generateStars(150));
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5] z-0" />

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className={`absolute rounded-full animate-pulse transition-all ${star.type === 'bright'
                                ? "bg-[#7A0018]/20 blur-[1px] z-10"
                                : star.type === 'medium'
                                    ? "bg-[#D4AF37]/30 blur-[0.5px]"
                                    : "bg-slate-300/50"
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
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 tracking-tight leading-tight">
                        Il Tuo Evento <br />
                        <span
                            className="text-[#7A0018] font-luna text-7xl md:text-9xl block mt-4"
                            style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                        >
                            Ovunque Tu Voglia
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Portiamo l'eleganza del TSC Caffè ovunque tu voglia.
                        Il nostro allestimento Apecar esclusivo per rendere i tuoi eventi indimenticabili.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <a
                            href="#contact"
                            className="w-full sm:w-auto px-10 py-4 bg-[#7A0018] text-white font-bold rounded-full hover:bg-[#5C0012] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Richiedi Preventivo
                        </a>
                        <a
                            href="#gallery"
                            className="w-full sm:w-auto px-10 py-4 border border-[#7A0018] text-[#7A0018] rounded-full hover:bg-[#7A0018] hover:text-white transition-colors duration-300 backdrop-blur-sm"
                        >
                            Guarda le Foto
                        </a>
                    </div>

                    <div className="relative flex flex-col items-center justify-center mt-24 md:mt-32">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-65 pointer-events-none">
                            <Image
                                src="/icons/moon.svg"
                                alt=""
                                width={300}
                                height={300}
                                className="w-64 h-64 md:w-80 md:h-80 object-contain"
                            />
                        </div>
                        <h2
                            className="font-luna text-6xl md:text-8xl text-[#7A0018]/80 relative z-10 leading-none"
                            style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                        >
                            Luna
                        </h2>
                        {/* COLORE EVENT: Uniformato al brand #7A0018 */}
                        <span className="text-[#7A0018] font-serif uppercase text-xs md:text-sm tracking-[0.5em] relative z-10 mt-[-5px] md:mt-[-10px] pl-2 opacity-80">
                            Events
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}