"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Printer, Save, Plus, Trash2, Phone, MapPin, Eye, EyeOff, 
    Loader2, CheckCircle2, Calculator, RefreshCw, Lock, ArrowLeft,
    Send, Mail, MessageCircle, X
} from "lucide-react";
import localFont from 'next/font/local';
import { useNewQuoteCreator, PRESET_OPTION_1, PRESET_OPTION_2 } from "./useNewQuoteCreator";

// IMPORT LIBRERIE PER PDF
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const lunaFont = localFont({
    src: [
        {
            path: '../../../../../fonts/mending.regular.otf',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-luna',
});

export default function AdminQuoteGenerator() {

    const router = useRouter();
    const {
        data, setData, saveStatus, editTotalMode, finalTotal, leadId,
        handleInputChange, handleTotalChange, handlePricePaxChange,
        toggleEditMode, loadPreset, addItem, updateItem, removeItem, handleSaveDB
    } = useNewQuoteCreator();

    // --- STATI PER IL MODALE DI INVIO ---
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [sendMethod, setSendMethod] = useState<'email' | 'whatsapp' | 'both'>('email');
    const [customMessage, setCustomMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Apre il modale e precompila il messaggio col nome inserito
    const openSendModal = () => {
        const honorific = data.customerHonorific ? `${data.customerHonorific} ` : '';
        const name = data.customerName || 'Cliente';
        
        setCustomMessage(`Gentile ${honorific}${name},\n\nin allegato trovi la proposta personalizzata elaborata per il tuo evento del ${new Date(data.eventDate).toLocaleDateString('it-IT')}.\n\nRestiamo a tua completa disposizione per qualsiasi modifica, chiarimento o per fissare un appuntamento dedicato.\n\nCordiali saluti,\nLuna Events`);
        setIsSendModalOpen(true);
    };

    // Gestisce il click su Conferma e Invia dal modale
    const handleConfirmSend = async () => {
        setIsSending(true);
        
        // 1. Salva nel DB (passiamo true per evitare il redirect automatico)
        const quote = await handleSaveDB(true); 
        
        if (!quote) {
            setIsSending(false);
            return; // Se il DB fallisce, ci fermiamo
        }

        try {
            // 2. LOGICA INVIO EMAIL
            if (sendMethod === 'email' || sendMethod === 'both') {
                if (data.customerEmail) {
                    
                    // --- GENERAZIONE PDF AL VOLO ---
                    let pdfBase64 = "";
                    const pdfElement = document.getElementById('quote-pdf-content');
                    
                    if (pdfElement) {
                        // Cattura il div in alta qualità
                        const canvas = await html2canvas(pdfElement, { 
                            scale: 2, 
                            useCORS: true,
                            logging: false
                        });
                        const imgData = canvas.toDataURL('image/png');
                        
                        // Inizializza jsPDF (Verticale, Millimetri, A4)
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                        
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        
                        // Estrai solo la stringa base64
                        const fullBase64 = pdf.output('datauristring');
                        pdfBase64 = fullBase64.split(',')[1];
                    }

                    // --- CHIAMATA API CON ALLEGATO ---
                    await fetch('/api/send-quote', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: data.customerEmail,
                            name: data.customerName,
                            quoteNumber: data.quoteNumber,
                            total: finalTotal,
                            eventDate: data.eventDate,
                            customMessage: customMessage,
                            pdfBase64: pdfBase64 // Invio stringa Base64 per l'allegato
                        })
                    });
                } else {
                    alert("Attenzione: Email cliente mancante. Impossibile inviare la mail.");
                }
            }

            // 3. LOGICA INVIO WHATSAPP (Apre il link precompilato)
            if (sendMethod === 'whatsapp' || sendMethod === 'both') {
                if (data.customerPhone) {
                    // Pulisce il numero rimuovendo spazi e formattandolo
                    let phone = data.customerPhone.replace(/[^\d+]/g, '');
                    if (!phone.startsWith('+39') && !phone.startsWith('39')) {
                        phone = `+39${phone}`; 
                    }
                    // Codifica il testo del modale per l'URL
                    const encodedMessage = encodeURIComponent(customMessage);
                    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
                } else {
                    alert("Attenzione: Telefono cliente mancante. Impossibile aprire WhatsApp.");
                }
            }

            // 4. Fine operazione, chiudi modale e torna alla lista
            setIsSendModalOpen(false);
            router.push('/admin/luna-events/preventivi');

        } catch (error) {
            console.error("Errore durante l'invio:", error);
            alert("Il preventivo è stato salvato, ma c'è stato un problema nell'invio.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={`min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col lg:flex-row ${lunaFont.variable} font-sans`}>
            
            {/* --- SIDEBAR CONTROLLI --- */}
            <aside className="w-full lg:w-[450px] bg-white border-r border-[#E8E1D9] p-6 overflow-y-auto h-screen no-print shadow-xl z-10 scrollbar-thin scrollbar-thumb-slate-200">
                
                {/* HEADER CON BACK LINK */}
                <div className="mb-6 flex items-center gap-4 border-b border-[#E8E1D9] pb-6">
                    <Link href="/admin/luna-events/preventivi" className="p-2 bg-slate-50 border border-[#E8E1D9] rounded-full hover:border-[#7A0018] hover:text-[#7A0018] transition-colors text-slate-400">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-serif text-slate-900 font-bold">Nuovo Preventivo</h2>
                        {leadId ? (
                            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                Da Richiesta Sito
                            </span>
                        ) : (
                            <span className="text-[#7A0018] font-mono text-xs">Creazione Manuale</span>
                        )}
                    </div>
                </div>

                {/* PRESETS */}
                <div className="mb-8">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Carica Preset Rapido</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => loadPreset(PRESET_OPTION_1)} className="p-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-xl hover:border-[#7A0018]/50 text-left transition-colors">
                            <span className="block text-[#7A0018] font-bold text-xs">Opzione 1</span>
                            <span className="text-[10px] text-slate-500">Classic €12</span>
                        </button>
                        <button onClick={() => loadPreset(PRESET_OPTION_2)} className="p-3 bg-[#FAF8F5] border border-[#E8E1D9] rounded-xl hover:border-[#7A0018]/50 text-left transition-colors">
                            <span className="block text-[#7A0018] font-bold text-xs">Opzione 2</span>
                            <span className="text-[10px] text-slate-500">Gourmet €16</span>
                        </button>
                    </div>
                </div>

                {/* INFO EVENTO */}
                <div className="space-y-3 mb-8 border-b border-[#E8E1D9] pb-6">
                    <div className="flex gap-2">
                        <select 
                            name="customerHonorific"
                            value={data.customerHonorific}
                            onChange={handleInputChange}
                            className="w-[100px] bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-2 py-2 text-sm focus:border-[#7A0018] outline-none text-slate-800"
                        >
                            <option value="Sig.">Sig.</option>
                            <option value="Sig.ra">Sig.ra</option>
                            <option value="Sig./Sig.ra">Sig./Sig.ra</option>
                            <option value="Mx.">Mx.</option>
                        </select>
                        <input 
                            type="text" 
                            name="customerName" 
                            value={data.customerName} 
                            onChange={handleInputChange} 
                            className="flex-1 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-3 py-2 text-sm focus:border-[#7A0018] outline-none text-slate-900" 
                            placeholder="Nome Cognome" 
                        />
                    </div>

                    <input type="text" name="location" value={data.location} onChange={handleInputChange} className="w-full bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-3 py-2 text-sm focus:border-[#7A0018] outline-none text-slate-900" placeholder="Luogo Evento" />
                    
                    <div className="grid grid-cols-2 gap-2">
                        <input type="date" name="eventDate" value={data.eventDate} onChange={handleInputChange} className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-2 py-2 text-sm outline-none focus:border-[#7A0018] text-slate-900" />
                        <input type="text" name="customerPhone" value={data.customerPhone} onChange={handleInputChange} className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-2 py-2 text-sm outline-none focus:border-[#7A0018] text-slate-900" placeholder="Telefono" />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Email Cliente</label>
                        <input 
                            type="email" 
                            name="customerEmail" 
                            value={data.customerEmail} 
                            onChange={handleInputChange} 
                            className="w-full bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-3 py-2 text-sm focus:border-[#7A0018] outline-none text-slate-900" 
                            placeholder="esempio@dominio.com" 
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Note Preventivo</label>
                        <textarea 
                            name="notes" 
                            value={data.notes} 
                            onChange={handleInputChange} 
                            rows={3} 
                            className="w-full bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-3 py-2 text-sm focus:border-[#7A0018] outline-none text-slate-900 resize-none" 
                            placeholder="Note di validità e pagamento..." 
                        />
                    </div>
                    
                    {/* SEZIONE PREZZI */}
                    <div className={`p-4 rounded-xl border mt-4 space-y-4 transition-colors ${data.lockedTotal !== null ? 'bg-[#7A0018]/5 border-[#7A0018]/20' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#7A0018] uppercase tracking-wider flex items-center gap-2">
                                Calcolo Prezzi 
                                {data.lockedTotal !== null && <Lock size={12} className="text-[#7A0018]" />}
                            </label>
                            <button 
                                onClick={toggleEditMode}
                                className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-[#7A0018] transition-colors"
                            >
                                <RefreshCw size={12} /> {editTotalMode ? "Chiudi Modifica Totale" : "Forza Totale Manuale"}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Ospiti</label>
                                <input type="number" name="guestCount" value={data.guestCount} onChange={(e) => setData(p => ({...p, guestCount: parseInt(e.target.value)}))} className="w-full bg-white border border-[#E8E1D9] rounded-lg px-2 py-2 text-sm outline-none focus:border-[#7A0018]" />
                            </div>
                            
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">€ / Persona</label>
                                <input 
                                    type="number" step="0.5" name="pricePerPerson" value={data.pricePerPerson} onChange={(e) => handlePricePaxChange(e.target.value)} 
                                    className={`w-full border rounded-lg px-2 py-2 text-sm outline-none focus:border-[#7A0018] ${data.lockedTotal !== null ? 'bg-slate-100 text-[#7A0018]/70 border-[#7A0018]/20' : 'bg-white border-[#E8E1D9] text-slate-900'}`} 
                                />
                                {data.lockedTotal !== null && <span className="text-[9px] text-[#7A0018]/70 block mt-1">*Calcolato dal totale</span>}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Costo Allestimento / Extra (€)</label>
                            <input 
                                type="number" 
                                name="setupCost" 
                                value={data.setupCost} 
                                onChange={(e) => setData(p => ({...p, setupCost: parseFloat(e.target.value) || 0}))} 
                                className="w-full bg-white border border-[#E8E1D9] rounded-lg px-2 py-2 text-sm outline-none focus:border-[#7A0018] text-slate-900" 
                                placeholder="0.00"
                            />
                        </div>

                        <div className="relative mt-2">
                            <label className="text-[10px] text-slate-500 block mb-1 flex justify-between uppercase font-bold">
                                Totale Finale
                                {editTotalMode && <span className="text-[#7A0018] text-[9px] uppercase font-bold">Manuale</span>}
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-slate-400"><Calculator size={14} /></div>
                                <input 
                                    type="number" value={data.lockedTotal !== null ? data.lockedTotal : finalTotal} readOnly={!editTotalMode} onChange={handleTotalChange}
                                    className={`w-full rounded-lg px-2 py-2 pl-9 text-sm font-bold outline-none border transition-all
                                        ${editTotalMode ? 'bg-[#7A0018]/10 border-[#7A0018] text-[#7A0018]' : 'bg-white border-[#E8E1D9] text-slate-800'}`} 
                                />
                                <div className="absolute right-3 top-2.5 text-xs text-slate-400">€</div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setData(p => ({...p, showUnitPrices: !p.showUnitPrices}))}
                        className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all text-xs font-bold ${data.showUnitPrices ? 'bg-white border-[#E8E1D9] text-slate-500 hover:border-[#7A0018]' : 'bg-[#7A0018]/10 border-[#7A0018] text-[#7A0018]'}`}
                    >
                        {data.showUnitPrices ? <Eye size={14} /> : <EyeOff size={14} />}
                        {data.showUnitPrices ? "Nascondi Prezzo Persona (Stampa)" : "Prezzo Persona Nascosto (Stampa)"}
                    </button>

                    <div className="mt-6 pt-4 border-t border-[#E8E1D9] text-center">
                         <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Preventivo N.</span>
                         <p className="text-[#7A0018] font-mono text-xl">{data.quoteNumber || "Calcolo..."}</p>
                    </div>
                </div>

                {/* LISTA VOCI */}
                <div className="space-y-6 mb-36">
                    {['food', 'beverage', 'setup'].map((cat) => (
                        <div key={cat}>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold uppercase text-[#7A0018] tracking-widest">{cat}</span>
                                <button onClick={() => addItem(cat as any)} className="text-slate-400 hover:text-[#7A0018] bg-[#FAF8F5] p-1 rounded-full"><Plus size={14} /></button>
                            </div>
                            <div className="space-y-2">
                                {data.items.filter(i => i.category === cat).map(item => (
                                    <div key={item.id} className="flex gap-2 items-start bg-white border border-[#E8E1D9] p-2 rounded-lg group hover:border-[#7A0018]/30 transition-all">
                                        <div className="flex-1 min-w-0">
                                            <input value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none mb-1" />
                                            <input value={item.description || ''} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full bg-transparent text-[10px] text-slate-500 outline-none" placeholder="Descrizione..." />
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="fixed bottom-0 left-0 w-full lg:w-[450px] bg-white p-4 border-t border-[#E8E1D9] flex flex-col gap-2 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50">
                    <button onClick={() => window.print()} className="w-full bg-[#FAF8F5] border border-[#E8E1D9] text-slate-700 font-bold py-2.5 rounded-xl hover:border-[#7A0018] hover:text-[#7A0018] transition-all flex items-center justify-center gap-2">
                        <Printer size={16} /> Stampa Preventivo
                    </button>
                    
                    <div className="flex gap-2 w-full">
                        <button 
                            onClick={() => handleSaveDB()}
                            disabled={saveStatus === 'saving' || saveStatus === 'success'}
                            className={`flex-1 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-sm
                                ${saveStatus === 'success' ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 
                                  saveStatus === 'error' ? 'bg-red-500 text-white' : 
                                  'bg-[#7A0018] text-white hover:bg-[#5C0012] shadow-[#7A0018]/20'}`}
                        >
                            {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={16} /> : 
                             saveStatus === 'success' ? <><CheckCircle2 size={16} /> Fatto!</> : 
                             saveStatus === 'error' ? 'Errore' : 
                             <><Save size={16} /> Salva DB</>}
                        </button>

                        <button 
                            onClick={openSendModal}
                            className="flex-1 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md bg-slate-800 text-white hover:bg-slate-900 shadow-slate-800/20 text-sm"
                        >
                            <Send size={16} /> Salva & Invia
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- PREVIEW STAMPA (A4) --- */}
            {/* L'ID "quote-pdf-content" è essenziale per dire ad html2canvas cosa trasformare in PDF */}
            <main className="flex-1 p-8 flex justify-center overflow-y-auto print:p-0 print:bg-white print:block pb-32">
                <div id="quote-pdf-content" className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl print:shadow-none relative flex flex-col text-slate-900 border border-[#E8E1D9]">
                    
                    {/* HEADER CON IL LOGO PNG (sostituita la vecchia scritta testuale) */}
                    <header className="flex justify-between items-start border-b-2 border-[#7A0018]/20 pb-4 mb-6">
                        <div className="w-[100px]">
                            {/* Usiamo un tag img standard compatibile con html2canvas per leggere il logo dalla cartella public */}
                            <img 
                                src="/icons/logo_luna_prev.png" 
                                alt="Luna Events Logo" 
                                className="w-full h-auto object-contain"
                            />
                        </div>
                        
                        <div className="text-right text-[10px] text-slate-500 leading-tight pt-4">
                            <p className="font-bold text-slate-900 text-sm mb-1">Luna Events</p>
                            <p>di Tabacchi San Clemente Caffè</p>
                            <p>Via Galatina 95, 81100 Caserta</p>
                            <p className="font-mono mt-1 text-[#7A0018]">info@lunaevents.it</p>
                            <p className="font-mono text-[#7A0018]">Tel: +39 371 542 8345</p>
                        </div>
                    </header>

                    {/* BOX INFO CLIENTE */}
                    <div className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-xl p-5 mb-8 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Cliente</p>
                            <h2 className="text-lg font-serif font-bold text-slate-900">
                                {data.customerHonorific} {data.customerName}
                            </h2>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                                {data.location && <span className="flex items-center gap-1"><MapPin size={12} className="text-[#7A0018]"/> {data.location}</span>}
                                {data.customerPhone && <span className="flex items-center gap-1"><Phone size={12} className="text-[#7A0018]"/> {data.customerPhone}</span>}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Riferimenti</p>
                            <p className="text-sm font-bold text-[#7A0018] min-h-[20px] tracking-widest">{data.quoteNumber}</p>
                            <p className="text-xs text-slate-600 capitalize mt-1 font-medium">
                                {new Date(data.eventDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">Ospiti previsti: <strong className="text-[#7A0018]">{data.guestCount}</strong></p>
                        </div>
                    </div>

                    {/* BODY PREVENTIVO */}
                    <div className="flex-1 space-y-8">
                        <div className="grid grid-cols-2 gap-10 items-start">
                            {/* Food */}
                            <section className="break-inside-avoid">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-[#E8E1D9] pb-2 mb-4 flex items-center gap-2">
                                    <span className="text-[#7A0018]">01.</span> Food & Buffet
                                </h3>
                                <ul className="space-y-3">
                                    {data.items.filter(i => i.category === 'food').map(item => (
                                        <li key={item.id} className="text-xs leading-tight">
                                            <span className="font-bold text-slate-800 block mb-0.5">{item.name}</span>
                                            {item.description && <span className="text-slate-500 text-[10px]">{item.description}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Beverage */}
                            <section className="break-inside-avoid">
                                <h3 className="text-sm font-bold text-slate-900 border-b border-[#E8E1D9] pb-2 mb-4 flex items-center gap-2">
                                    <span className="text-[#7A0018]">02.</span> Beverage & Bar
                                </h3>
                                <ul className="space-y-3">
                                    {data.items.filter(i => i.category === 'beverage').map(item => (
                                        <li key={item.id} className="text-xs leading-tight">
                                            <span className="font-bold text-slate-800 block mb-0.5">{item.name}</span>
                                            {item.description && <span className="text-slate-500 text-[10px]">{item.description}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        {/* SETUP */}
                        <section className="break-inside-avoid pt-4">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-[#E8E1D9] pb-2 mb-4 flex items-center gap-2">
                                <span className="text-[#7A0018]">03.</span> Allestimento & Servizio
                            </h3>
                            <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                                {data.items.filter(i => i.category === 'setup').map(item => (
                                    <div key={item.id} className="text-xs flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#7A0018] rounded-full mt-1 shrink-0"></div>
                                        <div>
                                            <span className="font-bold text-slate-800">{item.name}</span>
                                            {item.description && <span className="text-slate-500 text-[10px] block mt-0.5">{item.description}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* TOTALI */}
                    <div className="mt-12 break-inside-avoid">
                        <div className="flex justify-end">
                            <div className="w-2/5 min-w-[220px] border-t-2 border-[#7A0018] pt-4">
                                {data.showUnitPrices && (
                                    <>
                                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                                            <span>Costo pax</span>
                                            <span className="font-mono">€ {data.pricePerPerson.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600 mb-2">
                                            <span>Ospiti</span>
                                            <span className="font-mono">x {data.guestCount}</span>
                                        </div>
                                        {data.setupCost > 0 && (
                                            <div className="flex justify-between text-xs text-slate-600 mb-2">
                                                <span>Extra</span>
                                                <span className="font-mono">€ {data.setupCost.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="flex justify-between items-center text-xl font-bold text-slate-900 mt-3 bg-[#FAF8F5] p-3 rounded-lg border border-[#E8E1D9]">
                                    <span className="font-serif">{data.showUnitPrices ? "Totale" : "Importo Complessivo"}</span>
                                    <span className="text-[#7A0018]">€ {finalTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <p className="text-[9px] text-slate-400 text-right mt-1">* IVA Esclusa</p>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER LEGALE */}
                    <footer className="mt-auto pt-8 border-t border-[#E8E1D9]">
                        <div className="flex justify-between items-end mb-8">
                            <div className="w-1/3 text-center">
                                <p className="text-[10px] text-slate-400 mb-8 border-b border-dashed border-slate-300 pb-2 mx-4">Firma Luna Events</p>
                            </div>
                            <div className="w-1/3 text-center">
                                <p className="text-[10px] text-slate-400 mb-8 border-b border-dashed border-slate-300 pb-2 mx-4">Firma Cliente</p>
                            </div>
                        </div>
                        <div className="text-[9px] text-slate-500 leading-relaxed text-center bg-[#FAF8F5] p-3 rounded-lg border border-[#E8E1D9]">
                            <strong>1. Titolare del Trattamento</strong><br />
                            Il Titolare del trattamento dei dati è: <strong>Tabacchi San Clemente di Ianniello Gianpaolo</strong><br />
                            Indirizzo: Via Galatina 95, 81100 San Clemente, Caserta (CE) - P.IVA: 04124110612<br />
                            Email: info@lunaevents.it - Tel: +39 371 542 8345
                        </div>
                    </footer>
                </div>
            </main>

            {/* --- MODALE INVIO PREVENTIVO --- */}
            {isSendModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Send size={18} className="text-[#7A0018]"/> Invia Preventivo
                            </h3>
                            <button onClick={() => setIsSendModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Scegli come inviare</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setSendMethod('email')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${sendMethod === 'email' || sendMethod === 'both' ? 'bg-[#7A0018]/10 border-[#7A0018] text-[#7A0018]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        <Mail size={16}/> Email
                                    </button>
                                    <button onClick={() => setSendMethod('whatsapp')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${sendMethod === 'whatsapp' || sendMethod === 'both' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        <MessageCircle size={16}/> WhatsApp
                                    </button>
                                    <button onClick={() => setSendMethod('both')} className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${sendMethod === 'both' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        Entrambi
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Testo Messaggio</label>
                                <textarea 
                                    value={customMessage} 
                                    onChange={(e) => setCustomMessage(e.target.value)} 
                                    rows={7} 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 outline-none focus:border-[#7A0018] resize-none" 
                                />
                            </div>
                            
                            <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs flex items-start gap-2 border border-amber-200/50">
                                <span className="font-bold whitespace-nowrap">Info PDF:</span> 
                                Il sistema genererà automaticamente il PDF dell'anteprima e lo allegherà all'email!
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50">
                            <button onClick={() => setIsSendModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-colors">
                                Annulla
                            </button>
                            <button onClick={handleConfirmSend} disabled={isSending} className="flex-1 py-3 rounded-xl bg-[#7A0018] text-white font-bold text-sm hover:bg-[#5C0012] flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                                {isSending ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Conferma e Invia</>}
                            </button>
                        </div>
                        
                    </div>
                </div>
            )}

            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; color: black; }
                    .no-print { display: none !important; }
                }
            `}</style>
        </div>
    );
}