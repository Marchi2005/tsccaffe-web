"use client";

import Link from "next/link";
import { Flame, ArrowLeft, Bell, Heart } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f7] font-sans selection:bg-rose-100 selection:text-rose-600">

      <main className="flex-grow flex items-center justify-center px-4 relative overflow-hidden">
        
        {/* Sfondo Decorativo - Sfumature morbide */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px]" />

        <div className="max-w-3xl w-full text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-sm text-rose-500 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Heart size={14} fill="currentColor" />
            Special Edition
          </div>

          {/* Titolo Principale */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            San Valentino <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">
              In Arrivo.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Stiamo preparando qualcosa di speciale per te e la tua dolce metà.
          </p>

          {/* Box Informativo / Call to action */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <div className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0">
                <Flame size={24} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disponibile dal</p>
                <p className="text-xl font-black text-slate-900">04 Febbraio</p>
              </div>
            </div>

            <Link 
              href="https://wa.me/393715428345?text=Avvisami quando sono attive le offerte di San Valentino!"
              target="_blank"
              className="h-[88px] px-8 bg-white border border-slate-200 rounded-[2rem] font-bold text-slate-900 flex items-center gap-3 hover:bg-slate-50 hover:scale-[1.02] transition-all shadow-lg shadow-slate-200/20"
            >
              <Bell size={20} className="text-rose-500" />
              Avvisami su WhatsApp
            </Link>
          </div>

        </div>
      </main>

      {/* Decorative dots grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}