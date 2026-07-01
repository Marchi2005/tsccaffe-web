"use client";

import { Check, Ticket } from "lucide-react";

interface PromoSectionProps {
  promoCodeInput: string;
  setPromoCodeInput: (val: string) => void;
  handleApplyPromo: () => void;
  isValidatingPromo: boolean;
  promoError: string | null;
  appliedPromo: any;
  setAppliedPromo: (val: any) => void;
}

export default function PromoSection({
  promoCodeInput, setPromoCodeInput, handleApplyPromo,
  isValidatingPromo, promoError, appliedPromo, setAppliedPromo
}: PromoSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">4</span>
        Card B&B o Codice Sconto
      </h3>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 w-full">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value)}
              placeholder="Inserisci codice..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-emerald-300 transition-colors uppercase"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyPromo}
            disabled={isValidatingPromo || !promoCodeInput}
            className="bg-emerald-700 text-white px-5 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all disabled:opacity-50"
          >
            {isValidatingPromo ? "..." : "Applica"}
          </button>
        </div>
        {promoError && <p className="text-[10px] text-red-600 font-bold mt-2 ml-1">{promoError}</p>}
        {appliedPromo && (
          <div className="mt-3 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-1 rounded"><Check size={12} className="text-emerald-700" /></div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Codice "{appliedPromo.code}" Applicato!</span>
            </div>
            <button type="button" onClick={() => { setAppliedPromo(null); setPromoCodeInput(""); }} className="text-[10px] font-bold text-red-600 underline">Rimuovi</button>
          </div>
        )}
      </div>
    </section>
  );
}