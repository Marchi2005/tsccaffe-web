"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// FIX: Import Supabase corretto per evitare conflitti client
import { createClient } from "@supabase/supabase-js"; 
import { 
    Printer, 
    Save, 
    Plus, 
    Trash2, 
    Phone,
    MapPin,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle2,
    Calculator,
    RefreshCw,
    Lock
} from "lucide-react";
import localFont from 'next/font/local';

// --- FONT SETUP ---
const lunaFont = localFont({
    src: [
        {
            path: '../../../../../fonts/mending.regular.otf', // Verifica il percorso
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-luna',
});

// --- TIPI ---
type OrderItem = {
    id: string;
    category: 'food' | 'beverage' | 'setup';
    name: string;
    description?: string;
};

type QuoteData = {
    customerHonorific: string;
    customerName: string;
    customerPhone: string;
    eventDate: string;
    location: string;
    guestCount: number;
    pricePerPerson: number;
    setupCost: number;
    vatRate: number;
    items: OrderItem[];
    notes: string;
    quoteNumber: string;
    showUnitPrices: boolean;
    lockedTotal: number | null;
};

// --- PRESETS ---
const PRESET_OPTION_1: Partial<QuoteData> = {
    pricePerPerson: 12.00,
    setupCost: 0,
    lockedTotal: null,
    items: [
        // FOOD & BUFFET
        { id: 'f1', category: 'food', name: 'Pizzette Assortite', description: 'Margherita classiche, pizzette rosse e varianti della casa' },
        { id: 'f2', category: 'food', name: 'Calzoncini Mignon', description: 'Cotti al forno con ripieni classici' },
        { id: 'f3', category: 'food', name: 'Girelle di Sfoglia', description: 'Con verdure o carne di stagione' },
        { id: 'f4', category: 'food', name: 'Panini Morbidi all\'Olio', description: 'Farciti con salumi e formaggi (Inclusi in specialità forno)' },
        { id: 'f5', category: 'food', name: 'Panini Napoletani', description: 'Tradizionali con cubetti di salumi, formaggi e pepe' },
        { id: 'f6', category: 'food', name: 'Misto Rustici & Fritturine', description: 'Assortimento di sfoglie fragranti' },
        { id: 'f7', category: 'food', name: 'Torta Salata Alta', description: 'Gourmet, servita a cubotti' },
        
        // BEVERAGE & BAR
        { id: 'b1', category: 'beverage', name: 'Welcome Drink', description: 'Analcolico di Benvenuto' },
        { id: 'b2', category: 'beverage', name: 'Prosecco', description: 'Per il brindisi di benvenuto' },
        { id: 'b3', category: 'beverage', name: 'Bibite & Acque', description: 'Coca-Cola, Fanta, e altro, acqua minerale naturale/frizzante' },
        { id: 'b4', category: 'beverage', name: 'Caffè o Amaro', description: 'Per concludere il ricevimento' },
        
        // ALLESTIMENTO & SERVIZIO
        { id: 's1', category: 'setup', name: 'Confettata Tradizionale', description: 'Confetti in coppe' },
        { id: 's2', category: 'setup', name: 'Servizio Staff', description: '2 Operatori Specializzati per la gestione del buffet e del bar' },
        { id: 's3', category: 'setup', name: 'Mise en place', description: 'Tovaglioli, piatti e bicchieri inclusi' },
    ]
};

const PRESET_OPTION_2: Partial<QuoteData> = {
    pricePerPerson: 16.00,
    setupCost: 0,
    lockedTotal: null,
    items: [
        // FOOD (Include tutto il preset 1 + Upgrade)
        { id: 'f1', category: 'food', name: 'Pizzette Assortite', description: 'Margherita classiche, pizzette rosse e varianti della casa' },
        { id: 'f2', category: 'food', name: 'Calzoncini Mignon', description: 'Cotti al forno con ripieni classici' },
        { id: 'f3', category: 'food', name: 'Girelle di Sfoglia', description: 'Con verdure o carne di stagione' },
        { id: 'f4', category: 'food', name: 'Panini Morbidi all\'Olio', description: 'Farciti con salumi e formaggi (Inclusi in specialità forno)' },
        { id: 'f5', category: 'food', name: 'Panini Napoletani', description: 'Tradizionali con cubetti di salumi, formaggi e pepe' },
        { id: 'f6', category: 'food', name: 'Misto Rustici & Fritturine', description: 'Assortimento di sfoglie fragranti' },
        { id: 'f7', category: 'food', name: 'Torta Salata Alta', description: 'Gourmet, servita a cubotti' },
        // AGGIUNTE SPECIFICHE PRESET 2
        { id: 'f8', category: 'food', name: 'Bocconcini di Bufala', description: 'Mozzarelline/nodini monoporzione' },
        { id: 'f9', category: 'food', name: 'Spiedini Finger Food', description: 'Ciliegino, olive taggiasche, basilico' },

        // BEVERAGE (Upgrade)
        { id: 'b1', category: 'beverage', name: 'Welcome Drink', description: 'Analcolico di Benvenuto' },
        { id: 'b2', category: 'beverage', name: 'Prosecco', description: 'Scorta maggiorata per brindisi prolungato' },
        { id: 'b3', category: 'beverage', name: 'Soft Drinks Completi', description: 'Selezione completa bibite e acque' },
        { id: 'b4', category: 'beverage', name: 'Caffè o Amaro', description: 'Per concludere il ricevimento' },

        // SETUP (Upgrade)
        { id: 's1', category: 'setup', name: 'Grande Confettata', description: 'Scenografica, vari gusti, decorazioni a tema' },
        { id: 's2', category: 'setup', name: '2 Carretti in Legno', description: 'Isole degustazione separate e scenografiche' },
        { id: 's3', category: 'setup', name: 'Logistica Premium', description: 'Trasporto, montaggio, ghiaccio, 2 operatori specializzati' },
    ]
};

// FIX: Inizializzazione Supabase FUORI dal componente (Singleton)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AdminQuoteGenerator() {
    
    // State Dati
    const [data, setData] = useState<QuoteData>({
        customerHonorific: "Sig.",
        customerName: "Mario Rossi",
        customerPhone: "333 1234567",
        eventDate: new Date().toISOString().split('T')[0],
        location: "Location da definire",
        guestCount: 50,
        pricePerPerson: 12.00,
        setupCost: 0,
        vatRate: 22,
        quoteNumber: "",
        notes: "Validità offerta: 15 giorni.\nAcconto 30% alla conferma.",
        items: PRESET_OPTION_1.items || [],
        showUnitPrices: true,
        lockedTotal: null
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [editTotalMode, setEditTotalMode] = useState(false); 

    // --- CALCOLO INCREMENTALE NUMERO PREVENTIVO ---
    useEffect(() => {
        const fetchNextQuoteNumber = async () => {
            const currentYear = new Date().getFullYear();
            
            const { data: lastQuote } = await supabase
                .from('quotes')
                .select('quote_number')
                .ilike('quote_number', `PV-${currentYear}-%`)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            let nextSequence = 1;
            if (lastQuote && lastQuote.quote_number) {
                const parts = lastQuote.quote_number.split('-');
                if (parts.length === 3) {
                    const lastNum = parseInt(parts[2], 10);
                    if (!isNaN(lastNum)) nextSequence = lastNum + 1;
                }
            }
            const formattedSequence = nextSequence.toString().padStart(3, '0');
            setData(prev => ({ ...prev, quoteNumber: `PV-${currentYear}-${formattedSequence}` }));
        };
        
        fetchNextQuoteNumber();
    }, []); 

    // --- CALCOLI DINAMICI ---
    const finalTotal = data.lockedTotal !== null 
        ? data.lockedTotal 
        : (data.guestCount * data.pricePerPerson) + data.setupCost;

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    // LOGICA INVERSA
    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === "") {
            setData(prev => ({ ...prev, lockedTotal: null }));
            return;
        }
        const newTotal = parseFloat(val);
        const approxPricePax = (newTotal - data.setupCost) / (data.guestCount || 1);
        
        setData(prev => ({
            ...prev,
            lockedTotal: newTotal,
            pricePerPerson: parseFloat(approxPricePax.toFixed(2))
        }));
    };

    // LOGICA DIRETTA
    const handlePricePaxChange = (val: string) => {
        const newPrice = parseFloat(val) || 0;
        setData(prev => ({
            ...prev,
            pricePerPerson: newPrice,
            lockedTotal: null
        }));
    };

    const toggleEditMode = () => {
        setEditTotalMode(!editTotalMode);
    };

    const loadPreset = (preset: Partial<QuoteData>) => {
        setData(prev => ({
            ...prev,
            pricePerPerson: preset.pricePerPerson || 0,
            setupCost: preset.setupCost || 0,
            lockedTotal: null,
            items: preset.items || []
        }));
    };

    const addItem = (category: 'food' | 'beverage' | 'setup') => {
        const newItem: OrderItem = {
            id: Math.random().toString(36).substr(2, 9),
            category,
            name: "Nuova Voce",
            description: ""
        };
        setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const updateItem = (id: string, field: keyof OrderItem, value: string) => {
        setData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const removeItem = (id: string) => {
        setData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    // --- SALVATAGGIO DB ---
    const handleSaveDB = async () => {
        setSaveStatus('saving');
        try {
            const fullName = `${data.customerHonorific} ${data.customerName}`;

            const { error } = await supabase
                .from('quotes')
                .insert({
                    quote_number: data.quoteNumber,
                    customer_name: fullName, 
                    customer_phone: data.customerPhone,
                    event_date: data.eventDate,
                    location: data.location,
                    guest_count: data.guestCount,
                    price_per_person: data.pricePerPerson,
                    setup_cost: data.setupCost,
                    vat_rate: data.vatRate,
                    total_amount: finalTotal,
                    items: data.items,
                    notes: data.notes,
                    show_unit_prices: data.showUnitPrices
                });

            if (error) throw error;
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000); 
        } catch (err: any) {
            console.error("Errore salvataggio dettagliato:", JSON.stringify(err, null, 2));
            if (err?.message) console.error("Messaggio errore:", err.message);
            
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    return (
        <div className={`min-h-screen bg-slate-950 text-slate-200 flex flex-col lg:flex-row ${lunaFont.variable} font-sans`}>
            
            {/* --- SIDEBAR CONTROLLI --- */}
            <aside className="w-full lg:w-[450px] bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto h-screen no-print shadow-2xl z-10 scrollbar-thin scrollbar-thumb-slate-700">
                
                {/* LOGO SIDEBAR */}
                <div className="relative flex flex-col items-center justify-center py-10 mb-6 border-b border-slate-800">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
                        <Image
                            src="/icons/moon.svg"
                            alt=""
                            width={300}
                            height={300}
                            className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]"
                        />
                    </div>
                    <h2 className="font-luna text-7xl text-amber-400 relative z-10 leading-none drop-shadow-lg" style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}>
                        Luna
                    </h2>
                    <span className="text-white font-serif uppercase text-sm tracking-[0.5em] relative z-10 mt-[-5px] pl-2">
                        Events
                    </span>
                </div>

                {/* PRESETS */}
                <div className="mb-8">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Carica Preset</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => loadPreset(PRESET_OPTION_1)} className="p-3 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 text-left transition-colors">
                            <span className="block text-amber-400 font-bold text-xs">Opzione 1</span>
                            <span className="text-[10px] text-slate-400">Classic €12</span>
                        </button>
                        <button onClick={() => loadPreset(PRESET_OPTION_2)} className="p-3 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 text-left transition-colors">
                            <span className="block text-amber-400 font-bold text-xs">Opzione 2</span>
                            <span className="text-[10px] text-slate-400">Gourmet €16</span>
                        </button>
                    </div>
                </div>

                {/* INFO EVENTO */}
                <div className="space-y-3 mb-8 border-b border-slate-800 pb-6">
                    {/* INPUT NOME E TITOLO */}
                    <div className="flex gap-2">
                        <select 
                            name="customerHonorific"
                            value={data.customerHonorific}
                            onChange={handleInputChange}
                            className="w-[100px] bg-slate-950 border border-slate-700 rounded px-2 py-2 text-sm focus:border-amber-400 outline-none text-slate-300"
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
                            className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:border-amber-400 outline-none" 
                            placeholder="Nome Cognome" 
                        />
                    </div>

                    <input type="text" name="location" value={data.location} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:border-amber-400 outline-none" placeholder="Luogo Evento" />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="date" name="eventDate" value={data.eventDate} onChange={handleInputChange} className="bg-slate-950 border border-slate-700 rounded px-2 py-2 text-sm outline-none [color-scheme:dark]" />
                        <input type="text" name="customerPhone" value={data.customerPhone} onChange={handleInputChange} className="bg-slate-950 border border-slate-700 rounded px-2 py-2 text-sm outline-none" placeholder="Tel" />
                    </div>
                    
                    {/* SEZIONE PREZZI AVANZATA */}
                    <div className={`p-4 rounded-lg border mt-4 space-y-4 transition-colors ${data.lockedTotal !== null ? 'bg-amber-900/10 border-amber-500/30' : 'bg-slate-950/50 border-slate-800'}`}>
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                Calcolo Prezzi 
                                {data.lockedTotal !== null && <Lock size={12} className="text-amber-500" />}
                            </label>
                            <button 
                                onClick={toggleEditMode}
                                className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                            >
                                <RefreshCw size={12} /> {editTotalMode ? "Chiudi Modifica Totale" : "Forza Totale Manuale"}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] text-slate-500 block mb-1">Ospiti</label>
                                <input type="number" name="guestCount" value={data.guestCount} onChange={(e) => setData(p => ({...p, guestCount: parseInt(e.target.value)}))} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-2 text-sm outline-none focus:border-amber-400" />
                            </div>
                            
                            {/* Input Prezzo PAX */}
                            <div>
                                <label className="text-[10px] text-slate-500 block mb-1">€ / Persona</label>
                                <input 
                                    type="number" 
                                    step="0.5" 
                                    name="pricePerPerson" 
                                    value={data.pricePerPerson} 
                                    onChange={(e) => handlePricePaxChange(e.target.value)} 
                                    className={`w-full border rounded px-2 py-2 text-sm outline-none focus:border-amber-400 ${data.lockedTotal !== null ? 'bg-slate-800 text-amber-400/70 border-amber-500/20' : 'bg-slate-900 border-slate-700 text-white'}`} 
                                />
                                {data.lockedTotal !== null && <span className="text-[9px] text-amber-500/70 block mt-1">*Calcolato dal totale</span>}
                            </div>
                        </div>

                        {/* Input TOTALE (Reverse Calc) */}
                        <div className="relative">
                            <label className="text-[10px] text-slate-500 block mb-1 flex justify-between">
                                Totale Finale
                                {editTotalMode && <span className="text-amber-400 text-[9px] uppercase font-bold">Inserimento Manuale</span>}
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-slate-500"><Calculator size={14} /></div>
                                <input 
                                    type="number" 
                                    value={data.lockedTotal !== null ? data.lockedTotal : finalTotal} 
                                    readOnly={!editTotalMode}
                                    onChange={handleTotalChange}
                                    className={`w-full rounded px-2 py-2 pl-9 text-sm font-bold outline-none border transition-all
                                        ${editTotalMode 
                                            ? 'bg-amber-400/10 border-amber-400 text-amber-400 placeholder-amber-400/50' 
                                            : 'bg-slate-900 border-slate-700 text-slate-400'
                                        }`} 
                                />
                                <div className="absolute right-3 top-2.5 text-xs text-slate-500">€</div>
                            </div>
                            {editTotalMode && <p className="text-[9px] text-slate-500 mt-1 text-center">Inserendo un valore qui, il totale sarà esatto e il prezzo pax approssimativo.</p>}
                        </div>
                    </div>

                    <button 
                        onClick={() => setData(p => ({...p, showUnitPrices: !p.showUnitPrices}))}
                        className={`w-full mt-4 flex items-center justify-center gap-2 py-2 rounded border transition-all text-xs font-bold ${data.showUnitPrices ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-amber-400/10 border-amber-400 text-amber-400'}`}
                    >
                        {data.showUnitPrices ? <Eye size={14} /> : <EyeOff size={14} />}
                        {data.showUnitPrices ? "Nascondi Prezzo Persona (Stampa)" : "Prezzo Persona Nascosto (Stampa)"}
                    </button>

                    <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                         <span className="text-[10px] text-slate-500 uppercase">Preventivo N.</span>
                         <p className="text-amber-400 font-mono text-xl">{data.quoteNumber || "Calcolo..."}</p>
                    </div>
                </div>

                {/* LISTA VOCI */}
                <div className="space-y-6 mb-20">
                    {['food', 'beverage', 'setup'].map((cat) => (
                        <div key={cat}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">{cat}</span>
                                <button onClick={() => addItem(cat as any)} className="text-slate-400 hover:text-white"><Plus size={14} /></button>
                            </div>
                            <div className="space-y-1">
                                {data.items.filter(i => i.category === cat).map(item => (
                                    <div key={item.id} className="flex gap-2 items-start bg-slate-950/30 p-1.5 rounded hover:bg-slate-800 group">
                                        <div className="flex-1 min-w-0">
                                            <input value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="w-full bg-transparent text-xs font-medium text-slate-300 outline-none" />
                                            <input value={item.description || ''} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full bg-transparent text-[10px] text-slate-500 outline-none" placeholder="Descrizione..." />
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ACTIONS */}
                <div className="fixed bottom-0 left-0 w-full lg:w-[450px] bg-slate-900 p-4 border-t border-slate-800 flex gap-2">
                    <button onClick={() => window.print()} className="flex-1 bg-white text-slate-950 font-bold py-3 rounded hover:bg-slate-200 flex items-center justify-center gap-2">
                        <Printer size={18} /> Stampa
                    </button>
                    
                    <button 
                        onClick={handleSaveDB}
                        disabled={saveStatus === 'saving' || saveStatus === 'success'}
                        className={`flex-1 font-bold py-3 rounded flex items-center justify-center gap-2 transition-all
                            ${saveStatus === 'success' ? 'bg-green-500 text-white' : 
                              saveStatus === 'error' ? 'bg-red-500 text-white' : 
                              'bg-amber-400 text-slate-900 hover:bg-amber-300'}`}
                    >
                        {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={18} /> : 
                         saveStatus === 'success' ? <><CheckCircle2 size={18} /> Salvato</> : 
                         saveStatus === 'error' ? 'Errore' : 
                         <><Save size={18} /> Salva DB</>}
                    </button>
                </div>
            </aside>

            {/* --- PREVIEW STAMPA (A4) --- */}
            <main className="flex-1 bg-slate-800 p-8 flex justify-center overflow-y-auto print:p-0 print:bg-white print:block">
                
                <div className="bg-white w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl print:shadow-none relative flex flex-col text-slate-900">
                    
                    {/* HEADER */}
                    <header className="flex justify-between items-start border-b-2 border-[#C4A052]/30 pb-4 mb-6">
                        
                        {/* LOGO LUNA EVENTS - VERSIONE GIGANTE A4 */}
                        <div className="relative flex flex-col items-center justify-center w-[250px] h-[140px] -ml-8 -mt-4">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
                                <Image
                                    src="/icons/moon.svg"
                                    alt=""
                                    width={500} // Dimensioni Immagine Aumentate
                                    height={500}
                                    className="w-[500px] h-[500px] object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]" 
                                    style={{ printColorAdjust: 'exact' }}
                                />
                            </div>
                            <h2
                                className="font-luna text-7xl text-[#C4A052] relative z-10 leading-none drop-shadow-sm"
                                style={{ 
                                    fontFeatureSettings: '"liga" 1, "calt" 1',
                                    printColorAdjust: 'exact'
                                }}
                            >
                                Luna
                            </h2>
                            <span className="text-slate-600 font-serif uppercase text-sm tracking-[0.5em] relative z-10 mt-[-5px] pl-2 print:text-slate-600">
                                Events
                            </span>
                        </div>
                        
                        {/* Dati Azienda Header - AGGIORNATO CON TELEFONO */}
                        <div className="text-right text-[10px] text-slate-500 leading-tight pt-4">
                            <p className="font-bold text-slate-900 text-sm mb-1">Luna Events</p>
                            <p>di Tabacchi San Clemente Caffè</p>
                            <p>Via Galatina 95, 81100 Caserta</p>
                            <p className="font-mono mt-1">info@lunaevents.it</p>
                            <p className="font-mono">Tel: +39 371 542 8345</p>
                        </div>
                    </header>

                    {/* BOX INFO CLIENTE */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Cliente</p>
                            <h2 className="text-lg font-serif font-bold text-slate-800">
                                {/* Mostra Titolo + Nome in anteprima */}
                                {data.customerHonorific} {data.customerName}
                            </h2>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                                {data.location && <span className="flex items-center gap-1"><MapPin size={12}/> {data.location}</span>}
                                {data.customerPhone && <span className="flex items-center gap-1"><Phone size={12}/> {data.customerPhone}</span>}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Riferimenti</p>
                            <p className="text-sm font-bold text-[#C4A052] min-h-[20px]">{data.quoteNumber}</p>
                            <p className="text-xs text-slate-600 capitalize">
                                {new Date(data.eventDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">Ospiti previsti: <strong>{data.guestCount}</strong></p>
                        </div>
                    </div>

                    {/* BODY PREVENTIVO */}
                    <div className="flex-1 space-y-6">
                        
                        {/* FOOD & BEVERAGE */}
                        <div className="grid grid-cols-2 gap-8 items-start">
                            {/* Food */}
                            <section className="break-inside-avoid">
                                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 flex items-center gap-2">
                                    <span className="text-[#C4A052]">01.</span> Food & Buffet
                                </h3>
                                <ul className="space-y-2">
                                    {data.items.filter(i => i.category === 'food').map(item => (
                                        <li key={item.id} className="text-xs leading-tight">
                                            <span className="font-bold text-slate-700 block">{item.name}</span>
                                            {item.description && <span className="text-slate-500 text-[10px]">{item.description}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Beverage */}
                            <section className="break-inside-avoid">
                                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 flex items-center gap-2">
                                    <span className="text-[#C4A052]">02.</span> Beverage & Bar
                                </h3>
                                <ul className="space-y-2">
                                    {data.items.filter(i => i.category === 'beverage').map(item => (
                                        <li key={item.id} className="text-xs leading-tight">
                                            <span className="font-bold text-slate-700 block">{item.name}</span>
                                            {item.description && <span className="text-slate-500 text-[10px]">{item.description}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        {/* SETUP */}
                        <section className="break-inside-avoid">
                            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 flex items-center gap-2">
                                <span className="text-[#C4A052]">03.</span> Allestimento & Servizio
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {data.items.filter(i => i.category === 'setup').map(item => (
                                    <div key={item.id} className="text-xs flex items-start gap-2">
                                        <div className="w-1 h-1 bg-[#C4A052] rounded-full mt-1.5 shrink-0"></div>
                                        <div>
                                            <span className="font-bold text-slate-700">{item.name}</span>
                                            {item.description && <span className="text-slate-500 text-[10px] block">{item.description}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* TOTALI */}
                    <div className="mt-8 break-inside-avoid">
                        <div className="flex justify-end">
                            <div className="w-2/5 min-w-[200px] border-t-2 border-[#C4A052] pt-4">
                                
                                {data.showUnitPrices && (
                                    <>
                                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                                            <span>Costo pax</span>
                                            {/* Mostra il prezzo pax. Se siamo in Locked Total, potrebbe essere decimale strano, ma lo mostriamo comunque. */}
                                            <span>€ {data.pricePerPerson.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-600 mb-2">
                                            <span>Ospiti</span>
                                            <span>x {data.guestCount}</span>
                                        </div>
                                        {data.setupCost > 0 && (
                                            <div className="flex justify-between text-xs text-slate-600 mb-2">
                                                <span>Extra</span>
                                                <span>€ {data.setupCost.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="flex justify-between items-center text-xl font-bold text-slate-900 mt-2 bg-slate-50 p-2 rounded">
                                    <span className="font-serif">
                                        {data.showUnitPrices ? "Totale" : "Importo Complessivo"}
                                    </span>
                                    {/* QUI USIAMO IL TOTALE FINALE ESATTO */}
                                    <span className="text-[#C4A052]">€ {finalTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                </div>
                                {/* IVA Esclusa COME RICHIESTO */}
                                <p className="text-[9px] text-slate-400 text-right mt-1">* IVA Esclusa</p>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER LEGALE - AGGIORNATO CON TELEFONO */}
                    <footer className="mt-auto pt-6 border-t border-slate-200">
                        <div className="flex justify-between items-end mb-6">
                            <div className="w-1/3 text-center">
                                <p className="text-[10px] text-slate-400 mb-6 border-b border-dashed border-slate-300 pb-2 mx-4">Firma Cliente</p>
                            </div>
                        </div>
                        
                        <div className="text-[9px] text-slate-500 leading-tight text-center bg-slate-50 p-2 rounded">
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
