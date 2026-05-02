"use client";

import { useState, useEffect } from "react";
import { Package, MapPin } from "lucide-react";
import clsx from "clsx";

const getShopStatus = () => {
  const now = new Date();
  const itTimeStr = now.toLocaleString("en-US", { timeZone: "Europe/Rome" });
  const itDate = new Date(itTimeStr);

  const day = itDate.getDay(); 
  const minutes = itDate.getHours() * 60 + itDate.getMinutes();

  const statusStyles = {
    open: { text: "APERTO ORA", classes: "bg-emerald-500 shadow-emerald-500/20" },
    closed: { text: "CHIUSO ORA", classes: "bg-rose-500 shadow-rose-500/20" },
    closing: { text: "IN CHIUSURA", classes: "bg-amber-500 shadow-amber-500/20" }, 
    opening: { text: "APRE TRA POCO", classes: "bg-blue-500 shadow-blue-500/20" }   
  };

  if (day === 0) {
    if (minutes >= 435 && minutes < 450) return statusStyles.opening;
    if (minutes >= 840 && minutes < 870) return statusStyles.closing;
    if (minutes >= 450 && minutes < 870) return statusStyles.open;
    return statusStyles.closed;
  }

  if (minutes >= 375 && minutes < 390) return statusStyles.opening;
  if (minutes >= 780 && minutes < 810) return statusStyles.closing;
  if (minutes >= 390 && minutes < 810) return statusStyles.open;

  if (minutes >= 915 && minutes < 930) return statusStyles.opening;
  if (minutes >= 1170 && minutes < 1200) return statusStyles.closing;
  if (minutes >= 930 && minutes < 1200) return statusStyles.open;

  return statusStyles.closed;
};

export default function ShippingSection() {
  const [shopStatus, setShopStatus] = useState({ text: "", classes: "hidden" }); 

  useEffect(() => {
    setShopStatus(getShopStatus());
    const interval = setInterval(() => {
      setShopStatus(getShopStatus());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-slate-900 text-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
              <Package size={16} /> Hub Spedizioni
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Invia e ricevi i tuoi pacchi <br />
              senza stress.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Siamo un punto di ritiro e spedizione certificato per Poste Italiane e Amazon Hub.
              Affidaci i tuoi pacchi e approfitta dei nostri servizi di reso facili e veloci.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="text-white font-bold mb-1">Punto di Ritiro</div>
                <div className="text-xs text-slate-400">Amazon, UPS, DHL, Poste Italiane, GLS</div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="text-white font-bold mb-1">Resi Facili</div>
                <div className="text-xs text-slate-400">Stampa etichetta in sede con codice digitale</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-700 shadow-2xl relative flex flex-col">
            <div className="flex justify-end mb-4 md:absolute md:top-6 md:right-6 md:mb-0 w-full md:w-auto z-20 pointer-events-none">
               <div className={clsx(
                "text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full animate-pulse shadow-lg transition-colors duration-500 inline-block pointer-events-auto",
                shopStatus.classes
              )}>
                {shopStatus.text}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <MapPin className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold pr-0 md:pr-24">Punto Tabacchi San Clemente / Ricevitoria N.29</h4>
                  <p className="text-sm text-slate-400 mt-1">Utilizza il nostro indirizzo per i tuoi ordini online.</p>
                </div>
              </div>
              <hr className="border-slate-700" />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span>Punto Poste</span>
                  <span className="text-emerald-400 font-medium">Attivo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Amazon Hub</span>
                  <span className="text-emerald-400 font-medium">Attivo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vinted</span>
                  <span className="text-emerald-400 font-medium">Attivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}