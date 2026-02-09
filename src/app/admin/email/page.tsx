"use client";

import { useState, useEffect } from "react";
import { 
  Send, Lock, User, Mail, FileText, CheckCircle, AlertCircle, 
  Loader2, Briefcase, Headphones, History, RefreshCw, 
  ArrowLeft, Sparkles 
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import clsx from "clsx";
import Link from "next/link";
import localFont from 'next/font/local';

// --- CONFIGURAZIONE FONT LUNA ---
const lunaFont = localFont({
    src: [
        {
            path: '../../../fonts/mending.regular.otf', // Percorso relativo alla cartella src/fonts
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-luna',
});

// Definiamo il tipo per il Log
type EmailLog = {
  id: number;
  created_at: string;
  recipient: string;
  subject: string;
  sender_type: string;
  status: string;
};

export default function ScriviEmail() {
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');
  
  // Stati per l'invio
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });
  const [senderType, setSenderType] = useState('info'); // 'info' | 'supporto' | 'luna'

  // Stati per lo storico
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Inizializza Supabase Client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- LOGICA COLORI E TEMA ---
  const isLuna = senderType === 'luna';

  // Helper per classi dinamiche in base al sender
  const getThemeClasses = () => {
    if (senderType === 'luna') return {
      bgApp: "bg-[#050A18]", // Blu notte profondo
      bgCard: "bg-[#0A1125]/90 border-[#C4A052]/20 text-slate-100",
      accentText: "text-[#C4A052]",
      inputBg: "bg-[#050A18] border-slate-700 text-white placeholder:text-slate-500",
      ringFocus: "focus:ring-[#C4A052]/50 focus:border-[#C4A052]",
      btnPrimary: "bg-gradient-to-r from-[#C4A052] to-[#A08035] text-[#050A18] hover:shadow-[0_0_20px_rgba(196,160,82,0.4)] border border-[#C4A052]",
      iconColor: "text-[#C4A052]"
    };
    if (senderType === 'supporto') return {
      bgApp: "bg-slate-50",
      bgCard: "bg-white/80 border-slate-100 text-slate-900",
      accentText: "text-[#06b6d4]",
      inputBg: "bg-slate-50 border-slate-200 text-slate-900",
      ringFocus: "focus:ring-[#06b6d4]/50 focus:border-[#06b6d4]",
      btnPrimary: "bg-[#06b6d4] text-white hover:bg-cyan-600",
      iconColor: "text-[#06b6d4]"
    };
    // Default (Info/Admin)
    return {
      bgApp: "bg-slate-50",
      bgCard: "bg-white/80 border-slate-100 text-slate-900",
      accentText: "text-slate-900",
      inputBg: "bg-slate-50 border-slate-200 text-slate-900",
      ringFocus: "focus:ring-slate-900/50 focus:border-slate-900",
      btnPrimary: "bg-slate-900 text-white hover:bg-slate-800",
      iconColor: "text-slate-900"
    };
  };

  const theme = getThemeClasses();

  // Funzione per inviare
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: '' });

    const formData = {
      to: e.target.to.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
      senderType: senderType,
    };

    try {
      const res = await fetch('/api/invia-email', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Email inviata e salvata!' });
        e.target.reset(); 
        fetchLogs(); 
      } else {
        setStatus({ type: 'error', msg: 'Errore durante l\'invio.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Errore di connessione.' });
    }
    setLoading(false);
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setLogs(data);
    }
    setLoadingLogs(false);
  };

  useEffect(() => {
    if (activeTab === 'history') fetchLogs();
  }, [activeTab]);

  const messagePlaceholder = `Gentile Cliente,\n\n[...scrivi qui...]\n\nUn cordiale saluto,\n${senderType === 'luna' ? 'Luna Events Team' : 'Il Team TSC'}`;

  return (
    <div className={clsx("min-h-screen flex flex-col items-center justify-center p-4 font-sans relative transition-colors duration-700", theme.bgApp, lunaFont.variable)}>
      
      {/* Sfondo Decorativo Dinamico */}
      {isLuna ? (
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#050A18] to-[#050A18] -z-10" />
            {/* Stelle (puntini) */}
            <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse opacity-50"></div>
            <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-[#C4A052] rounded-full animate-pulse opacity-70"></div>
            <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-30"></div>
         </div>
      ) : (
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white to-transparent -z-10" />
      )}

      <div className="w-full max-w-4xl my-10 relative z-10">
        
        {/* Header con Pulsante Indietro */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4 self-start md:self-auto">
             <Link href="/admin" className={clsx("p-3 rounded-full border transition shadow-sm group", isLuna ? "bg-[#0A1125] border-slate-700 hover:bg-slate-800 text-white" : "bg-white border-slate-200 hover:bg-slate-100 text-slate-600")}>
                <ArrowLeft size={20} />
             </Link>
             <div className="text-left">
                <div className={clsx("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1", isLuna ? "bg-[#C4A052]/10 text-[#C4A052] border border-[#C4A052]/30" : "bg-slate-200/50 text-slate-600 border border-slate-200")}>
                  <Lock size={10} /> Admin Dashboard
                </div>
                <h1 className={clsx("text-3xl md:text-4xl font-extrabold tracking-tight transition-colors duration-500", isLuna ? "text-white" : "text-slate-900")}>
                  TSC Mailer <span className={theme.accentText}>Pro</span>
                </h1>
             </div>
          </div>

          {/* MENU TABS */}
          <div className="flex bg-slate-200/20 backdrop-blur-sm p-1 rounded-full border border-slate-200/10">
            <button 
              onClick={() => setActiveTab('write')}
              className={clsx(
                "px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2",
                activeTab === 'write' 
                  ? (isLuna ? "bg-[#C4A052] text-[#050A18] shadow-lg shadow-[#C4A052]/20" : "bg-slate-900 text-white shadow-lg") 
                  : (isLuna ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")
              )}
            >
              <Send size={16} /> <span className="hidden sm:inline">Nuova Email</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={clsx(
                "px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2",
                activeTab === 'history' 
                  ? (isLuna ? "bg-[#C4A052] text-[#050A18] shadow-lg shadow-[#C4A052]/20" : "bg-slate-900 text-white shadow-lg") 
                  : (isLuna ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")
              )}
            >
              <History size={16} /> <span className="hidden sm:inline">Storico</span>
            </button>
          </div>
        </div>

        {/* Card Principale */}
        <div className={clsx("backdrop-blur-xl rounded-[2.5rem] shadow-2xl border p-8 md:p-10 relative overflow-hidden min-h-[600px] transition-all duration-500", theme.bgCard)}>
          
          {/* TAB 1: SCRIVI EMAIL */}
          {activeTab === 'write' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
               <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SELETTORE MITTENTE (3 Opzioni) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Tasto 1: ADMIN */}
                  <button
                    type="button"
                    onClick={() => setSenderType('info')}
                    className={clsx(
                      "flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all duration-300 text-center px-2",
                      senderType === 'info' 
                        ? (isLuna ? "bg-slate-700 border-slate-500 text-white opacity-50 hover:opacity-100" : "bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02]")
                        : (isLuna ? "bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50")
                    )}
                  >
                    <Briefcase size={24} className="shrink-0" /> 
                    <div className="flex flex-col leading-none gap-1">
                        <span className="font-bold text-sm">Amministrazione</span>
                        <span className="text-[10px] opacity-70">info@tsccaffe.it</span>
                    </div>
                  </button>

                  {/* Tasto 2: SUPPORTO */}
                  <button
                    type="button"
                    onClick={() => setSenderType('supporto')}
                    className={clsx(
                      "flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all duration-300 text-center px-2",
                      senderType === 'supporto' 
                        ? (isLuna ? "bg-cyan-900/50 border-cyan-500/50 text-cyan-200 opacity-50 hover:opacity-100" : "bg-[#06b6d4] text-white border-[#06b6d4] shadow-lg shadow-cyan-200 scale-[1.02]")
                        : (isLuna ? "bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50")
                    )}
                  >
                    <Headphones size={24} className="shrink-0" />
                    <div className="flex flex-col leading-none gap-1">
                        <span className="font-bold text-sm">Supporto</span>
                        <span className="text-[10px] opacity-70">supporto@tsccaffe.it</span>
                    </div>
                  </button>

                   {/* Tasto 3: LUNA EVENTS (STILE PREMIUM) */}
                   <button
                    type="button"
                    onClick={() => setSenderType('luna')}
                    className={clsx(
                      "flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all duration-300 text-center px-2 relative overflow-hidden group",
                      senderType === 'luna' 
                        ? "bg-[#050A18] border-[#C4A052] shadow-[0_0_20px_rgba(196,160,82,0.2)] scale-[1.05] z-10"
                        : (isLuna ? "bg-slate-800 text-slate-400 border-slate-600" : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50")
                    )}
                  >
                    {senderType === 'luna' && <Sparkles size={16} className="absolute top-2 right-2 animate-pulse text-[#C4A052]" />}
                    
                    {/* LOGO LUNA */}
                    <div className="flex flex-col items-center leading-none mt-1">
                        <span className={clsx("text-3xl", senderType === 'luna' ? "text-[#C4A052]" : "text-current")} style={{ fontFamily: 'var(--font-luna)' }}>Luna</span>
                        <span className={clsx("text-[9px] uppercase tracking-[0.2em] font-light -mt-0.5 ml-1", senderType === 'luna' ? "text-white/90" : "text-current")}>Events</span>
                    </div>

                    <span className="text-[10px] opacity-70 mt-2 font-sans">lunaevents@tsccaffe.it</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className={clsx("block text-xs font-bold uppercase tracking-wider mb-2 ml-1", isLuna ? "text-slate-400" : "text-slate-400")}>A Chi Scriviamo?</label>
                    <div className="relative">
                      <div className={clsx("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", theme.iconColor)}><User size={18} /></div>
                      <input 
                        type="email" 
                        name="to" 
                        placeholder="cliente@email.com" 
                        required 
                        className={clsx("w-full rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all", theme.inputBg, theme.ringFocus)} 
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className={clsx("block text-xs font-bold uppercase tracking-wider mb-2 ml-1", isLuna ? "text-slate-400" : "text-slate-400")}>Oggetto</label>
                    <div className="relative">
                      <div className={clsx("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", theme.iconColor)}><Mail size={18} /></div>
                      <input 
                        type="text" 
                        name="subject" 
                        placeholder="Oggetto..." 
                        required 
                        className={clsx("w-full rounded-xl py-3.5 pl-12 pr-4 font-bold outline-none transition-all", theme.inputBg, theme.ringFocus)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className={clsx("block text-xs font-bold uppercase tracking-wider mb-2 ml-1", isLuna ? "text-slate-400" : "text-slate-400")}>Messaggio</label>
                  <div className="relative">
                    <div className={clsx("absolute left-4 top-5 transition-colors", theme.iconColor)}><FileText size={18} /></div>
                    <textarea 
                      name="message" 
                      rows={10} 
                      placeholder={messagePlaceholder}
                      required 
                      className={clsx("w-full rounded-xl py-4 pl-12 pr-4 outline-none transition-all resize-none leading-relaxed font-mono text-sm", theme.inputBg, theme.ringFocus)} 
                    />
                  </div>
                </div>

                {status.msg && (
                  <div className={clsx("p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 fade-in", 
                    status.type === 'success' 
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                      : "bg-red-500/10 text-red-600 border border-red-500/20"
                  )}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm">{status.msg}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={clsx(
                    "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group",
                    theme.btnPrimary
                  )}
                >
                  {loading ? <><Loader2 className="animate-spin" /> Invio...</> : <>Invia Email <Send size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: STORICO (Adattato ai colori) */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className={clsx("font-bold text-lg", isLuna ? "text-white" : "text-slate-800")}>Ultimi Invii</h3>
                <button onClick={fetchLogs} className={clsx("p-2 transition-colors", isLuna ? "text-slate-400 hover:text-[#C4A052]" : "text-slate-400 hover:text-[#06b6d4]")} title="Aggiorna">
                   <RefreshCw size={20} className={clsx(loadingLogs && "animate-spin")} />
                </button>
              </div>

              {loadingLogs && logs.length === 0 ? (
                <div className="text-center py-20 text-slate-400">Caricamento storico...</div>
              ) : logs.length === 0 ? (
                <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-3">
                  <History size={40} strokeWidth={1} />
                  <p>Nessuna email inviata (o database vuoto).</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={clsx("text-xs uppercase border-b", isLuna ? "text-slate-500 border-slate-700" : "text-slate-400 border-slate-100")}>
                        <th className="py-3 px-2 font-bold">Data</th>
                        <th className="py-3 px-2 font-bold">A Chi</th>
                        <th className="py-3 px-2 font-bold">Oggetto</th>
                        <th className="py-3 px-2 font-bold">Mittente</th>
                        <th className="py-3 px-2 font-bold text-right">Stato</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {logs.map((log) => (
                        <tr key={log.id} className={clsx("border-b transition-colors group", isLuna ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-50 hover:bg-slate-50/50")}>
                          <td className="py-3 px-2 text-slate-500 font-mono text-xs">
                            {new Date(log.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}
                          </td>
                          <td className={clsx("py-3 px-2 font-medium", isLuna ? "text-slate-300" : "text-slate-700")}>{log.recipient}</td>
                          <td className="py-3 px-2 text-slate-500 truncate max-w-[150px]">{log.subject}</td>
                          <td className="py-3 px-2">
                             {log.sender_type === 'supporto' ? (
                                <span className="text-[10px] font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full uppercase">Supporto</span>
                             ) : log.sender_type === 'luna' ? (
                                <span className="text-[10px] font-bold bg-[#050A18] text-[#C4A052] border border-[#C4A052]/30 px-2 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit" style={{ fontFamily: 'var(--font-luna)' }}>Luna</span>
                             ) : (
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full uppercase">Admin</span>
                             )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-emerald-500 font-bold flex items-center justify-end gap-1 text-xs">
                               <CheckCircle size={12} /> Inviata
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}