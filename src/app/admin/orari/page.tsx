"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, Clock, CalendarX2, Info, CheckCircle2, AlertCircle, X, CalendarRange } from "lucide-react";
import { getSchedules, updateWeeklyHours, deleteSpecialClosure, addMultipleSpecialClosures } from "./actions";

const daysMap = [
  { id: 1, name: "Lunedì" },
  { id: 2, name: "Martedì" },
  { id: 3, name: "Mercoledì" },
  { id: 4, name: "Giovedì" },
  { id: 5, name: "Venerdì" },
  { id: 6, name: "Sabato" },
  { id: 0, name: "Domenica" } 
];

// Funzione helper per calcolare tutte le date tra due giorni
function getDatesInRange(startStr: string, endStr: string) {
  const dates = [];
  let currentDate = new Date(startStr);
  const stopDate = new Date(endStr);
  
  while (currentDate <= stopDate) {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export default function OrariAdminPage() {
  const [weekly, setWeekly] = useState<any[]>([]);
  const [special, setSpecial] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form Chiusure Straordinarie (Range o Singola)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newReason, setNewReason] = useState("");

  // Stato Globale per il Modale Custom
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const showModal = (type: "success" | "error" | "confirm", title: string, message: string, onConfirm?: () => void) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };
  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { weekly, special } = await getSchedules();
      const formattedWeekly = daysMap.map(d => {
        const existing = weekly?.find(w => w.day_of_week === d.id);
        return existing || { day_of_week: d.id, is_closed: false, morning_open: "06:30:00", morning_close: "13:30:00", afternoon_open: "15:30:00", afternoon_close: "20:00:00" };
      });
      setWeekly(formattedWeekly);
      setSpecial(special || []);
    } catch (error) {
      showModal("error", "Errore Critico", "Impossibile caricare i dati dal database.");
    }
    setIsLoading(false);
  };

  const handleWeeklyChange = (dayId: number, field: string, value: any) => {
    setWeekly(prev => prev.map(day => 
      day.day_of_week === dayId ? { ...day, [field]: value } : day
    ));
  };

  const saveWeekly = async () => {
    setIsSaving(true);
    try {
      await updateWeeklyHours(weekly);
      showModal("success", "Salvataggio Completato", "Gli orari settimanali sono stati aggiornati e sono online.");
    } catch (error) {
      showModal("error", "Errore", "C'è stato un problema durante il salvataggio.");
    }
    setIsSaving(false);
  };

  const handleAddSpecial = async () => {
    if (!startDate) return showModal("error", "Dati Mancanti", "Inserisci almeno la data di inizio.");

    try {
      const reason = newReason || "CHIUSO";
      let datesToInsert = [];

      // Se l'utente ha inserito anche la data di fine, calcoliamo il range
      if (endDate) {
        if (new Date(endDate) < new Date(startDate)) {
          return showModal("error", "Errore Date", "La data di fine non può essere precedente a quella di inizio!");
        }
        const dates = getDatesInRange(startDate, endDate);
        datesToInsert = dates.map(d => ({ closure_date: d, reason }));
      } else {
        // Altrimenti, singola data
        datesToInsert = [{ closure_date: startDate, reason }];
      }

      await addMultipleSpecialClosures(datesToInsert);
      
      setStartDate("");
      setEndDate("");
      setNewReason("");
      fetchData();
      
      showModal("success", "Aggiunto", `${datesToInsert.length} ${datesToInsert.length > 1 ? 'date aggiunte' : 'data aggiunta'} con successo.`);
    } catch (error) {
      showModal("error", "Errore Server", "Impossibile aggiungere le date speciali.");
    }
  };

  const handleDeleteSpecial = (id: number) => {
    showModal("confirm", "Attenzione", "Sei sicuro di voler eliminare questa regola speciale?", async () => {
      try {
        await deleteSpecialClosure(id);
        fetchData();
        showModal("success", "Cancellato", "La data è stata rimossa con successo.");
      } catch (error) {
        showModal("error", "Errore", "Impossibile eliminare la data.");
      }
    });
  };

  if (isLoading) return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Caricamento orari...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-medium">
            <ArrowLeft size={16} /> Torna alla Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Clock className="text-indigo-600" /> Gestione Orari
          </h1>
          <p className="text-slate-500 mt-2">
            Gestisci la settimana standard e imposta ferie/festività. Le modifiche sono istantanee sul sito.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* SEZIONE 1: ORARI SETTIMANALI */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Orari Settimanali Standard</h2>
              <button 
                onClick={saveWeekly}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-200"
              >
                <Save size={18} />
                {isSaving ? "Salvataggio..." : "Salva Modifiche"}
              </button>
            </div>

            <div className="space-y-4">
              {weekly.map((day) => {
                const dayName = daysMap.find(d => d.id === day.day_of_week)?.name;
                return (
                  <div key={day.day_of_week} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-2xl border transition-colors ${day.is_closed ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="w-40 mb-3 md:mb-0 flex flex-col">
                      <span className="font-bold text-slate-700">{dayName}</span>
                      <label className="flex items-center gap-2 mt-1 cursor-pointer w-max">
                        <input type="checkbox" checked={day.is_closed} onChange={(e) => handleWeeklyChange(day.day_of_week, 'is_closed', e.target.checked)} className="w-4 h-4 rounded text-red-600 focus:ring-red-500" />
                        <span className="text-xs text-slate-500 font-medium">Giorno di riposo</span>
                      </label>
                    </div>

                    <div className={`flex flex-wrap gap-4 items-center ${day.is_closed ? 'opacity-30 pointer-events-none' : ''}`}>
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-xs text-slate-400 font-bold uppercase w-12">Matt</span>
                        <input type="time" value={day.morning_open ? day.morning_open.substring(0,5) : ''} onChange={(e) => handleWeeklyChange(day.day_of_week, 'morning_open', e.target.value)} className="text-sm font-medium text-slate-700 outline-none w-[70px] bg-transparent" />
                        <span className="text-slate-300">-</span>
                        <input type="time" value={day.morning_close ? day.morning_close.substring(0,5) : ''} onChange={(e) => handleWeeklyChange(day.day_of_week, 'morning_close', e.target.value)} className="text-sm font-medium text-slate-700 outline-none w-[70px] bg-transparent" />
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-xs text-slate-400 font-bold uppercase w-12">Pom</span>
                        <input type="time" value={day.afternoon_open ? day.afternoon_open.substring(0,5) : ''} onChange={(e) => handleWeeklyChange(day.day_of_week, 'afternoon_open', e.target.value)} className="text-sm font-medium text-slate-700 outline-none w-[70px] bg-transparent" />
                        <span className="text-slate-300">-</span>
                        <input type="time" value={day.afternoon_close ? day.afternoon_close.substring(0,5) : ''} onChange={(e) => handleWeeklyChange(day.day_of_week, 'afternoon_close', e.target.value)} className="text-sm font-medium text-slate-700 outline-none w-[70px] bg-transparent" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SEZIONE 2: CHIUSURE STRAORDINARIE / FESTIVITÀ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <CalendarX2 className="text-rose-500" /> Date Speciali, Ferie e Festività
            </h2>
            <p className="text-sm text-slate-500 mb-6">Aggiungi una data singola o un periodo di chiusura (es: Ferie). Seleziona sia la data di inizio che quella di fine.</p>

            {/* Aggiungi Date - FORM */}
            <div className="flex flex-col md:flex-row gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 items-end">
              <div className="w-full md:w-auto">
                <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Dal giorno</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div className="w-full md:w-auto relative">
                <label className="text-xs font-bold text-slate-500 mb-1 block uppercase flex items-center gap-1">Al giorno <span className="text-[10px] text-slate-400 normal-case">(Opzionale)</span></label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Motivo (visibile al pubblico)</label>
                <input type="text" placeholder="Es: CHIUSO PER FERIE, oppure 08:00 - 13:00" value={newReason} onChange={(e) => setNewReason(e.target.value)} className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <button onClick={handleAddSpecial} className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                <Plus size={18} /> Aggiungi
              </button>
            </div>

            {/* Lista Esistenti */}
            {special.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <CalendarRange size={32} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">Nessuna data speciale impostata.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {special.map((sp) => (
                  <div key={sp.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-rose-200 hover:shadow-md transition-all group">
                    <div>
                      <div className="font-bold text-slate-800 capitalize">
                        {new Date(sp.closure_date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                      <div className="text-xs text-rose-600 font-bold mt-1 bg-rose-50 px-2 py-0.5 rounded-full inline-block">{sp.reason || "CHIUSO"}</div>
                    </div>
                    <button onClick={() => handleDeleteSpecial(sp.id)} className="p-2.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100" title="Elimina">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALE CUSTOM OVERLAY */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4">
              {modal.type === "success" && <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><CheckCircle2 size={24} /></div>}
              {modal.type === "error" && <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0"><AlertCircle size={24} /></div>}
              {modal.type === "confirm" && <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><AlertCircle size={24} /></div>}
              
              <div>
                <h3 className="text-lg font-bold text-slate-900">{modal.title}</h3>
                <p className="text-sm text-slate-500 leading-tight mt-1">{modal.message}</p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {modal.type === "confirm" ? (
                <>
                  <button onClick={closeModal} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-bold transition-colors">
                    Annulla
                  </button>
                  <button onClick={() => { modal.onConfirm?.(); closeModal(); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                    Sì, Elimina
                  </button>
                </>
              ) : (
                <button onClick={closeModal} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Ho capito
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}