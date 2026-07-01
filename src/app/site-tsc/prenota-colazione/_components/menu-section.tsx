"use client";

import { User, Minus, Plus, MoreHorizontal, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import DrinkSelector, { DrinkVariantOptions } from "./drink-selector";
import PastrySelector from "./pastry-selector";
import { DRINKS_DATA, PASTRIES_DATA } from "@/lib/schemas";

interface MenuSectionProps {
  peopleCount: number | '5+';
  menus: { drink: string; pastry: string }[];
  updateMenu: (index: number, field: 'drink' | 'pastry', value: string) => void;
  bulkDrinks: Record<string, number>;
  bulkPastries: Record<string, number>;
  updateBulk: (type: 'drink' | 'pastry', item: string, delta: number) => void;
  bulkDietary: 'none' | 'vegan' | 'gluten_free';
  setBulkDietary: (val: 'none' | 'vegan' | 'gluten_free') => void;
  customizingDrink: string | null;
  setCustomizingDrink: (val: string | null) => void;
  tempDrinkSelection: string;
  setTempDrinkSelection: (val: string) => void;
  hasGlutenFreeNutella: boolean;
}

export default function MenuSection({
  peopleCount, menus, updateMenu, bulkDrinks, bulkPastries, updateBulk,
  bulkDietary, setBulkDietary, customizingDrink, setCustomizingDrink,
  tempDrinkSelection, setTempDrinkSelection, hasGlutenFreeNutella
}: MenuSectionProps) {

  // Spostato qui dal file principale!
  const isBulkOptionDisabled = (p: any) => {
    if (bulkDietary === 'none') return false;
    const l = p.label.toLowerCase();
    if (bulkDietary === 'vegan') return !(l.includes('bosco') || l.includes('albicocca') || l.includes('vuoto'));
    if (bulkDietary === 'gluten_free') return !(l.includes('nutella') || l.includes('vuoto'));
    return false;
  };

  return (
    <section>
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
        {peopleCount === '5+' ? "Componi Ordine Multiplo" : "Componi la Colazione"}
      </h3>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-6 w-full">
        {peopleCount === '5+' ? (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-widest mb-3 border-b pb-2">☕ Bevande</h4>
              <div className="space-y-2">
                {DRINKS_DATA.filter(d => !d.label.toLowerCase().includes('grazie') && !d.label.toLowerCase().includes('nessun')).map(d => {
                  const baseKey = d.label;
                  const subKeys = Object.keys(bulkDrinks).filter(k => k.startsWith(baseKey) && k !== baseKey && bulkDrinks[k] > 0);
                  return (
                    <div key={d.id} className="border border-slate-100 rounded-lg overflow-hidden">
                      <div className="flex justify-between items-center p-2 bg-white hover:bg-slate-50">
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">{d.icon} {d.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-md border border-slate-200">
                            <button type="button" onClick={() => updateBulk('drink', baseKey, -1)} className="w-6 h-6 flex justify-center items-center bg-white rounded shadow-sm text-slate-600"><Minus size={14} /></button>
                            <span className="w-4 text-center font-bold text-sm">{bulkDrinks[baseKey] || 0}</span>
                            <button type="button" onClick={() => updateBulk('drink', baseKey, 1)} className="w-6 h-6 flex justify-center items-center bg-amber-100 text-amber-800 rounded shadow-sm"><Plus size={14} /></button>
                          </div>
                          <button type="button" onClick={() => { setCustomizingDrink(customizingDrink === baseKey ? null : baseKey); setTempDrinkSelection(baseKey); }} className="w-8 h-8 flex justify-center items-center bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                      {subKeys.map(sk => (
                        <div key={sk} className="flex justify-between items-center p-2 pl-4 bg-slate-50/80 border-t border-slate-100">
                          <span className="text-[11px] font-medium text-slate-600 truncate mr-2">↳ {sk.replace(baseKey, '').trim()}</span>
                          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-slate-200">
                            <button type="button" onClick={() => updateBulk('drink', sk, -1)} className="w-5 h-5 flex justify-center items-center bg-slate-50 border rounded text-slate-600"><Minus size={12} /></button>
                            <span className="w-3 text-center font-bold text-xs">{bulkDrinks[sk]}</span>
                            <button type="button" onClick={() => updateBulk('drink', sk, 1)} className="w-5 h-5 flex justify-center items-center bg-slate-50 border rounded text-slate-600"><Plus size={12} /></button>
                          </div>
                        </div>
                      ))}
                      {customizingDrink === baseKey && (
                        <div className="p-3 bg-amber-50/50 border-t border-amber-100 animate-fade-in">
                          <DrinkVariantOptions drinkData={d} currentSelection={tempDrinkSelection} onSelect={setTempDrinkSelection} />
                          <div className="mt-3 flex justify-end">
                            <button type="button" onClick={() => {
                              updateBulk('drink', tempDrinkSelection, 1);
                              setCustomizingDrink(null);
                            }} className="bg-amber-900 text-white text-[11px] uppercase tracking-wider font-bold px-4 py-2 rounded-lg hover:bg-amber-950 transition-colors">Aggiungi Personalizzata</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-widest mb-2 border-b pb-2 mt-4">🥐 Dolci</h4>
              <div className="flex flex-col min-[400px]:flex-row gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100 mb-3">
                <button type="button" onClick={() => setBulkDietary(bulkDietary === 'vegan' ? 'none' : 'vegan')} className={clsx("flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all", bulkDietary === 'vegan' ? "bg-green-100 text-green-700 border-green-200 shadow-sm" : "bg-white text-slate-500 border-transparent hover:bg-slate-100")}>🌱 Vegano</button>
                <button type="button" onClick={() => setBulkDietary(bulkDietary === 'gluten_free' ? 'none' : 'gluten_free')} className={clsx("flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all", bulkDietary === 'gluten_free' ? "bg-amber-100 text-amber-700 border-amber-200 shadow-sm" : "bg-white text-slate-500 border-transparent hover:bg-slate-100")}>🌾 Senza Glutine</button>
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {PASTRIES_DATA.filter(p => p.id !== 'nessuno' && !p.label.toLowerCase().includes('nessun') && !p.label.toLowerCase().includes('grazie')).map(p => {
                  const isDisabled = isBulkOptionDisabled(p);
                  let filteredKey = p.label;
                  if (bulkDietary === 'vegan') filteredKey += " (Vegano)";
                  if (bulkDietary === 'gluten_free') filteredKey += " (Senza Glutine)";
                  const currentQty = bulkPastries[filteredKey] || 0;
                  const subKeys = Object.keys(bulkPastries).filter(k => k.startsWith(p.label) && k !== filteredKey && bulkPastries[k] > 0);
                  return (
                    <div key={p.id} className="border border-slate-100 rounded-lg overflow-hidden">
                      <div className={clsx("flex justify-between items-center p-2 bg-white", isDisabled ? "opacity-40 grayscale" : "hover:bg-slate-50 transition-colors")}>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            {p.label}
                            {bulkDietary === 'vegan' && !isDisabled && <span className="text-[8px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full uppercase">Veg</span>}
                            {bulkDietary === 'gluten_free' && !isDisabled && <span className="text-[8px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full uppercase">GF</span>}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-md border border-slate-200">
                          <button type="button" onClick={() => updateBulk('pastry', filteredKey, -1)} className="w-6 h-6 flex justify-center items-center bg-white rounded shadow-sm text-slate-600" disabled={currentQty === 0}><Minus size={14} /></button>
                          <span className="w-4 text-center font-bold text-sm">{currentQty}</span>
                          <button type="button" onClick={() => updateBulk('pastry', filteredKey, 1)} disabled={isDisabled} className={clsx("w-6 h-6 flex justify-center items-center rounded shadow-sm", isDisabled ? "bg-slate-200 text-slate-400" : "bg-amber-100 text-amber-800")}><Plus size={14} /></button>
                        </div>
                      </div>
                      {subKeys.map(sk => (
                        <div key={sk} className="flex justify-between items-center p-2 pl-4 bg-slate-50/80 border-t border-slate-100">
                          <span className="text-[11px] font-medium text-slate-600 truncate mr-2">↳ {sk.replace(p.label, '').trim() || 'Normale'}</span>
                          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-slate-200">
                            <button type="button" onClick={() => updateBulk('pastry', sk, -1)} className="w-5 h-5 flex justify-center items-center bg-slate-50 border rounded text-slate-600"><Minus size={12} /></button>
                            <span className="w-3 text-center font-bold text-xs">{bulkPastries[sk]}</span>
                            <button type="button" onClick={() => updateBulk('pastry', sk, 1)} className="w-5 h-5 flex justify-center items-center bg-slate-50 border rounded text-slate-600"><Plus size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          Array.from({ length: peopleCount as number }).map((_, idx) => (
            <div key={idx} className="pb-6 border-b border-dashed border-slate-200 last:border-0 last:pb-0 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-amber-100 text-amber-800 p-1.5 rounded-md"><User size={14} /></div>
                <span className="font-bold text-xs text-slate-800 uppercase tracking-widest">Persona {idx + 1}</span>
              </div>
              <DrinkSelector label="Bevanda" currentSelection={menus[idx].drink} onSelect={(val: string) => updateMenu(idx, 'drink', val)} />
              <PastrySelector label="Dolce" currentSelection={menus[idx].pastry} onSelect={(val: string) => updateMenu(idx, 'pastry', val)} />
            </div>
          ))
        )}
        {hasGlutenFreeNutella && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mt-4 rounded-r-xl animate-fade-in flex gap-2 items-start shadow-sm">
            <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-[10px] font-bold text-red-700 leading-tight">
              Prodotto non consigliato per persone fortemente allergiche o celiache. Non possiamo garantire contaminazione zero in laboratorio.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}