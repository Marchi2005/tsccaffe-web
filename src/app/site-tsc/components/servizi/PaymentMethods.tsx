// src/app/site-tsc/components/servizi/PaymentMethods.tsx
import { PaymentMethod } from "./types";
import { Banknote, CreditCard, Nfc, Wallet, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface Props {
  methods: PaymentMethod[];
}

const IconMap: Record<string, any> = {
  Banknote: Banknote,
  CreditCard: CreditCard,
  Nfc: Nfc,
  Wallet: Wallet,
};

export default function PaymentMethods({ methods }: Props) {
  if (!methods || methods.length === 0) return null;

  // Verifichiamo se è accettato solo il contante
  const isOnlyCash = methods.length === 1 && methods[0].name === "Contanti";

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
      {methods.filter(m => m.enabled).map((method) => {
        const Icon = IconMap[method.icon_name] || Wallet;
        
        return (
          <div 
            key={method.id} 
            className={clsx(
              "flex items-center gap-1 border px-2 py-1 rounded-md text-xs font-medium transition-colors",
              // Se è solo contanti, lo evidenziamo in modo diverso
              isOnlyCash && method.name === "Contanti" 
                ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm" 
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
            )}
          >
            {isOnlyCash && method.name === "Contanti" && <AlertCircle size={10} className="text-amber-500" />}
            <Icon size={12} strokeWidth={2} />
            <span>{isOnlyCash ? "Solo Contanti" : method.name}</span>
          </div>
        );
      })}
    </div>
  );
}