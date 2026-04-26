"use client";

import { submitOrder } from "./actions";
import {
  Bike, Check, CheckCircle2, Citrus, Store, Bean, Milk,
  ArrowRight, CreditCard, GlassWater, MessageCircle, AlertTriangle, Users,
  Coffee, Croissant, Minus, Plus, Info, ShieldCheck, Banknote,
  User, PartyPopper, Utensils, MoreHorizontal, Ticket, Calendar
} from "lucide-react";
import OrderQRSection from "@/components/OrderQRSection";
import Script from "next/script";
import { useState, useEffect, useActionState, useRef, Fragment, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { DRINKS_DATA, PASTRIES_DATA, TIMES } from "@/lib/schemas";
import { supabase } from "@/lib/supabase"; // 🆕 Importiamo supabase per il check codici
import clsx from "clsx";

// ... (Costanti e funzioni getDrinkPrice/getPastryPrice rimangono IDENTICHE) ...
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const SHOP_LAT = 41.064929499779254;
const SHOP_LNG = 14.36849096600742;
const MAX_DELIVERY_KM = 8.50;

const SUCCHI_FLAVORS = [
  "Ace", "Albicocca", "Ananas", "Arancia",
  "Arancia Rossa", "Frutti di Bosco", "Mango Passion",
  "Mela", "Mirtillo", "Multifrutti", "Pera", "Pesca", "Pompelmo"
].sort();

const PRICE_SPREMUTA = 2.50;
const PRICE_SUCCO = 2.50;

const getDrinkPrice = (drinkStr: string) => {
  if (!drinkStr) return 0;
  const str = drinkStr.toLowerCase();
  if (str.includes("grazie") || str.includes("nessun")) return 0;
  let base = 1.50;
  if (str.includes("espresso") && !str.includes("ginseng") && !str.includes("latte")) base = 1.20;
  if (str.includes("latte macchiato")) base = 1.80;
  if (str.includes("latte bianco") || str === "latte") base = 1.50;
  let extra = 0;
  if (str.includes("grande")) { extra = str.includes("ginseng") ? 0.30 : 0.20; }
  return base + extra;
};

const getPastryPrice = (pastryStr: string) => {
  if (!pastryStr) return 0;
  const str = pastryStr.toLowerCase();
  if (str.includes("nessun") || str.includes("grazie")) return 0;
  let base = 1.30;
  if (str.includes("vuoto")) base = 1.20;
  if (str.includes("nutella")) base = 1.50;
  if (str.includes("senza glutine") && str.includes("vuoto")) base = 1.30;
  return base;
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function SubmitButton({ label, price, disabled }: { label: string, price: number, disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending || disabled}
      type="submit"
      className="w-full bg-amber-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-amber-900/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-between px-6 items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      <span className="flex items-center gap-2 text-sm uppercase tracking-wider">
        {pending ? <span className="animate-pulse">Attendi...</span> : <>{label} <ArrowRight size={20} className="text-amber-300" /></>}
      </span>
      <span className="bg-white/20 px-3 py-1 rounded-lg text-lg font-mono tracking-tight">{(price || 0).toFixed(2)}€</span>
    </button>
  );
}

function DrinkVariantOptions({ drinkData, currentSelection, onSelect }: { drinkData: any, currentSelection: string, onSelect: (v: string) => void }) {
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

function DrinkSelector({ label, onSelect, currentSelection }: any) {
  const baseSelection = currentSelection ? currentSelection.split(" (")[0] : "";
  const drinkData = DRINKS_DATA.find(d => d.label === baseSelection) as any;

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

function PastrySelector({ label, onSelect, currentSelection }: any) {
  const [dietary, setDietary] = useState<'none' | 'vegan' | 'gluten_free'>('none');
  const specialitaKeywords = ['pasticciotto', 'graffa', 'bomba', 'polacca'];
  const cornetti = PASTRIES_DATA.filter((p: any) => !specialitaKeywords.some(k => p.id.includes(k)) && p.id !== 'nessuno');
  const specialita = PASTRIES_DATA.filter((p: any) => specialitaKeywords.some(k => p.id.includes(k)));
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

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  orderId?: string;
};

const initialState: ActionState = { success: false, message: "" };

const PEOPLE_OPTIONS = [
  { val: 1, icon: User, label: "Solo io ☕" },
  { val: 2, icon: Users, label: "In compagnia 👥" },
  { val: 3, icon: Users, label: "Piccolo gruppo 🎉" },
  { val: 4, icon: Utensils, label: "Tavolata 🍽️" },
  { val: '5+', icon: PartyPopper, label: "Gruppo numeroso 🚀" },
];

export default function PrenotaColazionePage() {
  const [state, formAction] = useActionState(submitOrder, initialState);

  // --- STATI PRINCIPALI ---
  const [peopleCount, setPeopleCount] = useState<number | '5+'>(1);
  const [menus, setMenus] = useState([
    { drink: "Cappuccino", pastry: "Cornetto Vuoto" },
    { drink: "Espresso", pastry: "Cornetto Vuoto" },
    { drink: "Espresso", pastry: "Cornetto Vuoto" },
    { drink: "Espresso", pastry: "Cornetto Vuoto" }
  ]);

// Stato 5+ Mode
  const [bulkDrinks, setBulkDrinks] = useState<Record<string, number>>({});
  const [bulkPastries, setBulkPastries] = useState<Record<string, number>>({});
  const [bulkDietary, setBulkDietary] = useState<'none' | 'vegan' | 'gluten_free'>('none');

  const [customizingDrink, setCustomizingDrink] = useState<string | null>(null);
  const [tempDrinkSelection, setTempDrinkSelection] = useState<string>("");

  const [delivery, setDelivery] = useState("domicilio");
  // Inizializziamo vuoto, verrà gestito dagli useEffect sotto
  const [time, setTime] = useState(""); 
  const [paymentMethod, setPaymentMethod] = useState("instore");
  const [notes, setNotes] = useState("");

  const [isTomorrow, setIsTomorrow] = useState(false);

  // --- 🆕 1. LOGICA ORARI DISPONIBILI (Lead Time 45 Minuti) ---
  const availableTimes = useMemo(() => {
    // Se è domani, tutti gli orari in TIMES sono validi
    if (isTomorrow) return TIMES;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Impostiamo 45 minuti di preavviso minimo per preparazione e rider
    const LEAD_TIME = 45; 
    const nowInMinutes = currentHour * 60 + currentMinute + LEAD_TIME;

    return TIMES.filter(t => {
      // Gestiamo sia il formato "08:30" che "08:00 - 09:00" prendendo il primo orario
      const timePart = t.includes(" - ") ? t.split(" - ")[0] : t;
      const [h, m] = timePart.split(':').map(Number);
      const slotInMinutes = h * 60 + m;
      
      return slotInMinutes >= nowInMinutes;
    });
  }, [isTomorrow]);

  // --- 🆕 2. AUTO-SWITCH SU DOMANI SE OGGI È CHIUSO ---
  useEffect(() => {
    // Se oggi non ci sono più slot disponibili (es. sono le 10:30) 
    // e siamo ancora su "Oggi", attiviamo automaticamente "Domani"
    if (!isTomorrow && availableTimes.length === 0) {
      setIsTomorrow(true);
    }
  }, [availableTimes.length, isTomorrow]);

  // --- 🆕 3. RESET E AUTO-SELECT ORARIO ---
  useEffect(() => {
    // Se l'orario scelto non è tra quelli disponibili (perché è passato il tempo o abbiamo cambiato giorno)
    if (time && !availableTimes.includes(time)) {
      setTime("");
    }

    // Se non abbiamo un orario selezionato e ci sono orari disponibili, 
    // preselezioniamo il primo per aiutare l'utente
    if (!time && availableTimes.length > 0) {
       setTime(availableTimes[0]);
    }
  }, [availableTimes, time]);

  const [spremuteCount, setSpremuteCount] = useState(0);
  const [succhiCounters, setSucchiCounters] = useState<Record<string, number>>({});

  // 🆕 STATI PER CODICI SCONTO / CARD B&B
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Maps
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);

  useEffect(() => {
    const google = (window as any).google;
    if (isMapsLoaded && delivery === 'domicilio' && addressInputRef.current && google?.maps?.places) {
      if (!autocompleteRef.current) {
        autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'], componentRestrictions: { country: 'it' }, fields: ['geometry', 'formatted_address']
        });
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.geometry?.location) {
            const dist = calculateDistance(SHOP_LAT, SHOP_LNG, place.geometry.location.lat(), place.geometry.location.lng());
            if (dist > MAX_DELIVERY_KM) { setAddressError(`Troppo lontano (${dist.toFixed(1)}km).`); setAddress(""); }
            else { setAddressError(null); setAddress(place.formatted_address || ""); }
          }
        });
      }
    }
  }, [isMapsLoaded, delivery]);

  // FUNZIONE APPLICA SCONTO
  const handleApplyPromo = async () => {
    if (!promoCodeInput) return;
    setIsValidatingPromo(true);
    setPromoError(null);

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCodeInput.toUpperCase().trim())
        .single();

      if (error || !data) {
        setPromoError(error?.code === 'PGRST116' ? "Codice non valido." : "Errore nel controllo codice.");
        setAppliedPromo(null);
        return;
      }

      const now = new Date();
      if (!data.is_active) {
        setPromoError("Questo codice non è più attivo.");
      } else if (data.expires_at && new Date(data.expires_at) < now) {
        setPromoError("Questo codice è scaduto.");
      } else if (data.max_uses && data.current_uses >= data.max_uses) {
        setPromoError("Limite utilizzi raggiunto.");
      } else {
        setAppliedPromo(data);
        setPromoError(null);
      }
    } catch (err) {
      setPromoError("Errore di connessione.");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const updateMenu = (index: number, field: 'drink' | 'pastry', value: string) => {
    const newMenus = [...menus]; newMenus[index][field] = value; setMenus(newMenus);
  };

  const updateBulk = (type: 'drink' | 'pastry', item: string, delta: number) => {
    if (type === 'drink') setBulkDrinks(prev => ({ ...prev, [item]: Math.max(0, (prev[item] || 0) + delta) }));
    else setBulkPastries(prev => ({ ...prev, [item]: Math.max(0, (prev[item] || 0) + delta) }));
  };

  const updateSucco = (flavor: string, delta: number) => {
    setSucchiCounters(prev => ({ ...prev, [flavor]: Math.max(0, (prev[flavor] || 0) + delta) }));
  };

  const isBulkOptionDisabled = (p: any) => {
    if (bulkDietary === 'none') return false;
    const l = p.label.toLowerCase();
    if (bulkDietary === 'vegan') return !(l.includes('bosco') || l.includes('albicocca') || l.includes('vuoto'));
    if (bulkDietary === 'gluten_free') return !(l.includes('nutella') || l.includes('vuoto'));
    return false;
  };

  // 💰 CALCOLO CARRELLO & PREZZI (AGGIORNATO)
  const cartData = useMemo(() => {
    let items: Array<{ name: string, qty: number, price: number }> = [];
    let total = 0;

    if (peopleCount === '5+') {
      Object.entries(bulkDrinks).forEach(([name, qty]) => {
        const price = getDrinkPrice(name);
        if (qty > 0 && price > 0) { items.push({ name, qty, price }); total += price * qty; }
      });
      Object.entries(bulkPastries).forEach(([name, qty]) => {
        const price = getPastryPrice(name);
        if (qty > 0 && price > 0) { items.push({ name, qty, price }); total += price * qty; }
      });
    } else {
      for (let i = 0; i < Number(peopleCount); i++) {
        const dPrice = getDrinkPrice(menus[i].drink);
        if (dPrice > 0) { items.push({ name: `P${i + 1} - ${menus[i].drink}`, qty: 1, price: dPrice }); total += dPrice; }
        const pPrice = getPastryPrice(menus[i].pastry);
        if (pPrice > 0) { items.push({ name: `P${i + 1} - ${menus[i].pastry}`, qty: 1, price: pPrice }); total += pPrice; }
      }
    }

    if (spremuteCount > 0) { items.push({ name: "Spremuta d'Arancia", qty: spremuteCount, price: PRICE_SPREMUTA }); total += PRICE_SPREMUTA * spremuteCount; }
    Object.entries(succhiCounters).forEach(([flavor, qty]) => {
      if (qty > 0) { items.push({ name: `Succo (${flavor})`, qty, price: PRICE_SUCCO }); total += PRICE_SUCCO * qty; }
    });

    if (paymentMethod === 'card') {
      const stripeFee = Math.round(((total * 0.015) + 0.25) * 100) / 100;
      items.push({ name: "Commissioni Stripe", qty: 1, price: stripeFee });
      total += stripeFee;
    }

    // 🆕 APPLICAZIONE SCONTO PROMO / CARD B&B
    let promoDiscountValue = 0;
    if (appliedPromo) {
      if (appliedPromo.discount_type === 'percentage') {
        promoDiscountValue = Math.round((total * (appliedPromo.discount_value / 100)) * 100) / 100;
      } else {
        promoDiscountValue = Number(appliedPromo.discount_value);
      }

      // Non andare mai sotto zero
      promoDiscountValue = Math.min(total, promoDiscountValue);

      if (promoDiscountValue > 0) {
        items.push({ name: `🎟️ Codice: ${appliedPromo.code}`, qty: 1, price: -promoDiscountValue });
        total -= promoDiscountValue;
      }
    }

    const finalTotal = Math.floor(total * 10) / 10;
    const roundingDiscount = Math.round((total - finalTotal) * 100) / 100;

    if (roundingDiscount > 0) {
      items.push({ name: "🎁 Sconto Arrotondamento", qty: 1, price: -roundingDiscount });
      total = finalTotal;
    }

    return { items, total, promoDiscountApplied: promoDiscountValue };
  }, [peopleCount, menus, bulkDrinks, bulkPastries, spremuteCount, succhiCounters, paymentMethod, appliedPromo]);

  const hasGlutenFreeNutella = cartData.items.some(i => i.name.toLowerCase().includes('senza glutine') && i.name.toLowerCase().includes('nutella'));

  const ScontrinoRiepilogo = () => (
    <div className="bg-[#fdfbf7] p-6 rounded-sm shadow-xl relative w-full font-mono text-sm border border-[#e8e4db]">
      <div className="absolute -top-[5px] left-0 w-full h-[6px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZmRmYmY3Ii8+PC9zdmc+')] bg-repeat-x z-10" />
      <div className="flex flex-col items-center mb-6 border-b-2 border-dashed border-[#e8e4db] pb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-800 mb-2">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
        <h4 className="font-bold text-amber-950 uppercase tracking-widest text-lg text-center leading-tight">Il tuo momento<br />di gusto ☕</h4>
        <p className="text-amber-800/60 text-[10px] mt-2 uppercase tracking-widest">TSC Caffè</p>
      </div>
      <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto no-scrollbar pr-2">
        {cartData.items.length === 0 ? (
          <p className="text-center text-amber-800/50 italic text-xs py-4">Nessun articolo selezionato.</p>
        ) : (
          cartData.items.map((item, idx) => (
            <div key={idx} className={clsx("flex justify-between items-start gap-2", item.price < 0 ? "text-emerald-700 font-bold" : "text-amber-950")}>
              <div className="flex-1 leading-tight">
                <span className="font-bold">{item.qty}x</span> <span className="opacity-90 ml-1">{item.name}</span>
              </div>
              <div className="text-right whitespace-nowrap font-medium pt-0.5">
                {(item.price * item.qty).toFixed(2)}€
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t-2 border-dashed border-[#e8e4db] pt-4 flex justify-between items-center text-amber-950">
        <span className="font-black uppercase tracking-wider text-base">Totale</span>
        <span className="font-black text-xl">{cartData.total.toFixed(2)}€</span>
      </div>
      <div className="absolute -bottom-[5px] left-0 w-full h-[6px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZmRmYmY3Ii8+PC9zdmc+')] bg-repeat-x rotate-180 z-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col w-full max-w-[100vw] overflow-x-hidden md:overflow-x-clip">
      <Script src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`} strategy="afterInteractive" onLoad={() => setIsMapsLoaded(true)} />

      <main className="flex-grow pt-20 sm:pt-32 w-full max-w-[100vw] flex flex-col">
        <div className="max-w-7xl w-full mx-auto grid md:grid-cols-12 min-h-[calc(100vh-200px)] gap-4 md:gap-8 px-4 sm:px-6 items-start">

          <div className="md:col-span-7 lg:col-span-8 pb-32 w-full max-w-full sm:max-w-[420px] mx-auto md:max-w-none overflow-x-hidden sm:overflow-x-visible">
            {state.success ? (
              // ... (Schermata Successo Invariata) ...
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
                      {state?.orderId ? <OrderQRSection orderId={state.orderId} /> : <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 animate-pulse text-center"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generazione Ticket...</p></div>}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 pt-4 border-t border-slate-100">
                    <div className="space-y-3 w-full">
                      <a href={`https://wa.me/393715428345`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 transition-all transform flex items-center justify-center gap-2 text-sm">
                        <MessageCircle size={20} fill="white" /> Contattaci su WhatsApp
                      </a>
                      <button onClick={() => window.location.reload()} className="w-full text-slate-400 text-[10px] font-bold py-2 uppercase tracking-widest">Effettua un altro ordine</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form action={formAction} className="w-full space-y-6">

                {/* --- 1. NUMERO PERSONE --- */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    Chi è a colazione?
                  </h3>
                  <div className="grid grid-cols-1 min-[350px]:grid-cols-2 sm:grid-cols-5 gap-2 w-full">
                    {PEOPLE_OPTIONS.map(opt => {
                      const Icon = opt.icon;
                      const isSelected = peopleCount === opt.val;
                      return (
                        <button key={opt.val} type="button" onClick={() => setPeopleCount(opt.val as number | '5+')} className={clsx("py-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5", isSelected ? "bg-amber-900 text-white border-amber-900 shadow-md" : "bg-white text-slate-600 border-slate-100 hover:border-amber-200")}>
                          <Icon size={20} className={isSelected ? "text-amber-300" : "text-slate-400"} />
                          <span className="font-bold text-sm leading-none">{opt.val}</span>
                          <span className={clsx("text-[9px] leading-tight text-center px-1", isSelected ? "text-amber-100" : "text-slate-500")}>{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                  <input type="hidden" name="boxType" value={`Colazione per ${peopleCount}`} />
                  <input type="hidden" name="quantity" value={peopleCount === '5+' ? 5 : peopleCount} />
                </section>

                <hr className="border-slate-200/60" />

                {/* --- 2. MENU DINAMICO --- */}
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

                <hr className="border-slate-200/60" />

                {/* --- 3. EXTRA --- */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    Aggiungi un tocco in più
                  </h3>
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 space-y-3 w-full">
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

                <hr className="border-slate-200/60" />

                {/* --- 🆕 SECTION: CODICE SCONTO / CARD B&B --- */}
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

                <hr className="border-slate-200/60" />

                {/* --- 4. NOTE (Diventa 5) --- */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">5</span>
                    Note per lo Staff
                  </h3>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 w-full">
                    <textarea
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Es. Bevande Non Zuccherate, cappuccino senza schiuma, suonare al citofono 'Rossi', attenti al gatto..."
                      className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-amber-300 transition-colors resize-none"
                    />
                  </div>
                </section>

                <hr className="border-slate-200/60" />

                {/* --- 6. DATI --- */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">6</span>
                    I tuoi Dati
                  </h3>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4 w-full">

                    {/* 🕒 TOGGLE OGGI / DOMANI */}
                    <div className={clsx(
                      "p-3 rounded-xl border transition-colors mb-2",
                      isTomorrow ? "bg-orange-50 border-orange-100" : "bg-slate-50 border-slate-100"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Calendar className={clsx("w-4 h-4", isTomorrow ? "text-orange-600" : "text-slate-400")} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
                              {isTomorrow ? "Per Domani" : "Per Oggi"}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              {isTomorrow ? "Prenota per domani mattina" : "Ordina per questa mattina"}
                            </p>
                          </div>
                        </div>

                        {/* Mostriamo il toggle solo se ci sono orari disponibili oggi, 
            altrimenti forziamo domani senza possibilità di errore */}
                        {TIMES.some(t => {
                          const [h, m] = t.split(':').map(Number);
                          const now = new Date();
                          return (h * 60 + m) >= (now.getHours() * 60 + now.getMinutes() + 45);
                        }) ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsTomorrow(!isTomorrow);
                              setTime("");
                            }}
                            className={clsx(
                              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                              isTomorrow ? "bg-orange-600" : "bg-slate-200"
                            )}
                          >
                            <span className={clsx(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                              isTomorrow ? "translate-x-6" : "translate-x-1"
                            )} />
                          </button>
                        ) : (
                          <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md uppercase">
                            Solo Domani
                          </span>
                        )}
                      </div>
                    </div>

                    {/* SELETTORE DOMICILIO/RITIRO */}
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl w-full">
                      <button type="button" onClick={() => setDelivery('domicilio')} className={clsx("py-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 transition-all w-full", delivery === 'domicilio' ? "bg-white shadow-sm text-amber-900" : "text-slate-500")}><Bike size={14} /> Domicilio</button>
                      <button type="button" onClick={() => setDelivery('ritiro')} className={clsx("py-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 transition-all w-full", delivery === 'ritiro' ? "bg-white shadow-sm text-amber-900" : "text-slate-500")}><Store size={14} /> Ritiro</button>
                    </div>
                    <input type="hidden" name="deliveryType" value={delivery} />

                    {/* SELETTORE ORARIO */}
                    <div className="w-full">
                      <label className="text-[10px] font-bold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">Orario Desiderato</label>

                      {/* 📢 Messaggio Dinamico: Appare se oggi è terminato o troppo tardi */}
                      {availableTimes.length === 0 && !isTomorrow && (
                        <div className="mb-4 p-3 bg-amber-100 border border-amber-200 rounded-xl flex items-start gap-2 animate-fade-in">
                          <Info size={16} className="text-amber-900 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-amber-900 leading-tight">
                            <b>Nota:</b> Per garantire la freschezza, richiediamo 45 min di preavviso.
                            Le consegne per oggi sono quasi terminate o l'orario minimo è oltre le 11:00.
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 min-[380px]:grid-cols-3 sm:grid-cols-4 gap-2 w-full">
                        {availableTimes.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTime(t)}
                            className={clsx(
                              "px-2 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors w-full",
                              time === t ? "bg-amber-900 text-white border-amber-900 shadow-md" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <input type="hidden" name="preferredTime" value={time} />
                      <input type="hidden" name="isTomorrow" value={isTomorrow ? "si" : "no"} />
                    </div>

                    {/* INPUT TESTUALI */}
                    <div className="space-y-3 w-full">
                      <input type="text" name="fullName" placeholder="Nome e Cognome" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-amber-300 transition-colors" required />
                      <input type="tel" name="phone" placeholder="Telefono" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white outline-none focus:border-amber-300 transition-colors" required />
                      {delivery === 'domicilio' ? (
                        <div className="space-y-2">
                          <input ref={addressInputRef} type="text" name="address" autoComplete="off" placeholder="Indirizzo (Inizia a digitare...)" className={clsx("w-full px-4 py-3 rounded-xl border bg-amber-50/50 text-sm focus:bg-white outline-none transition-colors", addressError ? "border-red-500 text-red-600" : "border-amber-200 focus:border-amber-400")} required onChange={(e) => setAddress(e.target.value)} />
                          {addressError && <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-pulse"><AlertTriangle size={14} /> {addressError}</div>}
                        </div>
                      ) : <input type="hidden" name="address" value="RITIRO IN SEDE" />}
                    </div>
                  </div>
                </section>

                {/* --- 7. PAGAMENTO --- */}
                <section className="mt-6 mb-8">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">7</span>
                    Pagamento
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => setPaymentMethod("instore")} className={clsx("relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-2 h-full", paymentMethod === "instore" ? "border-amber-900 bg-amber-50 shadow-md" : "border-slate-100 bg-white text-slate-400 hover:border-amber-200")}>
                        <Banknote size={24} className={paymentMethod === "instore" ? "text-amber-900" : "text-slate-300"} />
                        <span className="text-xs font-bold">In cassa o alla consegna</span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => setPaymentMethod("card")} className={clsx("relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-2 h-full", paymentMethod === "card" ? "border-indigo-600 bg-indigo-50/50 shadow-md" : "border-slate-100 bg-white text-slate-400 hover:border-indigo-200")}>
                        <CreditCard size={24} className={paymentMethod === "card" ? "text-indigo-600" : "text-slate-300"} />
                        <span className="text-xs font-bold">Carta Online</span>
                      </button>
                    </div>
                  </div>
                  <input type="hidden" name="paymentMethod" value={paymentMethod} />
                </section>

                {/* Riepilogo Mobile */}
                <div className="block md:hidden mb-4 animate-fade-in">
                  <ScontrinoRiepilogo />
                </div>

                {/* Barra di invio Sticky */}
                <div className="sticky bottom-3 z-40 px-1 pb-[env(safe-area-inset-bottom)]">
                  <div className="backdrop-blur-xl bg-white/90 p-2 rounded-2xl border border-white shadow-2xl">
                    <SubmitButton
                      label={paymentMethod === 'card' ? "Vai al Pagamento" : "Conferma Ordine"}
                      price={cartData.total}
                      disabled={!time || cartData.total <= 0 || (delivery === 'domicilio' && (!address || !!addressError))}
                    />
                    {state.message && !state.success && (
                      <div className="bg-red-50 text-red-600 p-2 rounded-xl text-center text-[11px] mt-2 border border-red-100 font-bold animate-shake">
                        {state.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* 🔧 INPUT NASCOSTI PER IL SERVER */}
                <input type="hidden" name="totalPrice" value={cartData.total || 0} />
                <input type="hidden" name="cartDetails" value={JSON.stringify(cartData.items)} />
                <input type="hidden" name="promoCodeId" value={appliedPromo?.id || ""} />
                <input type="hidden" name="discountApplied" value={cartData.promoDiscountApplied || 0} />
                <input type="hidden" name="isTomorrow" value={isTomorrow ? "si" : "no"} />
              </form>
            )}
          </div>

          {/* Riepilogo Desktop */}
          <div className="hidden lg:block lg:col-span-4 self-start sticky top-32 h-max pb-12">
            <ScontrinoRiepilogo />
          </div>
        </div>
      </main>
    </div>
  );
}