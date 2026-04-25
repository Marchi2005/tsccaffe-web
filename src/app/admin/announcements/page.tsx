// src/app/admin/announcements/page.tsx
"use client";

import { useState, useEffect, useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { 
  ArrowLeft, 
  Megaphone, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  Calendar,
  Clock
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { createAnnouncement, deactivateAnnouncement } from "./actions";

// Estraiamo il client FUORI dal componente per evitare istanze multiple
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
    >
      {pending ? "Creazione in corso..." : "Pubblica Annuncio"}
    </button>
  );
}

export default function AnnouncementsAdminPage() {
  const [state, formAction] = useActionState(createAnnouncement, null);
  const [activeAnnouncements, setActiveAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      const { data } = await supabase
        .from('site_announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) setActiveAnnouncements(data);
      setIsLoading(false);
    }
    
    fetchAnnouncements();
  }, [state]); 

  const handleDeactivate = async (id: string) => {
    if(!confirm("Sei sicuro di voler disattivare questo avviso?")) return;
    await deactivateAnnouncement(id);
    setActiveAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Torna alla Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Megaphone size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestione Avvisi & Popup</h1>
              <p className="text-slate-500 mt-1">Crea e gestisci le comunicazioni per i clienti del bar e tabacchi.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Nuovo Avviso</h2>
              
              <form action={formAction} className="space-y-5">
                
                {state?.error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100 text-sm">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p className="font-medium">{state.error}</p>
                  </div>
                )}
                {state?.success && (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-start gap-3 border border-emerald-100 text-sm">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <p className="font-medium">{state.message}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Titolo Avviso</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    placeholder="Es. Chiusura Straordinaria per Lavori" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Categoria</label>
                  <select 
                    name="category" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Seleziona una categoria...</option>
                    <option value="Chiusura Straordinaria">Chiusura Straordinaria</option>
                    <option value="Ferie">Ferie</option>
                    <option value="Offerta Momento">Offerta del Momento</option>
                    <option value="Evento">Evento Speciale</option>
                    <option value="Promo Colazione">Promo Colazione</option>
                    <option value="Promo Aperitivo">Promo Aperitivo</option>
                    <option value="Guasto Servizi Tabacchi">Guasto Servizi Tabacchi (Lottomatica/Poste)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Descrizione (Messaggio per i clienti)</label>
                  <textarea 
                    name="description" 
                    required 
                    rows={4}
                    placeholder="Scrivi qui i dettagli..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Data e Ora Inizio</label>
                    <input 
                      type="datetime-local" 
                      name="start_at" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Data e Ora Fine</label>
                    <input 
                      type="datetime-local" 
                      name="end_at" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <SubmitButton />
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Avvisi Attivi/Programmati
            </h3>

            {isLoading ? (
              <div className="text-slate-400 text-sm py-4">Caricamento avvisi...</div>
            ) : activeAnnouncements.length === 0 ? (
              <div className="bg-slate-100/50 border border-slate-200 border-dashed rounded-2xl p-8 text-center text-slate-500 text-sm">
                Nessun avviso attivo al momento.
              </div>
            ) : (
              <div className="space-y-4">
                {activeAnnouncements.map((announcement) => {
                  
                  const start = new Date(announcement.start_at);
                  const end = new Date(announcement.end_at);
                  const isCurrentlyLive = start <= new Date() && end >= new Date();

                  return (
                    <div key={announcement.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group">
                      
                      <div className="absolute -top-2.5 -right-2.5">
                        {isCurrentlyLive ? (
                          <span className="bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Live
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Programmato
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-violet-600 mb-1">{announcement.category}</div>
                      <h4 className="font-bold text-slate-900 mb-2 leading-tight">{announcement.title}</h4>
                      
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <Calendar size={12} />
                          Da: {start.toLocaleDateString("it-IT", { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <Clock size={12} />
                          A: {end.toLocaleDateString("it-IT", { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeactivate(announcement.id)}
                        className="w-full flex justify-center items-center gap-2 py-2 rounded-lg bg-slate-50 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-xs font-bold border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={14} /> Disattiva Avviso
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}