// src/app/site-tsc/components/servizi/StatusIndicator.tsx
import { ServiceStatus } from "./types";
import clsx from "clsx";

interface Props {
  status: ServiceStatus;
}

export default function StatusIndicator({ status }: Props) {
  const config = {
    available: { color: "bg-emerald-500", text: "Disponibile", border: "border-emerald-200" },
    maintenance: { color: "bg-amber-500", text: "In Manutenzione", border: "border-amber-200" },
    unavailable: { color: "bg-rose-500", text: "Non Disponibile", border: "border-rose-200" }
  };

  const current = config[status];

  return (
    <div className={clsx("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border bg-white shadow-sm", current.border)}>
      <span className="relative flex h-2 w-2">
        {status === 'available' && <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", current.color)}></span>}
        <span className={clsx("relative inline-flex rounded-full h-2 w-2", current.color)}></span>
      </span>
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
        {current.text}
      </span>
    </div>
  );
}