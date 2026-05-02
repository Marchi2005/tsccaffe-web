"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const GALLERY_IMAGES = [
    "/images/luna-1.jpg",
    "/images/luna-2.jpg",
    "/images/luna-3.jpg",
    "/images/luna-4.jpg",
];

export default function Gallery() {
    return (
        <section id="gallery" className="py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-[#7A0018] text-xs font-bold tracking-[0.2em] uppercase border border-[#7A0018]/20 px-4 py-1.5 rounded-full bg-white shadow-sm">Portfolio</span>
                    <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mt-6">I Nostri Allestimenti</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {GALLERY_IMAGES.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative h-80 rounded-xl overflow-hidden bg-white border border-[#E8E1D9] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-[#F4EFE6]">
                                <Camera size={32} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-70" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-white text-sm font-medium">Evento {index + 1}</p>
                                <p className="text-[#F4EFE6] text-xs">San Clemente</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}