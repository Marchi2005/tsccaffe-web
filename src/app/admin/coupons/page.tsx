"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Ticket,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Edit2,
  Save,
  X,
  RefreshCw,
  Percent,
  Euro,
  CalendarDays,
  Users,
  AlertTriangle,
  Hotel,
  Printer
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { format } from "date-fns";
import { it } from "date-fns/locale";

// --- TIPO COUPON ---
type PromoCode = {
  id: string;
  code: string;
  discount_type: 'fixed_amount' | 'percentage';
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  min_order_value: number | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

type ThemeType = 'danger' | 'warning' | 'success' | 'info';

// Generatore di codici leggibili (No 0, O, 1, I, L)
const generateReadableCode = (prefix: string) => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix.toUpperCase()}-${code}` : code;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  
  // TABS: 'standard' | 'batch'
  const [activeTab, setActiveTab] = useState<'standard' | 'batch'>('standard');

  // Stati Form Standard
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "fixed_amount" | "percentage",
    discount_value: "",
    max_uses: "",
    expires_at: ""
  });

  // Stati Form Generatore B&B
  const [batchData, setBatchData] = useState({
    count: "10",
    prefix: "BB",
    discount_type: "fixed_amount" as "fixed_amount" | "percentage",
    discount_value: "5"
  });
  const [lastGeneratedBatch, setLastGeneratedBatch] = useState<PromoCode[]>([]);

  // Modali
  const [errorModal, setErrorModal] = useState<{isOpen: boolean, title: string, message: React.ReactNode}>({ isOpen: false, title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean; title: string; message: React.ReactNode; actionText: string; theme: ThemeType; onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', actionText: '', theme: 'info', onConfirm: () => {} });

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    if (error) console.error("Errore fetch coupon:", error);
    else setCoupons(data as PromoCode[]);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'code' ? value.toUpperCase().replace(/\s+/g, '') : value }));
  };

  const handleBatchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBatchData(prev => ({ ...prev, [name]: name === 'prefix' ? value.toUpperCase().replace(/[^A-Z]/g, '') : value }));
  };

  const startEditing = (coupon: PromoCode) => {
    setEditingId(coupon.id);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      max_uses: coupon.max_uses ? coupon.max_uses.toString() : "",
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ code: "", discount_type: "percentage", discount_value: "", max_uses: "", expires_at: "" });
  };

  // --- AZIONI DATABASE STANDARD ---
  const executeSave = async () => {
    const payload = {
      code: formData.code, discount_type: formData.discount_type, discount_value: parseFloat(formData.discount_value),
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null, expires_at: formData.expires_at ? formData.expires_at : null,
    };
    let error;
    if (editingId) {
      const res = await supabase.from('promo_codes').update(payload).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('promo_codes').insert([{ ...payload, is_active: true, current_uses: 0 }]);
      error = res.error;
    }

    if (error) setErrorModal({ isOpen: true, title: "Errore", message: error.message });
    else { cancelEditing(); fetchCoupons(); }
  };

  // --- AZIONI DATABASE BATCH (Generatore B&B) ---
  const executeBatchSave = async () => {
    const count = parseInt(batchData.count);
    const val = parseFloat(batchData.discount_value);
    
    // Generiamo l'array di nuovi coupon (tutti monouso)
    const newCoupons = Array.from({ length: count }).map(() => ({
      code: generateReadableCode(batchData.prefix),
      discount_type: batchData.discount_type,
      discount_value: val,
      max_uses: 1, // MONOUSO FORZATO
      current_uses: 0,
      expires_at: null,
      is_active: true
    }));

    const { data, error } = await supabase.from('promo_codes').insert(newCoupons).select();

    if (error) {
      setErrorModal({ isOpen: true, title: "Errore", message: error.message });
    } else {
      setLastGeneratedBatch(data as PromoCode[]);
      fetchCoupons();
      setBatchData(prev => ({ ...prev, count: "10" })); // reset count
    }
  };

  const executeDelete = async (id: string) => {
    const { error } = await supabase.from('promo_codes').delete().eq('id', id);
    if (error) {
      if (error.code === '23503' || error.message?.includes('foreign key')) {
        setErrorModal({ isOpen: true, title: "Azione Bloccata", message: "Coupon già usato in un ordine. Disattivalo invece di eliminarlo." });
      } else setErrorModal({ isOpen: true, title: "Errore", message: error.message });
    } else fetchCoupons();
  };

  const executeToggle = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('promo_codes').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) fetchCoupons();
  };

  // --- GESTORI BOTTONI MODALI ---
  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setConfirmModal({ isOpen: true, title: "Salva Modifiche", message: "Sicuro di voler sovrascrivere?", actionText: "Salva", theme: 'info', onConfirm: executeSave });
    } else {
      executeSave();
    }
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPerc = batchData.discount_type === 'percentage';
    setConfirmModal({
      isOpen: true,
      title: "Generazione Massiva",
      message: `Stai per generare ${batchData.count} codici MONOUSO univoci da ${isPerc ? batchData.discount_value+'%' : '€'+batchData.discount_value}. Procedo?`,
      actionText: "Genera Codici",
      theme: 'success',
      onConfirm: executeBatchSave
    });
  };

  const handleDeleteClick = (id: string) => {
    setConfirmModal({ isOpen: true, title: "Elimina", message: "Azione irreversibile.", actionText: "Elimina", theme: 'danger', onConfirm: () => executeDelete(id) });
  };

  const handleToggleClick = (id: string, currentStatus: boolean) => {
    setConfirmModal({ isOpen: true, title: !currentStatus ? "Attiva" : "Disattiva", message: "Confermi?", actionText: "Sì, procedi", theme: !currentStatus ? 'success' : 'warning', onConfirm: () => executeToggle(id, currentStatus) });
  };

  const getThemeConfig = (theme: ThemeType) => {
    switch(theme) {
      case 'danger': return { icon: <Trash2 size={26}/>, bg: 'bg-red-100/60', border: 'border-red-200', text: 'text-red-700', btn: 'bg-red-600 hover:bg-red-700 shadow-red-600/20', grad: 'from-red-200/40' };
      case 'warning': return { icon: <XCircle size={26}/>, bg: 'bg-amber-100/60', border: 'border-amber-200', text: 'text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20', grad: 'from-amber-200/40' };
      case 'success': return { icon: <CheckCircle2 size={26}/>, bg: 'bg-emerald-100/60', border: 'border-emerald-200', text: 'text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20', grad: 'from-emerald-200/40' };
      case 'info': return { icon: <Save size={26}/>, bg: 'bg-blue-100/60', border: 'border-blue-200', text: 'text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20', grad: 'from-blue-200/40' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 relative">
      
      {/* 🖨️ SEZIONE DI STAMPA (Visibile SOLO durante window.print()) */}
      <div className="hidden print:block bg-white text-black p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black uppercase">Buoni Colazione / B&B</h1>
          <p className="text-sm text-gray-500">Codici monouso da inserire in fase di checkout sul sito.</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {lastGeneratedBatch.map((coupon) => (
            <div 
              key={coupon.id} 
              className="border-2 border-black border-dashed p-6 rounded-xl flex flex-col items-center justify-center text-center break-inside-avoid"
              style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
            >
              <span className="text-sm font-bold uppercase mb-2 tracking-widest text-gray-500">Codice Sconto Web</span>
              <div className="text-3xl font-mono font-black border-4 border-black px-4 py-2 rounded-lg mb-2">
                {coupon.code}
              </div>
              <div className="text-lg font-bold">
                Valore: {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `€${coupon.discount_value.toFixed(2)}`}
              </div>
              <p className="text-[10px] mt-2 uppercase text-gray-500 font-bold">Valido per 1 solo utilizzo. Inserisci nel carrello.</p>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:hidden">

        {/* HEADER */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition">
                <ArrowLeft size={20} className="text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
                  <Ticket className="text-rose-600" /> Coupon & Sconti
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Gestione codici promo e generazione massiva per B&B.
                </p>
              </div>
            </div>
            <button onClick={fetchCoupons} className="flex justify-center items-center gap-2 px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-100 font-bold shadow-sm text-sm active:scale-95 transition-transform w-full md:w-auto">
              <RefreshCw size={16} className={clsx(loading && "animate-spin")} /> Aggiorna Lista
            </button>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl mb-6 w-fit border border-slate-200">
          <button 
            onClick={() => setActiveTab('standard')} 
            className={clsx("flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all", activeTab === 'standard' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <Ticket size={16} /> Gestione Standard
          </button>
          <button 
            onClick={() => setActiveTab('batch')} 
            className={clsx("flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all", activeTab === 'batch' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <Hotel size={16} /> Generatore B&B
          </button>
        </div>

        {/* --- FORM STANDARD --- */}
        {activeTab === 'standard' && (
          <div className="bg-slate-100/50 p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 transition-all relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {editingId && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse" />}
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                  {editingId ? <Edit2 size={16} /> : <Ticket size={16} />}
                  {editingId ? "Modifica Coupon Standard" : "Crea Coupon Singolo"}
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                  {editingId 
                    ? "Modifica i parametri del coupon selezionato. Fai attenzione alle date di scadenza e al limite di utilizzi."
                    : "Crea un nuovo codice sconto standard da condividere con i tuoi clienti. Puoi renderlo monouso o infinito."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveClick} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Codice Sconto</label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} required placeholder="Es: ESTATE24" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 transition-colors uppercase font-mono font-bold text-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Tipo Sconto</label>
                  <select name="discount_type" value={formData.discount_type} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 transition-colors font-medium">
                    <option value="percentage">Sconto %</option>
                    <option value="fixed_amount">Sconto Fisso (€)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Valore</label>
                  <input type="number" step="0.1" name="discount_value" value={formData.discount_value} onChange={handleInputChange} required placeholder="Es: 10" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 transition-colors font-bold text-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Max Utilizzi (Opz)</label>
                  <input type="number" name="max_uses" value={formData.max_uses} onChange={handleInputChange} placeholder="Infiniti" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 transition-colors font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Scadenza (Opz)</label>
                  <input type="date" name="expires_at" value={formData.expires_at} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 transition-colors font-medium text-slate-600" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold shadow-sm shadow-slate-900/20 transition-all active:scale-95">
                  {editingId ? <><Save size={18} /> Salva Modifiche</> : <><Plus size={18} /> Crea Coupon</>}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEditing} className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3.5 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold transition-all active:scale-95 shadow-sm">
                    <X size={18} /> Annulla
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* --- FORM BATCH B&B --- */}
        {activeTab === 'batch' && (
          <div className="bg-rose-50/50 p-6 rounded-2xl shadow-sm border border-rose-100 mb-8 transition-all animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-rose-900 flex items-center gap-2 uppercase tracking-wider">
                  <Hotel size={16} /> Generatore Coupon B&B
                </h2>
                <p className="text-xs text-rose-700 mt-1 max-w-xl leading-relaxed">
                  Genera multipli codici monouso casuali (es: BB-K9A2M). Ottimo per creare buoni colazione prepagati da fornire ai Bed & Breakfast o per eventi speciali.
                </p>
              </div>
            </div>

            <form onSubmit={handleBatchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-rose-100 shadow-sm">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Quantità</label>
                  <input type="number" min="1" max="100" name="count" value={batchData.count} onChange={handleBatchInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-colors font-bold text-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Prefisso (Opz)</label>
                  <input type="text" maxLength={4} name="prefix" value={batchData.prefix} onChange={handleBatchInputChange} placeholder="BB" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-colors uppercase font-mono font-bold text-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Tipo Sconto</label>
                  <select name="discount_type" value={batchData.discount_type} onChange={handleBatchInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-colors font-medium">
                    <option value="fixed_amount">Sconto Fisso (€)</option>
                    <option value="percentage">Sconto %</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Valore</label>
                  <input type="number" step="0.1" name="discount_value" value={batchData.discount_value} onChange={handleBatchInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-colors font-bold text-slate-700" />
                </div>
              </div>
              <button type="submit" className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-bold shadow-sm shadow-rose-600/20 transition-all active:scale-95">
                <Plus size={18} /> Genera Codici
              </button>
            </form>

            {/* SEZIONE STAMPA DOPO LA GENERAZIONE */}
            {lastGeneratedBatch.length > 0 && (
              <div className="mt-6 p-5 bg-white border border-rose-200 rounded-xl animate-in zoom-in-95 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-rose-800 font-bold">
                    <CheckCircle2 className="text-emerald-500" /> {lastGeneratedBatch.length} Codici Generati con successo!
                  </div>
                  <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm">
                    <Printer size={16} /> Stampa Etichette
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {lastGeneratedBatch.slice(0, 5).map(c => (
                    <span key={c.id} className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-md font-mono text-sm font-bold text-slate-700 whitespace-nowrap">{c.code}</span>
                  ))}
                  {lastGeneratedBatch.length > 5 && <span className="px-3 py-1 text-slate-400 font-medium text-sm">...altri {lastGeneratedBatch.length - 5}</span>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- LISTA COUPON --- */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Tutti i Coupon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coupons.length === 0 && !loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
              <Ticket size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium">Nessun coupon creato finora.</p>
            </div>
          ) : (
            coupons.map((coupon) => {
              const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
              const isDepleted = coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses;
              const isActive = coupon.is_active && !isExpired && !isDepleted;

              return (
                <div key={coupon.id} className={clsx("bg-white rounded-2xl border shadow-sm relative overflow-hidden flex flex-col transition-all", isActive ? "border-slate-200" : "border-slate-100 opacity-75 bg-slate-50")}>
                  <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5", isActive ? "bg-emerald-400" : "bg-slate-300")} />

                  <div className="p-4 flex justify-between items-start pl-5 border-b border-slate-50">
                    <div>
                      <h3 className="font-mono font-black text-xl text-slate-900 tracking-tight flex items-center gap-2">
                        {coupon.code}
                        {coupon.max_uses === 1 && <span className="bg-rose-100 text-rose-700 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest leading-none">Monouso</span>}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {isActive ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                            <CheckCircle2 size={10} /> Attivo
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase">
                            <XCircle size={10} /> {isExpired ? "Scaduto" : isDepleted ? "Usato/Esaurito" : "Disattivo"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1 font-black shrink-0">
                      {coupon.discount_type === 'percentage' ? <Percent size={14} /> : <Euro size={14} />}
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `€${coupon.discount_value.toFixed(2)}`}
                    </div>
                  </div>

                  <div className="px-5 py-4 flex-grow grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Users size={12}/> Utilizzi</span>
                      <span className="font-medium text-slate-700">
                        {coupon.current_uses} / {coupon.max_uses ? coupon.max_uses : "∞"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><CalendarDays size={12}/> Scadenza</span>
                      <span className="font-medium text-slate-700">
                        {coupon.expires_at ? format(new Date(coupon.expires_at), "d MMM yyyy", { locale: it }) : "Nessuna"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border-t border-slate-100 grid grid-cols-3 gap-2 pl-5">
                    <button onClick={() => handleToggleClick(coupon.id, coupon.is_active)} className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all uppercase">
                      {coupon.is_active ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                      {coupon.is_active ? "Disattiva" : "Attiva"}
                    </button>
                    <button onClick={() => startEditing(coupon)} className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-white hover:text-blue-600 border border-transparent hover:border-slate-200 transition-all uppercase">
                      <Edit2 size={14} /> Modifica
                    </button>
                    <button onClick={() => handleDeleteClick(coupon.id)} className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-white hover:text-red-600 border border-transparent hover:border-red-200 transition-all uppercase">
                      <Trash2 size={14} /> Elimina
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </main>

      {/* --- MODALE CONFERMA --- */}
      {confirmModal.isOpen && (() => {
        const themeConfig = getThemeConfig(confirmModal.theme);
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 print:hidden">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] animate-in fade-in duration-500" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} />
            <div className="relative bg-white/40 backdrop-blur-3xl border border-white/60 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 rounded-[30px] w-full max-w-lg">
              <div className={`absolute inset-0 bg-gradient-to-b ${themeConfig.grad} to-transparent z-0 pointer-events-none`} />
              <div className="relative z-10 flex flex-col w-full h-full p-8 sm:p-10 pb-6 items-center">
                <div className={clsx("w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 shadow-sm border bg-white/60", themeConfig.bg, themeConfig.border, themeConfig.text)}>
                  {themeConfig.icon}
                </div>
                <h2 className="text-xl sm:text-[22px] font-extrabold text-slate-900 mb-4 text-center tracking-tight leading-snug">{confirmModal.title}</h2>
                <div className="text-[15px] sm:text-base text-slate-700 leading-relaxed text-center font-medium w-full max-w-[420px] whitespace-pre-wrap">{confirmModal.message}</div>
                <div className="mt-8 flex flex-col sm:flex-row w-full gap-3 justify-center">
                  <button onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} className="px-8 py-3.5 bg-white text-slate-700 font-bold rounded-[18px] hover:bg-slate-50 border border-slate-200 transition-all active:scale-[0.98] shadow-sm w-full sm:w-auto">Annulla</button>
                  <button onClick={() => { setConfirmModal(prev => ({ ...prev, isOpen: false })); confirmModal.onConfirm(); }} className={clsx("px-8 py-3.5 text-white font-bold rounded-[18px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl w-full sm:w-auto", themeConfig.btn)}>
                    {confirmModal.actionText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- MODALE ERRORE --- */}
      {errorModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 print:hidden">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] animate-in fade-in duration-500" onClick={() => setErrorModal({ isOpen: false, title: '', message: '' })} />
          <div className="relative bg-white/40 backdrop-blur-3xl border border-white/60 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 rounded-[30px] w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-red-200/40 to-transparent z-0 pointer-events-none" />
            <div className="relative z-10 flex flex-col w-full h-full p-8 sm:p-10 pb-4 items-center">
              <div className="w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 shadow-sm border bg-red-100/60 border-red-200 text-red-700">
                <AlertTriangle size={26} strokeWidth={2} />
              </div>
              <h2 className="text-xl sm:text-[22px] font-extrabold text-slate-900 mb-4 text-center tracking-tight leading-snug">{errorModal.title}</h2>
              <div className="text-[15px] sm:text-base text-slate-700 leading-relaxed text-center font-medium w-full max-w-[420px] whitespace-pre-wrap">{errorModal.message}</div>
              <div className="mt-8 mb-4 w-full flex justify-center">
                <button onClick={() => setErrorModal({ isOpen: false, title: '', message: '' })} className="px-14 py-3.5 bg-[#0A1128] text-white font-bold rounded-[18px] hover:bg-[#152040] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#0A1128]/20">Ho capito</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}