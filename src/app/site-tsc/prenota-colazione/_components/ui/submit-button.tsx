"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";

export function SubmitButton({ label, price, disabled }: { label: string, price: number, disabled?: boolean }) {
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