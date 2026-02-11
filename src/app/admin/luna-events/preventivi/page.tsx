"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js"; 
import { 
    Search, 
    Calendar, 
    Users, 
    FileText, 
    Trash2, 
    Loader2, 
    Plus,
    ArrowUpRight,
    Euro,
    Pencil,
    ArrowLeft // <--- Aggiunta importazione ArrowLeft
} from "lucide-react";
import localFont from 'next/font/local';

// --- FONT SETUP ---
const lunaFont = localFont({
    src: [
        {
            path: '../../../../fonts/mending.regular.otf', 
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-luna',
});

// --- INIT SUPABASE ---
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- TIPI ---
type Quote = {
    id: string;
    created_at: string;
    quote_number: string;
    customer_name: string;
    event_date: string;
    guest_count: number;
    total_amount: number;
    price_per_person: number;
};

export default function AdminQuotesList() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // --- FETCH DATA ---
    const fetchQuotes = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('quotes')
                .select('id, created_at, quote_number, customer_name, event_date, guest_count, total_amount, price_per_person')
                .order('created_at', { ascending: false });

            if (searchTerm) {
                query = query.or(`customer_name.ilike.%${searchTerm}%,quote_number.ilike.%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setQuotes(data || []);
        } catch (err) {
            console.error("Errore caricamento:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchQuotes();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // --- DELETE HANDLER ---
    const handleDelete = async (id: string) => {
        if (!confirm("Sei sicuro di voler eliminare questo preventivo? L'azione è irreversibile.")) return;
        
        setDeletingId(id);
        try {
            const { error } = await supabase.from('quotes').delete().eq('id', id);
            if (error) throw error;
            setQuotes(prev => prev.filter(q => q.id !== id));
        } catch (err) {
            console.error("Errore cancellazione:", err);
            alert("Errore durante l'eliminazione");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className={`min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 ${lunaFont.variable} font-sans`}>
            
            {/* --- PULSANTE INDIETRO --- */}
            <div className="mb-6">
                <Link 
                    href="/admin/luna-events" 
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-400 transition-colors"
                >
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-full hover:border-amber-400/50">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider">Torna alla Dashboard</span>
                </Link>
            </div>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-luna text-amber-400 mb-2">Archivio Preventivi</h1>
                    <p className="text-slate-400 text-sm">Gestisci e ricerca lo storico dei preventivi salvati.</p>
                </div>
                
                <Link 
                    href="/admin/luna-events/preventivi/nuovo" 
                    className="flex items-center gap-2 bg-amber-400 text-slate-950 px-6 py-3 rounded-lg font-bold hover:bg-amber-300 transition-colors shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                >
                    <Plus size={20} />
                    Nuovo Preventivo
                </Link>
            </div>

            {/* SEARCH BAR */}
            <div className="relative mb-10">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Search size={20} />
                </div>
                <input 
                    type="text" 
                    placeholder="Cerca per Nome Cliente o Numero Preventivo (es. PV-2024...)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all text-lg"
                />
            </div>

            {/* LISTA CARDS */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-amber-400" size={40} />
                </div>
            ) : quotes.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                    <FileText size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl text-white font-serif mb-2">Nessun preventivo trovato</h3>
                    <p className="text-slate-500">Prova a cambiare i filtri di ricerca o creane uno nuovo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quotes.map((quote) => (
                        <div 
                            key={quote.id} 
                            className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-400/30 transition-all hover:shadow-2xl hover:shadow-black/50 flex flex-col justify-between"
                        >
                            <div>
                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-block px-3 py-1 bg-slate-950 text-amber-400 text-xs font-mono font-bold rounded border border-slate-800">
                                        {quote.quote_number}
                                    </span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                        {new Date(quote.created_at).toLocaleDateString('it-IT')}
                                    </span>
                                </div>

                                {/* Cliente */}
                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1" title={quote.customer_name}>
                                    {quote.customer_name}
                                </h3>
                                
                                {/* Info Evento */}
                                <div className="space-y-2 mt-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-amber-500/70" />
                                        <span>Evento: <strong className="text-slate-300">{new Date(quote.event_date).toLocaleDateString('it-IT')}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-amber-500/70" />
                                        <span>Ospiti: <strong className="text-slate-300">{quote.guest_count}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Euro size={14} className="text-amber-500/70" />
                                        <span>Prezzo pax: <strong className="text-slate-300">€{quote.price_per_person}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Card & Azioni */}
                            <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase block">Totale</span>
                                    <span className="text-2xl font-luna text-amber-400">
                                        € {quote.total_amount?.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {/* DELETE BUTTON */}
                                    <button 
                                        onClick={() => handleDelete(quote.id)}
                                        disabled={deletingId === quote.id}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        title="Elimina"
                                    >
                                        {deletingId === quote.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    </button>
                                    
                                    {/* EDIT BUTTON */}
                                    <Link 
                                        href={`/admin/luna-events/preventivi/${quote.id}`}
                                        className="p-2 text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                                        title="Modifica Preventivo"
                                    >
                                        <Pencil size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}