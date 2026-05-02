"use client";

import React, { useEffect, useState } from "react";
// UTILIZZIAMO IL TUO CLIENT CENTRALIZZATO
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Save,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  Banknote,
  CreditCard,
  Nfc,
  Info
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

type PaymentMethod = {
  id: string;
  name: string;
  icon_name: string;
};

type QuickService = {
  id: string;
  title: string;
  description: string;
  status: 'available' | 'unavailable';
  sort_order: number;
  payment_methods: { payment_method: PaymentMethod }[];
};

export default function AdminQuickServicesPage() {
  const [services, setServices] = useState<QuickService[]>([]);
  const [allPaymentMethods, setAllPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Metodi di pagamento
      const { data: pmData } = await supabase.from('payment_methods').select('*');
      if (pmData) setAllPaymentMethods(pmData);

      // 2. Servizi con relazioni
      const { data, error } = await supabase
        .from('quick_services')
        .select(`
          *,
          payment_methods:service_payment_methods(
            payment_method:payment_methods(*)
          )
        `)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServices(data as any[]);
    } catch (err) {
      console.error("Errore fetch dati:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTextChange = (id: string, field: 'title' | 'description', value: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const togglePaymentMethod = async (serviceId: string, methodId: string, isCurrentlyActive: boolean) => {
    try {
      if (isCurrentlyActive) {
        await supabase.from('service_payment_methods')
          .delete()
          .eq('service_id', serviceId)
          .eq('payment_method_id', methodId);
      } else {
        await supabase.from('service_payment_methods')
          .insert({ service_id: serviceId, payment_method_id: methodId });
      }
      // Ricarichiamo i dati per aggiornare i badge
      fetchData();
    } catch (err) {
      console.error("Errore toggle pagamento:", err);
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'available' ? 'unavailable' : 'available';
    const { error } = await supabase
      .from('quick_services')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) fetchData();
  };

  const saveService = async (service: QuickService) => {
    setSavingId(service.id);
    const { error } = await supabase
      .from('quick_services')
      .update({
        title: service.title,
        description: service.description
      })
      .eq('id', service.id);

    if (error) alert("Errore nel salvataggio");
    setSavingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition">
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
                <ShieldCheck className="text-cyan-600" /> Servizi Rapidi
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Testi e Metodi di Pagamento</p>
            </div>
          </div>
          <button onClick={fetchData} className="flex justify-center items-center gap-2 px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-100 font-bold shadow-sm text-sm active:scale-95 transition-all">
            <RefreshCw size={16} className={clsx(loading && "animate-spin")} /> Aggiorna Lista
          </button>
        </div>

        {/* LISTA SERVIZI */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
               <RefreshCw className="animate-spin mb-2" />
               <p className="font-bold">Caricamento...</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row transition-all hover:border-slate-300">
                
                {/* PARTE SINISTRA: TESTI */}
                <div className="p-6 lg:p-8 flex-grow border-b lg:border-b-0 lg:border-r border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <LayoutGrid size={12}/> {service.id.split('-')[0]}
                    </span>
                    <button 
                      onClick={() => toggleStatus(service.id, service.status)}
                      className={clsx(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border transition-all",
                        service.status === 'available' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                      )}
                    >
                      {service.status === 'available' ? "● Attivo" : "○ Disattivato"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Titolo Servizio</label>
                      <input 
                        type="text" 
                        value={service.title}
                        onChange={(e) => handleTextChange(service.id, 'title', e.target.value)}
                        className="text-xl font-bold text-slate-900 w-full bg-slate-50 border-transparent focus:border-cyan-500 focus:bg-white rounded-xl px-4 py-2 transition-all mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Descrizione (Cosa facciamo)</label>
                      <textarea 
                        value={service.description}
                        onChange={(e) => handleTextChange(service.id, 'description', e.target.value)}
                        rows={2}
                        className="text-sm text-slate-600 w-full bg-slate-50 border-transparent focus:border-cyan-500 focus:bg-white rounded-xl px-4 py-2 transition-all mt-1 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* PARTE DESTRA: PAGAMENTI E SALVA */}
                <div className="p-6 lg:p-8 bg-slate-50/50 w-full lg:w-96 flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1">
                      <Banknote size={12}/> Metodi Accettati
                    </h3>
                    <div className="flex flex-col gap-2">
                      {allPaymentMethods.map(method => {
                        const isActive = service.payment_methods.some(pm => pm.payment_method?.id === method.id);
                        const Icon = method.icon_name === 'Banknote' ? Banknote : method.icon_name === 'CreditCard' ? CreditCard : Nfc;

                        return (
                          <button
                            key={method.id}
                            onClick={() => togglePaymentMethod(service.id, method.id, isActive)}
                            className={clsx(
                              "flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all",
                              isActive 
                                ? "bg-white border-slate-900 text-slate-900 shadow-sm" 
                                : "bg-slate-100 border-transparent text-slate-400 hover:border-slate-200"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={18} />
                              {method.name}
                            </div>
                            {isActive ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    onClick={() => saveService(service)}
                    disabled={savingId === service.id}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-slate-900/10"
                  >
                    {savingId === service.id ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                    Salva Testi
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* HELP */}
        <div className="mt-8 flex items-start gap-3 p-4 bg-cyan-50 border border-cyan-100 rounded-2xl text-cyan-700">
           <Info size={20} className="shrink-0 mt-0.5" />
           <p className="text-xs leading-relaxed">
              <strong>Consiglio:</strong> Se un servizio accetta solo contanti, deseleziona Carte e Apple/Google Pay. Il sito mostrerà automaticamente il badge arancione "Solo Contanti" per avvisare i clienti.
           </p>
        </div>

      </main>
    </div>
  );
}