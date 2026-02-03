"use client";

import { submitOrder } from "./actions";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Bike, Check, CheckCircle2, Citrus, Heart, Info, Store, Bean, Milk, 
  ArrowRight, Banknote, CreditCard, GlassWater, Sparkles, 
  ChevronLeft, ChevronRight, MessageCircle, PhoneCall, RefreshCw, 
  AlertTriangle, Clock, MapPin, CalendarClock
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import { DRINKS_DATA, PASTRIES_DATA, TIMES, BOX_TYPES } from "@/lib/schemas";
import clsx from "clsx";

// --- COSTANTI ---

// Modifica qui il numero di telefono del negozio per WhatsApp e Chiamate
const SHOP_PHONE_NUMBER = "393715428345"; 

const SUCCHI_FLAVORS = [
  "Ace", "Albicocca", "Ananas", "Arancia", 
  "Arancia Rossa", "Frutti di Bosco", "Mango Passion", 
  "Mela", "Melograno", "Mirtillo", "Multifrutti", 
  "Pera", "Pesca", "Pompelmo"
].sort();

// Mappatura nomi file immagini come richiesto
const IMAGE_PREFIXES: Record<string, string> = {
  royal: "royal-desire",
  velvet: "velvet-dream",
  red_love: "red-love",
  sparkling: "sparkling-love"
};

// --- COMPONENTS ---

function PaymentLogos() {
  return (
    <div className="flex flex-wrap justify-center items-end gap-6 mt-4 opacity-70 scale-90">
      <div className="flex flex-col items-center gap-2">
        <Banknote size={24} className="text-slate-600" strokeWidth={1.5} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Contanti</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CreditCard size={24} className="text-slate-600" strokeWidth={1.5} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Carta</span>
      </div>
    </div>
  );
}

function SubmitButton({ label, price }: { label: string, price: number }) {
  const { pending } = useFormStatus();
  const safePrice = (price && !isNaN(price)) ? price : 0;

  return (
    <button disabled={pending} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-between px-8 items-center disabled:opacity-70 disabled:cursor-not-allowed">
       <span className="flex items-center gap-2">
         {pending ? <span className="animate-pulse">Invio in corso...</span> : <>{label} <ArrowRight size={20} className="text-rose-300" /></>}
       </span>
       <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-mono tracking-tight">{safePrice.toFixed(2)}€</span>
    </button>
  );
}

// Carosello Immagini
function BoxCarousel({ boxId, boxName, price, compact = false }: { boxId: string, boxName: string, price?: number, compact?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefix = IMAGE_PREFIXES[boxId] || "royal-desire";
  
  // Genera array [1, 2, 3, 4, 5]
  const images = Array.from({ length: 5 }, (_, i) => `/images/box/${prefix}_${i + 1}.png`);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Autoplay solo su desktop
  useEffect(() => {
    if (compact) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, compact]);

  // Reset index se cambia box
  useEffect(() => {
    setCurrentIndex(0);
  }, [boxId]);

  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Immagini */}
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
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Controlli (Freccette) */}
      <button onClick={(e) => { e.preventDefault(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
        <ChevronLeft size={24} />
      </button>
      <button onClick={(e) => { e.preventDefault(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
        <ChevronRight size={24} />
      </button>

      {/* Indicatori (Pallini) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={clsx(
              "w-2 h-2 rounded-full transition-all shadow-sm",
              idx === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white"
            )}
          />
        ))}
      </div>

      {/* Info Overlay (Solo Mobile o Compact) */}
      {compact && price !== undefined && (
        <div className="absolute bottom-5 left-5 right-5 z-20 text-white pointer-events-none">
           <h1 className="text-2xl font-extrabold shadow-black drop-shadow-md">{boxName}</h1>
           <div className="text-xl font-bold text-rose-500 bg-white px-3 py-1 rounded-lg shadow-lg inline-block mt-2">
              {price.toFixed(2)}€
           </div>
        </div>
      )}
      
      {/* Info Overlay (Solo Desktop Full) */}
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
      <p className="font-bold text-slate-400 text-xs uppercase tracking-wider pl-1">{label}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {DRINKS_DATA.map((d: any) => {
          const isSelected = baseSelection === d.label;
          return (
            <button key={d.id} type="button" onClick={() => {
                 let initial = d.label;
                 if (d.hasSub && d.subOptions && d.subOptions.length > 0) { initial += ` (${d.subOptions[0]})`; }
                 onSelect(initial);
              }}
              className={clsx("relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all h-20", isSelected ? "bg-slate-800 text-white border-slate-800 shadow-md scale-[1.02]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              <span className="text-xl mb-1">{d.icon}</span>
              <span className="text-[10px] font-bold leading-tight text-center">{d.label}</span>
            </button>
          );
        })}
      </div>
      {drinkData && (drinkData.hasCoffeeVariant || drinkData.hasMilkVariant || drinkData.hasSub || drinkData.hasSize) && (
        <div className="bg-slate-50 p-3 rounded-xl animate-fade-in border border-slate-200 relative mt-2">
           <div className="space-y-3">
              {drinkData.hasCoffeeVariant && (
                <div className="flex items-center gap-2">
                   <div className="w-6 flex justify-center"><Bean size={14} className="text-slate-400" /></div>
                   <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
                      <button type="button" onClick={() => updateVariant('coffee', 'Normale')} className={clsx("px-3 py-1 rounded-md text-[10px] font-bold transition-all", !isDeca ? "bg-rose-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50")}>Normale</button>
                      <button type="button" onClick={() => updateVariant('coffee', 'Deca')} className={clsx("px-3 py-1 rounded-md text-[10px] font-bold transition-all", isDeca ? "bg-rose-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50")}>Deca</button>
                   </div>
                </div>
              )}
              {drinkData.hasMilkVariant && (
                <div className="flex items-center gap-2">
                   <div className="w-6 flex justify-center"><Milk size={14} className="text-slate-400" /></div>
                   <div className="flex flex-wrap gap-1">
                      <button type="button" onClick={() => updateVariant('milk', 'Intero')} className={clsx("px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-colors", milkType === 'Intero' ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-slate-600 border-slate-300")}>Intero</button>
                      <button type="button" onClick={() => updateVariant('milk', 'Senza Lattosio')} className={clsx("px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-colors", milkType === 'Senza Lattosio' ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-slate-600 border-slate-300")}>No Lattosio</button>
                      <button type="button" onClick={() => updateVariant('milk', 'Soia')} className={clsx("px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-colors", milkType === 'Soia' ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-slate-600 border-slate-300")}>Soia</button>
                   </div>
                </div>
              )}
              {drinkData.hasSub && (
                <div className="flex items-center gap-2">
                   <div className="w-6 flex justify-center text-[10px] font-bold text-slate-400">Gusto</div>
                   <div className="flex gap-1">
                     {drinkData.subOptions?.map((opt: string) => (
                        <button key={opt} type="button" onClick={() => updateVariant('flavor', opt)} className={clsx("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors", currentSelection.includes(opt) ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-300")}>{opt}</button>
                     ))}
                   </div>
                </div>
              )}
              {drinkData.hasSize && (
                 <div className="flex items-center gap-2">
                    <div className="w-6 flex justify-center text-[10px] font-bold text-slate-400">Size</div>
                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
                       <button type="button" onClick={() => updateVariant('size', 'Standard')} className={clsx("px-3 py-1 rounded-md text-[10px] font-bold transition-all", sizeType === 'Standard' ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50")}>S</button>
                       <button type="button" onClick={() => updateVariant('size', 'Grande')} className={clsx("px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1", sizeType === 'Grande' ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50")}>L <span className="opacity-70 text-[8px]">+0,20€</span></button>
                    </div>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}

function PastrySelector({ label, onSelect, currentSelection }: any) {
  const specialitaKeywords = ['pasticciotto', 'graffa', 'bomba', 'polacca'];
  const cornetti = PASTRIES_DATA.filter((p: any) => !specialitaKeywords.some(k => p.id.includes(k)) && p.id !== 'nessuno');
  const specialita = PASTRIES_DATA.filter((p: any) => specialitaKeywords.some(k => p.id.includes(k)));
  const noGrazie = PASTRIES_DATA.find((p: any) => p.id === 'nessuno');

  const renderGrid = (items: any[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                "p-2 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-center pl-3 min-h-[3.5rem]",
                isSelected ? "shadow-md ring-1 ring-inset" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
               <span className={clsx("text-xs font-bold leading-tight z-10", isSelected && "scale-105 origin-left")}>{p.label}</span>
               {isSelected && (
                 <div className="absolute right-2 top-2 w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Check size={12} strokeWidth={3} color={textColor} />
                 </div>
               )}
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
       {noGrazie && (
          <button type="button" onClick={() => onSelect(noGrazie.label)} className={clsx("w-full py-2 px-4 rounded-xl border text-xs font-bold transition-all text-center mb-2", currentSelection === noGrazie.label ? "bg-slate-800 text-white border-slate-800" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100")}>❌ Nessun Dolce</button>
       )}
       <div>
         <p className="text-[10px] font-bold text-slate-400 mb-2 ml-1 opacity-80 uppercase tracking-widest">Cornetteria</p>
         {renderGrid(cornetti)}
       </div>
       {specialita.length > 0 && (
         <div>
            <p className="text-[10px] font-bold text-slate-400 mb-2 ml-1 mt-3 opacity-80 uppercase tracking-widest">Specialità</p>
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
    <div onClick={onClick} className={clsx("cursor-pointer rounded-2xl p-4 border-2 transition-all relative overflow-hidden group h-full flex flex-col", selected ? "border-rose-500 bg-rose-50/50 ring-1 ring-rose-500" : "border-slate-100 bg-white hover:border-rose-200")}>
      <div className="flex justify-between items-start mb-2">
        <h4 className={clsx("font-bold text-lg", selected ? "text-rose-600" : "text-slate-900")}>{box.name}</h4>
        {selected && <div className="bg-rose-500 text-white p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>}
      </div>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed flex-grow">{box.desc}</p>
      <div className="flex items-baseline gap-2 mt-auto">
         <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Da</span>
         <span className="text-2xl font-extrabold text-slate-800">{displayPrice.toFixed(2)}€</span>
      </div>
    </div>
  );
}

function GiftCard({ label, price, icon, selected, onClick }: any) {
    return (
        <div onClick={onClick} className={clsx("cursor-pointer rounded-xl p-3 border-2 transition-all relative flex flex-col items-center justify-center text-center gap-1 h-24", selected ? "border-rose-500 bg-rose-50 ring-1 ring-rose-500" : "border-slate-100 bg-white hover:border-rose-200")}>
            <div className="text-2xl">{icon}</div>
            <div className="text-[10px] font-bold text-slate-700 leading-tight">{label}</div>
            <div className="text-xs font-extrabold text-rose-600">+{price.toFixed(2)}€</div>
            {selected && <div className="absolute top-1 right-1 text-rose-500"><CheckCircle2 size={12} /></div>}
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
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

      <main className="flex-grow pt-32">
        
        {/* HERO MOBILE CON CAROSELLO */}
        <div className="lg:hidden relative h-[40vh] w-full mb-8 rounded-b-[2.5rem] overflow-hidden shadow-xl bg-slate-200">
          <BoxCarousel boxId={box.id} boxName={box.name} price={totalPrice} compact={true} />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[calc(100vh-200px)] gap-8 px-4">
          
          {/* DESKTOP SIDEBAR CON CAROSELLO */}
          <div className="hidden lg:block relative h-full">
              <div className="sticky top-32 p-4 h-[650px]">
                 <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                     <BoxCarousel boxId={box.id} boxName={box.name} price={totalPrice} />
                 </div>
              </div>
          </div>

          {/* CONFIGURATOR O SUCCESS */}
          <div className="pb-12">
            {state.success ? (
               // --- THANK YOU PAGE RIDISEGNATA ---
               <div className="animate-fade-in py-10">
                 <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
                    {/* Background decorativo */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-rose-600" />
                    
                    {/* CUORE PULSANTE */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-rose-50/50">
                            <div className="animate-pulse">
                                <Heart size={48} fill="#f43f5e" className="text-rose-500 drop-shadow-md" />
                            </div>
                        </div>
                        
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Grazie di Cuore!</h2>
                        <p className="text-slate-500 text-lg mb-8 leading-relaxed max-w-sm mx-auto">
                            Abbiamo ricevuto la tua prenotazione.<br/>
                            Ora manca solo l'ultimo passaggio.
                        </p>

                        {/* AVVISO PAGAMENTO CRITICO */}
                        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl mb-8 relative overflow-hidden shadow-lg shadow-red-100/50 text-left w-full">
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="bg-red-500 text-white p-2 rounded-lg shrink-0 shadow-md">
                                    <AlertTriangle size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-red-700 uppercase tracking-wide mb-1">Pagamento Richiesto</h3>
                                    <p className="text-red-900 font-medium text-sm leading-relaxed mb-3">
                                        Per confermare l'ordine è <strong>obbligatorio</strong> versare l'acconto o il saldo in negozio.
                                        <span className="block mt-1 font-bold">Senza pagamento, la box non verrà preparata.</span>
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md text-xs font-bold text-red-800 border border-red-200">
                                            <CalendarClock size={12} /> Entro le 18:00 del 13/02/26
                                        </span>
                                        <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-md text-xs font-bold text-red-800 border border-red-200">
                                            <MapPin size={12} /> Saldo in Sede
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Texture sfondo */}
                            <div className="absolute -right-4 -bottom-4 opacity-10 text-red-900 rotate-12">
                                <Store size={120} />
                            </div>
                        </div>

                        {/* Riepilogo Veloce */}
                        <div className="border-t border-slate-100 pt-6 mb-8 w-full">
                           <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                               <div className="text-left">
                                   <p className="text-xs text-slate-400 uppercase font-bold">Hai scelto</p>
                                   <p className="font-bold text-slate-800">{box.name}</p>
                               </div>
                               <div className="text-right">
                                   <p className="text-xs text-slate-400 uppercase font-bold">Totale</p>
                                   <p className="text-xl font-extrabold text-rose-500">{totalPrice.toFixed(2)}€</p>
                               </div>
                           </div>
                        </div>

                        {/* Pulsanti Azione */}
                        <div className="space-y-3 w-full">
                            <a 
                                href={`https://wa.me/${SHOP_PHONE_NUMBER}?text=${encodeURIComponent(`Ciao! Ho prenotato una Box ${box.name} a nome di... Vorrei confermare per il pagamento.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-[#20bd5a] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={22} fill="white" className="text-white" />
                                Avvisaci su WhatsApp
                            </a>

                            <a 
                                href={`tel:${SHOP_PHONE_NUMBER}`}
                                className="w-full bg-white text-slate-700 border-2 border-slate-100 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                <PhoneCall size={20} />
                                Chiamaci per dubbi
                            </a>
                            
                            <button 
                                onClick={() => window.location.reload()}
                                className="w-full text-slate-400 text-sm font-bold py-3 hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={14} /> Fai un nuovo ordine
                            </button>
                        </div>
                    </div>
                 </div>
               </div>
            ) : (
              <form action={formAction} className="max-w-xl mx-auto space-y-8">
                
                {/* 1. SCELTA BOX */}
                <section>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm flex items-center justify-center font-bold">1</span>
                     Scegli la tua Box
                   </h3>
                   <div className="grid gap-3">
                     {BOX_TYPES.map(b => (
                        <BoxCard key={b.id} box={b} selected={box.id === b.id} onClick={() => setBox(b)} />
                     ))}
                   </div>
                   <input type="hidden" name="boxType" value={box.id} />
                </section>

                <hr className="border-slate-200/60" />

                {/* 2. CONFIGURAZIONE DIMENSIONE */}
                <section className="animate-fade-in">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm flex items-center justify-center font-bold">2</span>
                        Configura Dimensione
                    </h3>
                    
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-rose-100 space-y-6 relative overflow-hidden">
                        
                        {box.id === 'sparkling' ? (
                            <div className="relative z-10 text-center py-4 bg-rose-50 rounded-2xl border border-rose-100">
                                <Sparkles className="mx-auto text-rose-500 mb-2" size={24} />
                                <h4 className="font-bold text-rose-800">Edizione Limitata Singola</h4>
                                <p className="text-xs text-rose-600">Pensiero unico e speciale.</p>
                            </div>
                        ) : (
                            <>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-[4rem] -z-0" />
                            <div className="relative z-10">
                                <label className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
                                    <Heart size={12} className="fill-rose-400" /> Per quante persone?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => setVariantId("singola")} 
                                        className={clsx("py-4 rounded-2xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1", 
                                        variantId === "singola" ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200" : "bg-white text-slate-600 border-slate-100 hover:border-rose-200")}>
                                        <span>Singola 👤</span>
                                    </button>
                                    <button type="button" onClick={() => setVariantId("doppia")} 
                                        className={clsx("py-4 rounded-2xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1", 
                                        variantId === "doppia" ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200" : "bg-white text-slate-600 border-slate-100 hover:border-rose-200")}>
                                        <span>Doppia 👥</span>
                                    </button>
                                </div>
                            </div>
                            </>
                        )}

                        {isRedLove && (
                            <div className="relative z-10">
                                <label className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 block">Grandezza Box</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => setSizeId("small")} 
                                        className={clsx("py-3 rounded-2xl border-2 font-bold text-sm transition-all", 
                                        sizeId === "small" ? "bg-slate-800 text-white border-slate-800 shadow-md" : "bg-white text-slate-600 border-slate-100")}>
                                        Small
                                    </button>
                                    <button type="button" onClick={() => setSizeId("medium")} 
                                        className={clsx("py-3 rounded-2xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center", 
                                        sizeId === "medium" ? "bg-slate-800 text-white border-slate-800 shadow-md" : "bg-white text-slate-600 border-slate-100")}>
                                        <span>Medium</span>
                                    </button>
                                </div>
                                <div className="mt-3 p-3 bg-rose-50 rounded-xl text-xs text-rose-800 border border-rose-100 flex gap-2">
                                    <Info size={16} className="shrink-0" />
                                    {sizeId === "medium" ? "Include Spremuta e più dolcetti!" : "Versione essenziale, spremuta a parte."}
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
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm flex items-center justify-center font-bold">3</span>
                     Personalizza Menù
                   </h3>
                   <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 space-y-8">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                           <div className="bg-rose-100 text-rose-600 p-1.5 rounded-lg"><Heart size={14} className="fill-rose-600" /></div>
                           <span className="font-bold text-sm text-slate-800">Per Te</span>
                        </div>
                        <DrinkSelector label="La tua bevanda" currentSelection={d1} onSelect={setD1} />
                        <PastrySelector label="Il tuo dolce" currentSelection={c1} onSelect={setC1} />
                      </div>

                      {!isSingleMode && (
                          <div className="animate-fade-in">
                            <div className="border-t border-dashed border-slate-200 mb-8 mt-8"></div>
                            <div className="flex items-center gap-2 mb-3">
                               <div className="bg-rose-100 text-rose-600 p-1.5 rounded-lg"><Heart size={14} className="fill-rose-600" /></div>
                               <span className="font-bold text-sm text-slate-800">Per la tua Dolce Metà</span>
                            </div>
                            <DrinkSelector label="La sua bevanda" currentSelection={d2} onSelect={setD2} />
                            <PastrySelector label="Il suo dolce" currentSelection={c2} onSelect={setC2} />
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
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm flex items-center justify-center font-bold">4</span>
                     Regali & Extra
                   </h3>
                   <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 space-y-4">
                      
                      {/* SPREMUTA */}
                      <div 
                           className={clsx("relative rounded-2xl p-4 border-2 flex items-center justify-between cursor-pointer transition-all", 
                               spremuta ? "bg-orange-50 border-orange-400 ring-1 ring-orange-200" : "bg-white border-slate-100 hover:border-orange-200")} 
                           onClick={() => setSpremuta(!spremuta)}
                       >
                           <div className="flex items-center gap-4">
                               <div className={clsx("p-3 rounded-full", spremuta ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-400")}>
                                   <Citrus size={20} />
                               </div>
                               <div>
                                   <h4 className="font-extrabold text-slate-800 text-sm">Spremuta d'Arancia</h4>
                                   <p className="text-xs font-medium text-slate-500 mt-0.5">
                                       {((box as any).spremutaIncluded || (isRedLove && sizeId === 'medium')) 
                                           ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">INCLUSA</span> 
                                           : <span className="text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md font-bold">+{(box.id === 'sparkling' || (isRedLove && sizeId === 'small')) ? "1,50€" : "2,50€"} cad.</span>
                                       }
                                   </p>
                               </div>
                           </div>
                           <div className={clsx("w-6 h-6 rounded-full border-2 flex items-center justify-center", spremuta ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300")}>
                               {spremuta && <Check size={14} strokeWidth={3} />}
                           </div>
                       </div>
                       <input type="hidden" name="includeSpremuta" value={spremuta ? "on" : ""} />

                       {/* SUCCO EXTRA CON GUSTI */}
                       <div 
                           className={clsx("relative rounded-2xl p-4 border-2 transition-all", 
                               succoExtra ? "bg-yellow-50 border-yellow-400 ring-1 ring-yellow-200" : "bg-white border-slate-100 hover:border-yellow-200")} 
                       >
                           {/* HEADER CLICKABLE */}
                           <div className="flex items-center justify-between cursor-pointer" onClick={() => setSuccoExtra(!succoExtra)}>
                               <div className="flex items-center gap-4">
                                   <div className={clsx("p-3 rounded-full", succoExtra ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-500")}>
                                       <GlassWater size={20} />
                                   </div>
                                   <div>
                                       <h4 className="font-extrabold text-slate-800 text-sm">Succo di Frutta (Extra)</h4>
                                       <p className="text-xs font-medium text-slate-500 mt-0.5">
                                           <span className="text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-md font-bold">+{(box as any).succoPrice || "2,00"}€</span>
                                       </p>
                                   </div>
                               </div>
                               <div className={clsx("w-6 h-6 rounded-full border-2 flex items-center justify-center", succoExtra ? "border-yellow-500 bg-yellow-500 text-white" : "border-slate-300")}>
                                   {succoExtra && <Check size={14} strokeWidth={3} />}
                               </div>
                           </div>

                           {/* SELETTORE GUSTI */}
                           {succoExtra && (
                               <div className="mt-3 pt-3 border-t border-yellow-200/50 animate-fade-in">
                                   <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide mb-2">Seleziona Gusto:</p>
                                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                       {SUCCHI_FLAVORS.map(gusto => (
                                           <button 
                                               key={gusto}
                                               type="button"
                                               onClick={() => setSuccoFlavor(gusto)}
                                               className={clsx("px-2 py-2 rounded-lg text-[11px] font-bold border transition-all text-center truncate", 
                                                   succoFlavor === gusto ? "bg-yellow-400 text-white border-yellow-500 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:bg-yellow-50")}
                                           >
                                               {gusto}
                                           </button>
                                       ))}
                                   </div>
                               </div>
                           )}
                       </div>
                       <input type="hidden" name="includeSucco" value={succoExtra ? "on" : ""} />
                       <input type="hidden" name="succoFlavor" value={succoFlavor} />

                       {/* REGALI */}
                       {accessories && (
                         <div className="pt-4 border-t border-slate-100">
                             <p className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-3 pl-1">Aggiungi un Regalo</p>
                             <div className="grid grid-cols-3 gap-2">
                                {accessories.peluche_l && (
                                   <GiftCard label="Peluche L" icon="🧸" price={accessories.peluche_l.price} selected={addPelucheL} onClick={() => setAddPelucheL(!addPelucheL)} />
                                )}
                                {accessories.peluche_m && (
                                   <GiftCard label="Peluche M" icon="🧸" price={accessories.peluche_m.price} selected={addPelucheM} onClick={() => setAddPelucheM(!addPelucheM)} />
                                )}
                                {accessories.rosa && (
                                   <GiftCard label="Rosa + Baci" icon="🌹" price={accessories.rosa.price} selected={addRosa} onClick={() => setAddRosa(!addRosa)} />
                                )}
                             </div>
                             <input type="hidden" name="addPelucheL" value={addPelucheL ? "on" : ""} />
                             <input type="hidden" name="addPelucheM" value={addPelucheM ? "on" : ""} />
                             <input type="hidden" name="addRosa" value={addRosa ? "on" : ""} />
                         </div>
                       )}
                   </div>
                </section>

                {/* 5. DETTAGLI FINALI */}
                <section>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm flex items-center justify-center font-bold">5</span>
                     Dettagli Ordine
                   </h3>
                   <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 space-y-6">
                       <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                          <button type="button" onClick={() => setDelivery('domicilio')} className={clsx("py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all", delivery === 'domicilio' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
                              <Bike size={16} /> Domicilio
                          </button>
                          <button type="button" onClick={() => setDelivery('ritiro')} className={clsx("py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all", delivery === 'ritiro' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
                              <Store size={16} /> Ritiro
                          </button>
                       </div>
                       <input type="hidden" name="deliveryType" value={delivery} />

                       <div>
                          <label className="text-xs font-bold text-slate-500 ml-1 mb-2 block">Orario Preferito</label>
                          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                             {TIMES.map(t => (
                                <button key={t} type="button" onClick={() => setTime(t)} className={clsx("flex-shrink-0 px-4 py-3 rounded-xl border text-xs font-bold whitespace-nowrap transition-all", time === t ? "bg-slate-800 text-white border-slate-800 shadow-md" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-white")}>{t}</button>
                             ))}
                          </div>
                          <input type="hidden" name="preferredTime" value={time} />
                       </div>

                       <div className="space-y-4">
                          <input type="text" name="fullName" placeholder="Nome e Cognome" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 outline-none transition-colors text-sm" required />
                          <input type="tel" name="phone" placeholder="Telefono" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 outline-none transition-colors text-sm" required />
                          {delivery === 'domicilio' ? (
                             <input type="text" name="address" placeholder="Indirizzo (Via, Civico...)" className="w-full px-5 py-4 rounded-xl border border-rose-200 bg-rose-50/50 focus:bg-white focus:border-rose-400 outline-none transition-colors animate-fade-in text-sm" required />
                          ) : (
                             <input type="hidden" name="address" value="RITIRO IN SEDE" />
                          )}
                       </div>
                   </div>
                </section>

                <div className="sticky bottom-4 z-30">
                  <SubmitButton label="Conferma Ordine" price={totalPrice} />
                  {state.message && !state.success && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-xs mt-2 border border-red-100 font-bold shadow-lg">{state.message}</div>}
                </div>
                
                <div className="text-center pb-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pagamenti Accettati</p>
                    <PaymentLogos />
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