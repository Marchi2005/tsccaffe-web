"use client";

import { ShoppingBag } from "lucide-react";

export default function HeroHeader() {
  return (
    <section className="bg-white pt-32 pb-16 lg:pt-40 lg:pb-24 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6">
          <ShoppingBag size={14} />
          Multiservizi & Store
        </div>
        <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Più di un semplice <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
            Tabacchi di quartiere.
          </span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Dalle spedizioni ai pagamenti, passando per la nostra selezione di articoli per fumatori.
          Tutto quello che ti serve, in un unico posto.
        </p>
      </div>
    </section>
  );
}