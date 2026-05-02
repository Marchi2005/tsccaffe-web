"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { generateStars, StarData } from "../../utils/helpers";

export default function LunaLoader({ onComplete }: { onComplete: () => void }) {
    const [stars, setStars] = useState<StarData[]>([]);

    useEffect(() => {
        setStars(generateStars(100));
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF8F5] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
        >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className={`absolute rounded-full animate-pulse ${star.type === 'bright' ? "bg-[#7A0018]/30 blur-[1px]" :
                                star.type === 'medium' ? "bg-[#D4AF37]/40" : "bg-slate-200/60"
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
                {/* LUNA VISIBILE: Opacità passata da 5 a 30 */}
                <Image
                    src="/icons/moon.svg"
                    alt="Luna Sfondo"
                    width={800}
                    height={800}
                    className="w-[400px] h-[400px] md:w-[700px] md:h-[700px] object-contain opacity-50 drop-shadow-xl"
                />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center text-center mt-10">
                <motion.h1
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="font-luna text-[9rem] md:text-[13rem] leading-none text-[#7A0018] drop-shadow-sm"
                    style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
                >
                    Luna
                </motion.h1>

                {/* COLORE EVENT: Uniformato al brand #7A0018 */}
                <motion.span
                    initial={{ opacity: 0, letterSpacing: "0em", y: -20 }}
                    animate={{ opacity: 1, letterSpacing: "0.6em", y: 0 }}
                    transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                    onAnimationComplete={() => setTimeout(onComplete, 1000)}
                    className="text-[#7A0018] font-serif uppercase text-sm md:text-xl font-medium tracking-widest relative -top-4 md:-top-8"
                >
                    Events
                </motion.span>
            </div>
        </motion.div>
    );
}