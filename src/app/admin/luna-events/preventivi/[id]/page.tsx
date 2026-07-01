"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import {
    Printer, Save, Plus, Trash2, Phone, MapPin, Eye, EyeOff, Loader2,
    CheckCircle2, Calculator, RefreshCw, Lock, ArrowLeft
} from "lucide-react";
import localFont from 'next/font/local';
import Link from "next/link";
import { useQuoteEditor } from "./useQuoteEditor"; // Importiamo la logica

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
    const id = params?.id as string;
    
    // Inizializziamo il nostro custom hook
    const {
        data, setData, loading, saveStatus, editTotalMode, finalTotal,
        handleInputChange, handleTotalChange, handlePricePaxChange,
        toggleEditMode, addItem, updateItem, removeItem, handleUpdateDB
    } = useQuoteEditor(id);

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
                    <input type="text" name="location" value={data.location} onChange={handleInputChange} className="w-full bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg px-3 py-2 text-sm focus:border-[#7A0018] outline-none text-slate-900" placeholder="Luogo Evento" />
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
                        <div className="relative mt-2">
                            <label className="text-[10px] text-slate-500 block mb-1 flex justify-between uppercase font-bold">
                                Totale Finale
                                {editTotalMode && <span className="text-[#7A0018] text-[9px] uppercase font-bold">Manuale</span>}
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-slate-400"><Calculator size={14} /></div>
                                <input type="number" value={data.lockedTotal !== null ? data.lockedTotal : finalTotal} readOnly={!editTotalMode} onChange={handleTotalChange}
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
                    <button onClick={() => window.print()} className="flex-1 bg-[#FAF8F5] border border-[#E8E1D9] text-slate-700 font-bold py-3.5 rounded-xl hover:border-[#7A0018] hover:text-[#7A0018] transition-all flex items-center justify-center gap-2">
                        <Printer size={18} /> Stampa
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
                <div className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl print:shadow-none relative flex flex-col text-slate-900 border border-[#E8E1D9]">
                    
                    {/* HEADER */}
                    <header className="flex justify-between items-start border-b-2 border-[#7A0018]/20 pb-4 mb-6">
                        
                        {/* LOGO LUNA EVENTS */}
                        <div className="relative flex flex-col items-center justify-center w-[250px] h-[140px] -ml-8 -mt-4">
                            <h2 className="font-luna text-7xl text-[#7A0018] relative z-10 leading-none drop-shadow-sm" style={{ fontFeatureSettings: '"liga" 1, "calt" 1', printColorAdjust: 'exact' }}>
                                Luna
                            </h2>
                            <span className="text-slate-600 font-serif uppercase text-sm tracking-[0.5em] relative z-10 mt-[-5px] pl-2 print:text-slate-600">
                                Events
                            </span>
                        </div>                   
                        
                        <div className="text-right text-[10px] text-slate-500 leading-tight pt-4">
                            <p className="font-bold text-slate-900 text-sm mb-1">Luna Events</p>
                            <p>di Tabacchi San Clemente</p>
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