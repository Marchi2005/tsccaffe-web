import Link from "next/link";
import { HeartCrack, Home, Gift, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Sfondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-rose-200 rounded-full blur-[100px] opacity-20"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* Card Principale */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center max-w-md w-full relative z-10 animate-fade-in">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-rose-600" />

        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-rose-50/50">
           <HeartCrack size={48} className="text-rose-500 drop-shadow-sm" />
        </div>

        <h1 className="text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Pagina non trovata</h2>
        
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Sembra che tu abbia smarrito la strada...<br/>
          <strong>Ma non perdere l'occasione di stupire chi ami!</strong>
        </p>

        {/* Pulsante CALL TO ACTION (Prenota Box) */}
        <div className="mb-4">
            <Link 
              href="/prenota-box" 
              className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-rose-200 hover:bg-rose-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group animate-pulse-slow"
            >
              <Gift size={22} className="group-hover:rotate-12 transition-transform" />
              Ordina la Box di San Valentino
              <ArrowRight size={18} className="opacity-80" />
            </Link>
            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-2">Edizione Limitata</p>
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