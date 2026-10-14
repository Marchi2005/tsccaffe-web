"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Printer, Save, Plus, Trash2, Phone, MapPin, Eye, EyeOff, Loader2,
    CheckCircle2, Calculator, RefreshCw, Lock, ArrowLeft, Send, Mail, MessageCircle, X
} from "lucide-react";
import localFont from 'next/font/local';
import Link from "next/link";
import { useQuoteEditor } from "./useQuoteEditor"; // Importiamo la logica
import { createQuotePdfBase64, printQuoteWithFilename } from '../quotePdf';
import LunaDialog, { type LunaDialogTone } from '../../LunaDialog';

type Notice = { title: string; message: string; tone: LunaDialogTone };

const lunaFont = localFont({
    src: [
        {
            path: '../../../../../fonts/mending.regular.otf', // Verifica percorso!
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-luna',
});

export default function EditQuotePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [sendMethod, setSendMethod] = useState<'email' | 'whatsapp' | 'both'>('email');
    const [customMessage, setCustomMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [travelKm, setTravelKm] = useState('');
    const [fuelPricePerLiter, setFuelPricePerLiter] = useState('2.063');
    
    // Inizializziamo il nostro custom hook
    const {
        data, setData, loading, loadError, saveStatus, editTotalMode, baseTotal, finalTotal, discountAmount,
        handleInputChange, handleTotalChange, handlePricePaxChange,
        toggleEditMode, addItem, updateItem, removeItem, handleUpdateDB
    } = useQuoteEditor(id);

    useEffect(() => {
        if (loadError) setNotice({ title: 'Preventivo non disponibile', message: loadError, tone: 'error' });
    }, [loadError]);

    const openSendModal = () => {
        const fullName = `${data.customerHonorific ? `${data.customerHonorific} ` : ''}${data.customerName || 'Cliente'}`;
        const eventDate = data.eventDate ? new Date(`${data.eventDate}T00:00:00`).toLocaleDateString('it-IT') : 'data da definire';
        setCustomMessage(`Gentile ${fullName},\n\nin allegato trovi la proposta personalizzata elaborata per il tuo evento del ${eventDate}.\n\nRestiamo a tua completa disposizione per qualsiasi modifica, chiarimento o per fissare un appuntamento dedicato.\n\nCordiali saluti,\nLuna Events`);
        setIsSendModalOpen(true);
    };

    const handleConfirmSend = async () => {
        if ((sendMethod === 'email' || sendMethod === 'both') && !data.customerEmail) {
            setNotice({ title: 'Email mancante', message: "Inserisci l'email del cliente per inviare il preventivo.", tone: 'error' });
            return;
        }
        if ((sendMethod === 'whatsapp' || sendMethod === 'both') && !data.customerPhone) {
            setNotice({ title: 'Telefono mancante', message: 'Inserisci il telefono del cliente per aprire WhatsApp.', tone: 'error' });
            return;
        }

        setIsSending(true);
        const saved = await handleUpdateDB();
        if (!saved) {
            setIsSending(false);
            return;
        }

        try {
            if (sendMethod === 'email' || sendMethod === 'both') {
                if (!data.customerEmail) {
                    setIsSending(false);
                    return;
                }

                let pdfBase64 = "";
                const pdfElement = document.getElementById('quote-pdf-content');
                if (pdfElement) pdfBase64 = await createQuotePdfBase64(pdfElement);

                const response = await fetch('/api/send-quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: data.customerEmail,
                        name: data.customerName,
                        quoteNumber: data.quoteNumber,
                        total: finalTotal,
                        eventDate: data.eventDate,
                        customMessage,
                        pdfBase64
                    })
                });
                if (!response.ok) throw new Error(`Invio email non riuscito (${response.status})`);
            }

            if (sendMethod === 'whatsapp' || sendMethod === 'both') {
                if (data.customerPhone) {
                    let phone = data.customerPhone.replace(/[^\d+]/g, '');
                    if (!phone.startsWith('+39') && !phone.startsWith('39')) phone = `+39${phone}`;
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(customMessage)}`, '_blank');
                } else {
                    setIsSending(false);
                    return;
                }
            }

            setIsSendModalOpen(false);
            setNotice({ title: 'Preventivo pronto', message: 'Il preventivo è stato salvato e preparato per l’invio.', tone: 'success' });
        } catch (error) {
            console.error("Errore durante l'invio del preventivo:", error);
            setNotice({ title: 'Invio non riuscito', message: 'Il preventivo è stato salvato, ma si è verificato un problema durante l’invio.', tone: 'error' });
        } finally {
            setIsSending(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#7A0018]">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col lg:flex-row ${lunaFont.variable} font-sans`}>
            
            {/* --- SIDEBAR CONTROLLI (STILE PANNA/BORDEAUX) --- */}
            <aside className="w-full lg:w-[450px] bg-white border-r border-[#E8E1D9] p-6 overflow-y-auto h-screen no-print shadow-xl z-10 scrollbar-thin scrollbar-thumb-slate-200">
                
                {/* HEADER CON BACK LINK */}
                <div className="mb-6 flex items-center gap-4 border-b border-[#E8E1D9] pb-6">
                    <Link href="/admin/luna-events/preventivi" className="p-2 bg-slate-50 border border-[#E8E1D9] rounded-full hover:border-[#7A0018] hover:text-[#7A0018] transition-colors text-slate-400">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-serif text-slate-900 font-bold">Modifica Preventivo</h2>
                        <p className="text-xs text-[#7A0018] font-mono tracking-widest">{data.quoteNumber}</p>
                    </div>
                </div>

                {/* DATI ANAGRAFICI */}
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
                            type="text" name="customerName" value={data.customerName} onChange={handleInputChange} 
                            className="flex-1 bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-3 py-2 text-sm focus:border-[#7A0018] outline-none text-slate-900" 
                            placeholder="Nome Cognome" 
                        />
                    </div>
                    <input type="text" name="location" value={data.location} onChange={handleInputChange} className="w-full bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-3 py-2 text-sm focus:border-[#7A0018] outline-none text-slate-900" placeholder="Destinazione evento" />
                    <input type="email" name="customerEmail" value={data.customerEmail} onChange={handleInputChange} className="w-full bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-3 py-2 text-sm focus:border-[#7A0018] outline-none text-slate-900" placeholder="Email Cliente" />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="date" name="eventDate" value={data.eventDate} onChange={handleInputChange} className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-2 py-2 text-sm outline-none focus:border-[#7A0018] text-slate-900" />
                        <input type="text" name="customerPhone" value={data.customerPhone} onChange={handleInputChange} className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-2 py-2 text-sm outline-none focus:border-[#7A0018] text-slate-900" placeholder="Telefono" />
                    </div>
                    
                    {/* CALCOLATORE PREZZI */}
                    <div className={`p-4 rounded-xl border mt-4 space-y-4 transition-colors ${data.lockedTotal !== null ? 'bg-[#7A0018]/5 border-[#7A0018]/20' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#7A0018] uppercase tracking-wider flex items-center gap-2">
                                Calcolo Prezzi {data.lockedTotal !== null && <Lock size={12} className="text-[#7A0018]" />}
                            </label>
                            <button onClick={toggleEditMode} className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-[#7A0018] transition-colors">
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
                                <input type="number" step="0.5" name="pricePerPerson" value={data.pricePerPerson} onChange={(e) => handlePricePaxChange(e.target.value)} 
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
                                min="0"
                                step="0.01"
                                value={data.setupCost}
                                onChange={e => setData(prev => ({ ...prev, setupCost: Math.max(0, parseFloat(e.target.value) || 0) }))}
                                className="w-full bg-white border border-[#E8E1D9] rounded-lg px-2 py-2 text-sm outline-none focus:border-[#7A0018] text-slate-900"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3 space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-sky-900">Stima carburante · solo uso interno</label>
                                <p className="mt-1 text-[10px] text-slate-600">Partenza: Via Galatina 95, Caserta (CE)</p>
                                {data.location.trim() && (
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('Via Galatina 95, Caserta CE')}&destination=${encodeURIComponent(data.location)}&travelmode=driving`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-1 inline-block text-[10px] font-semibold text-sky-800 underline"
                                    >
                                        Apri percorso in Google Maps
                                    </a>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="mb-1 block text-[10px] font-bold text-slate-500">Km sola andata</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={travelKm}
                                        onChange={e => setTravelKm(e.target.value)}
                                        className="w-full rounded-lg border border-sky-200 bg-white px-2 py-2 text-sm outline-none focus:border-sky-600"
                                        placeholder="Inserisci i km"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-[10px] font-bold text-slate-500">Benzina €/L</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.001"
                                        value={fuelPricePerLiter}
                                        onChange={e => setFuelPricePerLiter(e.target.value)}
                                        className="w-full rounded-lg border border-sky-200 bg-white px-2 py-2 text-sm outline-none focus:border-sky-600"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3 border-t border-sky-200 pt-2 text-xs text-slate-700">
                                <span>Consumo stimato A/R · 10 L/100 km</span>
                                <span className="shrink-0 font-bold text-sky-900">
                                    {travelKm && Number(travelKm) > 0
                                        ? `€ ${((Number(travelKm) * 2 * 0.1) * (Number(fuelPricePerLiter) || 0)).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : 'Inserisci i km'}
                                </span>
                            </div>
                        </div>                        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-900">Sconto commerciale</label>
                            <select
                                value={data.discountMode ?? ''}
                                onChange={e => setData(prev => ({
                                    ...prev,
                                    discountMode: e.target.value === 'fixed' || e.target.value === 'final_price' ? e.target.value : null,
                                    discountValue: 0,
                                }))}
                                className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7A0018]"
                            >
                                <option value="">Nessuno sconto</option>
                                <option value="fixed">Sconto in contanti (€)</option>
                                <option value="final_price">Imposta direttamente il prezzo finale (€)</option>
                            </select>
                            {data.discountMode && (
                                <>
                                    <div>
                                        <label className="mb-1 block text-[10px] font-bold text-slate-500">
                                            {data.discountMode === 'fixed' ? 'Importo dello sconto' : 'Prezzo finale scontato'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number" min="0" max={baseTotal} step="0.01"
                                                value={Math.min(data.discountValue, baseTotal) || ''}
                                                onChange={e => setData(prev => ({ ...prev, discountValue: Math.min(baseTotal, Math.max(0, parseFloat(e.target.value) || 0)) }))}
                                                className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 pr-9 text-sm font-bold outline-none focus:border-[#7A0018]"
                                                placeholder="0,00"
                                            />
                                            <span className="absolute right-3 top-2 text-xs text-slate-400">€</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-amber-900">
                                        {discountAmount > 0
                                            ? `Risparmio €${discountAmount.toLocaleString('it-IT', { minimumFractionDigits: 2 })} · totale finale €${finalTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`
                                            : 'Inserisci lo sconto o il prezzo promozionale da proporre.'}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="relative mt-2">
                            <label className="text-[10px] text-slate-500 block mb-1 flex justify-between uppercase font-bold">
                                Totale prima dello sconto
                                {editTotalMode && <span className="text-[#7A0018] text-[9px] uppercase font-bold">Manuale</span>}
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-slate-400"><Calculator size={14} /></div>
                                <input type="number" value={baseTotal} readOnly={!editTotalMode} onChange={handleTotalChange}
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
                </div>

                {/* LISTA VOCI (FOOD, BEV, SETUP) */}
                <div className="space-y-6 mb-24">
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
                <div className="fixed bottom-0 left-0 w-full lg:w-[450px] bg-white p-4 border-t border-[#E8E1D9] flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50">
                    <button onClick={() => printQuoteWithFilename(data.quoteNumber, data.customerName)} className="flex-1 bg-[#FAF8F5] border border-[#E8E1D9] text-slate-700 font-bold py-3.5 rounded-xl hover:border-[#7A0018] hover:text-[#7A0018] transition-all flex items-center justify-center gap-2">
                        <Printer size={18} /> Stampa
                    </button>               
                    <button onClick={openSendModal} className="flex-1 bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                        <Send size={18} /> Invia
                    </button>
                    <button 
                        onClick={handleUpdateDB}
                        disabled={saveStatus === 'saving' || saveStatus === 'success'}
                        className={`flex-1 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md
                            ${saveStatus === 'success' ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 
                              saveStatus === 'error' ? 'bg-red-500 text-white' : 
                              'bg-[#7A0018] text-white hover:bg-[#5C0012] shadow-[#7A0018]/20'}`}
                    >
                        {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={18} /> : 
                         saveStatus === 'success' ? <><CheckCircle2 size={18} /> Aggiornato</> : 
                         saveStatus === 'error' ? 'Errore' : 
                         <><Save size={18} /> Salva</>}
                    </button>
                </div>
            </aside>

            {/* --- PREVIEW STAMPA (A4) --- */}
            <main className="flex-1 p-8 flex justify-center overflow-y-auto print:p-0 print:bg-white print:block pb-32">
                <div id="quote-pdf-content" className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl print:shadow-none relative flex flex-col text-slate-900 border border-[#E8E1D9]">
                    
                    {/* HEADER */}
                    <header data-pdf-block className="flex justify-between items-center border-b-2 border-[#7A0018]/20 pb-2 mb-3">
                        
                        {/* LOGO LUNA EVENTS */}
                        <img src="/icons/logo_luna_prev.png" alt="Luna Events" className="w-[160px] h-[100px] object-contain object-left" />
                        
                        <div className="text-right text-[9px] text-slate-500 leading-tight">
                            <p className="font-bold text-slate-900 text-xs mb-0.5">Luna Events</p>
                            <p>di Tabacchi San Clemente</p>
                            <p>Via Galatina 95, 81100 Caserta</p>
                            <p className="font-mono mt-1 text-[#7A0018]">info@lunaevents.it</p>
                            <p className="font-mono text-[#7A0018]">Tel: +39 371 542 8345</p>
                        </div>
                    </header>

                    {/* BOX INFO CLIENTE */}
                    <div data-pdf-block className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-xl p-3 mb-3 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Cliente</p>
                            <h2 className="text-base font-serif font-bold text-slate-900">
                                {data.customerHonorific} {data.customerName}
                            </h2>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[10px] text-slate-600">
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
                            {discountAmount > 0 && <p className="text-xs text-slate-500 mt-1">Prezzo standard: <del className="font-semibold">€ {baseTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</del></p>}
                        </div>
                    </div>

                    {/* BODY PREVENTIVO */}
                    <div className="space-y-3">
                        
                        <div data-pdf-block className="grid grid-cols-2 gap-6 items-start">
                            {/* Food */}
                            <section className="break-inside-avoid">
                                <h3 className="text-xs font-bold text-slate-900 border-b border-[#E8E1D9] pb-1 mb-2 flex items-center gap-2">
                                    <span className="text-[#7A0018]">01.</span> Food & Buffet
                                </h3>
                                <ul className="space-y-1.5">
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
                                <h3 className="text-xs font-bold text-slate-900 border-b border-[#E8E1D9] pb-1 mb-2 flex items-center gap-2">
                                    <span className="text-[#7A0018]">02.</span> Beverage & Bar
                                </h3>
                                <ul className="space-y-1.5">
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
                        <section data-pdf-block className="break-inside-avoid pt-1">
                            <h3 className="text-xs font-bold text-slate-900 border-b border-[#E8E1D9] pb-1 mb-2 flex items-center gap-2">
                                <span className="text-[#7A0018]">03.</span> Allestimento & Servizio
                            </h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
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
                    <div data-pdf-block className="mt-4 break-inside-avoid">
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
                                    </>
                                )}
                                {data.setupCost > 0 && (
                                    <div className="flex justify-between text-xs text-slate-600 mb-2">
                                        <span>Extra</span>
                                        <span className="font-mono">€ {data.setupCost.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                {discountAmount > 0 && (
                                    <div className="flex justify-between gap-3 text-xs font-semibold text-slate-500 mb-2">
                                        <span>Totale generale</span>
                                        <del className="shrink-0 font-mono">€ {baseTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</del>
                                    </div>
                                )}
                                {data.showUnitPrices ? (
                                    <div className="flex min-w-0 justify-between items-center gap-3 text-xl font-bold text-slate-900 mt-3 bg-[#FAF8F5] p-3 rounded-lg border border-[#E8E1D9]">
                                        <span className="font-serif">Totale</span>
                                        <span className="min-w-0 text-right text-[#7A0018] tabular-nums">€ {finalTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                ) : (
                                    <div className="w-full min-w-0 overflow-hidden mt-3 rounded-xl border border-[#7A0018]/20 bg-gradient-to-br from-[#FAF8F5] to-white px-4 py-3 text-center shadow-sm">
                                        <span className="block text-xl font-serif font-bold text-slate-900">Importo complessivo</span>
                                        <span
                                            className="mt-1 block max-w-full text-xl font-bold leading-tight text-[#7A0018] tabular-nums"
                                            style={{ overflowWrap: 'anywhere' }}
                                        >
                                            € {finalTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}
                                <p className="text-[9px] text-slate-400 text-right mt-1">* IVA Esclusa</p>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER LEGALE */}
                    <footer data-pdf-block className="mt-5 pt-3 border-t border-[#E8E1D9]">
                        <div className="flex justify-between gap-10 mb-6">
                            <div className="w-1/2 text-center">
                                <div data-signature-space className="mx-4 h-[105px] border-b border-dashed border-slate-400" />
                                <p className="mt-2 text-[10px] text-slate-500">Firma Luna Events</p>
                            </div>
                            <div className="w-1/2 text-center">
                                <div data-signature-space className="mx-4 h-[105px] border-b border-dashed border-slate-400" />
                                <p className="mt-2 text-[10px] text-slate-500">Firma Cliente</p>
                            </div>
                        </div>
                        <div className="text-[9px] text-slate-500 leading-tight text-center bg-[#FAF8F5] p-2 rounded-lg border border-[#E8E1D9]">
                            <strong>1. Titolare del Trattamento</strong><br />
                            Il Titolare del trattamento dei dati è: <strong>Tabacchi San Clemente di Ianniello Gianpaolo</strong><br />
                            Indirizzo: Via Galatina 95, 81100 San Clemente, Caserta (CE) - P.IVA: 04124110612<br />
                            Email: info@lunaevents.it - Tel: +39 371 542 8345
                        </div>
                    </footer>
                </div>
            </main>

            {isSendModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Send size={18} className="text-[#7A0018]" /> Invia Preventivo</h3>
                            <button onClick={() => setIsSendModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Email Cliente</label>
                                <input type="email" value={data.customerEmail} onChange={handleInputChange} name="customerEmail" placeholder="cliente@email.it" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:border-[#7A0018]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Scegli come inviare</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setSendMethod('email')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${sendMethod === 'email' || sendMethod === 'both' ? 'bg-[#7A0018]/10 border-[#7A0018] text-[#7A0018]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}><Mail size={16} /> Email</button>
                                    <button onClick={() => setSendMethod('whatsapp')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${sendMethod === 'whatsapp' || sendMethod === 'both' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}><MessageCircle size={16} /> WhatsApp</button>
                                    <button onClick={() => setSendMethod('both')} className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${sendMethod === 'both' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>Entrambi</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Testo Messaggio</label>
                                <textarea value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} rows={7} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 outline-none focus:border-[#7A0018] resize-none" />
                            </div>
                            <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs flex items-start gap-2 border border-amber-200/50"><span className="font-bold whitespace-nowrap">Info PDF:</span> Il PDF del preventivo verrà allegato all'email.</div>
                        </div>
                        <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50">
                            <button onClick={() => setIsSendModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-colors">Annulla</button>
                            <button onClick={handleConfirmSend} disabled={isSending} className="flex-1 py-3 rounded-xl bg-[#7A0018] text-white font-bold text-sm hover:bg-[#5C0012] flex items-center justify-center gap-2 transition-colors disabled:opacity-70">{isSending ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Conferma e Invia</>}</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                #quote-pdf-content [class~="text-[9px]"] { font-size: 11px !important; }
                #quote-pdf-content [class~="text-[10px]"] { font-size: 12px !important; }
                #quote-pdf-content [class~="text-xs"] { font-size: 14px !important; }
                #quote-pdf-content [class~="text-sm"] { font-size: 16px !important; }
                #quote-pdf-content [class~="text-base"] { font-size: 18px !important; }
                #quote-pdf-content [class~="text-xl"] { font-size: 23px !important; }
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; color: black; }
                    .no-print { display: none !important; }
                }
            `}</style>
            <LunaDialog
                open={notice !== null}
                title={notice?.title || ''}
                message={notice?.message || ''}
                tone={notice?.tone}
                onConfirm={() => {
                    setNotice(null);
                    if (loadError) router.push('/admin/luna-events/preventivi');
                }}
                onCancel={() => {
                    setNotice(null);
                    if (loadError) router.push('/admin/luna-events/preventivi');
                }}
            />
        </div>
    );
}
