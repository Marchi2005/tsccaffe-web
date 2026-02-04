"use client";

import { submitOrder } from "./actions";
import Footer from "@/components/layout/Footer";
import { 
  Bike, Check, CheckCircle2, Citrus, Heart, Info, Store, Bean, Milk, 
  ArrowRight, Banknote, CreditCard, GlassWater, Sparkles, 
  ChevronLeft, ChevronRight, MessageCircle, AlertTriangle
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import { DRINKS_DATA, PASTRIES_DATA, TIMES, BOX_TYPES } from "@/lib/schemas";
import clsx from "clsx";

// --- COSTANTI ---

const SHOP_PHONE_NUMBER = "393715428345"; 

const SUCCHI_FLAVORS = [
  "Ace", "Albicocca", "Ananas", "Arancia", 
  "Arancia Rossa", "Frutti di Bosco", "Mango Passion", 
  "Mela", "Melograno", "Mirtillo", "Multifrutti", 
  "Pera", "Pesca", "Pompelmo"
].sort();

const IMAGE_PREFIXES: Record<string, string> = {
  royal: "royal-desire",
  velvet: "velvet-dream",
  red_love: "red-love",
  sparkling: "sparkling-love"
};

// --- COMPONENTS ---

function PaymentLogos() {
  return (
    <div className="flex flex-wrap justify-center items-end gap-4 opacity-70 scale-90 mb-4">
      <div className="flex flex-col items-center gap-1">
        <Banknote size={20} className="text-slate-600" strokeWidth={1.5} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Contanti</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <CreditCard size={20} className="text-slate-600" strokeWidth={1.5} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Carta</span>
      </div>
    </div>
  );
}

function SubmitButton({ label, price }: { label: string, price: number }) {
  const { pending } = useFormStatus();
  const safePrice = (price && !isNaN(price)) ? price : 0;

  return (
    <button disabled={pending} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm sm:text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex justify-between px-5 items-center disabled:opacity-70 disabled:cursor-not-allowed">
       <span className="flex items-center gap-2">
         {pending ? <span className="animate-pulse">Invio...</span> : <>{label} <ArrowRight size={18} className="text-rose-300 hidden sm:block" /></>}
       </span>
       <span className="bg-white/20 px-2 py-1 rounded-lg font-mono tracking-tight">{safePrice.toFixed(2)}€</span>
    </button>
  );
}

// Carosello Immagini
function BoxCarousel({ boxId, boxName, price, compact = false }: { boxId: string, boxName: string, price?: number, compact?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefix = IMAGE_PREFIXES[boxId] || "royal-desire";
  
  const images = Array.from({ length: 5 }, (_, i) => `/images/box/${prefix}_${i + 1}.png`);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (compact) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, compact]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [boxId]);

  return (
    <div className="relative w-full h-full overflow-hidden group">
      {images.map((img, index) => (
        <div
          key={img}
          className={clsx(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <Image 
            src={img} 
            alt={`${boxName} - ${index + 1}`} 
            fill 
            className="object-cover" 
            priority={index === 0} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Controlli solo Desktop */}
      {!compact && (
        <>
        <button onClick={(e) => { e.preventDefault(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:block">
            <ChevronLeft size={24} />
        </button>
        <button onClick={(e) => { e.preventDefault(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:block">
            <ChevronRight size={24} />
        </button>
        </>
      )}

      {/* Indicatori */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={clsx(
              "w-1.5 h-1.5 rounded-full transition-all shadow-sm",
              idx === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white"
            )}
          />
        ))}
      </div>

      {compact && price !== undefined && (
        <div className="absolute bottom-4 left-4 right-4 z-20 text-white pointer-events-none">
           <h1 className="text-xl font-extrabold shadow-black drop-shadow-md">{boxName}</h1>
           <div className="text-lg font-bold text-rose-500 bg-white px-2 py-0.5 rounded-lg shadow-lg inline-block mt-1">
              {price.toFixed(2)}€
           </div>
        </div>
      )}
      
      {!compact && price !== undefined && (
         <div className="absolute bottom-10 left-10 right-10 z-20 text-white flex justify-between items-end pointer-events-none">
            <div>
              <h2 className="text-4xl font-extrabold mb-2 leading-tight drop-shadow-lg">{boxName}</h2>
              <p className="text-sm opacity-90 drop-shadow-md max-w-md">Scorri per vedere i dettagli.</p>
            </div>
            <div className="text-right">
               <div className="text-5xl font-extrabold text-rose-500 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
                 {price.toFixed(2)}€
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

// --- DRINK SELECTOR (GRID STABILE CON TESTO A CAPO) ---
function DrinkSelector({ label, onSelect, currentSelection }: any) {
  const baseSelection = currentSelection ? currentSelection.split(" (")[0] : ""; 
  const drinkData = DRINKS_DATA.find(d => d.label === baseSelection) as any;

  const updateVariant = (type: 'coffee' | 'milk' | 'flavor' | 'size', value: string) => {
    if (!drinkData) return;
    
    let coffee = "Normale";
    let milk = "Intero";
    let flavor = drinkData.subOptions?.[0] || "";
    let size = "Standard";
    
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

    let finalString = drinkData.label;
    let extras = [];
    
    if (coffee === "Deca") extras.push("Deca");
    if (milk !== "Intero" && drinkData.hasMilkVariant) extras.push(milk);
    if (drinkData.hasSub && flavor) extras.push(flavor);
    if (drinkData.hasSize && size === "Grande") extras.push("Grande");
    
    if (extras.length > 0) finalString += ` (${extras.join(", ")})`;
    else if (drinkData.hasSub) finalString += ` (${flavor})`;

    onSelect(finalString);
  };

  const isDeca = currentSelection.includes("Deca");
  const milkType = currentSelection.includes("Soia") ? "Soia" : (currentSelection.includes("Senza Lattosio") ? "Senza Lattosio" : "Intero");
  const sizeType = currentSelection.includes("Grande") ? "Grande" : "Standard";

  return (
    <div className="space-y-2">
      <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider pl-1">{label}</p>
      
      {/* GRID 3 COLONNE RIGIDE: w-full forza il contenimento */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {DRINKS_DATA.map((d: any) => {
          const isSelected = baseSelection === d.label;
          return (
            <button key={d.id} type="button" onClick={() => {
                 let initial = d.label;
                 if (d.hasSub && d.subOptions && d.subOptions.length > 0) { initial += ` (${d.subOptions[0]})`; }
                 onSelect(initial);
              }}
              // h-auto e min-h permettono al bottone di crescere in altezza se il testo va a capo
              // whitespace-normal e break-words forzano il testo a stare dentro la larghezza
              className={clsx(
                "relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all h-auto min-h-[4rem] w-full", 
                isSelected ? "bg-slate-800 text-white border-slate-800 shadow-md scale-[1.01]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <span className="text-lg mb-1">{d.icon}</span>
              <span className="text-[9px] font-bold leading-3 text-center w-full break-words whitespace-normal">{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* VARIANTI */}
      {drinkData && (drinkData.hasCoffeeVariant || drinkData.hasMilkVariant || drinkData.hasSub || drinkData.hasSize) && (
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 relative mt-1 w-full">
           <div className="space-y-2">
              {/* Caffè */}
              {drinkData.hasCoffeeVariant && (
                <div className="flex items-center gap-2">
                   <div className="w-4 flex justify-center"><Bean size={12} className="text-slate-400" /></div>
                   <div className="grid grid-cols-2 gap-1 w-full">
                      <button type="button" onClick={() => updateVariant('coffee', 'Normale')} className={clsx("py-2 rounded text-[10px] font-bold border text-center", !isDeca ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-500 border-slate-200")}>Normale</button>
                      <button type="button" onClick={() => updateVariant('coffee', 'Deca')} className={clsx("py-2 rounded text-[10px] font-bold border text-center", isDeca ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-500 border-slate-200")}>Deca</button>
                   </div>
                </div>
              )}
              {/* Latte */}
              {drinkData.hasMilkVariant && (
                <div className="flex items-start gap-2">
                   <div className="w-4 flex justify-center mt-2"><Milk size={12} className="text-slate-400" /></div>
                   <div className="grid grid-cols-3 gap-1 w-full">
                      <button type="button" onClick={() => updateVariant('milk', 'Intero')} className={clsx("px-1 py-2 rounded text-[10px] font-bold border text-center", milkType === 'Intero' ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-slate-600 border-slate-200")}>Intero</button>
                      <button type="button" onClick={() => updateVariant('milk', 'Senza Lattosio')} className={clsx("px-1 py-2 rounded text-[10px] font-bold border text-center leading-3 break-words whitespace-normal", milkType === 'Senza Lattosio' ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-slate-600 border-slate-200")}>No Latt.</button>
                      <button type="button" onClick={() => updateVariant('milk', 'Soia')} className={clsx("px-1 py-2 rounded text-[10px] font-bold border text-center", milkType === 'Soia' ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-slate-600 border-slate-200")}>Soia</button>
                   </div>
                </div>
              )}
              {/* Gusti */}
              {drinkData.hasSub && (
                <div className="flex flex-col gap-1 w-full">
                   <p className="text-[9px] font-bold text-slate-400 ml-6">Gusto:</p>
                   {/* 3 Colonne anche per i gusti per allineamento perfetto */}
                   <div className="grid grid-cols-3 gap-1 pl-6 w-full">
                     {drinkData.subOptions?.map((opt: string) => (
                        <button key={opt} type="button" onClick={() => updateVariant('flavor', opt)} className={clsx("px-1 py-2 rounded text-[10px] font-bold border text-center break-words whitespace-normal leading-3", currentSelection.includes(opt) ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-200")}>{opt}</button>
                     ))}
                   </div>
                </div>
              )}
              {/* Size */}
              {drinkData.hasSize && (
                 <div className="flex items-center gap-2">
                    <div className="w-4 flex justify-center text-[9px] font-bold text-slate-400">Tg</div>
                    <div className="grid grid-cols-2 gap-1 w-full">
                       <button type="button" onClick={() => updateVariant('size', 'Standard')} className={clsx("py-2 rounded text-[10px] font-bold border transition-all text-center", sizeType === 'Standard' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200")}>Standard</button>
                       <button type="button" onClick={() => updateVariant('size', 'Grande')} className={clsx("py-2 rounded text-[10px] font-bold border transition-all text-center", sizeType === 'Grande' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200")}>Grande</button>
                    </div>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}

// --- PASTRY SELECTOR (GRID 2 COLONNE PER NOMI LUNGHI) ---
function PastrySelector({ label, onSelect, currentSelection }: any) {
  const specialitaKeywords = ['pasticciotto', 'graffa', 'bomba', 'polacca'];
  const cornetti = PASTRIES_DATA.filter((p: any) => !specialitaKeywords.some(k => p.id.includes(k)) && p.id !== 'nessuno');
  const specialita = PASTRIES_DATA.filter((p: any) => specialitaKeywords.some(k => p.id.includes(k)));
  const noGrazie = PASTRIES_DATA.find((p: any) => p.id === 'nessuno');

  const renderGrid = (items: any[]) => (
    // GRID 2 COLONNE: Più spazio per "Cornetto Nutella" senza uscire
    <div className="grid grid-cols-2 gap-2 w-full">
       {items.map((p) => {
          const isSelected = currentSelection === p.label;
          const textColor = p.text || (p.id.includes('cioccolato') || p.id === 'nutella' || p.id === 'bomba_cioccolato' ? 'white' : '#334155');
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.label)}
              style={isSelected ? { backgroundColor: p.bg, borderColor: p.border, color: textColor } : {}}
              className={clsx(
                "p-2 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-center h-auto min-h-[3.5rem] w-full",
                isSelected ? "shadow-sm ring-1 ring-inset" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
               <span className={clsx("text-[10px] font-bold leading-3 z-10 break-words whitespace-normal pr-3 w-full", isSelected && "scale-105 origin-left")}>{p.label}</span>
               {isSelected && (
                 <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Check size={8} strokeWidth={3} color={textColor} />
                 </div>
               )}
            </button>
          );
       })}
    </div>
  );

  return (
    <div className="space-y-2 mt-3 w-full">
       <div className="flex items-center justify-between">
          <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider pl-1">{label}</p>
       </div>
       {noGrazie && (
          <button type="button" onClick={() => onSelect(noGrazie.label)} className={clsx("w-full py-2 px-3 rounded-lg border text-[10px] font-bold transition-all text-center mb-1", currentSelection === noGrazie.label ? "bg-slate-800 text-white border-slate-800" : "bg-slate-50 text-slate-400 border-slate-200")}>❌ Nessun Dolce</button>
       )}
       <div>
         <p className="text-[9px] font-bold text-slate-400 mb-1 ml-1 opacity-80 uppercase tracking-widest">Cornetteria</p>
         {renderGrid(cornetti)}
       </div>
       {specialita.length > 0 && (
         <div>
            <p className="text-[9px] font-bold text-slate-400 mb-1 ml-1 mt-2 opacity-80 uppercase tracking-widest">Specialità</p>
            {renderGrid(specialita)}
         </div>
       )}
    </div>
  );
}

function BoxCard({ box, selected, onClick }: any) {
  let displayPrice = 0;
  if (box.variants) {
      displayPrice = Math.min(...box.variants.map((v:any) => v.price));
  } else if (box.sizes) {
      const allPrices = box.sizes.flatMap((s: any) => s.variants.map((v: any) => v.price));
      displayPrice = Math.min(...allPrices);
  } else {
      displayPrice = box.price || 0;
  }

  return (
    <div onClick={onClick} className={clsx("cursor-pointer rounded-xl p-3 border-2 transition-all relative overflow-hidden group h-full flex flex-col w-full", selected ? "border-rose-500 bg-rose-50/50 ring-1 ring-rose-500" : "border-slate-100 bg-white hover:border-rose-200")}>
      <div className="flex justify-between items-start mb-1">
        <h4 className={clsx("font-bold text-base", selected ? "text-rose-600" : "text-slate-900")}>{box.name}</h4>
        {selected && <div className="bg-rose-500 text-white p-0.5 rounded-full"><Check size={12} strokeWidth={3} /></div>}
      </div>
      <p className="text-[11px] text-slate-500 mb-2 leading-tight flex-grow">{box.desc}</p>
      <div className="flex items-baseline gap-1 mt-auto">
         <span className="text-[9px] font-bold text-slate-400 uppercase">Da</span>
         <span className="text-lg font-extrabold text-slate-800">{displayPrice.toFixed(2)}€</span>
      </div>
    </div>
  );
}

function GiftCard({ label, price, icon, selected, onClick }: any) {
    return (
        <div onClick={onClick} className={clsx("cursor-pointer rounded-lg p-1.5 border-2 transition-all relative flex flex-col items-center justify-center text-center gap-0.5 min-h-[5rem] w-full", selected ? "border-rose-500 bg-rose-50 ring-1 ring-rose-500" : "border-slate-100 bg-white hover:border-rose-200")}>
            <div className="text-lg">{icon}</div>
            <div className="text-[9px] font-bold text-slate-700 leading-tight break-words w-full px-0.5">{label}</div>
            <div className="text-[10px] font-extrabold text-rose-600">+{price.toFixed(2)}€</div>
            {selected && <div className="absolute top-0.5 right-0.5 text-rose-500"><CheckCircle2 size={10} /></div>}
        </div>
    );
}

const initialState = { success: false, message: "", errors: {} };

export default function PrenotaBoxPage() {
  const [state, formAction] = useActionState(submitOrder, initialState);
  
  // STATI
  const [box, setBox] = useState(BOX_TYPES[0]); // Default Royal
  const [variantId, setVariantId] = useState("doppia"); 
  const [sizeId, setSizeId] = useState("medium"); 
  
  const [delivery, setDelivery] = useState("domicilio");
  const [time, setTime] = useState(TIMES[1]);
  
  // Extra
  const [spremuta, setSpremuta] = useState(false);
  const [succoExtra, setSuccoExtra] = useState(false);
  const [succoFlavor, setSuccoFlavor] = useState("Ace");

  // Regali
  const [addPelucheL, setAddPelucheL] = useState(false);
  const [addPelucheM, setAddPelucheM] = useState(false);
  const [addRosa, setAddRosa] = useState(false);

  // Menu
  const [d1, setD1] = useState("Cappuccino");
  const [c1, setC1] = useState("Nutella®");
  const [d2, setD2] = useState("Espresso");
  const [c2, setC2] = useState("Pistacchio");

  const [totalPrice, setTotalPrice] = useState(0);

  // RESET
  useEffect(() => {
    if (box.id === "sparkling") {
      setVariantId("singola");
    } else {
      setVariantId("doppia"); 
    }
    setSizeId("medium");
    setSpremuta(false);
    setSuccoExtra(false);
    setSuccoFlavor("Ace"); // Reset gusto
    setAddPelucheL(false);
    setAddPelucheM(false);
    setAddRosa(false);
  }, [box.id]);

  // CALCOLO PREZZI
  useEffect(() => {
    let final = 0;

    // A. Box Base
    if (box.id === "red_love") {
      const sizes = (box as any).sizes;
      const currentSize = sizes.find((s:any) => s.id === sizeId) || sizes[0];
      const currentVariant = currentSize.variants.find((v:any) => v.id === variantId) || currentSize.variants[0];
      final = currentVariant.price;
    } else if (box.variants) {
      const currentVariant = box.variants.find((v:any) => v.id === variantId);
      final = currentVariant ? currentVariant.price : box.variants[0].price;
    } else {
      final = (box as any).price || 0;
    }

    const isSingle = variantId === 'singola';

    // B. Spremuta
    if (spremuta) {
        let isIncluded = (box as any).spremutaIncluded;
        if (box.id === "red_love") isIncluded = (sizeId === "medium");
        
        if (!isIncluded) {
            if (box.id === "red_love" && sizeId === "small") final += 1.50; 
            else if (box.id === "sparkling") final += 1.50; 
            else final += (2.50 * (isSingle ? 1 : 2)); 
        }
    }

    // C. Succo Extra
    if (succoExtra) {
        final += (box as any).succoPrice || 1.70;
    }

    // D. Regali
    const acc = (box as any).accessories;
    if (acc) {
        if (addPelucheL) final += acc.peluche_l.price;
        if (addPelucheM) final += acc.peluche_m.price;
        if (addRosa) final += acc.rosa.price;
    }

    // E. Menu
    if (d1.includes("Grande")) final += 0.20;
    if (!isSingle && d2.includes("Grande")) final += 0.20;

    setTotalPrice(final);
  }, [box, variantId, sizeId, spremuta, succoExtra, addPelucheL, addPelucheM, addRosa, d1, d2]);

  const isSingleMode = variantId === 'singola';
  const isRedLove = box.id === 'red_love';
  const accessories = (box as any).accessories || {};

  return (
    // MAIN WRAPPER: overflow-hidden fondamentale
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-x-hidden w-full">
      
      {/* HEADER SPACER */}
      <main className="flex-grow pt-20 sm:pt-32 w-full">
        
        {/* HERO MOBILE CON CAROSELLO - STESSO WIDTH DEL FORM */}
        <div className="lg:hidden w-full max-w-md mx-auto px-4 mb-6">
           <div className="relative h-[40vh] w-full rounded-[2rem] overflow-hidden shadow-lg bg-slate-200">
             <BoxCarousel boxId={box.id} boxName={box.name} price={totalPrice} compact={true} />
           </div>
        </div>

        {/* CONTENITORE PRINCIPALE CENTRATO E LIMITATO */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[calc(100vh-200px)] gap-8 px-4 sm:px-6">
          
          {/* DESKTOP SIDEBAR CON CAROSELLO */}
          <div className="hidden lg:block relative h-full">
              <div className="sticky top-32 p-4 h-[650px]">
                 <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                     <BoxCarousel boxId={box.id} boxName={box.name} price={totalPrice} />
                 </div>
              </div>
          </div>

          {/* CONFIGURATOR (LIMITATO A MAX-W-MD SU MOBILE PER ALLINEARSI ALLA FOTO) */}
          <div className="pb-32 w-full max-w-md mx-auto lg:max-w-none">
            {state.success ? (
               // SUCCESS STATE
               <div className="animate-fade-in py-6">
                 <div className="bg-white p-5 rounded-[2rem] shadow-xl border border-slate-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-rose-600" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <Heart size={40} fill="#f43f5e" className="text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Grazie di Cuore!</h2>
                        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                            Prenotazione ricevuta. <br/> Completa il pagamento in sede.
                        </p>
                        
                        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6 text-left w-full">
                            <h3 className="text-sm font-black text-red-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                                <AlertTriangle size={16} /> Pagamento Obbligatorio
                            </h3>
                            <p className="text-red-900 text-xs leading-relaxed">
                                Versa l'acconto o il saldo in negozio entro il 13/02/26.
                            </p>
                        </div>

                        <div className="border-t border-slate-100 pt-4 mb-6 w-full">
                           <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                               <div className="text-left">
                                   <p className="text-[10px] text-slate-400 uppercase font-bold">Box</p>
                                   <p className="font-bold text-sm text-slate-800">{box.name}</p>
                               </div>
                               <div className="text-right">
                                   <p className="text-[10px] text-slate-400 uppercase font-bold">Totale</p>
                                   <p className="text-lg font-extrabold text-rose-500">{totalPrice.toFixed(2)}€</p>
                               </div>
                           </div>
                        </div>

                        <div className="space-y-3 w-full">
                            <a 
                                href={`https://wa.me/${SHOP_PHONE_NUMBER}?text=${encodeURIComponent(`Ciao! Ho prenotato una Box ${box.name} a nome di... Vorrei confermare per il pagamento.`)}`}
                                className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-sm"
                            >
                                <MessageCircle size={20} fill="white" /> Avvisaci su WhatsApp
                            </a>
                            <button onClick={() => window.location.reload()} className="w-full text-slate-400 text-xs font-bold py-2">Nuovo ordine</button>
                        </div>
                    </div>
                 </div>
               </div>
            ) : (
              <form action={formAction} className="w-full space-y-6">
                
                {/* 1. SCELTA BOX */}
                <section>
                   <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                     Scegli la tua Box
                   </h3>
                   <div className="grid gap-2 w-full">
                     {BOX_TYPES.map(b => (
                        <BoxCard key={b.id} box={b} selected={box.id === b.id} onClick={() => setBox(b)} />
                     ))}
                   </div>
                   <input type="hidden" name="boxType" value={box.id} />
                </section>

                <hr className="border-slate-200/60" />

                {/* 2. CONFIGURAZIONE DIMENSIONE */}
                <section>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                        Configura
                    </h3>
                    
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-rose-100 space-y-4 w-full">
                        {box.id === 'sparkling' ? (
                            <div className="text-center py-3 bg-rose-50 rounded-xl border border-rose-100">
                                <Sparkles className="mx-auto text-rose-500 mb-1" size={20} />
                                <h4 className="font-bold text-sm text-rose-800">Edizione Limitata Singola</h4>
                            </div>
                        ) : (
                            <div>
                                <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                                    <Heart size={10} className="fill-rose-400" /> Per chi?
                                </label>
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <button type="button" onClick={() => setVariantId("singola")} 
                                        className={clsx("py-3 rounded-xl border font-bold text-xs transition-all flex flex-col items-center gap-0.5 w-full", 
                                        variantId === "singola" ? "bg-rose-500 text-white border-rose-500 shadow-md" : "bg-white text-slate-600 border-slate-100")}>
                                        <span>Singola 👤</span>
                                    </button>
                                    <button type="button" onClick={() => setVariantId("doppia")} 
                                        className={clsx("py-3 rounded-xl border font-bold text-xs transition-all flex flex-col items-center gap-0.5 w-full", 
                                        variantId === "doppia" ? "bg-rose-500 text-white border-rose-500 shadow-md" : "bg-white text-slate-600 border-slate-100")}>
                                        <span>Doppia 👥</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {isRedLove && (
                            <div className="mt-2">
                                <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2 block">Grandezza</label>
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <button type="button" onClick={() => setSizeId("small")} 
                                        className={clsx("py-2.5 rounded-xl border font-bold text-xs transition-all w-full", 
                                        sizeId === "small" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-100")}>
                                        Small
                                    </button>
                                    <button type="button" onClick={() => setSizeId("medium")} 
                                        className={clsx("py-2.5 rounded-xl border font-bold text-xs transition-all w-full", 
                                        sizeId === "medium" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-100")}>
                                        Medium
                                    </button>
                                </div>
                                <div className="mt-2 p-2 bg-rose-50 rounded-lg text-[10px] text-rose-800 border border-rose-100 flex gap-2 items-center leading-tight">
                                    <Info size={14} className="shrink-0" />
                                    {sizeId === "medium" ? "Include Spremuta e più dolcetti!" : "Spremuta a parte."}
                                </div>
                            </div>
                        )}
                    </div>
                    <input type="hidden" name="variant" value={box.id === 'sparkling' ? 'singola' : variantId} />
                    <input type="hidden" name="boxSize" value={isRedLove ? sizeId : ""} />
                </section>

                <hr className="border-slate-200/60" />
                
                {/* 3. MENÙ */}
                <section>
                   <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
                     Menù
                   </h3>
                   <div className="bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-6 w-full">
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="bg-rose-100 text-rose-600 p-1 rounded-md"><Heart size={12} className="fill-rose-600" /></div>
                           <span className="font-bold text-xs text-slate-800">Per Te</span>
                        </div>
                        <DrinkSelector label="Bevanda" currentSelection={d1} onSelect={setD1} />
                        <PastrySelector label="Dolce" currentSelection={c1} onSelect={setC1} />
                      </div>

                      {!isSingleMode && (
                          <div className="animate-fade-in pt-4 border-t border-dashed border-slate-200 w-full">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="bg-rose-100 text-rose-600 p-1 rounded-md"><Heart size={12} className="fill-rose-600" /></div>
                               <span className="font-bold text-xs text-slate-800">Per la tua Dolce Metà</span>
                            </div>
                            <DrinkSelector label="Bevanda" currentSelection={d2} onSelect={setD2} />
                            <PastrySelector label="Dolce" currentSelection={c2} onSelect={setC2} />
                          </div>
                      )}
                      
                      <input type="hidden" name="drink1" value={d1} />
                      <input type="hidden" name="croissant1" value={c1} />
                      <input type="hidden" name="drink2" value={!isSingleMode ? d2 : "Nessuna"} />
                      <input type="hidden" name="croissant2" value={!isSingleMode ? c2 : "Nessuno"} />
                   </div>
                </section>

                <hr className="border-slate-200/60" />

                {/* 4. REGALI & EXTRA */}
                <section>
                   <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">4</span>
                     Extra
                   </h3>
                   <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 space-y-3 w-full">
                      
                      {/* SPREMUTA */}
                      <div 
                           className={clsx("relative rounded-xl p-3 border-2 flex items-center justify-between cursor-pointer transition-all w-full", 
                               spremuta ? "bg-orange-50 border-orange-400" : "bg-white border-slate-100")} 
                           onClick={() => setSpremuta(!spremuta)}
                       >
                           <div className="flex items-center gap-3">
                               <div className={clsx("p-2 rounded-full shrink-0", spremuta ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-400")}>
                                   <Citrus size={16} />
                               </div>
                               <div>
                                   <h4 className="font-extrabold text-slate-800 text-xs">Spremuta</h4>
                                   <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                                       {((box as any).spremutaIncluded || (isRedLove && sizeId === 'medium')) 
                                           ? <span className="text-emerald-600 font-bold">INCLUSA</span> 
                                           : <span className="text-orange-600 font-bold">+{(box.id === 'sparkling' || (isRedLove && sizeId === 'small')) ? "1,50€" : "2,50€"}</span>
                                       }
                                   </p>
                               </div>
                           </div>
                           {spremuta && <div className="text-orange-500"><Check size={16} /></div>}
                       </div>
                       <input type="hidden" name="includeSpremuta" value={spremuta ? "on" : ""} />

                       {/* SUCCO EXTRA */}
                       <div className={clsx("relative rounded-xl p-3 border-2 transition-all w-full", succoExtra ? "bg-yellow-50 border-yellow-400" : "bg-white border-slate-100")}>
                           <div className="flex items-center justify-between cursor-pointer" onClick={() => setSuccoExtra(!succoExtra)}>
                               <div className="flex items-center gap-3">
                                   <div className={clsx("p-2 rounded-full shrink-0", succoExtra ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-500")}>
                                       <GlassWater size={16} />
                                   </div>
                                   <div>
                                       <h4 className="font-extrabold text-slate-800 text-xs">Succo Extra</h4>
                                       <p className="text-[10px] font-bold text-yellow-700 mt-0.5">
                                           +{(box as any).succoPrice || "2,00"}€
                                       </p>
                                   </div>
                               </div>
                               {succoExtra && <div className="text-yellow-600"><Check size={16} /></div>}
                           </div>

                           {succoExtra && (
                               <div className="mt-2 pt-2 border-t border-yellow-200/50 w-full">
                                   <p className="text-[9px] font-bold text-yellow-700 uppercase mb-1">Gusto:</p>
                                   {/* SUCCHI: GRID 3 COL */}
                                   <div className="grid grid-cols-3 gap-1 w-full">
                                       {SUCCHI_FLAVORS.map(gusto => (
                                           <button key={gusto} type="button" onClick={() => setSuccoFlavor(gusto)}
                                               className={clsx("px-1 py-1.5 rounded text-[9px] font-bold border truncate text-center w-full", 
                                                   succoFlavor === gusto ? "bg-yellow-400 text-white border-yellow-500" : "bg-white text-slate-600 border-slate-200")}>
                                               {gusto}
                                           </button>
                                       ))}
                                   </div>
                               </div>
                           )}
                       </div>
                       <input type="hidden" name="includeSucco" value={succoExtra ? "on" : ""} />
                       <input type="hidden" name="succoFlavor" value={succoFlavor} />

                       {/* REGALI GRID */}
                       {accessories && (
                         <div className="pt-2 border-t border-slate-100 w-full">
                             <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-2 pl-1">Regalo?</p>
                             {/* REGALI: GRID 3 COL */}
                             <div className="grid grid-cols-3 gap-2 w-full">
                                {accessories.peluche_l && <GiftCard label="Peluche L" icon="🧸" price={accessories.peluche_l.price} selected={addPelucheL} onClick={() => setAddPelucheL(!addPelucheL)} />}
                                {accessories.peluche_m && <GiftCard label="Peluche M" icon="🧸" price={accessories.peluche_m.price} selected={addPelucheM} onClick={() => setAddPelucheM(!addPelucheM)} />}
                                {accessories.rosa && <GiftCard label="Rosa+Baci" icon="🌹" price={accessories.rosa.price} selected={addRosa} onClick={() => setAddRosa(!addRosa)} />}
                             </div>
                             <input type="hidden" name="addPelucheL" value={addPelucheL ? "on" : ""} />
                             <input type="hidden" name="addPelucheM" value={addPelucheM ? "on" : ""} />
                             <input type="hidden" name="addRosa" value={addRosa ? "on" : ""} />
                         </div>
                       )}
                   </div>
                </section>

                {/* 5. DETTAGLI */}
                <section>
                   <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">5</span>
                     I tuoi Dati
                   </h3>
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4 w-full">
                       <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg w-full">
                          <button type="button" onClick={() => setDelivery('domicilio')} className={clsx("py-2.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all w-full", delivery === 'domicilio' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
                              <Bike size={14} /> Domicilio
                          </button>
                          <button type="button" onClick={() => setDelivery('ritiro')} className={clsx("py-2.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all w-full", delivery === 'ritiro' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
                              <Store size={14} /> Ritiro
                          </button>
                       </div>
                       <input type="hidden" name="deliveryType" value={delivery} />

                       <div className="w-full">
                          <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1 block">Orario</label>
                          <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar w-full">
                             {TIMES.map(t => (
                                <button key={t} type="button" onClick={() => setTime(t)} className={clsx("flex-shrink-0 px-3 py-2 rounded-lg border text-[11px] font-bold whitespace-nowrap", time === t ? "bg-slate-800 text-white border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200")}>{t}</button>
                             ))}
                          </div>
                          <input type="hidden" name="preferredTime" value={time} />
                       </div>

                       <div className="space-y-3 w-full">
                          <input type="text" name="fullName" placeholder="Nome e Cognome" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none" required />
                          <input type="tel" name="phone" placeholder="Telefono" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none" required />
                          {delivery === 'domicilio' ? (
                             <input type="text" name="address" placeholder="Indirizzo Completo" className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-rose-50/50 text-sm focus:bg-white outline-none animate-fade-in" required />
                          ) : (
                             <input type="hidden" name="address" value="RITIRO IN SEDE" />
                          )}
                       </div>
                   </div>
                </section>
                
                <PaymentLogos />

                {/* BOTTOM STICKY ACTION BAR */}
                <div className="sticky bottom-4 z-40 px-1 pb-[env(safe-area-inset-bottom)]">
                   <div className="backdrop-blur-md bg-white/70 p-2 rounded-2xl border border-white/50 shadow-2xl">
                       <SubmitButton label="Conferma" price={totalPrice} />
                       {state.message && !state.success && <div className="bg-red-50 text-red-600 p-2 rounded-lg text-center text-xs mt-2 border border-red-100 font-bold">{state.message}</div>}
                   </div>
                </div>

                <input type="hidden" name="totalPrice" value={totalPrice || 0} />
                <input type="hidden" name="quantity" value="1" />
              </form>
            )}
          </div>
        </div>
      </main>
      <div className="lg:hidden"><Footer /></div>
    </div>
  );
}