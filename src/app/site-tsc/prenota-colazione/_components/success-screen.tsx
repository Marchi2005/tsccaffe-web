"use client";

import { CheckCircle2, Store, MessageCircle } from "lucide-react";
import OrderQRSection from "@/components/OrderQRSection"; // Assumendo che questo esista e sia corretto!

interface SuccessScreenProps {
  orderId?: string;
}

export default function SuccessScreen({ orderId }: SuccessScreenProps) {
  return (
    <div className="animate-fade-in py-8 px-4 w-full flex justify-center">
      <div className="bg-white p-0 rounded-[2.5rem] shadow-2xl shadow-amber-100/50 border border-slate-100 text-center relative overflow-hidden max-w-sm w-full">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-50 to-white z-0" />
        <div className="relative z-10 flex flex-col items-center p-8 pb-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-amber-100 border-4 border-amber-50 animate-bounce-slow">
            <CheckCircle2 size={42} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Ordine Ricevuto!</h2>
          <p className="text-slate-500 font-medium mb-8">Abbiamo preso in carico la tua colazione.</p>
          <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl mb-8 text-left w-full relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
            <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Store size={18} className="text-amber-500" />
              Dettagli Ritiro/Pagamento
            </h3>
            <p className="text-amber-900/80 text-sm leading-relaxed font-medium">
              Ti aspettiamo in cassa o all'indirizzo indicato all'orario da te scelto.
            </p>
          </div>
          <div className="w-full mb-6">
            {orderId ? (
              <OrderQRSection orderId={orderId} />
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 animate-pulse text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generazione Ticket...</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-slate-50 p-6 pt-4 border-t border-slate-100">
          <div className="space-y-3 w-full">
            <a href={`https://wa.me/393715428345`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 transition-all transform flex items-center justify-center gap-2 text-sm">
              <MessageCircle size={20} fill="white" /> Contattaci su WhatsApp
            </a>
            <button onClick={() => window.location.reload()} className="w-full text-slate-400 text-[10px] font-bold py-2 uppercase tracking-widest">
              Effettua un altro ordine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}