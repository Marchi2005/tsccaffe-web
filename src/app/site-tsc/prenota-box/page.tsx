"use client";

import { submitOrder } from "./actions";
import {
  Bike, Check, CheckCircle2, Citrus, Heart, Info, Store, Bean, Milk,
  ArrowRight, Banknote, CreditCard, GlassWater, Sparkles,
  ChevronLeft, ChevronRight, MessageCircle, PhoneCall, RefreshCw,
  AlertTriangle, CalendarClock, MapPin, Flower, Gift, Star, Tag
} from "lucide-react";
import OrderQRSection from "@/components/OrderQRSection";
import Image from "next/image";
import Script from "next/script";
import { useState, useEffect, useActionState, useCallback, useRef } from "react";
import { useFormStatus } from "react-dom";
import { DRINKS_DATA, PASTRIES_DATA, TIMES, BOX_TYPES } from "@/lib/schemas";
import clsx from "clsx";

// --- COSTANTI & PREZZI PROMO ---

const SHOP_PHONE_NUMBER = "393715428345";

const SUCCHI_FLAVORS = [
  "Ace", "Albicocca", "Ananas", "Arancia",
  "Arancia Rossa", "Frutti di Bosco", "Mango Passion",
  "Mela", "Mirtillo", "Multifrutti",
  "Pera", "Pesca", "Pompelmo"
].sort();

const IMAGE_PREFIXES: Record<string, string> = {
  royal: "royal-desire",
  velvet: "velvet-dream",
  red_love: "red-love",
  sparkly: "sparkly-valentine"
};

// Mappa Prezzi: [Prezzo Scontato, Prezzo Originale]
const PRICING_MAP: any = {
  royal: {
    singola: { current: 25, original: 28 },
    doppia: { current: 30, original: 35 }
  },
  velvet: {
    singola: { current: 21, original: 25 },
    doppia: { current: 25, original: 30 }
  },
  red_love: {
    small: {
      singola: { current: 13, original: 15 },
      doppia: { current: 15, original: 18 }
    },
    medium: {
      singola: { current: 18, original: 20 },
      doppia: { current: 20, original: 23 }
    }
  },
  sparkly: {
    singola: { current: 10, original: 13 },
    doppia: { current: 0, original: 0 }
  }
};

// --- CONFIGURAZIONE MAPPE ---
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const SHOP_LAT = 41.064929499779254;
const SHOP_LNG = 14.36849096600742;
const MAX_DELIVERY_KM = 8.50;

// Helper per calcolare la distanza
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- COMPONENTS ---

function PaymentLogos() {
  return (
    <div className="flex flex-wrap justify-center items-end gap-3 opacity-70 scale-90 mb-2">
      <div className="flex flex-col items-center gap-0.5">
        <Banknote size={16} className="text-slate-600" strokeWidth={1.5} />
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Contanti</span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <CreditCard size={16} className="text-slate-600" strokeWidth={1.5} />
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Carta</span>
      </div>
    </div>
  );
}

function SubmitButton({ label, price, disabled }: { label: string, price: number, disabled?: boolean }) {
  const { pending } = useFormStatus();
  const safePrice = (price && !isNaN(price)) ? price : 0;

  return (
    <div className="w-full bg-white border-t border-slate-200 p-4 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
      <button
        disabled={pending || disabled}
        type="submit"
        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-between px-6 items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <span className="flex items-center gap-2 text-sm uppercase tracking-wider">
          {pending ? <span className="animate-pulse">Attendi...</span> : <>{label} <ArrowRight size={20} className="text-rose-300" /></>}
        </span>
        <span className="bg-white/20 px-3 py-1 rounded-lg text-lg font-mono tracking-tight">{safePrice.toFixed(2)}€</span>
      </button>
      <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">Pagamento in CONTANTI da effettuare in SEDE entro il 13/02/2026!!</p>
    </div>
  );
}

function BoxCarousel({ boxId, boxName, price, originalPrice, compact = false }: { boxId: string, boxName: string, price?: number, originalPrice?: number, compact?: boolean }) {
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
          <Image src={img} alt={`${boxName} - ${index + 1}`} fill className="object-cover" priority={index === 0} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {!compact && (
        <>
          <button onClick={(e) => { e.preventDefault(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:block"><ChevronLeft size={24} /></button>
          <button onClick={(e) => { e.preventDefault(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:block"><ChevronRight size={24} /></button>
        </>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {images.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentIndex(idx)} className={clsx("w-1.5 h-1.5 rounded-full transition-all shadow-sm", idx === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white")} />
        ))}
      </div>

      {compact && price !== undefined && (
        <div className="absolute bottom-3 left-4 right-4 z-20 text-white pointer-events-none">
          <h1 className="text-lg font-extrabold shadow-black drop-shadow-md">{boxName}</h1>
          <div className="flex items-baseline gap-2 mt-0.5">
            <div className="text-base font-bold text-rose-500 bg-white px-2 py-0.5 rounded-lg shadow-lg">
              {price.toFixed(2)}€
            </div>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-white/80 line-through decoration-white/80 drop-shadow-md font-bold">{originalPrice.toFixed(2)}€</span>
            )}
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
            {originalPrice && originalPrice > price && (
              <div className="text-xl text-white/80 line-through decoration-white/80 font-bold mb-1 mr-1">{originalPrice.toFixed(2)}€</div>
            )}
            <div className="text-5xl font-extrabold text-rose-500 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
              {price.toFixed(2)}€
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SELECTORS ---
function DrinkSelector({ label, onSelect, currentSelection }: any) {
  const baseSelection = currentSelection ? currentSelection.split(" (")[0] : "";
  const drinkData = DRINKS_DATA.find(d => d.label === baseSelection) as any;

  const updateVariant = (type: 'coffee' | 'milk' | 'flavor' | 'size', value: string) => {
    if (!drinkData) return;
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
    <div className="space-y-1.5 w-full">
      <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider pl-1">{label}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
        {DRINKS_DATA.map((d: any) => {
          const isSelected = baseSelection === d.label;
          return (
            <button key={d.id} type="button" onClick={() => {
              let initial = d.label;
              if (d.hasSub && d.subOptions && d.subOptions.length > 0) { initial += ` (${d.subOptions[0]})`; }
              onSelect(initial);
            }}
              className={clsx("relative flex items-center justify-start px-2 py-2 rounded-lg border transition-all h-auto min-h-[3rem] w-full gap-2", isSelected ? "bg-slate-800 text-white border-slate-800 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              <span className="text-lg shrink-0">{d.icon}</span>
              <span className="text-[10px] font-bold leading-tight text-left break-words">{d.label}</span>
            </button>
          );
        })}
      </div>
      {drinkData && (drinkData.hasCoffeeVariant || drinkData.hasMilkVariant || drinkData.hasSub || drinkData.hasSize) && (
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 relative mt-1 w-full">
          <div className="space-y-2">
            {drinkData.hasCoffeeVariant && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-4 flex justify-center"><Bean size={12} className="text-slate-400" /></div>
                <div className="flex flex-wrap gap-1">
                  <button type="button" onClick={() => updateVariant('coffee', 'Normale')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", !isDeca ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-500 border-slate-200")}>Normale</button>
                  <button type="button" onClick={() => updateVariant('coffee', 'Deca')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", isDeca ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-500 border-slate-200")}>Deca</button>
                </div>
              </div>
            )}
            {drinkData.hasMilkVariant && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-4 flex justify-center"><Milk size={12} className="text-slate-400" /></div>
                <div className="flex flex-wrap gap-1">
                  <button type="button" onClick={() => updateVariant('milk', 'Intero')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", milkType === 'Intero' ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-slate-600 border-slate-200")}>Intero</button>
                  <button type="button" onClick={() => updateVariant('milk', 'Senza Lattosio')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", milkType === 'Senza Lattosio' ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-slate-600 border-slate-200")}>No Latt.</button>
                  <button type="button" onClick={() => updateVariant('milk', 'Soia')} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", milkType === 'Soia' ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-slate-600 border-slate-200")}>Soia</button>
                </div>
              </div>
            )}
            {drinkData.hasSub && (
              <div className="flex flex-col gap-1 w-full">
                <p className="text-[9px] font-bold text-slate-400 ml-6">Gusto:</p>
                <div className="flex flex-wrap gap-1 pl-6">
                  {drinkData.subOptions?.map((opt: string) => (
                    <button key={opt} type="button" onClick={() => updateVariant('flavor', opt)} className={clsx("px-2 py-1.5 rounded text-[9px] font-bold border", currentSelection.includes(opt) ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-200")}>{opt}</button>
                  ))}
                </div>
              </div>
            )}
            {drinkData.hasSize && (
              <div className="flex flex-col gap-1 w-full">
                <p className="text-[9px] font-bold text-slate-400 ml-6">Dimensione:</p>
                <div className="flex gap-2 pl-6 w-full">
                  <button type="button" onClick={() => updateVariant('size', 'Standard')} className={clsx("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex-1 text-center", sizeType === 'Standard' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200")}>Normale</button>
                  <button type="button" onClick={() => updateVariant('size', 'Grande')} className={clsx("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex-1 text-center flex items-center justify-center gap-1", sizeType === 'Grande' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200")}>
                    Grande <span className="opacity-70 text-[8px] font-normal">+0,20€</span>
                  </button>
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
  // STATO PER LE PREFERENZE ALIMENTARI
  const [dietary, setDietary] = useState<'none' | 'vegan' | 'gluten_free'>('none');

  const specialitaKeywords = ['pasticciotto', 'graffa', 'bomba', 'polacca'];
  const cornetti = PASTRIES_DATA.filter((p: any) => !specialitaKeywords.some(k => p.id.includes(k)) && p.id !== 'nessuno');
  const specialita = PASTRIES_DATA.filter((p: any) => specialitaKeywords.some(k => p.id.includes(k)));
  const noGrazie = PASTRIES_DATA.find((p: any) => p.id === 'nessuno');

  // Helper per controllare se un prodotto è disabilitato in base alla dieta
  const isOptionDisabled = (p: any) => {
    if (dietary === 'none') return false;
    const l = p.label.toLowerCase();

    // VEGANA: Solo Frutti di Bosco, Albicocca e Vuoto abilitati
    if (dietary === 'vegan') {
      return !(l.includes('bosco') || l.includes('albicocca') || l.includes('vuoto'));
    }

    // SENZA GLUTINE: Solo Nutella e Vuoto abilitati
    if (dietary === 'gluten_free') {
      return !(l.includes('nutella') || l.includes('vuoto'));
    }
    return false;
  };

  // Gestione click: aggiunge automaticamente il tag (Vegano/Senza Glutine) al nome del dolce
  const handleSelect = (label: string) => {
    let finalString = label;
    // Rimuoviamo eventuali tag precedenti per evitare "Vuoto (Vegano) (Vegano)"
    finalString = finalString.replace(" (Vegano)", "").replace(" (Senza Glutine)", "");

    if (dietary === 'vegan') finalString += " (Vegano)";
    if (dietary === 'gluten_free') finalString += " (Senza Glutine)";

    onSelect(finalString);
  };

  // Se cambio dieta, resetto la selezione se non è compatibile
  useEffect(() => {
    if (currentSelection && currentSelection !== 'Nessuno') {
      // Se la selezione attuale non è compatibile con la nuova dieta, resetta o aggiorna il tag
      const baseLabel = currentSelection.split(" (")[0];
      // Logica semplificata: deseleziona se cambio filtro
      // (Opzionale: potresti forzare un reset qui, ma lasciamo che l'utente scelga)
    }
  }, [dietary]);

  const renderGrid = (items: any[]) => (
    <div className="grid grid-cols-2 gap-2">
      {items.map((p) => {
        // Controllo selezione flessibile (ignora il tag tra parentesi per l'evidenziazione)
        const isSelected = currentSelection.startsWith(p.label);
        const isDisabled = isOptionDisabled(p);

        const textColor = isDisabled ? '#94a3b8' : (p.text || (p.id.includes('cioccolato') || p.id === 'nutella' ? 'white' : '#334155'));

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => !isDisabled && handleSelect(p.label)}
            disabled={isDisabled}
            style={
              isDisabled
                ? { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' }
                : (isSelected ? { backgroundColor: p.bg, borderColor: p.border, color: textColor } : {})
            }
            className={clsx(
              "p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-center pl-3 min-h-[3.5rem]",
              isDisabled ? "opacity-50 cursor-not-allowed" : "active:scale-95",
              !isDisabled && (isSelected ? "shadow-md ring-1 ring-inset" : "bg-white border-slate-200 text-slate-600")
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

      {/* SCELTA DIETA FACOLTATIVA */}
      <div className="flex gap-2 mb-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
        <button
          type="button"
          onClick={() => setDietary(dietary === 'vegan' ? 'none' : 'vegan')}
          className={clsx("flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all", dietary === 'vegan' ? "bg-green-100 text-green-700 border-green-200 shadow-sm" : "bg-white text-slate-500 border-transparent hover:bg-slate-100")}
        >
          🌱 Vegano
        </button>
        <button
          type="button"
          onClick={() => setDietary(dietary === 'gluten_free' ? 'none' : 'gluten_free')}
          className={clsx("flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all", dietary === 'gluten_free' ? "bg-amber-100 text-amber-700 border-amber-200 shadow-sm" : "bg-white text-slate-500 border-transparent hover:bg-slate-100")}
        >
          🌾 Senza Glutine
        </button>
      </div>

      {noGrazie && (
        <button
          type="button"
          onClick={() => onSelect(noGrazie.label)}
          className={clsx("w-full py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center mb-2", currentSelection === noGrazie.label ? "bg-slate-800 text-white border-slate-800" : "bg-slate-50 text-slate-400 border-slate-200")}
        >
          ❌ Nessun Dolce
        </button>
      )}

      {/* CORNETTERIA */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 mb-2 ml-1 opacity-80 uppercase tracking-widest flex items-center gap-1">
          🥐 Cornetteria
        </p>
        {renderGrid(cornetti)}
      </div>

      {/* SPECIALITÀ (Con margine extra) */}
      {specialita.length > 0 && (
        <div className="mt-6 pt-2">
          <p className="text-[10px] font-bold text-slate-400 mb-2 ml-1 opacity-80 uppercase tracking-widest flex items-center gap-1">
            🍩 Specialità
          </p>
          {renderGrid(specialita)}
        </div>
      )}

      {/* WARNING CELIACHIA (Solo se GF + Nutella) */}
      {dietary === 'gluten_free' && currentSelection.startsWith('Nutella') && (
        <div className="mt-3 bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 items-start animate-fade-in">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
          <p className="text-[10px] text-amber-800 leading-tight font-medium">
            <strong>Attenzione:</strong> Il prodotto potrebbe contenere tracce di frumento.
            Scelta sconsigliata a persone gravemente celiache.
          </p>
        </div>
      )}
    </div>
  );
}

function BoxCard({ box, selected, onClick }: any) {
  let displayPrice = 0;
  let originalPrice = 0;

  const pricingNode = PRICING_MAP[box.id];
  if (pricingNode) {
    if (pricingNode.singola && pricingNode.singola.current) {
      displayPrice = pricingNode.singola.current;
      originalPrice = pricingNode.singola.original;
    } else if (pricingNode.small && pricingNode.small.singola) {
      displayPrice = pricingNode.small.singola.current;
      originalPrice = pricingNode.small.singola.original;
    }
  } else {
    displayPrice = box.price || 0;
  }

  const isBestSeller = box.id === 'royal';

  // 1. DEFINISCI LA CONDIZIONE DI DISABILITAZIONE
  // Verifica che l'ID sia esattamente quello usato nel tuo DB (es. 'velvet-dream', 'velvet_dream', ecc.)
  const isDisabled = box.id === 'velvet';

  return (
    <div 
      // 2. BLOCCA IL CLICK
      onClick={isDisabled ? undefined : onClick} 
      className={clsx(
        "rounded-xl p-3 border-2 transition-all relative overflow-hidden group h-full flex flex-col w-full",
        
        // 3. GESTIONE CLASSI (Disabilitato vs Normale)
        isDisabled 
          ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100 grayscale" // Stile Disabilitato
          : "cursor-pointer", // Stile Attivo (cursore)

        // Logica di selezione (solo se NON disabilitato)
        !isDisabled && selected 
          ? "border-rose-500 bg-rose-50/50 ring-1 ring-rose-500" 
          : !isDisabled 
            ? "border-slate-100 bg-white hover:border-rose-200" 
            : ""
      )}
    >

      {isBestSeller && !isDisabled && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-1 rounded-bl-xl z-20 shadow-sm flex items-center gap-1">
          <Star size={8} fill="currentColor" /> BEST SELLER
        </div>
      )}

      {/* (Opzionale) Badge "Non disponibile" */}
      {isDisabled && (
        <div className="absolute top-0 right-0 bg-slate-200 text-slate-500 text-[8px] font-black px-2 py-1 rounded-bl-xl z-20">
          ESAURITO
        </div>
      )}

      <div className="flex justify-between items-start mb-1">
        <h4 className={clsx("font-bold text-sm", selected && !isDisabled ? "text-rose-600" : "text-slate-900")}>
          {box.name}
        </h4>

        {selected && !isDisabled && (
          <div className={clsx("bg-rose-500 text-white p-0.5 rounded-full transition-all", isBestSeller ? "mt-5 mr-1" : "")}>
            <Check size={10} strokeWidth={3} />
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-slate-500 mb-2 leading-tight flex-grow">{box.desc}</p>
      
      <div className="flex items-baseline gap-1 mt-auto">
        <span className="text-[9px] font-bold text-slate-400 uppercase">Da</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-extrabold text-slate-800">{displayPrice.toFixed(2)}€</span>
          {originalPrice > displayPrice && (
            <span className="text-[10px] text-rose-400 line-through decoration-rose-400 font-bold">{originalPrice.toFixed(2)}€</span>
          )}
        </div>
      </div>
    </div>
  );
}

function GiftCard({ label, price, icon, selected, onClick, isPromo }: any) {
  const fakeOriginal = price + 5.00;
  return (
    <div onClick={onClick} className={clsx("cursor-pointer rounded-lg p-1 border-2 transition-all relative flex flex-col items-center justify-center text-center gap-0.5 min-h-[4rem] w-full overflow-visible", selected ? "border-rose-500 bg-rose-50 ring-1 ring-rose-500" : "border-slate-100 bg-white hover:border-rose-200")}>
      {isPromo && (
        <div className="absolute -top-2.5 -right-1 bg-rose-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-0.5 transform rotate-2">
          <Tag size={6} /> OFFERTA
        </div>
      )}
      <div className="text-lg">{icon}</div>
      <div className="text-[8px] font-bold text-slate-700 leading-tight break-words w-full px-0.5">{label}</div>
      <div className="flex flex-col items-center leading-none mt-0.5">
        {isPromo && <span className="text-[7px] text-slate-400 line-through decoration-slate-400 font-bold">{fakeOriginal.toFixed(2)}€</span>}
        <div className={clsx("text-[9px] font-extrabold", isPromo ? "text-rose-600" : "text-rose-600")}>+{price.toFixed(2)}€</div>
      </div>
      {selected && <div className="absolute top-0.5 left-0.5 text-rose-500"><CheckCircle2 size={10} /></div>}
    </div>
  );
}

const initialState = { success: false, message: "", errors: {} };

export default function PrenotaBoxPage() {

  const [state, formAction] = useActionState(submitOrder, initialState);

  // STATI
  const [box, setBox] = useState(BOX_TYPES[0]);
  const [variantId, setVariantId] = useState("doppia");
  const [sizeId, setSizeId] = useState("medium");

  const [delivery, setDelivery] = useState("domicilio");
  const [time, setTime] = useState(TIMES[1]);

  // STATO PAGAMENTO (NUOVO)
  const [paymentMethod, setPaymentMethod] = useState("instore"); // 'instore' | 'card'

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
  const [originalPriceForTotal, setOriginalPriceForTotal] = useState(0);

  // --- STATI PER GOOGLE MAPS ---
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);

  // Inizializza Autocomplete quando script caricato
  useEffect(() => {
    const google = (window as any).google;

    if (isMapsLoaded && delivery === 'domicilio' && addressInputRef.current && google && google.maps && google.maps.places) {

      try {
        if (!autocompleteRef.current) {
          autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
            types: ['address'],
            componentRestrictions: { country: 'it' },
            fields: ['geometry', 'formatted_address']
          });

          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place && place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              const dist = calculateDistance(SHOP_LAT, SHOP_LNG, lat, lng);

              if (dist > MAX_DELIVERY_KM) {
                setAddressError(`Troppo lontano (${dist.toFixed(1)}km). Max ${MAX_DELIVERY_KM}km.`);
                setAddress("");
              } else {
                setAddressError(null);
                setAddress(place.formatted_address || "");
              }
            }
          });
        }
      } catch (e) {
        console.error("Errore inizializzazione Maps:", e);
      }
    }
  }, [isMapsLoaded, delivery]);

  // RESET
  useEffect(() => {
    if (box.id === "sparkly") {
      setVariantId("singola");
    } else {
      setVariantId("doppia");
    }
    setSizeId("medium");
    setSpremuta(false);
    setSuccoExtra(false);
    setSuccoFlavor("Ace");
    setAddPelucheL(false);
    setAddPelucheM(false);
    setAddRosa(false);
  }, [box.id]);

  // CALCOLO PREZZI
  useEffect(() => {
    let final = 0;
    let original = 0;

    // 1. Box Base
    let boxPrices = { current: 0, original: 0 };
    const pNode = (typeof PRICING_MAP !== 'undefined') ? PRICING_MAP[box.id] : null;

    if (pNode) {
      if (box.id === 'red_love') {
        boxPrices = pNode[sizeId]?.[variantId] || { current: 0, original: 0 };
      } else {
        boxPrices = pNode[variantId] || { current: 0, original: 0 };
      }
    } else {
      if (box.id === 'red_love') {
        const s = (box as any).sizes?.find((s: any) => s.id === sizeId);
        const v = s?.variants?.find((v: any) => v.id === variantId);
        boxPrices = v ? { current: v.price, original: v.originalPrice || v.price } : { current: 0, original: 0 };
      } else if ((box as any).variants) {
        const v = (box as any).variants.find((v: any) => v.id === variantId);
        boxPrices = v ? { current: v.price, original: v.originalPrice || v.price } : { current: 0, original: 0 };
      } else {
        boxPrices = { current: (box as any).price || 0, original: (box as any).originalPrice || 0 };
      }
    }

    final += boxPrices.current;
    original += (boxPrices.original > 0 ? boxPrices.original : boxPrices.current);

    const isSingle = variantId === 'singola';

    // 2. Spremuta
    if (spremuta) {
      const isRedLoveMedium = (box.id === 'red_love' && sizeId === 'medium');
      let isIncluded = (box as any).spremutaIncluded || isRedLoveMedium;
      if (!isIncluded) {
        const priceSpremuta = (box.id === 'sparkly' || (box.id === 'red_love' && sizeId === 'small')) ? 1.50 : 2.50;
        const qty = isSingle ? 1 : 2;
        final += (priceSpremuta * qty);
        original += (priceSpremuta * qty);
      }
    }

    // 3. Succo
    if (succoExtra) {
      const p = (box as any).succoPrice || 1.70;
      final += p;
      original += p;
    }

    // 4. Regali
    const acc = (box as any).accessories;
    if (acc) {
      if (addPelucheL) {
        final += acc.peluche_l.price;
        original += (box.id === 'royal' ? acc.peluche_l.price + 5 : acc.peluche_l.price);
      }
      if (addPelucheM) {
        final += acc.peluche_m.price;
        original += (box.id === 'royal' ? acc.peluche_m.price + 5 : acc.peluche_m.price);
      }
      if (addRosa) {
        final += acc.rosa.price;
        original += acc.rosa.price;
      }
    }

    // 5. Menu
    if (d1.includes("Grande")) { final += 0.20; original += 0.20; }
    if (!isSingle && d2.includes("Grande")) { final += 0.20; original += 0.20; }

    setTotalPrice(final);
    setOriginalPriceForTotal(original);
  }, [box, variantId, sizeId, spremuta, succoExtra, addPelucheL, addPelucheM, addRosa, d1, d2]);

  const isSingleMode = variantId === 'singola';
  const isRedLove = box.id === 'red_love';
  const isRoyal = box.id === 'royal';
  const accessories = (box as any).accessories || {};

  const getBoxPrice = (bId: string, vId: string, sId?: string) => {
    if (typeof PRICING_MAP === 'undefined') {
      return { current: 0, original: 0 };
    }
    const pNode = PRICING_MAP[bId];
    if (!pNode) return { current: 0, original: 0 };
    if (bId === 'red_love' && sId) return pNode[sId][vId];
    return pNode[vId];
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col overflow-x-hidden w-full">

      {/* CSS PER FORZARE L'AUTOCOMPLETE SOPRA A TUTTO */}
      <style jsx global>{`
        .pac-container {
            z-index: 99999 !important;
            margin-top: 5px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            border: 1px solid #e2e8f0;
            font-family: inherit;
        }
        .pac-item {
            padding: 10px 15px;
            font-size: 13px;
            cursor: pointer;
        }
        .pac-item:hover {
            background-color: #f1f5f9;
        }
        .pac-icon {
            display: none; 
        }
      `}</style>

      {/* SCRIPT GOOGLE MAPS CORRETTO */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => setIsMapsLoaded(true)}
      />

      <main className="flex-grow pt-20 sm:pt-32 w-full">

        {/* HERO MOBILE */}
        <div className="lg:hidden w-full max-w-[400px] mx-auto px-4 mb-4">
          <div className="relative h-[35vh] w-full rounded-[1.5rem] overflow-hidden shadow-lg bg-slate-200">
            <BoxCarousel boxId={box.id} boxName={box.name} price={totalPrice} compact={true} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[calc(100vh-200px)] gap-8 px-4 sm:px-6">
          <div className="hidden lg:block relative h-full">
            <div className="sticky top-32 p-4 h-[650px]">
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <BoxCarousel boxId={box.id} boxName={box.name} price={totalPrice} />
              </div>
            </div>
          </div>

          <div className="pb-32 w-full max-w-[400px] mx-auto lg:max-w-none px-4 lg:px-0">
            {state.success ? (
              <div className="animate-fade-in py-8 px-4 w-full flex justify-center">
                <div className="bg-white p-0 rounded-[2.5rem] shadow-2xl shadow-rose-100/50 border border-slate-100 text-center relative overflow-hidden max-w-sm w-full">

                  {/* DECORAZIONE TOP: Sfumatura morbida */}
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-50 to-white z-0" />

                  <div className="relative z-10 flex flex-col items-center p-8 pb-6">

                    {/* ICONA ANIMATA */}
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-rose-100 border-4 border-rose-50 animate-bounce-slow">
                      <Heart size={42} fill="#fb7185" className="text-rose-400" />
                    </div>

                    <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Grazie di cuore!</h2>
                    <p className="text-slate-500 font-medium mb-8">La tua prenotazione è stata registrata.</p>

                    {/* BOX PAGAMENTO IN SEDE */}
                    <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl mb-8 text-left w-full relative overflow-hidden group">
                      {/* Piccola decorazione laterale */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-300" />

                      <h3 className="text-sm font-extrabold text-orange-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <Store size={18} className="text-orange-500" />
                        Un ultimo passaggio
                      </h3>

                      <p className="text-orange-900/80 text-sm leading-relaxed font-medium">
                        Per confermare definitivamente il tuo box, ti aspettiamo in sede per il saldo entro il <span className="text-orange-700 font-black bg-orange-100 px-1 rounded">13 Febbraio</span>.
                      </p>
                    </div>

                    {/* --- 2. NUOVO INSERIMENTO: TICKET DIGITALE --- */}
                    <div className="w-full mb-6">
                      {/* Usiamo state.orderId perché è lì che la action salva l'ID */}
                      {state?.orderId ? (
                        <OrderQRSection orderId={state.orderId} />
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 animate-pulse text-center">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Generazione Ticket...
                          </p>
                        </div>
                      )}
                    </div>
                    {/* --------------------------------------------- */}

                  </div>

{/* BOTTONI AZIONE (Footer grigio chiaro) */}
<div className="bg-slate-50 p-6 pt-4 border-t border-slate-100">
  <div className="space-y-3 w-full">
    
    {/* WHATSAPP */}
    <a
      href={`https://wa.me/393715428345?text=${encodeURIComponent(
        `Ciao! Ho prenotato una Box ${box.name} (Ordine: ${state?.orderId || ""}). Avrei bisogno di alcune informazioni e vorrei sapere...`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm"
    >
      <MessageCircle size={20} fill="white" />
      Contattaci su WhatsApp
    </a>

    {/* CHIAMATA CLASSICA */}
    <a
      href="tel:+393715428345"
      className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      Chiamaci in sede
    </a>

    {/* NUOVO ORDINE */}
    <button
      onClick={() => window.location.reload()}
      className="w-full text-slate-400 hover:text-slate-600 text-[10px] font-bold py-2 transition-colors uppercase tracking-widest"
    >
      Effettua un altro ordine
    </button>
  </div>
</div>
                </div>
              </div>
            ) : (
              <form action={formAction} className="w-full space-y-4">

                <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
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

                <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    Configura
                  </h3>
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-rose-100 space-y-3 w-full">
                    {box.id === 'sparkly' ? (
                      <div className="text-center py-2 bg-rose-50 rounded-xl border border-rose-100">
                        <Sparkles className="mx-auto text-rose-500 mb-1" size={18} />
                        <h4 className="font-bold text-xs text-rose-800">Singola (Ltd. Ed.)</h4>
                        <p className="text-[10px] text-rose-600 mt-1 font-bold">10€ <s className="text-rose-300">13€</s></p>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[9px] font-bold text-rose-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                          <Heart size={10} className="fill-rose-400" /> Per chi?
                        </label>
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <button type="button" onClick={() => setVariantId("singola")}
                            className={clsx("py-2.5 rounded-xl border font-bold text-[10px] transition-all flex flex-col items-center gap-0.5 w-full",
                              variantId === "singola" ? "bg-rose-500 text-white border-rose-500 shadow-sm" : "bg-white text-slate-600 border-slate-100")}>
                            <span>Singola 👤</span>
                            <span className="opacity-90 font-normal">
                              {getBoxPrice(box.id, 'singola', isRedLove ? sizeId : undefined).current}€
                              <s className="text-[9px] opacity-70 ml-1">{getBoxPrice(box.id, 'singola', isRedLove ? sizeId : undefined).original}€</s>
                            </span>
                          </button>
                          <button type="button" onClick={() => setVariantId("doppia")}
                            className={clsx("py-2.5 rounded-xl border font-bold text-[10px] transition-all flex flex-col items-center gap-0.5 w-full",
                              variantId === "doppia" ? "bg-rose-500 text-white border-rose-500 shadow-sm" : "bg-white text-slate-600 border-slate-100")}>
                            <span>Doppia 👥</span>
                            <span className="opacity-90 font-normal">
                              {getBoxPrice(box.id, 'doppia', isRedLove ? sizeId : undefined).current}€
                              <s className="text-[9px] opacity-70 ml-1">{getBoxPrice(box.id, 'doppia', isRedLove ? sizeId : undefined).original}€</s>
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {isRedLove && (
                      <div className="mt-2 pt-2 border-t border-rose-50">
                        <label className="text-[9px] font-bold text-rose-400 uppercase tracking-wider mb-2 block">Grandezza</label>
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <button type="button" onClick={() => setSizeId("small")}
                            className={clsx("py-2 rounded-xl border font-bold text-[10px] transition-all w-full flex flex-col items-center",
                              sizeId === "small" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-100")}>
                            <span>Small</span>
                            <span className="font-normal opacity-80 text-[9px] mt-0.5">Base</span>
                          </button>
                          <button type="button" onClick={() => setSizeId("medium")}
                            className={clsx("py-2 rounded-xl border font-bold text-[10px] transition-all w-full flex flex-col items-center",
                              sizeId === "medium" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-100")}>
                            <span>Medium</span>
                            <span className="font-normal opacity-80 text-[9px] mt-0.5 flex items-center gap-1"><Star size={8} fill="currentColor" /> Best Seller</span>
                          </button>
                        </div>
                        {sizeId === "medium" ? (
                          <div className="mt-2 p-2.5 bg-rose-50 rounded-lg border border-rose-200 shadow-sm animate-fade-in">
                            <p className="text-[10px] text-rose-900 font-bold mb-1 flex items-center gap-1"><Sparkles size={10} className="text-rose-500" /> Pacchetto Medium Include:</p>
                            <ul className="text-[9px] text-rose-700 space-y-0.5 pl-1"><li>✅ <b>Spremuta d'Arancia</b> (Inclusa)</li><li>✅ <b>Dolcetti Sorpresa</b> Extra</li><li>✅ Accesso a <b>Orsetto M Scontato</b></li></ul>
                          </div>
                        ) : (
                          <div className="mt-2 p-2 bg-slate-50 rounded-lg text-[9px] text-slate-500 border border-slate-100 flex gap-2 items-center leading-tight"><Info size={12} className="shrink-0" />Versione Small essenziale. Spremuta esclusa.</div>
                        )}
                      </div>
                    )}
                  </div>
                  <input type="hidden" name="variant" value={box.id === 'sparkly' ? 'singola' : variantId} />
                  <input type="hidden" name="boxSize" value={isRedLove ? sizeId : ""} />
                </section>

                <hr className="border-slate-200/60" />

                <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    Menù
                  </h3>
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 space-y-5 w-full">
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-2"><div className="bg-rose-100 text-rose-600 p-1 rounded-md"><Heart size={10} className="fill-rose-600" /></div><span className="font-bold text-[10px] text-slate-800">Per Lui / Lei ( 1 )</span></div>
                      <DrinkSelector label="Bevanda" currentSelection={d1} onSelect={setD1} />
                      <PastrySelector label="Dolce" currentSelection={c1} onSelect={setC1} />
                    </div>
                    {!isSingleMode && (
                      <div className="animate-fade-in pt-4 border-t border-dashed border-slate-200 w-full">
                        <div className="flex items-center gap-2 mb-2"><div className="bg-rose-100 text-rose-600 p-1 rounded-md"><Heart size={10} className="fill-rose-600" /></div><span className="font-bold text-[10px] text-slate-800">Per Lui / Lei ( 2 )</span></div>
                        <DrinkSelector label="Bevanda" currentSelection={d2} onSelect={setD2} />
                        <PastrySelector label="Dolce" currentSelection={c2} onSelect={setC2} />
                      </div>
                    )}
                    <input type="hidden" name="drink1" value={d1} /><input type="hidden" name="croissant1" value={c1} />
                    <input type="hidden" name="drink2" value={!isSingleMode ? d2 : "Nessuna"} /><input type="hidden" name="croissant2" value={!isSingleMode ? c2 : "Nessuno"} />
                  </div>
                </section>

                <hr className="border-slate-200/60" />

                <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    Extra
                  </h3>
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 space-y-2 w-full">

                    <div className={clsx("relative rounded-xl p-2.5 border-2 flex items-center justify-between cursor-pointer transition-all w-full", spremuta ? "bg-orange-50 border-orange-400" : "bg-white border-slate-100")} onClick={() => setSpremuta(!spremuta)}>
                      <div className="flex items-center gap-2">
                        <div className={clsx("p-1.5 rounded-full shrink-0", spremuta ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-400")}><Citrus size={14} /></div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-[10px]">Spremuta</h4>
                          <p className="text-[9px] font-medium text-slate-500 mt-0.5">
                            {((box as any).spremutaIncluded || (isRedLove && sizeId === 'medium')) ? <span className="text-emerald-600 font-bold">INCLUSA</span> : <span className="text-orange-600 font-bold">+{(box.id === 'sparkly' || (isRedLove && sizeId === 'small')) ? "1,50€" : "2,50€"}</span>}
                          </p>
                          {!((box as any).spremutaIncluded || (isRedLove && sizeId === 'medium')) && !spremuta && (<p className="text-[8px] text-orange-400 leading-tight mt-0.5">Aggiungila per completare la colazione!</p>)}
                        </div>
                      </div>
                      {spremuta && <div className="text-orange-500"><Check size={14} /></div>}
                    </div>
                    <input type="hidden" name="includeSpremuta" value={spremuta ? "on" : ""} />

                    <div className={clsx("relative rounded-xl p-2.5 border-2 transition-all w-full", succoExtra ? "bg-yellow-50 border-yellow-400" : "bg-white border-slate-100")}>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setSuccoExtra(!succoExtra)}>
                        <div className="flex items-center gap-2">
                          <div className={clsx("p-1.5 rounded-full shrink-0", succoExtra ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-500")}><GlassWater size={14} /></div>
                          <div><h4 className="font-extrabold text-slate-800 text-[10px]">Succo Extra</h4><p className="text-[9px] font-bold text-yellow-700 mt-0.5">+{(box as any).succoPrice || "2,00"}€</p></div>
                        </div>
                        {succoExtra && <div className="text-yellow-600"><Check size={14} /></div>}
                      </div>
                      {succoExtra && (
                        <div className="mt-2 pt-2 border-t border-yellow-200/50 w-full">
                          <p className="text-[9px] font-bold text-yellow-700 uppercase mb-1">Gusto:</p>
                          <div className="grid grid-cols-3 gap-1 w-full">{SUCCHI_FLAVORS.map(gusto => (<button key={gusto} type="button" onClick={() => setSuccoFlavor(gusto)} className={clsx("px-1 py-1 rounded text-[9px] font-bold border truncate text-center w-full", succoFlavor === gusto ? "bg-yellow-400 text-white border-yellow-500" : "bg-white text-slate-600 border-slate-200")}>{gusto}</button>))}</div>
                        </div>
                      )}
                    </div>
                    <input type="hidden" name="includeSucco" value={succoExtra ? "on" : ""} /><input type="hidden" name="succoFlavor" value={succoFlavor} />

                    {accessories && (
                      <div className="pt-2 border-t border-slate-100 w-full">
                        <p className="font-bold text-slate-400 text-[9px] uppercase tracking-wider mb-2 pl-1">Regalo?</p>
                        <div className="grid grid-cols-3 gap-1.5 w-full">
                          {accessories.peluche_l && <GiftCard label="Peluche L" icon="🧸" price={accessories.peluche_l.price} selected={addPelucheL} onClick={() => setAddPelucheL(!addPelucheL)} isPromo={isRoyal} />}
                          {/*accessories.peluche_m && <GiftCard label="Peluche M" icon="🧸" price={accessories.peluche_m.price} selected={addPelucheM} onClick={() => setAddPelucheM(!addPelucheM)} isPromo={isRoyal} />*/}
                          {accessories.rosa && <GiftCard label="Rosa+Baci" icon="🌹" price={accessories.rosa.price} selected={addRosa} onClick={() => setAddRosa(!addRosa)} />}
                        </div>
                        <input type="hidden" name="addPelucheL" value={addPelucheL ? "on" : ""} /><input type="hidden" name="addPelucheM" value={addPelucheM ? "on" : ""} /><input type="hidden" name="addRosa" value={addRosa ? "on" : ""} />
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">5</span>
                    I tuoi Dati
                  </h3>
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 space-y-3 w-full">
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg w-full">
                      <button type="button" onClick={() => setDelivery('domicilio')} className={clsx("py-2 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 transition-all w-full", delivery === 'domicilio' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}><Bike size={12} /> Domicilio</button>
                      <button type="button" onClick={() => setDelivery('ritiro')} className={clsx("py-2 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 transition-all w-full", delivery === 'ritiro' ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}><Store size={12} /> Ritiro</button>
                    </div>
                    <input type="hidden" name="deliveryType" value={delivery} />
                    <div className="w-full">
                      <label className="text-[9px] font-bold text-slate-500 ml-1 mb-1 block">Orario</label>
                      <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar w-full">{TIMES.map(t => (<button key={t} type="button" onClick={() => setTime(t)} className={clsx("flex-shrink-0 px-3 py-1.5 rounded-lg border text-[10px] font-bold whitespace-nowrap", time === t ? "bg-slate-800 text-white border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200")}>{t}</button>))}</div>
                      <input type="hidden" name="preferredTime" value={time} />
                    </div>
                    <div className="space-y-2 w-full">
                      <input type="text" name="fullName" placeholder="Nome e Cognome" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white outline-none" required />
                      <input type="tel" name="phone" placeholder="Telefono" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white outline-none" required />

                      {/* INPUT INDIRIZZO CON GOOGLE MAPS */}
                      {delivery === 'domicilio' ? (
                        <div className="space-y-2">
                          <input
                            ref={addressInputRef}
                            type="text"
                            name="address"
                            autoComplete="off"
                            placeholder="Indirizzo (Inizia a digitare...)"
                            className={clsx(
                              "w-full px-5 py-4 rounded-xl border bg-rose-50/50 text-base focus:bg-white outline-none transition-colors animate-fade-in",
                              addressError ? "border-red-500 focus:border-red-500 text-red-600" : "border-rose-200 focus:border-rose-400"
                            )}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                          />
                          {addressError && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 animate-pulse">
                              <AlertTriangle size={14} /> {addressError}
                            </div>
                          )}
                        </div>
                      ) : (
                        <input type="hidden" name="address" value="RITIRO IN SEDE" />
                      )}
                    </div>
                  </div>
                </section>

                {/* --- SEZIONE PAGAMENTO (NUOVA) --- */}
                <section className="mt-6 mb-8">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 px-1">Metodo di Pagamento</h3>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Bottone Paga in Negozio */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("instore")}
                      className={clsx(
                        "relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-2",
                        paymentMethod === "instore"
                          ? "border-slate-800 bg-slate-50 shadow-md"
                          : "border-slate-100 bg-white text-slate-400"
                      )}
                    >
                      <Store size={24} className={paymentMethod === "instore" ? "text-slate-800" : "text-slate-300"} />
                      <span className="text-xs font-bold">In Cassa</span>
                      {paymentMethod === "instore" && (
                        <div className="absolute top-3 right-3 w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </button>

                    {/* Bottone Paga con Carta */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={clsx(
                        "relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-2",
                        paymentMethod === "card"
                          ? "border-indigo-600 bg-indigo-50/50 shadow-md"
                          : "border-slate-100 bg-white text-slate-400"
                      )}
                    >
                      <CreditCard size={24} className={paymentMethod === "card" ? "text-indigo-600" : "text-slate-300"} />
                      <span className="text-xs font-bold">Carta Online</span>
                      {paymentMethod === "card" && (
                        <div className="absolute top-3 right-3 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* INFO CONDIZIONALI */}
                  <div className="animate-fade-in">
                    {paymentMethod === "instore" ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start text-amber-900">
                        <AlertTriangle className="shrink-0 text-amber-500 mt-0.5" size={20} />
                        <div className="text-xs">
                          <p className="font-bold mb-1">Pagamento richiesto in sede</p>
                          <p className="opacity-80 leading-relaxed">
                            Per confermare l'ordine, dovrai passare a pagare in negozio entro il:
                          </p>
                          <p className="font-bold text-amber-700 mt-1 text-sm">Giovedì 13/02</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex gap-3 items-start text-indigo-900">
                        <div className="bg-white p-1.5 rounded-full shadow-sm">
                          <CreditCard className="shrink-0 text-indigo-600" size={16} />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold mb-1">Pagamento Sicuro Stripe</p>
                          <p className="opacity-80 leading-relaxed mb-2">
                            Verrai reindirizzato al checkout sicuro per completare l'ordine con Carta di Credito, Debito o Prepagata.
                          </p>
                          <div className="flex gap-2 opacity-60">
                            <div className="h-4 w-8 bg-slate-900 rounded flex items-center justify-center text-[6px] text-white font-bold">VISA</div>
                            <div className="h-4 w-8 bg-slate-900 rounded flex items-center justify-center text-[6px] text-white font-bold">MC</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
                {/* Campo nascosto per passare la scelta al server */}
                <input type="hidden" name="paymentMethod" value={paymentMethod} />

                <div className="sticky bottom-3 z-40 px-1 pb-[env(safe-area-inset-bottom)]">
                  <div className="backdrop-blur-md bg-white/80 p-1.5 rounded-2xl border border-white/50 shadow-2xl">
                    <SubmitButton label={paymentMethod === 'card' ? "Vai al Pagamento" : "Conferma Ordine"} price={totalPrice} />
                    {state.message && !state.success && <div className="bg-red-50 text-red-600 p-1.5 rounded-lg text-center text-[10px] mt-1 border border-red-100 font-bold">{state.message}</div>}
                  </div>
                </div>

                <input type="hidden" name="totalPrice" value={totalPrice || 0} />
                <input type="hidden" name="quantity" value="1" />
              </form>
            )}
          </div>
        </div>
      </main>
      <div className="lg:hidden"></div>
    </div>
  );
}