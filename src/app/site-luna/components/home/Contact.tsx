"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, ChevronRight, ArrowRight, Loader2, Check, MessageCircle, Instagram } from "lucide-react";
import CustomDatePicker from "../ui/CustomDatePicker";
import { YEARS, MONTHS, PERIOD_OPTIONS } from "../../utils/helpers";

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

        if (dateMode === 'specific' && !formData.specificDate) {
            alert("Per favore, seleziona una data specifica.");
            return;
        }
        if (dateMode === 'period' && (!formData.periodYear || !formData.periodMonth || !formData.periodTime)) {
            alert("Per favore, indica Anno, Mese e la preferenza sul periodo.");
            return;
        }

        setFormStatus('sending');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Dati Inviati:", formData);
        setFormStatus('success');
        setTimeout(() => setFormStatus('idle'), 5000);
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7A0018]/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white/90 backdrop-blur-md border border-[#E8E1D9] rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7A0018] to-transparent opacity-30" />

                    <div className="relative flex flex-col items-center justify-center mb-10 pt-4">
                        <h2 className="font-luna text-6xl md:text-7xl text-[#7A0018] relative z-10 leading-none drop-shadow-sm" style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}>
                            Contattaci
                        </h2>
                    </div>

                    <div className="text-center mb-12">
                        <p className="text-slate-600 max-w-lg mx-auto font-light">I campi con l'asterisco (*) sono obbligatori.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Nome *</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-white border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:outline-none focus:border-[#7A0018] focus:ring-1 focus:ring-[#7A0018] shadow-sm transition-all placeholder:text-slate-400" placeholder="Mario Rossi" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Telefono *</label>
                                <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:outline-none focus:border-[#7A0018] focus:ring-1 focus:ring-[#7A0018] shadow-sm transition-all placeholder:text-slate-400" placeholder="+39 333 ..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-[#E8E1D9] rounded-lg pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:border-[#7A0018] focus:ring-1 focus:ring-[#7A0018] shadow-sm transition-all placeholder:text-slate-400" placeholder="mario@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Tipo Evento</label>
                                <div className="relative">
                                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-white border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:outline-none focus:border-[#7A0018] focus:ring-1 focus:ring-[#7A0018] shadow-sm transition-all cursor-pointer appearance-none">
                                        <option>Matrimonio</option>
                                        <option>Compleanno</option>
                                        <option>Laurea</option>
                                        <option>Evento Aziendale</option>
                                        <option>Altro</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronRight className="rotate-90" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[#E8E1D9] mt-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1 whitespace-nowrap">Quando? *</label>
                                <div className="flex bg-[#FAF8F5] border border-[#E8E1D9] rounded-full p-1 w-fit">
                                    <button type="button" onClick={() => setDateMode('specific')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${dateMode === 'specific' ? 'bg-[#7A0018] text-white shadow-sm' : 'text-slate-500 hover:text-[#7A0018]'}`}>Data Esatta</button>
                                    <button type="button" onClick={() => setDateMode('period')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${dateMode === 'period' ? 'bg-[#7A0018] text-white shadow-sm' : 'text-slate-500 hover:text-[#7A0018]'}`}>Non ho la data</button>
                                </div>
                            </div>

                            <div className="relative z-20 min-h-[60px]">
                                {dateMode === 'specific' ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <CustomDatePicker selectedDate={formData.specificDate} onChange={handleDateChange} />
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-4 text-slate-400 z-10 group-focus-within:text-[#7A0018] transition-colors" size={20} />
                                            <select name="periodYear" value={formData.periodYear} onChange={handleInputChange} className="w-full bg-white border border-[#E8E1D9] rounded-lg pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:border-[#7A0018] focus:ring-1 focus:ring-[#7A0018] shadow-sm appearance-none cursor-pointer">
                                                <option value="" disabled>Anno</option>
                                                {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-slate-400" size={16} />
                                        </div>
                                        <div className="relative">
                                            <select name="periodMonth" value={formData.periodMonth} onChange={handleInputChange} className="w-full bg-white border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:outline-none focus:border-[#7A0018] focus:ring-1 focus:ring-[#7A0018] shadow-sm appearance-none cursor-pointer">
                                                <option value="" disabled>Mese</option>
                                                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-slate-400" size={16} />
                                        </div>
                                        <div className="relative">
                                            <select name="periodTime" value={formData.periodTime} onChange={handleInputChange} className="w-full bg-white border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:outline-none focus:border-[#7A0018] focus:ring-1 focus:ring-[#7A0018] shadow-sm appearance-none cursor-pointer">
                                                <option value="" disabled>Periodo</option>
                                                {PERIOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90 text-slate-400" size={16} />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-1">Messaggio</label>
                            <textarea rows={4} name="message" value={formData.message} onChange={handleInputChange} className="w-full bg-white border border-[#E8E1D9] rounded-lg px-4 py-4 text-slate-900 focus:outline-none focus:border-[#7A0018] focus:ring-1 focus:ring-[#7A0018] shadow-sm transition-all placeholder:text-slate-400 resize-none" placeholder="Raccontaci i dettagli (location, idee, orari)..."></textarea>
                        </div>

                        <motion.button
                            type="submit" disabled={formStatus === 'sending' || formStatus === 'success'}
                            whileTap={{ scale: 0.97 }} animate={formStatus === 'success' ? { backgroundColor: "#10B981", borderColor: "#10B981" } : { backgroundColor: "#7A0018" }}
                            className={`w-full font-bold text-lg h-16 rounded-lg transition-all shadow-md flex items-center justify-center gap-3 relative overflow-hidden ${formStatus === 'success' ? 'text-white' : 'text-white hover:bg-[#5C0012] hover:shadow-xl'}`}
                        >
                            <AnimatePresence mode="wait">
                                {formStatus === 'idle' && (
                                    <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                                        <span className="tracking-wide">INVIA RICHIESTA</span>
                                        <ArrowRight size={20} />
                                    </motion.div>
                                )}
                                {formStatus === 'sending' && (
                                    <motion.div key="sending" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                        <Loader2 className="animate-spin" size={26} />
                                    </motion.div>
                                )}
                                {formStatus === 'success' && (
                                    <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} className="flex items-center gap-2">
                                        <Check strokeWidth={4} size={28} />
                                        <span className="text-xl font-bold">INVIATO!</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </form>

                    <div className="mt-16 pt-10 border-t border-[#E8E1D9] flex flex-col items-center gap-6">
                        <p className="text-slate-600 text-sm tracking-wide font-medium">Preferisci parlare subito con noi?</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="https://wa.me/393715428345" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-full border border-[#E8E1D9] hover:border-green-600 hover:shadow-md transition-all group">
                                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" /> <span className="text-slate-700 group-hover:text-green-700 transition-colors font-medium">WhatsApp</span>
                            </a>
                            <a href="https://instagram.com/tuo_profilo" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white text-pink-600 rounded-full border border-[#E8E1D9] hover:border-pink-600 hover:shadow-md transition-all group">
                                <Instagram size={20} className="group-hover:scale-110 transition-transform" /> <span className="text-slate-700 group-hover:text-pink-700 transition-colors font-medium">Instagram</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}