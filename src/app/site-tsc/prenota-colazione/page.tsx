"use client";

import { useState, useEffect, useActionState, useMemo } from "react";
import Script from "next/script";
import clsx from "clsx";
import { User, Users, Utensils, PartyPopper } from "lucide-react";

// --- CONFIGURAZIONE E SERVER ---
import { supabase } from "@/lib/supabase";
import { TIMES } from "@/lib/schemas";
import { submitOrder } from "./actions";

// --- HOOK CUSTOM (Il "Cervello" Matematico) ---
import { useCartCalculator } from "./_lib/useCartCalculator";

// --- COMPONENTI UI (I "Mattoncini" Visivi) ---
import { SubmitButton } from "./_components/ui/submit-button";
import SuccessScreen from "./_components/success-screen";
import MenuSection from "./_components/menu-section";
import ExtraOptions from "./_components/extra-options";
import PromoSection from "./_components/promo-section";
import NotesSection from "./_components/notes-section";
import UserDetailsSection from "./_components/user-details-section";
import PaymentSection from "./_components/payment-section";
import ScontrinoRiepilogo from "./_components/scontrino";

// 💡 CONFIGURAZIONE MAPPE: 
// La chiave API serve qui solo per caricare lo script, la logica vera e propria
// (come il raggio di km) vive dentro `_components/user-details-section.tsx`.
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

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
  // 💡 GESTIONE FORM SERVER-SIDE: Qui gestiamo la risposta di Supabase/Stripe
  const [state, formAction] = useActionState(submitOrder, initialState);

  // ==========================================
  // 💡 STATI DELL'APPLICAZIONE (I dati del form)
  // ==========================================
  
  // Sezione 1: Persone
  const [peopleCount, setPeopleCount] = useState<number | '5+'>(1);
  const [menus, setMenus] = useState([
    { drink: "Cappuccino", pastry: "Cornetto Vuoto" },
    { drink: "Espresso", pastry: "Cornetto Vuoto" },
    { drink: "Espresso", pastry: "Cornetto Vuoto" },
    { drink: "Espresso", pastry: "Cornetto Vuoto" }
  ]);

  // Sezione 2: Menu Gruppi (5+)
  const [bulkDrinks, setBulkDrinks] = useState<Record<string, number>>({});
  const [bulkPastries, setBulkPastries] = useState<Record<string, number>>({});
  const [bulkDietary, setBulkDietary] = useState<'none' | 'vegan' | 'gluten_free'>('none');
  const [customizingDrink, setCustomizingDrink] = useState<string | null>(null);
  const [tempDrinkSelection, setTempDrinkSelection] = useState<string>("");

  // Sezione 3: Extra
  const [spremuteCount, setSpremuteCount] = useState(0);
  const [succhiCounters, setSucchiCounters] = useState<Record<string, number>>({});
  const [giftBoxSelected, setGiftBoxSelected] = useState(false);

  // Sezione 4: Promozioni
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Sezione 5: Note
  const [notes, setNotes] = useState("");

  // Sezione 6: Dati Utente & Mappe
  const [delivery, setDelivery] = useState("domicilio");
  const [time, setTime] = useState("");
  const [isTomorrow, setIsTomorrow] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);

  // Sezione 7: Pagamento
  const [paymentMethod, setPaymentMethod] = useState("instore");

  // ==========================================
  // 💡 LOGICA DI BUSINESS E ORARI
  // ==========================================

  // Calcola quali orari sono ancora prenotabili oggi (45 min di scarto)
  const availableTimes = useMemo(() => {
    if (isTomorrow) return TIMES;

    const now = new Date();
    const LEAD_TIME = 45;
    const nowInMinutes = now.getHours() * 60 + now.getMinutes() + LEAD_TIME;

    return TIMES.filter(t => {
      const timePart = t.includes(" - ") ? t.split(" - ")[0] : t;
      const [h, m] = timePart.split(':').map(Number);
      return (h * 60 + m) >= nowInMinutes;
    });
  }, [isTomorrow]);

  // Se non ci sono orari oggi, forza "Domani"
  useEffect(() => {
    if (!isTomorrow && availableTimes.length === 0) setIsTomorrow(true);
  }, [availableTimes.length, isTomorrow]);

  // Auto-seleziona il primo orario disponibile
  useEffect(() => {
    if (time && !availableTimes.includes(time)) setTime("");
    if (!time && availableTimes.length > 0) setTime(availableTimes[0]);
  }, [availableTimes, time]);

  // ==========================================
  // 💡 FUNZIONI DI AGGIORNAMENTO STATO
  // ==========================================

  const updateMenu = (index: number, field: 'drink' | 'pastry', value: string) => {
    const newMenus = [...menus]; 
    newMenus[index][field] = value; 
    setMenus(newMenus);
  };

  const updateBulk = (type: 'drink' | 'pastry', item: string, delta: number) => {
    if (type === 'drink') setBulkDrinks(prev => ({ ...prev, [item]: Math.max(0, (prev[item] || 0) + delta) }));
    else setBulkPastries(prev => ({ ...prev, [item]: Math.max(0, (prev[item] || 0) + delta) }));
  };

  const updateSucco = (flavor: string, delta: number) => {
    setSucchiCounters(prev => ({ ...prev, [flavor]: Math.max(0, (prev[flavor] || 0) + delta) }));
  };

  // 💡 CHIAMATA A SUPABASE PER I CODICI SCONTO
  // Se vuoi aggiungere logiche per i coupon (es. scadenze diverse), modificalo qui.
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
      if (!data.is_active) setPromoError("Questo codice non è più attivo.");
      else if (data.expires_at && new Date(data.expires_at) < now) setPromoError("Questo codice è scaduto.");
      else if (data.max_uses && data.current_uses >= data.max_uses) setPromoError("Limite utilizzi raggiunto.");
      else {
        setAppliedPromo(data);
        setPromoError(null);
      }
    } catch (err) {
      setPromoError("Errore di connessione.");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  // ==========================================
  // 💡 IL CUORE: CALCOLO DEL CARRELLO
  // Tutto il calcolo matematico vive in `useCartCalculator.ts`.
  // Se devi cambiare prezzi o commissioni stripe, apri quel file!
  // ==========================================
  const cartData = useCartCalculator({
    peopleCount, menus, bulkDrinks, bulkPastries,
    spremuteCount, succhiCounters, paymentMethod, appliedPromo, giftBoxSelected
  });

  const hasGlutenFreeNutella = cartData.items.some(i => i.name.toLowerCase().includes('senza glutine') && i.name.toLowerCase().includes('nutella'));

  // ==========================================
  // 💡 RENDERIZZAZIONE DELLA PAGINA
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col w-full max-w-[100vw] overflow-x-hidden md:overflow-x-clip">
      {/* Caricamento di Google Maps */}
      <Script src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`} strategy="afterInteractive" onLoad={() => setIsMapsLoaded(true)} />

      <main className="flex-grow pt-20 sm:pt-32 w-full max-w-[100vw] flex flex-col">
        <div className="max-w-7xl w-full mx-auto grid md:grid-cols-12 min-h-[calc(100vh-200px)] gap-4 md:gap-8 px-4 sm:px-6 items-start">

          <div className="md:col-span-7 lg:col-span-8 pb-32 w-full max-w-full sm:max-w-[420px] mx-auto md:max-w-none overflow-x-hidden sm:overflow-x-visible">
            
            {/* 💡 SCHERMATA DI SUCCESSO: Se l'ordine va a buon fine, mostra questo e nasconde il form */}
            {state.success ? (
              <SuccessScreen orderId={state.orderId} />
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
                {/* 💡 Modifica l'interfaccia dei dolci o delle bevande dentro `_components/menu-section.tsx` */}
                <MenuSection 
                  peopleCount={peopleCount} menus={menus} updateMenu={updateMenu}
                  bulkDrinks={bulkDrinks} bulkPastries={bulkPastries} updateBulk={updateBulk}
                  bulkDietary={bulkDietary} setBulkDietary={setBulkDietary}
                  customizingDrink={customizingDrink} setCustomizingDrink={setCustomizingDrink}
                  tempDrinkSelection={tempDrinkSelection} setTempDrinkSelection={setTempDrinkSelection}
                  hasGlutenFreeNutella={hasGlutenFreeNutella}
                />

                <hr className="border-slate-200/60" />

                {/* --- 3. EXTRA --- */}
                {/* 💡 Aggiungi nuovi extra (es. pancake) dentro `_components/extra-options.tsx` */}
                <ExtraOptions 
                  giftBoxSelected={giftBoxSelected} setGiftBoxSelected={setGiftBoxSelected}
                  spremuteCount={spremuteCount} setSpremuteCount={setSpremuteCount}
                  succhiCounters={succhiCounters} updateSucco={updateSucco}
                />

                <hr className="border-slate-200/60" />

                {/* --- 4. CODICE SCONTO --- */}
                <PromoSection 
                  promoCodeInput={promoCodeInput} setPromoCodeInput={setPromoCodeInput}
                  handleApplyPromo={handleApplyPromo} isValidatingPromo={isValidatingPromo}
                  promoError={promoError} appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo}
                />

                <hr className="border-slate-200/60" />

                {/* --- 5. NOTE --- */}
                <NotesSection notes={notes} setNotes={setNotes} />

                {/* --- 6. DATI UTENTE E MAPPE --- */}
                {/* 💡 La distanza massima (8.5km) e le coordinate del bar si modificano dentro `_components/user-details-section.tsx` */}
                <UserDetailsSection 
                  isTomorrow={isTomorrow} setIsTomorrow={setIsTomorrow}
                  availableTimes={availableTimes} time={time} setTime={setTime}
                  delivery={delivery} setDelivery={setDelivery}
                  address={address} setAddress={setAddress}
                  addressError={addressError} setAddressError={setAddressError}
                  isMapsLoaded={isMapsLoaded}
                />

                {/* --- 7. PAGAMENTO --- */}
                <PaymentSection 
                  paymentMethod={paymentMethod} 
                  setPaymentMethod={setPaymentMethod} 
                />

                {/* Riepilogo Mobile (Visibile solo su schermi piccoli) */}
                <div className="block md:hidden mb-4 animate-fade-in">
                  <ScontrinoRiepilogo cartData={cartData} />
                </div>

                {/* 💡 BARRA DI INVIO STICKY */}
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

                {/* 🔧 INPUT NASCOSTI PER IL SERVER: Questi inviano i dati reali ad actions.ts */}
                <input type="hidden" name="totalPrice" value={cartData.total || 0} />
                <input type="hidden" name="cartDetails" value={JSON.stringify(cartData.items)} />
                <input type="hidden" name="promoCodeId" value={appliedPromo?.id || ""} />
                <input type="hidden" name="discountApplied" value={cartData.promoDiscountApplied || 0} />
                <input type="hidden" name="isTomorrow" value={isTomorrow ? "si" : "no"} />
                <input type="hidden" name="giftBoxSelected" value={giftBoxSelected ? "si" : "no"} />
              </form>
            )}
          </div>

          {/* Riepilogo Desktop (Visibile solo su schermi grandi, fisso a destra) */}
          <div className="hidden lg:block lg:col-span-4 self-start sticky top-32 h-max pb-12">
            <ScontrinoRiepilogo cartData={cartData} />
          </div>
        </div>
      </main>
    </div>
  );
}