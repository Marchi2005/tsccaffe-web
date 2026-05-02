"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export default function Concept() {
    return (
        <section className="py-24 bg-white/60 border-y border-[#E8E1D9]">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl border border-[#E8E1D9] group"
                >
                    <div className="absolute inset-0 bg-[#F4EFE6] flex items-center justify-center group-hover:bg-[#E8E1D9] transition-colors">
                        <span className="text-[#7A0018]/50 flex flex-col items-center gap-2">
                            <Camera size={48} />
                            <span className="text-xs uppercase tracking-widest font-semibold">Foto Apecar</span>
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900">
                        Un tocco <span className="text-[#7A0018] font-luna text-5xl md:text-6xl px-2" style={{ fontFeatureSettings: '"liga" 1' }}>Chic</span> & Vintage
                    </h2>
                    <div className="space-y-4 text-slate-600 leading-relaxed text-lg font-light">
                        <p>
                            <strong className="text-slate-900 font-medium">Luna Events</strong> nasce dalla passione per i dettagli. Abbiamo trasformato un'iconica Apecar in un bar mobile di lusso, pronto a servire bollicine, cocktail e finger food.
                        </p>
                        <p>
                            Non portiamo solo bevande, portiamo un'atmosfera. L'illuminazione calda, i dettagli eleganti in bianco panna e rosso scuro, e la professionalità dei nostri barman.
                        </p>
                    </div>

                    <div className="pt-4">
                        <h3 className="text-[#7A0018] text-sm font-bold uppercase tracking-widest mb-4">Perfetto per</h3>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {['Matrimoni', 'Compleanni', 'Inaugurazioni', 'Feste Private', 'Aperitivi Aziendali', 'Lauree'].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <span className="w-1.5 h-1.5 bg-[#7A0018] rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}