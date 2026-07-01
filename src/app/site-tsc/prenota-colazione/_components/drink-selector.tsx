"use client";

import clsx from "clsx";
import { Bean, Milk } from "lucide-react";
import { DRINKS_DATA } from "@/lib/schemas";

export function DrinkVariantOptions({ drinkData, currentSelection, onSelect }: { drinkData: any, currentSelection: string, onSelect: (v: string) => void }) {
  const updateVariant = (type: 'coffee' | 'milk' | 'flavor' | 'size', value: string) => {
    let coffee = "Normale"; let milk = "Intero"; let flavor = drinkData.subOptions?.[0] || ""; let size = "Standard";
    const match = currentSelection.match(/\((.*?)\)/);
    if (match) {
      const parts = match[1].split(", ");
      if (parts.includes("Deca")) coffee = "Deca";
      if (parts.includes("Senza Lattosio")) milk = "Senza Lattosio";
      if (parts.includes("Soia")) milk = "Soia";
      if (parts.includes("Grande")) size = "Grande";
      const foundFlavor = parts.find((p: string) => drinkData.subOptions?.includes(p));
      if (foundFlavor) flavor = foundFlavor;
    }
    if (type === 'coffee') coffee = value;
    if (type === 'milk') milk = value;
    if (type === 'flavor') flavor = value;
    if (type === 'size') size = value;

    let extras = [];
    if (coffee === "Deca") extras.push("Deca");
    if (milk !== "Intero" && drinkData.hasMilkVariant) extras.push(milk);
    if (drinkData.hasSub && flavor) extras.push(flavor);
    if (drinkData.hasSize && size === "Grande") extras.push("Grande");

    let finalString = drinkData.label;
    if (extras.length > 0) finalString += ` (${extras.join(", ")})`;
    else if (drinkData.hasSub) finalString += ` (${flavor})`;

    onSelect(finalString);
  };

  const isDeca = currentSelection.includes("Deca");
  const milkType = currentSelection.includes("Soia") ? "Soia" : (currentSelection.includes("Senza Lattosio") ? "Senza Lattosio" : "Intero");
  const sizeType = currentSelection.includes("Grande") ? "Grande" : "Standard";

  return (
    <div className="space-y-2">
      {drinkData.hasSize && (
        <div className="flex flex-col gap-1 w-full">
          <p className="text-[9px] font-bold text-slate-400">Dimensione:</p>
          <div className="flex gap-2 w-full">
            <button type="button" onClick={() => updateVariant('size', 'Standard')} className={clsx("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex-1", sizeType === 'Standard' ? "bg-amber-900 text-white border-amber-900" : "bg-white text-slate-500 border-slate-200")}>Normale</button>
            <button type="button" onClick={() => updateVariant('size', 'Grande')} className={clsx("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex-1 flex justify-center items-center gap-1", sizeType === 'Grande' ? "bg-amber-900 text-white border-amber-900" : "bg-white text-slate-500 border-slate-200")}>
              Grande <span className="opacity-70 text-[8px] font-normal">+{drinkData.label.toLowerCase().includes('ginseng') ? '0,30' : '0,20'}€</span>
            </button>
          </div>
        </div>
      )}
      {drinkData.hasCoffeeVariant && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-4 flex justify-center"><Bean size={12} className="text-amber-700" /></div>
          <div className="flex flex-wrap gap-1">
            <button type="button" onClick={() => updateVariant('coffee', 'Normale')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", !isDeca ? "bg-amber-700 text-white border-amber-700" : "bg-white text-slate-500 border-slate-200")}>Normale</button>
            <button type="button" onClick={() => updateVariant('coffee', 'Deca')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", isDeca ? "bg-amber-700 text-white border-amber-700" : "bg-white text-slate-500 border-slate-200")}>Deca</button>
          </div>
        </div>
      )}
      {drinkData.hasMilkVariant && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-4 flex justify-center"><Milk size={12} className="text-amber-700" /></div>
          <div className="flex flex-wrap gap-1">
            <button type="button" onClick={() => updateVariant('milk', 'Intero')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", milkType === 'Intero' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200")}>Intero</button>
            <button type="button" onClick={() => updateVariant('milk', 'Senza Lattosio')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", milkType === 'Senza Lattosio' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200")}>No Latt.</button>
            <button type="button" onClick={() => updateVariant('milk', 'Soia')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", milkType === 'Soia' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200")}>Soia</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DrinkSelector({ label, onSelect, currentSelection }: any) {
  const baseSelection = currentSelection ? currentSelection.split(" (")[0] : "";
  const drinkData = DRINKS_DATA.find((d: any) => d.label === baseSelection) as any;

  return (
    <div className="space-y-1.5 w-full">
      <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider pl-1">{label}</p>
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-2 w-full">
        {DRINKS_DATA.map((d: any) => {
          const isSelected = baseSelection === d.label;
          return (
            <button key={d.id} type="button" onClick={() => {
              let initial = d.label;
              if (d.hasSub && d.subOptions && d.subOptions.length > 0) initial += ` (${d.subOptions[0]})`;
              onSelect(initial);
            }}
              className={clsx("relative flex items-center justify-start px-2 py-2 rounded-lg border transition-all h-auto min-h-[3rem] w-full gap-2", isSelected ? "bg-amber-900 text-white border-amber-900 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              <span className="text-lg shrink-0">{d.icon}</span>
              <span className="text-[10px] font-bold leading-tight text-left break-words">{d.label}</span>
            </button>
          );
        })}
      </div>
      {drinkData && (drinkData.hasCoffeeVariant || drinkData.hasMilkVariant || drinkData.hasSub || drinkData.hasSize) && (
        <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 relative mt-1 w-full animate-fade-in">
          <DrinkVariantOptions drinkData={drinkData} currentSelection={currentSelection} onSelect={onSelect} />
        </div>
      )}
    </div>
  );
}