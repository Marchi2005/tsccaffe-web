"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Croissant } from "lucide-react";
import { PASTRIES_DATA } from "@/lib/schemas";

export default function PastrySelector({ label, onSelect, currentSelection }: any) {
  const [dietary, setDietary] = useState<'none' | 'vegan' | 'gluten_free'>('none');
  const specialitaKeywords = ['pasticciotto', 'graffa', 'bomba', 'polacca'];
  const cornetti = PASTRIES_DATA.filter((p: any) => !specialitaKeywords.some((k: string) => p.id.includes(k)) && p.id !== 'nessuno');
  const specialita = PASTRIES_DATA.filter((p: any) => specialitaKeywords.some((k: string) => p.id.includes(k)));
  const noGrazie = PASTRIES_DATA.find((p: any) => p.id === 'nessuno');

  const isOptionDisabled = (p: any) => {
    if (dietary === 'none') return false;
    const l = p.label.toLowerCase();
    if (dietary === 'vegan') return !(l.includes('bosco') || l.includes('albicocca') || l.includes('vuoto'));
    if (dietary === 'gluten_free') return !(l.includes('nutella') || l.includes('vuoto'));
    return false;
  };

  const handleSelect = (label: string) => {
    let finalString = label.replace(" (Vegano)", "").replace(" (Senza Glutine)", "");
    if (dietary === 'vegan') finalString += " (Vegano)";
    if (dietary === 'gluten_free') finalString += " (Senza Glutine)";
    onSelect(finalString);
  };

  const renderGrid = (items: any[]) => (
    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
      {items.map((p) => {
        const isSelected = currentSelection.startsWith(p.label);
        const isDisabled = isOptionDisabled(p);
        const textColor = isDisabled ? '#94a3b8' : (p.text || (p.id.includes('cioccolato') || p.id === 'nutella' ? 'white' : '#334155'));

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => !isDisabled && handleSelect(p.label)}
            disabled={isDisabled}
            style={isDisabled ? { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' } : (isSelected ? { backgroundColor: p.bg, borderColor: p.border, color: textColor } : {})}
            className={clsx(
              "p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-center pl-3 min-h-[3.5rem]",
              isDisabled ? "opacity-50 cursor-not-allowed" : "active:scale-95",
              !isDisabled && (isSelected ? "shadow-md ring-2 ring-inset ring-amber-500/50" : "bg-white border-slate-200 text-slate-600")
            )}
          >
            <span className={clsx("text-xs font-bold leading-tight z-10", isSelected && "scale-105 origin-left")}>{p.label}</span>
            {isSelected && !isDisabled && <div className="absolute right-2 top-2"><Check size={12} strokeWidth={3} color={textColor} /></div>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-400 text-xs uppercase tracking-wider pl-1">{label}</p>
      </div>

      <div className="flex flex-col min-[400px]:flex-row gap-2 mb-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
        <button type="button" onClick={() => setDietary(dietary === 'vegan' ? 'none' : 'vegan')} className={clsx("flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all", dietary === 'vegan' ? "bg-green-100 text-green-700 border-green-200 shadow-sm" : "bg-white text-slate-500 border-transparent hover:bg-slate-100")}>🌱 Vegano</button>
        <button type="button" onClick={() => setDietary(dietary === 'gluten_free' ? 'none' : 'gluten_free')} className={clsx("flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all", dietary === 'gluten_free' ? "bg-amber-100 text-amber-700 border-amber-200 shadow-sm" : "bg-white text-slate-500 border-transparent hover:bg-slate-100")}>🌾 Senza Glutine</button>
      </div>

      {noGrazie && (
        <button type="button" onClick={() => onSelect(noGrazie.label)} className={clsx("w-full py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center mb-2", currentSelection === noGrazie.label ? "bg-slate-800 text-white border-slate-800" : "bg-slate-50 text-slate-400 border-slate-200")}>
          ❌ Nessun Dolce
        </button>
      )}

      <div>
        <p className="text-[10px] font-bold text-slate-400 mb-2 ml-1 opacity-80 uppercase tracking-widest flex items-center gap-1"><Croissant size={12} /> Dolci</p>
        {renderGrid(cornetti)}
      </div>

      {specialita.length > 0 && (
        <div className="mt-6 pt-2">
          <p className="text-[10px] font-bold text-slate-400 mb-2 ml-1 opacity-80 uppercase tracking-widest flex items-center gap-1">🍩 Specialità</p>
          {renderGrid(specialita)}
        </div>
      )}
    </div>
  );
}