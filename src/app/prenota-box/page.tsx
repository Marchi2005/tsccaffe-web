"use client";

import { submitOrder } from "./actions";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Bike, Check, CheckCircle2, Citrus, Heart, Info, Store, Bean, Milk, Phone, AlertTriangle, ArrowRight, Banknote, CreditCard } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { DRINKS_DATA, PASTRIES_DATA, TIMES, BOX_TYPES } from "@/lib/schemas";
import clsx from "clsx";

// --- COMPONENTS ---

// Loghi Pagamenti (Minimal)
function PaymentLogos() {
  return (
    <div className="flex flex-wrap justify-center items-end gap-8 mt-4">
       {/* CONTANTI */}
       <div className="flex flex-col items-center gap-2">
          <Banknote size={28} className="text-slate-600" strokeWidth={1.5} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contanti</span>
       </div>

       {/* CARTA */}
       <div className="flex flex-col items-center gap-2">
          <CreditCard size={28} className="text-slate-600" strokeWidth={1.5} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Carta</span>
       </div>

       {/* APPLE PAY */}
       <div className="flex flex-col items-center gap-2">
          <div className="relative w-12 h-7">
             <Image 
               src="/icons/apple-pay.svg" 
               alt="Apple Pay" 
               fill 
               className="object-contain" 
             />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apple Pay</span>
       </div>

       {/* GOOGLE PAY */}
       <div className="flex flex-col items-center gap-2">
          <div className="relative w-12 h-7">
             <Image 
               src="/icons/google-pay.svg" 
               alt="Google Pay" 
               fill 
               className="object-contain" 
             />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Google Pay</span>
       </div>

       {/* SAMSUNG PAY */}
       <div className="flex flex-col items-center gap-2">
          <div className="relative w-12 h-7">
             <Image 
               src="/icons/samsung-pay.svg" 
               alt="Samsung Pay" 
               fill 
               className="object-contain" 
             />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Samsung Pay</span>
       </div>
    </div>
  );
}

function BoxCard({ box, selected, onClick }: any) {
  return (
    <div onClick={onClick} className={clsx(
      "relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 group overflow-hidden",
      selected ? "border-brand-red bg-red-50/50 shadow-lg ring-1 ring-brand-red scale-[1.02]" : "border-slate-200 hover:border-brand-red/30 hover:bg-slate-50"
    )}>
      {selected && <div className="absolute top-3 right-3 text-brand-red"><CheckCircle2 className="fill-brand-red text-white" /></div>}
      <div className="absolute top-0 left-0 bg-brand-red text-white text-[10px] font-bold px-3 py-1 rounded-br-lg z-10 shadow-md">OFFERTA WEB</div>
      <h3 className={clsx("font-bold text-lg mb-1 mt-2", selected ? "text-brand-red" : "text-slate-800")}>{box.name}</h3>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed min-h-[36px]">{box.desc}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-brand-dark">{box.price.toFixed(2)}€</span>
        <span className="text-sm text-slate-400 line-through decoration-slate-400 decoration-2">{box.oldPrice.toFixed(2)}€</span>
      </div>
    </div>
  );
}

function DrinkSelector({ label, onSelect, currentSelection }: any) {
  const baseSelection = currentSelection.split(" (")[0]; 
  const drinkData = DRINKS_DATA.find(d => d.label === baseSelection);

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
        if (parts.includes("Zymil")) milk = "Zymil";
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
  const milkType = currentSelection.includes("Soia") ? "Soia" : (currentSelection.includes("Zymil") ? "Zymil" : "Intero");
  const sizeType = currentSelection.includes("Grande") ? "Grande" : "Standard";

  return (
    <div className="space-y-2">
      <p className="font-bold text-slate-400 text-xs uppercase tracking-wider pl-1">{label}</p>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {DRINKS_DATA.map((d) => {
          const isSelected = baseSelection === d.label;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                 let initial = d.label;
                 if (d.hasSub) initial += ` (${d.subOptions![0]})`;
                 onSelect(initial);
              }}
              className={clsx(
                "relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all h-20",
                isSelected ? "bg-brand-dark text-white border-brand-dark shadow-md" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <span className="text-xl mb-1">{d.icon}</span>
              <span className="text-[10px] font-bold leading-tight text-center">{d.label}</span>
              {d.surcharge && (
                <span className="absolute -top-1 -right-1 text-[8px] bg-yellow-400 text-yellow-900 px-1 rounded shadow-sm font-bold">
                  +{d.surcharge.toFixed(2)}€
                </span>
              )}
            </button>
          );
        })}
      </div>

      {drinkData && (drinkData.hasCoffeeVariant || drinkData.hasMilkVariant || drinkData.hasSub || drinkData.hasSize) && (
        <div className="bg-slate-100 p-3 rounded-xl animate-fade-in-down border border-slate-200 relative mt-2">
           <div className="absolute -top-1.5 left-8 w-3 h-3 bg-slate-100 border-t border-l border-slate-200 transform rotate-45"></div>

           {drinkData.id === 'succo' && (
             <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60 text-[10px] text-slate-600">
               <Info size={14} className="text-blue-500" />
               <span>Supplemento: <span className="font-bold text-red-500">+{drinkData.surcharge?.toFixed(2)}€</span> <span className="line-through opacity-50">{drinkData.fullPrice?.toFixed(2)}€</span></span>
             </div>
           )}

           <div className="space-y-3">
              {drinkData.hasCoffeeVariant && (
                <div className="flex items-center gap-2">
                   <div className="w-6 flex justify-center"><Bean size={14} className="text-slate-400" /></div>
                   <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
                      <button type="button" onClick={() => updateVariant('coffee', 'Normale')} className={clsx("px-3 py-1 rounded-md text-[10px] font-bold transition-all", !isDeca ? "bg-brand-coffee text-white shadow-sm" : "text-slate-500 hover:bg-slate-50")}>Normale</button>
                      <button type="button" onClick={() => updateVariant('coffee', 'Deca')} className={clsx("px-3 py-1 rounded-md text-[10px] font-bold transition-all", isDeca ? "bg-brand-coffee text-white shadow-sm" : "text-slate-500 hover:bg-slate-50")}>Deca</button>
                   </div>
                </div>
              )}

              {drinkData.hasMilkVariant && (
                <div className="flex items-center gap-2">
                   <div className="w-6 flex justify-center"><Milk size={14} className="text-slate-400" /></div>
                   <div className="flex flex-wrap gap-1">
                      <button type="button" onClick={() => updateVariant('milk', 'Intero')} className={clsx("px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-colors", milkType === 'Intero' ? "bg-brand-cyan text-white border-brand-cyan" : "bg-white text-slate-600 border-slate-300")}>Intero</button>
                      <button type="button" onClick={() => updateVariant('milk', 'Zymil')} className={clsx("px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-colors", milkType === 'Zymil' ? "bg-brand-cyan text-white border-brand-cyan" : "bg-white text-slate-600 border-slate-300")}>Zymil</button>
                      <button type="button" onClick={() => updateVariant('milk', 'Soia')} className={clsx("px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-colors", milkType === 'Soia' ? "bg-brand-cyan text-white border-brand-cyan" : "bg-white text-slate-600 border-slate-300")}>Soia</button>
                   </div>
                </div>
              )}

              {drinkData.hasSub && (
                <div className="flex items-center gap-2">
                   <div className="w-6 flex justify-center text-[10px] font-bold text-slate-400">Gusto</div>
                   <div className="flex gap-1">
                     {drinkData.subOptions?.map(opt => (
                        <button key={opt} type="button" onClick={() => updateVariant('flavor', opt)} className={clsx("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors", currentSelection.includes(opt) ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-600 border-slate-300")}>{opt}</button>
                     ))}
                   </div>
                </div>
              )}

              {drinkData.hasSize && (
                 <div className="flex items-center gap-2">
                    <div className="w-6 flex justify-center text-[10px] font-bold text-slate-400">Size</div>
                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
                       <button type="button" onClick={() => updateVariant('size', 'Standard')} className={clsx("px-3 py-1 rounded-md text-[10px] font-bold transition-all", sizeType === 'Standard' ? "bg-brand-dark text-white" : "text-slate-500 hover:bg-slate-50")}>S</button>
                       <button type="button" onClick={() => updateVariant('size', 'Grande')} className={clsx("px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1", sizeType === 'Grande' ? "bg-brand-dark text-white" : "text-slate-500 hover:bg-slate-50")}>L <span className="opacity-70 text-[8px]">+0,20€</span></button>
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
  // Filtriamo i dati per creare due categorie
  const specialitaKeywords = ['pasticciotto','graffa', 'bomba', 'polacca'];
  
  const cornetti = PASTRIES_DATA.filter(p => !specialitaKeywords.some(k => p.id.includes(k)));
  const specialita = PASTRIES_DATA.filter(p => specialitaKeywords.some(k => p.id.includes(k)));

  const renderGrid = (items: typeof PASTRIES_DATA) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
       {items.map((p) => {
          const isSelected = currentSelection === p.label;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.label)}
              style={isSelected ? { backgroundColor: p.bg, borderColor: p.border, color: p.text || (p.id.includes('ciocco') || p.id === 'nutella' ? 'white' : '#334155') } : {}}
              className={clsx(
                "p-2 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-center pl-3 min-h-[3.5rem]",
                isSelected ? "shadow-md ring-1" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
               <span className={clsx("text-xs font-bold leading-tight", isSelected && "scale-105 origin-left")}>{p.label}</span>
               {p.desc && <span className={clsx("text-[9px] font-medium mt-0.5 block", isSelected ? "opacity-90" : "text-slate-400")}>{p.desc}</span>}
               {isSelected && <div className="absolute right-2 top-2 w-4 h-4 rounded-full bg-white/30 flex items-center justify-center"><Check size={10} style={{ color: p.text || 'black' }} /></div>}
            </button>
          );
       })}
    </div>
  );

  return (
    <div className="space-y-4 mt-4">
       <div className="flex items-center justify-between">
          <p className="font-bold text-slate-400 text-xs uppercase tracking-wider pl-1">{label}</p>
          {currentSelection && <span className="text-[10px] text-brand-dark font-medium bg-slate-100 px-2 py-0.5 rounded-md">Selezionato: {currentSelection}</span>}
       </div>

       {/* Sezione Cornetti */}
       <div>
         <p className="text-[15px] font-bold text-slate-500 mb-2 ml-1 flex items-center gap-1">
            🥐 Cornetteria
         </p>
         {renderGrid(cornetti)}
       </div>

       {/* Sezione Specialità (se presenti) */}
       {specialita.length > 0 && (
         <div>
            <p className="text-[15px] font-bold text-slate-500 mb-2 ml-1 flex items-center gap-1 mt-2">
               🍩 Altri Dolci
            </p>
            {renderGrid(specialita)}
         </div>
       )}
    </div>
  );
}

function SubmitButton({ price, label }: { price: number, label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-brand-dark text-white font-bold text-lg py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 mt-4 flex justify-between items-center px-6">
      <span>{pending ? "Invio..." : label}</span>
      <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">{price.toFixed(2)}€</span>
    </button>
  );
}

const initialState = { success: false, message: "", errors: {} };

export default function PrenotaBoxPage() {
  const [state, formAction] = useActionState(submitOrder, initialState);
  
  const [box, setBox] = useState(BOX_TYPES[1]); 
  const [delivery, setDelivery] = useState("domicilio");
  const [time, setTime] = useState(TIMES[1]);
  const [spremuta, setSpremuta] = useState(true);
  const [peluche, setPeluche] = useState(false); 

  const [d1, setD1] = useState("Cappuccino");
  const [c1, setC1] = useState("Nutella®");
  const [d2, setD2] = useState("Espresso");
  const [c2, setC2] = useState("Pistacchio");

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let price = box.price;
    if (d1.includes("Succo")) price += 1.30;
    if (d2.includes("Succo")) price += 1.30;
    if (d1.includes("Grande")) price += 0.20;
    if (d2.includes("Grande")) price += 0.20;
    if (peluche) price += 9.50; 
    setTotalPrice(price);
  }, [box, d1, d2, peluche]);

  const heroImage = box.id === 'velvet' ? '/images/8.jpg' : (box.id === 'red_love' ? '/images/6.jpg' : '/images/4.jpg');

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow">
        
        {/* --- MOBILE HERO --- */}
        <div className="lg:hidden relative h-[40vh] w-full bg-slate-900 border-b-4 border-brand-red">
          <Image src={heroImage} alt={box.name} fill className="object-cover opacity-90" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end text-white z-10">
              <div className="max-w-[65%]">
                 <h1 className="text-3xl font-extrabold leading-none mb-1 shadow-black drop-shadow-md">{box.name}</h1>
                 <p className="text-xs opacity-90 line-clamp-2 font-medium text-slate-200">{box.desc}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                 <div className="text-xs opacity-80 line-through decoration-white/70">{box.oldPrice.toFixed(2)}€</div>
                 <div className="text-3xl font-extrabold text-brand-red bg-white px-2 py-0.5 rounded-lg shadow-lg">
                    {box.price.toFixed(2)}€
                 </div>
              </div>
          </div>
        </div>

        {/* Layout Desktop + Form */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
          
          {/* SX: Desktop Sticky Sidebar */}
          <div className="hidden lg:block relative h-full bg-white sticky top-0 border-r border-slate-100">
              <div className="sticky top-24 p-8 xl:p-12 h-[calc(100vh-100px)] flex flex-col">
                 <div className="relative flex-grow rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-50 group">
                    <Image src={heroImage} alt="Box Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10 text-white flex justify-between items-end">
                       <div className="max-w-[60%]">
                         <h2 className="text-4xl font-extrabold mb-2 leading-tight">{box.name}</h2>
                         <p className="text-sm opacity-90">{box.desc}</p>
                       </div>
                       <div className="text-right">
                          <div className="text-lg opacity-70 line-through font-medium">{box.oldPrice.toFixed(2)}€</div>
                          <div className="text-5xl font-extrabold text-brand-red bg-white/10 backdrop-blur-sm px-3 py-1 rounded-xl">{box.price.toFixed(2)}€</div>
                       </div>
                    </div>
                 </div>
              </div>
          </div>

          {/* DX: Configurator */}
          <div className="p-4 md:p-8 lg:py-16 overflow-y-auto bg-slate-50">
            {state.success ? (
               <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl text-center border-2 border-red-100 mt-10 max-w-lg mx-auto">
                  {/* Cuore Rosa/Rosso */}
                  <div className="w-24 h-24 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Heart size={44} className="fill-brand-red" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Grazie di Cuore!</h2>
                  <p className="text-slate-500 mb-8">Il tuo ordine è stato registrato correttamente.</p>

                  {/* CLAUSOLA IMPORTANTE */}
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 text-left rounded-r-lg shadow-sm">
                    <div className="flex gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wide">Da saldare in sede</h4>
                            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                                Per confermare la prenotazione, il pagamento deve essere effettuato <strong>entro le ore 18:00 del 13 Febbraio 2026</strong> presso la nostra sede.
                            </p>
                        </div>
                    </div>
                  </div>

                  {/* Contatti EVIDENZIA SPAZIO CHIAMATA */}
                  <div className="mb-8 border-t border-b border-slate-100 py-6">
                      <p className="text-sm font-medium text-slate-500 mb-3">Dubbi o modifiche all'ordine?</p>
                      <a 
                        href="tel:+393715428345" 
                        className="group flex items-center justify-between w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                      >
                         <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full shadow-sm text-brand-dark group-hover:scale-110 transition-transform">
                               <Phone size={24} />
                            </div>
                            <div className="text-left">
                               <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chiama ora</span>
                               <span className="block text-xl font-bold text-slate-800">+39 317 542 8345</span>
                            </div>
                         </div>
                         <div className="bg-white p-2 rounded-full text-slate-300 group-hover:text-brand-dark transition-colors">
                            <ArrowRight size={20} />
                         </div>
                      </a>
                  </div>

                  {/* Metodi di Pagamento */}
                  <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Metodi di pagamento accettati</p>
                        <PaymentLogos />
                  </div>

                  <button onClick={() => window.location.reload()} className="text-brand-red font-bold underline text-sm mt-8">Nuovo ordine</button>
               </div>
            ) : (
              <form action={formAction} className="max-w-xl mx-auto space-y-8 lg:space-y-10 pb-12">
                
                {/* 1. SCELTA BOX */}
                <section className="pt-2 lg:pt-0">
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center">1</span>
                     Scegli l'atmosfera
                   </h3>
                   <div className="grid gap-3">
                     {BOX_TYPES.map(b => <BoxCard key={b.id} box={b} selected={box.id === b.id} onClick={() => setBox(b)} />)}
                   </div>
                   <input type="hidden" name="boxType" value={box.id} />
                </section>
                <hr className="border-slate-200" />
                
                {/* 2. MENÙ */}
                <section>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center">2</span>
                     Personalizza Menù
                   </h3>
                   <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-8">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                           <div className="bg-brand-red/10 text-brand-red p-1.5 rounded-lg"><Heart size={14} className="fill-brand-red" /></div>
                           <span className="font-bold text-sm text-slate-800">Per Lei / Lui (1)</span>
                        </div>
                        <DrinkSelector label="Bevanda" currentSelection={d1} onSelect={setD1} />
                        <PastrySelector label="Dolce" currentSelection={c1} onSelect={setC1} />
                      </div>
                      <div className="border-t border-dashed border-slate-200"></div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                           <div className="bg-brand-coffee/10 text-brand-coffee p-1.5 rounded-lg"><Heart size={14} className="fill-brand-coffee" /></div>
                           <span className="font-bold text-sm text-slate-800">Per Lei / Lui (2)</span>
                        </div>
                        <DrinkSelector label="Bevanda" currentSelection={d2} onSelect={setD2} />
                        <PastrySelector label="Dolce" currentSelection={c2} onSelect={setC2} />
                      </div>
                      
                      {/* SPREMUTA TOGGLE */}
                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex items-center justify-between cursor-pointer" onClick={() => setSpremuta(!spremuta)}>
                          <div className="flex items-center gap-3">
                             <div className="bg-white p-2 rounded-full shadow-sm"><Citrus className="text-orange-500" size={20} /></div>
                             <div>
                                <h4 className="font-bold text-slate-800 text-sm">Spremuta d'Arancia</h4>
                                <p className="text-xs text-slate-500">Ricca di vitamina C (Inclusa)</p>
                             </div>
                          </div>
                          <div className={clsx("w-12 h-6 rounded-full relative transition-colors duration-300", spremuta ? "bg-orange-500" : "bg-slate-300")}>
                             <div className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm", spremuta ? "left-7" : "left-1")}></div>
                          </div>
                      </div>
                      <input type="hidden" name="includeSpremuta" value={spremuta ? "on" : ""} />

                      {/* PELUCHE TOGGLE */}
                      <div className="bg-pink-50 rounded-xl p-4 border border-pink-100 flex items-center justify-between cursor-pointer" onClick={() => setPeluche(!peluche)}>
                          <div className="flex items-center gap-3">
                             <div className="bg-white p-2 rounded-full shadow-sm text-xl flex items-center justify-center w-10 h-10">🧸</div>
                             <div>
                                <h4 className="font-bold text-slate-800 text-sm">Aggiungi Peluche</h4>
                                <p className="text-xs text-slate-500">Un dolce regalo (+9,50€)</p>
                             </div>
                          </div>
                          <div className={clsx("w-12 h-6 rounded-full relative transition-colors duration-300", peluche ? "bg-pink-500" : "bg-slate-300")}>
                             <div className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm", peluche ? "left-7" : "left-1")}></div>
                          </div>
                      </div>
                      <input type="hidden" name="includePeluche" value={peluche ? "on" : ""} />
                   </div>
                   <input type="hidden" name="drink1" value={d1} />
                   <input type="hidden" name="croissant1" value={c1} />
                   <input type="hidden" name="drink2" value={d2} />
                   <input type="hidden" name="croissant2" value={c2} />
                </section>

                {/* 3. DETTAGLI - MODIFICATO QUI */}
                <section>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center">3</span>
                     Dettagli
                   </h3>
                   <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                         <button type="button" onClick={() => setDelivery('domicilio')} className={clsx("py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all", delivery === 'domicilio' ? "bg-white shadow-sm text-brand-dark" : "text-slate-500")}><Bike size={16} /> Domicilio</button>
                         <button type="button" onClick={() => setDelivery('ritiro')} className={clsx("py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all", delivery === 'ritiro' ? "bg-white shadow-sm text-brand-dark" : "text-slate-500")}><Store size={16} /> Ritiro</button>
                      </div>
                      <input type="hidden" name="deliveryType" value={delivery} />
                      <div>
                         <label className="text-xs font-bold text-slate-500 ml-1 mb-2 block">Orario Consegna</label>
                         <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                           {TIMES.map(t => (
                             <button key={t} type="button" onClick={() => setTime(t)} className={clsx("flex-shrink-0 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all", time === t ? "bg-brand-dark text-white border-brand-dark shadow-md" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-white")}>{t}</button>
                           ))}
                         </div>
                         <input type="hidden" name="preferredTime" value={time} />
                      </div>
                      <div className="space-y-3">
                         <input type="text" name="fullName" placeholder="Nome e Cognome" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-dark outline-none transition-colors text-sm" required />
                         <input type="tel" name="phone" placeholder="Telefono" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-dark outline-none transition-colors text-sm" required />
                         
                         {/* CORREZIONE: Gestione condizionale del campo Address */}
                         {delivery === 'domicilio' ? (
                           <input type="text" name="address" placeholder="Indirizzo (Via, Civico...)" className="w-full px-4 py-3 rounded-xl border border-yellow-200 bg-yellow-50 focus:bg-white focus:border-yellow-400 outline-none transition-colors animate-fade-in text-sm" required />
                         ) : (
                           <input type="hidden" name="address" value="RITIRO IN SEDE" />
                         )}
                      </div>
                   </div>
                </section>
                <input type="hidden" name="quantity" value="1" />
                <div className="sticky bottom-4 z-20">
                   <SubmitButton label="Conferma Ordine" price={totalPrice} />
                   {state.message && !state.success && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-xs mt-2 border border-red-100 font-bold">{state.message}</div>}
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <div className="lg:hidden"><Footer /></div>
    </div>
  );
}