// src/components/ui/status-badge.tsx
'use client';

import { useEffect, useState } from 'react';
import { getBusinessStatus, type BusinessState } from '@/lib/business-hours';
import { cn } from '../../lib/utils';

export function StatusBadge({ className }: { className?: string }) {
  const [status, setStatus] = useState<{ state: BusinessState; label: string } | null>(null);

  useEffect(() => {
    setStatus(getBusinessStatus());
    const interval = setInterval(() => setStatus(getBusinessStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="h-8 w-32 bg-slate-100 rounded-full animate-pulse" />;

  const styles = {
    open: {
      bg: "bg-emerald-50 border-emerald-200",
      dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
      text: "text-emerald-700"
    },
    "closing-soon": {
      bg: "bg-amber-50 border-amber-200",
      dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
      text: "text-amber-700"
    },
    closed: {
      // Sfondo grigio chiaro (pulito), ma LED ROSSO acceso
      bg: "bg-slate-100 border-red-200",
      dot: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]", // <-- QUI IL CAMBIAMENTO (Rosso)
      text: "text-red-600"
    }
  };

  const currentStyle = styles[status.state];

  return (
    <div className={cn(
      "inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border shadow-sm transition-all duration-300",
      currentStyle.bg,
      className
    )}>
      <span className="relative flex h-2.5 w-2.5">
        {status.state !== 'closed' && (
           <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", currentStyle.dot)}></span>
        )}
        <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", currentStyle.dot)}></span>
      </span>
      <span className={cn("text-xs font-semibold tracking-wide uppercase", currentStyle.text)}>
        {status.label}
      </span>
    </div>
  );
}