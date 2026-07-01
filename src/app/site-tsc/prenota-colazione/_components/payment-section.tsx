"use client";

import { Banknote, CreditCard } from "lucide-react";
import clsx from "clsx";

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
}

export default function PaymentSection({ paymentMethod, setPaymentMethod }: PaymentSectionProps) {
  return (
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
  );
}