// src/app/site-tsc/components/servizi/ServiceCard.tsx
import { QuickService } from "./types";
import StatusIndicator from "./StatusIndicator";
import PaymentMethods from "./PaymentMethods";
import clsx from "clsx";
import * as Icons from "lucide-react";

interface Props {
  service: QuickService;
}

export default function ServiceCard({ service }: Props) {
  // Estrattore dinamico icona
  // @ts-ignore - Necessario perché accediamo dinamicamente all'oggetto Icons
  const IconComponent = Icons[service.icon_name] || Icons.Box; 
  
  const isUnavailable = service.status === 'unavailable';

  return (
    <div className={clsx(
      "group bg-white rounded-2xl p-6 border shadow-sm transition-all duration-300 flex flex-col h-full",
      isUnavailable ? "border-rose-100 opacity-75 grayscale-[0.3]" : "border-slate-100 hover:shadow-md hover:border-slate-200"
    )}>
      
      {/* Header Card: Icona + Stato */}
      <div className="flex justify-between items-start mb-4">
        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center transition-transform", !isUnavailable && "group-hover:scale-110", service.color_class)}>
          <IconComponent size={24} strokeWidth={1.5} />
        </div>
        <StatusIndicator status={service.status} />
      </div>

      {/* Contenuto Testuale */}
      <div className="flex-grow">
        <h3 className="text-slate-900 font-bold text-lg mb-2">{service.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
      </div>

      {/* Footer Card: Metodi di Pagamento */}
      {!isUnavailable && <PaymentMethods methods={service.accepted_methods} />}
      
    </div>
  );
}