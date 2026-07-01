"use client";

import { useEffect, useRef } from "react";
import { Calendar, Bike, Store, Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { calculateDistance } from "../_lib/helpers";

const SHOP_LAT = 41.064929499779254;
const SHOP_LNG = 14.36849096600742;
const MAX_DELIVERY_KM = 8.50;

interface UserDetailsSectionProps {
  isTomorrow: boolean;
  setIsTomorrow: (val: boolean) => void;
  availableTimes: string[];
  time: string;
  setTime: (val: string) => void;
  delivery: string;
  setDelivery: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  addressError: string | null;
  setAddressError: (val: string | null) => void;
  isMapsLoaded: boolean;
}

export default function UserDetailsSection({
  isTomorrow, setIsTomorrow, availableTimes, time, setTime,
  delivery, setDelivery, address, setAddress, addressError, setAddressError, isMapsLoaded
}: UserDetailsSectionProps) {
  
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  // LOGICA GOOGLE MAPS AUTOCOMPLETE
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
            if (dist > MAX_DELIVERY_KM) { 
              setAddressError(`Troppo lontano (${dist.toFixed(1)}km).`); 
              setAddress(""); 
            } else { 
              setAddressError(null); 
              setAddress(place.formatted_address || ""); 
            }
          }
        });
      }
    }
  }, [isMapsLoaded, delivery, setAddress, setAddressError]);

  // Controlliamo se c'è almeno un orario disponibile OGGI
  const hasTimesToday = availableTimes.length > 0 || isTomorrow; 
  // (In realtà in page.tsx hai una logica basata su TIMES.some, ma qui possiamo semplificare delegando a chi calcola availableTimes)

  return (
    <section>
      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">6</span>
        I tuoi Dati
      </h3>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4 w-full">

        {/* 🕒 TOGGLE OGGI / DOMANI */}
        <div className={clsx("p-3 rounded-xl border transition-colors mb-2", isTomorrow ? "bg-orange-50 border-orange-100" : "bg-slate-50 border-slate-100")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Calendar className={clsx("w-4 h-4", isTomorrow ? "text-orange-600" : "text-slate-400")} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{isTomorrow ? "Per Domani" : "Per Oggi"}</p>
                <p className="text-[10px] text-slate-500 font-medium">{isTomorrow ? "Prenota per domani mattina" : "Ordina per questa mattina"}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setIsTomorrow(!isTomorrow); setTime(""); }}
              className={clsx("relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none", isTomorrow ? "bg-orange-600" : "bg-slate-200")}
            >
              <span className={clsx("inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm", isTomorrow ? "translate-x-6" : "translate-x-1")} />
            </button>
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

          {availableTimes.length === 0 && !isTomorrow && (
            <div className="mb-4 p-3 bg-amber-100 border border-amber-200 rounded-xl flex items-start gap-2 animate-fade-in">
              <Info size={16} className="text-amber-900 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-900 leading-tight">
                <b>Nota:</b> Per garantire la freschezza, richiediamo 45 min di preavviso. Le consegne per oggi sono quasi terminate o l'orario minimo è oltre le 11:00.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 min-[380px]:grid-cols-3 sm:grid-cols-4 gap-2 w-full">
            {availableTimes.map(t => (
              <button key={t} type="button" onClick={() => setTime(t)} className={clsx("px-2 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors w-full", time === t ? "bg-amber-900 text-white border-amber-900 shadow-md" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100")}>{t}</button>
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
              <input
                type="text"
                name="address"
                ref={addressInputRef}
                placeholder="Indirizzo"
                className={clsx("w-full px-4 py-3 rounded-xl border bg-amber-50/50 text-sm focus:bg-white outline-none transition-colors", addressError ? "border-red-500 text-red-600" : "border-amber-200 focus:border-amber-400")}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
              {addressError && <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-pulse"><AlertTriangle size={14} /> {addressError}</div>}
            </div>
          ) : <input type="hidden" name="address" value="RITIRO IN SEDE" />}
        </div>
      </div>
    </section>
  );
}