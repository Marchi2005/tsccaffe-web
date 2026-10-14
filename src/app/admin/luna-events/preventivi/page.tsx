"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js"; 
import { 
    Search, 
    Calendar, 
    FileText, 
    Trash2, 
    Loader2, 
    ArrowLeft,
    Mail,
    Phone,
    Eye,
    Filter,
    Plus,
    FilePlus,
    X,
    MessageSquare,
    RefreshCw
} from "lucide-react";
import localFont from 'next/font/local';
import clsx from "clsx";
import LunaDialog, { type LunaDialogTone } from "../LunaDialog";

type PageDialog = {
    title: string;
    message: string;
    tone: LunaDialogTone;
    confirmLabel?: string;
    cancelLabel?: string;
    showCancel?: boolean;
    onConfirm: () => void | Promise<void>;
};

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

// --- INIT SUPABASE CON CACHE DISABILITATA ---
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
        auth: {
            persistSession: false,
        },
        global: {
            fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
        }
    }
);

// --- TIPI ---
type LunaLead = {
    id: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    event_type: string;
    event_date_info: string;
    specific_date: string | null;
    customer_message: string | null;
    status: 'nuovo' | 'preventivo_inviato' | 'accettato' | 'rifiutato';
    quote_id?: string | null;
    quotes?: { quote_number: string } | { quote_number: string }[] | null; 
};

type LunaQuote = {
    id: string;
    created_at: string;
    quote_number: string;
    customer_name: string;
    customer_phone: string | null;
    customer_email: string | null;
    event_date: string | null;
    location: string | null;
    guest_count: number | null;
    total_amount: number | null;
    original_total: number | null;
    discount_mode: 'fixed' | 'final_price' | null;
    discount_value: number | null;
    price_per_person: number | null;
    setup_cost: number | null;
    vat_rate: number | null;
    items: { id?: string; name: string; category?: string; description?: string }[] | null;
    notes: string | null;
    show_unit_prices: boolean | null;
    status: 'nuovo' | 'preventivo_inviato' | 'accettato' | 'rifiutato';
};

export default function LunaPreventiviList() {
    const [leads, setLeads] = useState<LunaLead[]>([]);
    const [quotes, setQuotes] = useState<LunaQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingQuoteId, setDeletingQuoteId] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<LunaLead | null>(null);
    const [selectedQuote, setSelectedQuote] = useState<LunaQuote | null>(null);
    const [dialog, setDialog] = useState<PageDialog | null>(null);
    
    // STATO PER IL CARICAMENTO DURANTE L'AGGIORNAMENTO DELLO STATO
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const [updatingQuoteStatusId, setUpdatingQuoteStatusId] = useState<string | null>(null);

    // --- FETCH DATA ---
    const fetchLeads = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setLoading(true);

        try {
            let query = supabase
                .from('luna_preventivi')
                .select('*, quotes(quote_number)')
                .order('created_at', { ascending: false });

            const quotesQuery = supabase
                .from('quotes')
                .select('id, created_at, quote_number, customer_name, customer_phone, customer_email, event_date, location, guest_count, total_amount, original_total, discount_mode, discount_value, price_per_person, setup_cost, vat_rate, items, notes, show_unit_prices, status')
                .order('created_at', { ascending: false });

            const [{ data, error }, { data: quoteData, error: quoteError }] = await Promise.all([query, quotesQuery]);

            if (error) throw error;
            setLeads((data as LunaLead[]) || []);
            if (quoteError) {
                console.error("Errore recupero preventivi manuali:", quoteError);
                setQuotes([]);
            } else {
                setQuotes((quoteData as LunaQuote[]) || []);
            }
        } catch (err) {
            console.error("Errore fetch leads:", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    // Auto-fetch al caricamento o cambio filtri
    useEffect(() => {
        const timer = setTimeout(() => fetchLeads(), 300);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter]);

    // I preventivi già collegati a una richiesta vengono mostrati dentro la relativa card,
    // quindi qui restano soltanto i preventivi manuali senza richiesta associata.
    const linkedQuoteIds = new Set(leads.map(lead => lead.quote_id).filter((id): id is string => Boolean(id)));
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('it');
    const visibleLeads = leads.filter(lead =>
        (statusFilter === 'all' || lead.status === statusFilter) &&
        (!normalizedSearch || `${lead.customer_name} ${lead.event_type} ${lead.customer_email}`.toLocaleLowerCase('it').includes(normalizedSearch))
    );
    const manualQuotes = quotes.filter(quote =>
        !linkedQuoteIds.has(quote.id) &&
        (!normalizedSearch || `${quote.customer_name} ${quote.quote_number} ${quote.location || ''}`.toLocaleLowerCase('it').includes(normalizedSearch))
    );

    // --- UPDATE STATUS HANDLER (FUNZIONE AGGIUNTA) ---
    const handleUpdateStatus = async (id: string, newStatus: LunaLead['status']) => {
        setUpdatingStatusId(id);
        try {
            const lead = leads.find(item => item.id === id);
            if (lead?.quote_id) {
                const { error: quoteError } = await supabase
                    .from('quotes')
                    .update({ status: newStatus })
                    .eq('id', lead.quote_id);
                if (quoteError) throw quoteError;
            }

            const { error } = await supabase
                .from('luna_preventivi')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Aggiorna lo stato locale della lista principale
            setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
            
            // Se il modale di dettaglio è aperto per questo lead, aggiorna anche lui
            setSelectedLead(prev => {
                if (prev && prev.id === id) {
                    return { ...prev, status: newStatus };
                }
                return prev;
            });

        } catch (err) {
            console.error("Errore aggiornamento stato:", err);
            setDialog({ title: "Aggiornamento non riuscito", message: "Non è stato possibile salvare lo stato della richiesta.", tone: "error", onConfirm: () => setDialog(null) });
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleUpdateQuoteStatus = async (quote: LunaQuote, newStatus: LunaQuote['status']) => {
        setUpdatingQuoteStatusId(quote.id);
        try {
            const { error } = await supabase
                .from('quotes')
                .update({ status: newStatus })
                .eq('id', quote.id);
            if (error) throw error;

            setQuotes(prev => prev.map(item => item.id === quote.id ? { ...item, status: newStatus } : item));
            setSelectedQuote(prev => prev?.id === quote.id ? { ...prev, status: newStatus } : prev);

            const linkedLead = leads.find(lead => lead.quote_id === quote.id);
            if (linkedLead) {
                const { error: leadError } = await supabase
                    .from('luna_preventivi')
                    .update({ status: newStatus })
                    .eq('id', linkedLead.id);
                if (leadError) throw leadError;
                setLeads(prev => prev.map(lead => lead.id === linkedLead.id ? { ...lead, status: newStatus } : lead));
                setSelectedLead(prev => prev?.id === linkedLead.id ? { ...prev, status: newStatus } : prev);
            }
        } catch (err) {
            console.error("Errore aggiornamento stato preventivo:", err);
            setDialog({ title: "Aggiornamento non riuscito", message: "Non è stato possibile salvare lo stato del preventivo.", tone: "error", onConfirm: () => setDialog(null) });
        } finally {
            setUpdatingQuoteStatusId(null);
        }
    };

    // --- DELETE HANDLER ---
    const deleteLead = async (id: string) => {
        setDeletingId(id);
        try {
            const { error } = await supabase.from('luna_preventivi').delete().eq('id', id);
            if (error) throw error;
            setLeads(prev => prev.filter(l => l.id !== id));
            if (selectedLead?.id === id) setSelectedLead(null); 
        } catch (err) {
            console.error("Errore cancellazione:", err);
            setDialog({ title: "Eliminazione non riuscita", message: "Non è stato possibile eliminare la richiesta.", tone: "error", onConfirm: () => setDialog(null) });
        } finally {
            setDeletingId(null);
        }
    };

    const handleDelete = (id: string) => {
        setDialog({
            title: "Eliminare la richiesta?",
            message: "La richiesta verrà rimossa dall'elenco. Vuoi continuare?",
            tone: "danger",
            confirmLabel: "Continua",
            cancelLabel: "Annulla",
            showCancel: true,
            onConfirm: () => setDialog({
                title: "Conferma eliminazione definitiva",
                message: "Questa operazione non può essere annullata. Vuoi eliminare definitivamente la richiesta?",
                tone: "danger",
                confirmLabel: "Elimina definitivamente",
                cancelLabel: "Torna indietro",
                showCancel: true,
                onConfirm: () => { setDialog(null); void deleteLead(id); },
            }),
        });
    };

    const deleteQuote = async (quote: LunaQuote) => {
        setDeletingQuoteId(quote.id);
        try {
            const { error } = await supabase.from('quotes').delete().eq('id', quote.id);
            if (error) throw error;
            setQuotes(prev => prev.filter(item => item.id !== quote.id));
        } catch (err) {
            console.error("Errore eliminazione preventivo manuale:", err);
            setDialog({ title: "Eliminazione non riuscita", message: "Non è stato possibile eliminare il preventivo.", tone: "error", onConfirm: () => setDialog(null) });
        } finally {
            setDeletingQuoteId(null);
        }
    };

    const handleDeleteQuote = (quote: LunaQuote) => {
        setDialog({
            title: "Eliminare il preventivo?",
            message: `Vuoi eliminare il preventivo ${quote.quote_number} di ${quote.customer_name}?`,
            tone: "danger",
            confirmLabel: "Continua",
            cancelLabel: "Annulla",
            showCancel: true,
            onConfirm: () => setDialog({
                title: "Conferma eliminazione definitiva",
                message: "Il preventivo verrà eliminato definitivamente e non potrà essere recuperato. Procedere?",
                tone: "danger",
                confirmLabel: "Elimina definitivamente",
                cancelLabel: "Torna indietro",
                showCancel: true,
                onConfirm: () => { setDialog(null); void deleteQuote(quote); },
            }),
        });
    };

    const formatRequestId = (lead: LunaLead) => {
        const year = new Date(lead.created_at).getFullYear();
        const idStr = lead.id.toString().padStart(3, '0');
        return `RC-${year}-${idStr}`;
    };

    // Estrae il numero dal JSON relazionale
    const getQuoteNumber = (quotesData: any) => {
        if (!quotesData) return null;
        if (Array.isArray(quotesData) && quotesData.length > 0) return quotesData[0].quote_number;
        return quotesData.quote_number || null;
    };

    // --- SELETTORE DI STATO INTERATTIVO (Sostituisce il vecchio badge statico) ---
    const renderStatusSelect = (lead: LunaLead) => {
        return (
            <select
                value={lead.status}
                disabled={updatingStatusId === lead.id}
                onClick={(e) => e.stopPropagation()} // Evita di aprire il modale se clicchi sulla tendina nella card
                onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LunaLead['status'])}
                className={clsx(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border outline-none shadow-sm cursor-pointer transition-all disabled:opacity-50",
                    lead.status === 'nuovo' && "bg-[#7A0018]/10 text-[#7A0018] border-[#7A0018]/20 focus:border-[#7A0018]",
                    lead.status === 'preventivo_inviato' && "bg-amber-100 text-amber-700 border-amber-200 focus:border-amber-500",
                    lead.status === 'accettato' && "bg-emerald-100 text-emerald-700 border-emerald-200 focus:border-emerald-500",
                    lead.status === 'rifiutato' && "bg-slate-100 text-slate-500 border-slate-200 focus:border-slate-500"
                )}
            >
                <option value="nuovo">⏳ Da Leggere</option>
                <option value="preventivo_inviato">📩 Inviato</option>
                <option value="accettato">🟢 Accettato</option>
                <option value="rifiutato">🔴 Rifiutato</option>
            </select>
        );
    };

    const renderQuoteStatusSelect = (quote: LunaQuote) => (
        <select
            value={quote.status || 'nuovo'}
            disabled={updatingQuoteStatusId === quote.id}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleUpdateQuoteStatus(quote, e.target.value as LunaQuote['status'])}
            className={clsx(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border outline-none shadow-sm cursor-pointer transition-all disabled:opacity-50",
                quote.status === 'nuovo' && "bg-[#7A0018]/10 text-[#7A0018] border-[#7A0018]/20 focus:border-[#7A0018]",
                quote.status === 'preventivo_inviato' && "bg-amber-100 text-amber-700 border-amber-200 focus:border-amber-500",
                quote.status === 'accettato' && "bg-emerald-100 text-emerald-700 border-emerald-200 focus:border-emerald-500",
                quote.status === 'rifiutato' && "bg-slate-100 text-slate-500 border-slate-200 focus:border-slate-500"
            )}
        >
            <option value="nuovo">⏳ Da Leggere</option>
            <option value="preventivo_inviato">📩 Inviato</option>
            <option value="accettato">🟢 Accettato</option>
            <option value="rifiutato">🔴 Rifiutato</option>
        </select>
    );

    return (
        <div className={`min-h-screen bg-[#FAF8F5] text-slate-800 p-6 md:p-12 ${lunaFont.variable} font-sans relative`}>
            <div className="max-w-7xl mx-auto">
                
                <div className="mb-6">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#7A0018] transition-colors group">
                        <div className="p-2 bg-white border border-[#E8E1D9] rounded-full group-hover:border-[#7A0018]/50 shadow-sm">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-widest">Torna alla Dashboard</span>
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-2">Richieste e Preventivi</h1>
                        <p className="text-slate-500 text-sm">Gestisci le richieste ricevute dal sito e i preventivi creati manualmente.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => fetchLeads(true)}
                            className="inline-flex items-center justify-center p-3 bg-white border border-[#E8E1D9] text-slate-600 rounded-xl hover:text-[#7A0018] hover:border-[#7A0018]/30 transition-colors shadow-sm shrink-0"
                            title="Aggiorna dati"
                        >
                            <RefreshCw size={18} className={isRefreshing ? "animate-spin text-[#7A0018]" : ""} />
                        </button>
                        <Link href="/admin/luna-events/preventivi/nuovo" className="inline-flex items-center gap-2 px-5 py-3 bg-[#7A0018] text-white rounded-xl hover:bg-[#5C0012] transition-colors shadow-md text-xs font-bold tracking-wider uppercase shrink-0">
                            <Plus size={16} /> Nuovo Preventivo
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="relative w-full md:w-96">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={20} />
                        </div>
                        <input 
                            type="text" placeholder="Cerca nome, evento o numero preventivo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-[#E8E1D9] rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#7A0018] focus:ring-1 focus:ring-[#7A0018]/30 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        <Filter size={16} className="text-slate-400 mr-2 shrink-0" />
                        {[
                            { id: 'all', label: 'Tutti' },
                            { id: 'nuovo', label: 'Da leggere' },
                            { id: 'preventivo_inviato', label: 'Inviati' },
                            { id: 'accettato', label: 'Accettati' },
                            { id: 'rifiutato', label: 'Rifiutati' }
                        ].map(filter => (
                            <button
                                key={filter.id} onClick={() => setStatusFilter(filter.id)}
                                className={clsx(
                                    "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                                    statusFilter === filter.id ? "bg-[#7A0018] text-white border-[#7A0018] shadow-md" : "bg-white text-slate-500 border-[#E8E1D9] hover:border-[#7A0018]/30 hover:text-slate-800"
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#7A0018]" size={40} />
                    </div>
                ) : visibleLeads.length === 0 && manualQuotes.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-[#E8E1D9] rounded-2xl bg-white/50">
                        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl text-slate-900 font-serif mb-2">Nessun risultato trovato</h3>
                        <p className="text-slate-500 text-sm">Non ci sono richieste o preventivi manuali corrispondenti ai filtri.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                    {visibleLeads.length > 0 && (
                    <section>
                    <h2 className="text-xl font-serif text-slate-900 mb-4">Richieste ricevute dal sito <span className="text-sm text-slate-400">({visibleLeads.length})</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleLeads.map((lead) => {
                            const qNumber = getQuoteNumber(lead.quotes);
                            
                            return (
                                <div key={lead.id} className="group bg-white border border-[#E8E1D9] rounded-2xl p-0 hover:border-[#7A0018]/30 transition-all hover:shadow-xl hover:shadow-[#7A0018]/5 flex flex-col justify-between overflow-hidden relative">
                                    
                                    <div className="p-6 cursor-pointer flex-1" onClick={() => setSelectedLead(lead)}>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                                {new Date(lead.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            {/* SELETTORE NELLA CARD INTERATTIVO */}
                                            {renderStatusSelect(lead)}
                                        </div>

                                        <h3 className="text-xl font-serif text-slate-900 mb-4 line-clamp-1" title={lead.customer_name}>
                                            {lead.customer_name}
                                        </h3>
                                        
                                        <div className="space-y-3 text-sm text-slate-600 mb-2">
                                            <div className="flex items-start gap-3">
                                                <Calendar size={16} className="text-[#7A0018] shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-slate-900">{lead.event_type}</p>
                                                    <p className="text-xs text-slate-500">{lead.event_date_info}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone size={16} className="text-slate-400 shrink-0" />
                                                <span className="text-slate-600">{lead.customer_phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail size={16} className="text-slate-400 shrink-0" />
                                                <span className="text-slate-600 truncate" title={lead.customer_email}>{lead.customer_email}</span>
                                            </div>
                                        </div>

                                        {lead.customer_message && (
                                            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-100 w-fit">
                                                <MessageSquare size={14} />
                                                <span className="font-medium">Messaggio cliente</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-[#E8E1D9] flex justify-between items-center bg-[#FAF8F5] px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatRequestId(lead)}</span>
                                            {qNumber && (
                                                <span className="text-[10px] text-[#7A0018] font-bold uppercase">PV: {qNumber}</span>
                                            )}
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }} disabled={deletingId === lead.id}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Elimina"
                                            >
                                                {deletingId === lead.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                            </button>
                                            
                                            {!lead.quote_id && (
                                                <Link 
                                                    href={`/admin/luna-events/preventivi/nuovo?leadId=${lead.id}&name=${encodeURIComponent(lead.customer_name)}&email=${encodeURIComponent(lead.customer_email)}&phone=${encodeURIComponent(lead.customer_phone)}&type=${encodeURIComponent(lead.event_type)}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-[#C4A052] text-[#050A18] rounded-xl hover:bg-[#b08e47] hover:text-white transition-colors shadow-sm text-[10px] font-bold tracking-wider uppercase"
                                                >
                                                    <FilePlus size={14} /> Crea
                                                </Link>
                                            )}
                                            
                                            {lead.quote_id && (
                                                <Link 
                                                    href={`/admin/luna-events/preventivi/${lead.quote_id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-1 px-3 py-2 bg-[#7A0018] text-white rounded-xl hover:bg-[#5C0012] transition-colors shadow-sm text-[10px] font-bold tracking-wider uppercase"
                                                >
                                                    <Eye size={14} /> Apri Preventivo
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    </section>
                    )}

                    {manualQuotes.length > 0 && (
                    <section>
                        <h2 className="text-xl font-serif text-slate-900 mb-4">Preventivi creati manualmente <span className="text-sm text-slate-400">({manualQuotes.length})</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {manualQuotes.map(quote => (
                                <div key={quote.id} className="group bg-white border border-[#E8E1D9] rounded-2xl p-0 hover:border-[#7A0018]/30 transition-all hover:shadow-xl hover:shadow-[#7A0018]/5 flex flex-col justify-between overflow-hidden relative">
                                    <div className="p-6 flex-1 cursor-pointer" onClick={() => setSelectedQuote(quote)}>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                                {new Date(quote.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            {renderQuoteStatusSelect(quote)}
                                        </div>

                                        <h3 className="text-xl font-serif text-slate-900 mb-4 line-clamp-1" title={quote.customer_name}>{quote.customer_name}</h3>

                                        <div className="space-y-3 text-sm text-slate-600 mb-2">
                                            <div className="flex items-start gap-3">
                                                <Calendar size={16} className="text-[#7A0018] shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-slate-900">Evento · Preventivo {quote.quote_number}</p>
                                                    <p className="text-xs text-slate-500">{quote.event_date ? new Date(`${quote.event_date}T00:00:00`).toLocaleDateString('it-IT') : 'Data evento non indicata'}</p>
                                                </div>
                                            </div>
                                            {quote.customer_phone && <div className="flex items-center gap-3"><Phone size={16} className="text-slate-400 shrink-0" /><span className="text-slate-600">{quote.customer_phone}</span></div>}
                                            {quote.customer_email && <div className="flex items-center gap-3"><Mail size={16} className="text-slate-400 shrink-0" /><span className="text-slate-600 truncate" title={quote.customer_email}>{quote.customer_email}</span></div>}
                                            {quote.location && <div className="flex items-center gap-3"><Eye size={16} className="text-slate-400 shrink-0" /><span className="text-slate-600">{quote.location}</span></div>}
                                            {quote.guest_count != null && <div className="flex items-center gap-3"><FileText size={16} className="text-slate-400 shrink-0" /><span className="text-slate-600">{quote.guest_count} ospiti · €{Number(quote.price_per_person || 0).toFixed(2)} a persona · IVA {quote.vat_rate ?? 22}%</span></div>}
                                        </div>

                                    </div>

                                    <div className="pt-4 border-t border-[#E8E1D9] flex justify-between items-center bg-[#FAF8F5] px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Preventivo manuale</span>
                                            <span className="text-sm text-slate-900 font-black">{quote.total_amount != null ? `€${Number(quote.total_amount).toLocaleString('it-IT', { minimumFractionDigits: 2 })}` : 'Totale n/d'}</span>
                                            {quote.discount_mode && Number(quote.original_total || 0) > Number(quote.total_amount || 0) && (
                                                <span className="text-[11px] font-medium text-slate-400 line-through">€{Number(quote.original_total).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <button
                                                onClick={() => handleDeleteQuote(quote)}
                                                disabled={deletingQuoteId === quote.id}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                                                title="Elimina preventivo"
                                            >
                                                {deletingQuoteId === quote.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                            </button>
                                            <Link href={`/admin/luna-events/preventivi/${quote.id}`} className="flex items-center gap-1 px-3 py-2 bg-[#7A0018] text-white rounded-xl hover:bg-[#5C0012] transition-colors shadow-sm text-[10px] font-bold tracking-wider uppercase">
                                                <Eye size={14} /> Apri Preventivo
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    )}
                    </div>
                )}
            </div>

            {/* --- MODALE --- */}
            {selectedLead && (() => {
                const qNumber = getQuoteNumber(selectedLead.quotes);
                return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all" onClick={() => setSelectedLead(null)}>
                    <div className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 bg-white border-b border-[#E8E1D9]">
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-3xl font-serif text-slate-900 leading-none">{selectedLead.customer_name}</h2>
                                    {/* SELETTORE ANCHE NEL MODALE DI DETTAGLIO */}
                                    {renderStatusSelect(selectedLead)}
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                                    <span>Richiesta: <span className="text-slate-600">{formatRequestId(selectedLead)}</span></span>
                                    {qNumber && <span>Preventivo: <span className="text-[#7A0018]">{qNumber}</span></span>}
                                </div>
                            </div>
                            <button onClick={() => setSelectedLead(null)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-8 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-[#E8E1D9] shadow-sm">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Email Cliente</p>
                                    <a href={`mailto:${selectedLead.customer_email}`} className="text-sm font-medium text-slate-800 hover:text-[#7A0018] flex items-center gap-2">
                                        <Mail size={16} className="text-slate-400" /> {selectedLead.customer_email}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Telefono</p>
                                    <a href={`tel:${selectedLead.customer_phone}`} className="text-sm font-medium text-slate-800 hover:text-[#7A0018] flex items-center gap-2">
                                        <Phone size={16} className="text-slate-400" /> {selectedLead.customer_phone}
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-[#E8E1D9] shadow-sm space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Evento</p>
                                        <p className="text-sm font-bold text-[#7A0018]">{selectedLead.event_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Data</p>
                                        <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                                            <Calendar size={16} className="text-[#C4A052]" /> {selectedLead.event_date_info}
                                        </p>
                                    </div>
                                </div>
                                {selectedLead.specific_date && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Data Specifica Selezionata</p>
                                        <p className="text-sm font-medium text-slate-800">
                                            {new Date(selectedLead.specific_date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <MessageSquare size={16} className="text-[#7A0018]" /> Messaggio del Cliente
                                </h3>
                                <div className="bg-white p-6 rounded-xl border border-[#E8E1D9] shadow-sm">
                                    {selectedLead.customer_message ? (
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed italic">"{selectedLead.customer_message}"</p>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Nessun messaggio.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#E8E1D9] bg-white flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => setSelectedLead(null)} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 text-xs font-bold uppercase tracking-widest">
                                Chiudi
                            </button>
                            {!selectedLead.quote_id && (
                                <Link 
                                    href={`/admin/luna-events/preventivi/nuovo?leadId=${selectedLead.id}&name=${encodeURIComponent(selectedLead.customer_name)}&email=${encodeURIComponent(selectedLead.customer_email)}&phone=${encodeURIComponent(selectedLead.customer_phone)}&type=${encodeURIComponent(selectedLead.event_type)}`}
                                    className="px-5 py-2.5 bg-[#C4A052] text-[#050A18] rounded-xl hover:bg-[#b08e47] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm"
                                >
                                    <FilePlus size={16} /> Crea Preventivo
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                );
            })()}

            {selectedQuote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all" onClick={() => setSelectedQuote(null)}>
                    <div className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 bg-white border-b border-[#E8E1D9]">
                            <div>
                                <div className="flex flex-wrap items-center gap-4 mb-2">
                                    <h2 className="text-3xl font-serif text-slate-900 leading-none">{selectedQuote.customer_name}</h2>
                                    {renderQuoteStatusSelect(selectedQuote)}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                                    <span>Preventivo: <span className="text-[#7A0018]">{selectedQuote.quote_number}</span></span>
                                    <span>Creato il: <span className="text-slate-600">{new Date(selectedQuote.created_at).toLocaleDateString('it-IT')}</span></span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedQuote(null)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-[#E8E1D9] shadow-sm">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Email Cliente</p>
                                    {selectedQuote.customer_email ? <a href={`mailto:${selectedQuote.customer_email}`} className="text-base font-medium text-slate-800 hover:text-[#7A0018] flex items-center gap-2"><Mail size={18} className="text-slate-400" />{selectedQuote.customer_email}</a> : <p className="text-sm text-slate-400">Non indicata</p>}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Telefono</p>
                                    {selectedQuote.customer_phone ? (
                                        <a href={`tel:${selectedQuote.customer_phone}`} className="text-base font-medium text-slate-800 hover:text-[#7A0018] flex items-center gap-2"><Phone size={18} className="text-slate-400" />{selectedQuote.customer_phone}</a>
                                    ) : <p className="text-sm text-slate-400">Non indicato</p>}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Luogo</p>
                                    <p className="text-base font-medium text-slate-800">{selectedQuote.location || 'Non indicato'}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-[#E8E1D9] shadow-sm">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={16} className="text-[#7A0018]" /> Dettagli evento e importi</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Data evento</p><p className="text-base font-medium text-slate-800">{selectedQuote.event_date ? new Date(`${selectedQuote.event_date}T00:00:00`).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Non indicata'}</p></div>
                                    <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Numero ospiti</p><p className="text-base font-medium text-slate-800">{selectedQuote.guest_count ?? 'Non indicato'}</p></div>
                                    <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Prezzo per persona</p><p className="text-base font-medium text-slate-800">€{Number(selectedQuote.price_per_person || 0).toFixed(2)}</p></div>
                                    <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Costo allestimento</p><p className="text-base font-medium text-slate-800">€{Number(selectedQuote.setup_cost || 0).toFixed(2)}</p></div>
                                    <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">IVA</p><p className="text-base font-medium text-slate-800">{selectedQuote.vat_rate ?? 22}%</p></div>
                                    <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Prezzi unitari nel preventivo</p><p className="text-base font-medium text-slate-800">{selectedQuote.show_unit_prices ? 'Sì' : 'No'}</p></div>
                                </div>
                                <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center gap-4">
                                    <div>
                                        <span className="block text-xs font-bold uppercase tracking-widest text-slate-500">Totale</span>
                                        {selectedQuote.discount_mode && Number(selectedQuote.original_total || 0) > Number(selectedQuote.total_amount || 0) && (
                                            <>
                                                <span className="block mt-1 text-sm text-slate-400 line-through">€{Number(selectedQuote.original_total).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                                <span className="block text-xs font-semibold text-amber-700">Sconto €{(Number(selectedQuote.original_total) - Number(selectedQuote.total_amount || 0)).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-2xl font-black text-[#7A0018]">€{Number(selectedQuote.total_amount || 0).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-[#E8E1D9] shadow-sm">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={16} className="text-[#7A0018]" /> Voci del preventivo ({selectedQuote.items?.length || 0})</h3>
                                {selectedQuote.items?.length ? (
                                    <div className="space-y-3">
                                        {selectedQuote.items.map((item, index) => (
                                            <div key={item.id || `${item.name}-${index}`} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D9]">
                                                <div className="flex justify-between items-start gap-3">
                                                    <p className="text-base font-bold text-slate-900">{item.name}</p>
                                                    {item.category && <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A0018] bg-[#7A0018]/5 px-2 py-1 rounded-full">{item.category === 'food' ? 'Cibo' : item.category === 'beverage' ? 'Bevande' : 'Allestimento'}</span>}
                                                </div>
                                                {item.description && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-slate-400 italic">Nessuna voce inserita.</p>}
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2"><MessageSquare size={16} className="text-[#7A0018]" /> Messaggio e note</h3>
                                <div className="bg-white p-6 rounded-xl border border-[#E8E1D9] shadow-sm">
                                    {selectedQuote.notes ? <p className="text-base text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedQuote.notes}</p> : <p className="text-sm text-slate-400 italic">Nessun messaggio o nota.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#E8E1D9] bg-white flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => setSelectedQuote(null)} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 text-xs font-bold uppercase tracking-widest">Chiudi</button>
                            <Link href={`/admin/luna-events/preventivi/${selectedQuote.id}`} className="px-5 py-2.5 bg-[#7A0018] text-white rounded-xl hover:bg-[#5C0012] transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm"><Eye size={16} /> Modifica preventivo</Link>
                        </div>
                    </div>
                </div>
            )}
            <LunaDialog
                open={dialog !== null}
                title={dialog?.title || ''}
                message={dialog?.message || ''}
                tone={dialog?.tone}
                confirmLabel={dialog?.confirmLabel}
                cancelLabel={dialog?.cancelLabel}
                showCancel={dialog?.showCancel}
                onConfirm={() => { void dialog?.onConfirm(); }}
                onCancel={() => setDialog(null)}
            />
        </div>
    );
}
