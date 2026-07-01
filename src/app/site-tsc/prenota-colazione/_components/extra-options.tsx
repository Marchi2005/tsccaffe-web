"use client";

import { Check, Citrus, GlassWater, Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { PRICE_CONFEZIONE_REGALO, PRICE_SPREMUTA, PRICE_SUCCO } from "@/lib/schemas";

const SUCCHI_FLAVORS = [
  "Ace", "Albicocca", "Ananas",
  "Arancia", "Mela", "Mirtillo",
  "Pesca", "Pera"
];

interface ExtraOptionsProps {
  giftBoxSelected: boolean;
  setGiftBoxSelected: (val: boolean) => void;
  spremuteCount: number;
  setSpremuteCount: (val: number) => void;
  succhiCounters: Record<string, number>;
  updateSucco: (gusto: string, delta: number) => void;
}

export default function ExtraOptions({ 
  giftBoxSelected, setGiftBoxSelected, 
  spremuteCount, setSpremuteCount, 
  succhiCounters, updateSucco 
}: ExtraOptionsProps) {
  return (
    <section>
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
        Aggiungi un tocco in più
      </h3>
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 space-y-3 w-full">
        
        {/* GIFT BOX */}
        <button
          type="button"
          onClick={() => setGiftBoxSelected(!giftBoxSelected)}
          className={clsx(
            "relative rounded-xl p-3 border-2 transition-all w-full flex items-center justify-between",
            giftBoxSelected ? "bg-purple-50 border-purple-400" : "bg-white border-slate-100 hover:border-purple-200"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-full shrink-0", giftBoxSelected ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-500")}>
              🎁
            </div>
            <div className="text-left">
              <h4 className="font-extrabold text-slate-800 text-xs">Confezione Regalo</h4>
              <p className="text-[10px] font-bold text-purple-600 mt-0.5">+{PRICE_CONFEZIONE_REGALO.toFixed(2)}€</p>
            </div>
          </div>
          <div className={clsx("w-5 h-5 rounded border-2 flex items-center justify-center transition-colors", giftBoxSelected ? "bg-purple-500 border-purple-500" : "border-slate-300")}>
            {giftBoxSelected && <Check size={16} className="text-white" />}
          </div>
        </button>

        {/* SPREMUTE */}
        <div className={clsx("relative rounded-xl p-3 border-2 transition-all w-full flex items-center justify-between", spremuteCount > 0 ? "bg-orange-50 border-orange-400" : "bg-white border-slate-100")}>
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-full shrink-0", spremuteCount > 0 ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-500")}><Citrus size={16} /></div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs">Spremuta d'Arancia</h4>
              <p className="text-[10px] font-bold text-orange-600 mt-0.5">+{PRICE_SPREMUTA.toFixed(2)}€ cad.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <button type="button" onClick={() => setSpremuteCount(Math.max(0, spremuteCount - 1))} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 bg-slate-50 rounded"><Minus size={14} /></button>
            <span className="font-bold text-sm w-3 text-center">{spremuteCount}</span>
            <button type="button" onClick={() => setSpremuteCount(spremuteCount + 1)} className="w-6 h-6 flex items-center justify-center text-orange-500 hover:text-orange-700 bg-orange-100 rounded"><Plus size={14} /></button>
          </div>
        </div>

        {/* SUCCHI */}
        <div className="relative rounded-xl p-3 border-2 transition-all w-full bg-white border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full shrink-0 bg-yellow-100 text-yellow-600"><GlassWater size={16} /></div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs">Succhi di Frutta</h4>
              <p className="text-[10px] font-bold text-yellow-700 mt-0.5">+{PRICE_SUCCO.toFixed(2)}€ cad.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {SUCCHI_FLAVORS.map(gusto => {
              const qty = succhiCounters[gusto] || 0;
              return (
                <div key={gusto} className={clsx("flex justify-between items-center p-2 border rounded-lg", qty > 0 ? "bg-yellow-50 border-yellow-300" : "bg-white border-slate-100 hover:bg-slate-50")}>
                  <span className="text-[10px] font-bold text-slate-700">{gusto}</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateSucco(gusto, -1)} className="w-5 h-5 flex justify-center items-center bg-white border rounded shadow-sm text-slate-600"><Minus size={12} /></button>
                    <span className="w-3 text-center font-bold text-[10px]">{qty}</span>
                    <button type="button" onClick={() => updateSucco(gusto, 1)} className="w-5 h-5 flex justify-center items-center bg-yellow-400 rounded shadow-sm text-slate-900"><Plus size={12} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
}