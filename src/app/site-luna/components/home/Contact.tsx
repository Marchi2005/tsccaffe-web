"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Loader2, Check, Instagram, Facebook, Phone } from "lucide-react";
import CustomDatePicker from "../ui/CustomDatePicker";
import { YEARS, MONTHS, PERIOD_OPTIONS } from "../../utils/helpers";

// Icona TikTok personalizzata per integrarsi perfettamente con lo stile delle altre icone
const TiktokIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

export default function Contact() {
    const [dateMode, setDateMode] = useState<'specific' | 'period'>('specific');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "Matrimonio",
        message: "",
        specificDate: "",
        periodYear: "",
        periodMonth: "",
        periodTime: ""
    });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: string) => {
        setFormData({ ...formData, specificDate: date });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');

        try {
            // Chiamata reale alla tua API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormStatus('success');
                // Opzionale: reset del form
            } else {
                // Leggiamo il VERO errore dal server
                const errorData = await response.json();
                console.error("Errore ESATTO dal server:", errorData.error);
                setFormStatus('idle');
                alert(`Errore: ${errorData.error}`); // Mostra un popup con l'errore così lo vedi subito
            }
        } catch (error) {
            console.error("Errore di rete:", error);
            setFormStatus('idle');
        }

        setTimeout(() => setFormStatus('idle'), 5000);
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7A0018]/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-4xl mx-auto px-6">
                
                {/* BLOCCO SOCIAL - ARMONIOSO E INTEGRATO */}
                <div className="text-center mb-16">
                    <span className="text-[#7A0018] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Segui la Magia</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-10">Restiamo in Contatto</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        
                        {/* Instagram */}
                        <a 
                            href="https://instagram.com/lunaevents.it" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-5 bg-[#FAF8F5] border border-[#E8E1D9] rounded-2xl shadow-sm hover:border-[#7A0018] hover:bg-white transition-all group justify-center sm:justify-start"
                        >
                            <div className="w-10 h-10 rounded-full bg-white border border-[#E8E1D9] flex items-center justify-center text-[#7A0018] group-hover:bg-[#7A0018] group-hover:text-white transition-all">
                                <Instagram size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-none mb-1">Instagram</p>
                                <p className="font-serif text-sm text-slate-800 font-medium">lunaevents.it</p>
                            </div>
                        </a>

                        {/* Facebook */}
                        <a 
                            href="https://facebook.com/lunaevents.it" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-5 bg-[#FAF8F5] border border-[#E8E1D9] rounded-2xl shadow-sm hover:border-[#7A0018] hover:bg-white transition-all group justify-center sm:justify-start"
                        >
                            <div className="w-10 h-10 rounded-full bg-white border border-[#E8E1D9] flex items-center justify-center text-[#7A0018] group-hover:bg-[#7A0018] group-hover:text-white transition-all">
                                <Facebook size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-none mb-1">Facebook</p>
                                <p className="font-serif text-sm text-slate-800 font-medium">lunaevents.it</p>
                            </div>
                        </a>

                        {/* TikTok */}
                        <a 
                            href="https://tiktok.com/@lunaevents.it" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-5 bg-[#FAF8F5] border border-[#E8E1D9] rounded-2xl shadow-sm hover:border-[#7A0018] hover:bg-white transition-all group justify-center sm:justify-start"
                        >
                            <div className="w-10 h-10 rounded-full bg-white border border-[#E8E1D9] flex items-center justify-center text-[#7A0018] group-hover:bg-[#7A0018] group-hover:text-white transition-all">
                                <TiktokIcon size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-none mb-1">TikTok</p>
                                <p className="font-serif text-sm text-slate-800 font-medium">lunaevents.it</p>
                            </div>
                        </a>

                    </div>
                </div>

                {/* FORM DI CONTATTO */}
                <div className="bg-white border border-[#E8E1D9] rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#7A0018]" />

                    <div className="text-center mb-12">
                        <h3 className="font-serif text-3xl text-slate-900 mb-4">Richiedi un Preventivo</h3>
                        <p className="text-slate-500 font-light">Raccontaci il tuo sogno e lo realizzeremo insieme.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Nome *</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-slate-50 border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:border-[#7A0018] outline-none transition-all" placeholder="Mario Rossi" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Telefono *</label>
                                <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:border-[#7A0018] outline-none transition-all" placeholder="+39 333 ..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Email *</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:border-[#7A0018] outline-none transition-all" placeholder="mario@email.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Tipo Evento</label>
                                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-slate-50 border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:border-[#7A0018] outline-none cursor-pointer">
                                    <option>Matrimonio</option>
                                    <option>Battesimo</option>
                                    <option>Compleanno</option>
                                    <option>Laurea</option>
                                    <option>Evento Aziendale</option>
                                    <option>Altro</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[#E8E1D9]">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Quando? *</label>
                                <div className="flex bg-[#FAF8F5] border border-[#E8E1D9] rounded-full p-1 w-fit">
                                    <button type="button" onClick={() => setDateMode('specific')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${dateMode === 'specific' ? 'bg-[#7A0018] text-white shadow-sm' : 'text-slate-500 hover:text-[#7A0018]'}`}>Data Esatta</button>
                                    <button type="button" onClick={() => setDateMode('period')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${dateMode === 'period' ? 'bg-[#7A0018] text-white shadow-sm' : 'text-slate-500 hover:text-[#7A0018]'}`}>Non ho la data</button>
                                </div>
                            </div>
                            <div className="min-h-[60px]">
                                {dateMode === 'specific' ? (
                                    <CustomDatePicker selectedDate={formData.specificDate} onChange={handleDateChange} />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <select name="periodYear" value={formData.periodYear} onChange={handleInputChange} className="w-full bg-slate-50 border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:border-[#7A0018] outline-none">
                                            <option value="" disabled>Anno</option>
                                            {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                                        </select>
                                        <select name="periodMonth" value={formData.periodMonth} onChange={handleInputChange} className="w-full bg-slate-50 border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:border-[#7A0018] outline-none">
                                            <option value="" disabled>Mese</option>
                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <select name="periodTime" value={formData.periodTime} onChange={handleInputChange} className="w-full bg-slate-50 border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:border-[#7A0018] outline-none">
                                            <option value="" disabled>Periodo</option>
                                            {PERIOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Messaggio</label>
                            <textarea rows={4} name="message" value={formData.message} onChange={handleInputChange} className="w-full bg-slate-50 border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:border-[#7A0018] outline-none resize-none" placeholder="Raccontaci i tuoi desideri..."></textarea>
                        </div>

                        <motion.button
                            type="submit" disabled={formStatus === 'sending' || formStatus === 'success'}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-16 bg-[#7A0018] text-white font-bold rounded-xl shadow-lg hover:bg-[#5C0012] transition-all flex items-center justify-center gap-3"
                        >
                            <AnimatePresence mode="wait">
                                {formStatus === 'idle' && (
                                    <div className="flex items-center gap-2">
                                        <span>INVIA RICHIESTA</span> <ArrowRight size={20} />
                                    </div>
                                )}
                                {formStatus === 'sending' && <Loader2 className="animate-spin" size={24} />}
                                {formStatus === 'success' && <div className="flex items-center gap-2 text-green-400"><Check size={24} /> <span>INVIATO</span></div>}
                            </AnimatePresence>
                        </motion.button>
                    </form>

                    {/* FOOTER DATI CONTATTO */}
                    <div className="mt-16 pt-10 border-t border-[#E8E1D9] flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#7A0018]">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest leading-none">Chiamaci</p>
                                <p className="font-bold text-slate-900">+39 371 542 8345</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#7A0018]">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest leading-none">Scrivici</p>
                                <p className="font-bold text-slate-900">info@lunaevents.it</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}