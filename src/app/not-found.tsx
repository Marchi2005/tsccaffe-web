import Link from "next/link";
import { Compass, Home, Coffee, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Sfondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-amber-200 rounded-full blur-[100px] opacity-20"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* Card Principale (Aggiunto 'overflow-hidden' per tagliare correttamente la barra superiore) */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center max-w-md w-full relative z-10 animate-fade-in overflow-hidden">
        
        {/* Barra sottile superiore ora segue la curvatura grazie a overflow-hidden */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600" />

        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-amber-50/50">
           <Compass size={48} className="text-amber-600 drop-shadow-sm" />
        </div>

        <h1 className="text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Pagina non trovata</h2>
        
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Sembra che tu abbia smarrito la rotta...<br/>
          <strong>Ma sei sempre in tempo per un buon caffè!</strong>
        </p>

        {/* Pulsante CALL TO ACTION (Prenota Colazione) */}
        <div className="mb-4">
            <Link 
              href="/prenota-colazione" 
              className="w-full bg-amber-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-amber-900/20 hover:bg-amber-950 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group animate-pulse-slow"
            >
              <Coffee size={22} className="group-hover:rotate-12 transition-transform" />
              Prenota Colazione
              <ArrowRight size={18} className="opacity-80" />
            </Link>
            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mt-2">Inizia bene la giornata</p>
        </div>

        {/* Pulsante Secondario (Home) */}
        <Link 
          href="/" 
          className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <Home size={16} />
          Torna alla Home
        </Link>

      </div>
    </div>
  );
}