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

export default function LunaPreventiviList() {
    const [leads, setLeads] = useState<LunaLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<LunaLead | null>(null);
    
    // STATO PER IL CARICAMENTO DURANTE L'AGGIORNAMENTO DELLO STATO
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

    // --- FETCH DATA ---
    const fetchLeads = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setLoading(true);

        try {
            let query = supabase
                .from('luna_preventivi')
                .select('*, quotes(quote_number)')
                .order('created_at', { ascending: false });

            if (searchTerm) {
                query = query.or(`customer_name.ilike.%${searchTerm}%,event_type.ilike.%${searchTerm}%`);
            }

            if (statusFilter !== "all") {
                query = query.eq('status', statusFilter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setLeads((data as LunaLead[]) || []);
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

    // --- UPDATE STATUS HANDLER (FUNZIONE AGGIUNTA) ---
    const handleUpdateStatus = async (id: string, newStatus: LunaLead['status']) => {
        setUpdatingStatusId(id);
        try {
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
            alert("Errore durante il salvataggio dello stato nel database.");
        } finally {
            setUpdatingStatusId(null);
        }
    };

    // --- DELETE HANDLER ---
    const handleDelete = async (id: string) => {
        if (!window.confirm("Sei sicuro di voler eliminare questa richiesta?")) return;
        if (!window.confirm("ATTENZIONE: Eliminazione definitiva. Procedere?")) return;
        
        setDeletingId(id);
        try {
            const { error } = await supabase.from('luna_preventivi').delete().eq('id', id);
            if (error) throw error;
            setLeads(prev => prev.filter(l => l.id !== id));
            if (selectedLead?.id === id) setSelectedLead(null); 
        } catch (err) {
            console.error("Errore cancellazione:", err);
            alert("Errore durante l'eliminazione");
        } finally {
            setDeletingId(null);
        }
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
                        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-2">Richieste Preventivi</h1>
                        <p className="text-slate-500 text-sm">Gestisci i contatti ricevuti dal sito web di Luna Events.</p>
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
                            type="text" placeholder="Cerca per Nome o Evento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
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
                ) : leads.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-[#E8E1D9] rounded-2xl bg-white/50">
                        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl text-slate-900 font-serif mb-2">Nessuna richiesta trovata</h3>
                        <p className="text-slate-500 text-sm">Non ci sono preventivi per i filtri selezionati.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leads.map((lead) => {
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
        </div>
    );
}