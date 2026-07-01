"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles, GlassWater, MapPin } from "lucide-react";
import Image from "next/image";

export default function Concept() {
    return (
        <section id="concept" className="bg-[#FAF8F5] relative overflow-hidden">
            
            {/* BLOCCO 1: L'Origine (Foto Orizzontale 1) */}
            <div className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-[#E8E1D9]"
                >
                    <Image 
                        src="/images/lunaevents/luna-concept-1.jpg" // Sostituisci con la tua foto orizzontale 1
                        alt="Apecar Luna Events"
                        fill
                        className="object-cover"
                    />
                    {/* Fallback se non carica */}
                    <div className="absolute inset-0 bg-[#F4EFE6] -z-10 flex items-center justify-center">
                        <Camera className="text-[#7A0018]/20" size={48} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 text-[#7A0018] font-bold text-xs uppercase tracking-[0.2em]">
                        <Sparkles size={16} /> Il Fascino del Vintage
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">
                        Un Bar Mobile dall'anima <span className="text-[#7A0018] font-luna text-5xl md:text-6xl px-2">Chic</span>
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg font-light italic">
                        "Luna Events non è solo un servizio bar, è un'esperienza che trasforma il tuo evento."
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Abbiamo reinterpretato la classica Apecar italiana vestendola di eleganza, creando un punto d'appoggio iconico per matrimoni, lauree e feste private che non vogliono passare inosservate.
                    </p>
                </motion.div>
            </div>

            {/* BLOCCO 2: L'Esperienza (Foto Verticale) */}
            <div className="py-24 bg-white/60 border-y border-[#E8E1D9]">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="order-2 md:order-1 space-y-8"
                    >
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">
                            Ogni Dettaglio, <br />Una <span className="text-[#7A0018] font-luna text-5xl md:text-6xl px-2">Promessa</span>
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#7A0018]/10 flex items-center justify-center shrink-0">
                                    <GlassWater className="text-[#7A0018]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Mixology Premium</h4>
                                    <p className="text-sm text-slate-600">Cocktail curati e selezione di bollicine, o il miglior caffè Illy.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#7A0018]/10 flex items-center justify-center shrink-0">
                                    <MapPin className="text-[#7A0018]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Versatilità Totale</h4>
                                    <p className="text-sm text-slate-600">Quando vuoi dove ci vuoi.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="order-1 md:order-2 relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
                    >
                        <Image 
                            src="/images/lunaevents/luna-vertical.jpg" // Sostituisci con la tua foto verticale
                            alt="Dettaglio Luna Events"
                            fill
                            className="object-cover"
                        />
                         <div className="absolute inset-0 bg-[#F4EFE6] -z-10 flex items-center justify-center">
                            <Camera className="text-[#7A0018]/20" size={48} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* BLOCCO 3: Atmosfera (3 Foto Orizzontali restanti) */}
            <div className="py-24 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900">Atmosfere <span className="text-[#7A0018] font-luna text-5xl md:text-6xl px-2">Luna</span></h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[2, 3, 4].map((num) => (
                        <motion.div
                            key={num}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: num * 0.1 }}
                            className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg group border border-[#E8E1D9]"
                        >
                            <Image 
                                src={`/images/lunaevents/luna-concept-${num}.jpg`} // Sostituisci con le altre 3 foto orizzontali
                                alt="Gallery Luna Events"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}