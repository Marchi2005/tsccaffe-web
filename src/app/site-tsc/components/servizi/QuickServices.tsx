"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ServiceCard from "./ServiceCard";
import { QuickService } from "./types";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function QuickServices() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const [services, setServices] = useState<QuickService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Query relazionale: Prendi i servizi + i metodi di pagamento associati
        const { data, error } = await supabase
          .from('quick_services')
          .select(`
            *,
            payment_methods:service_payment_methods(
              payment_method:payment_methods(*)
            )
          `)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error("Errore fetch servizi:", error);
          return;
        }

        if (data) {
          // Formattiamo i dati per adattarli all'interfaccia QuickService
          const formattedServices: QuickService[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            icon_name: item.icon_name,
            color_class: item.color_class,
            status: item.status,
            sort_order: item.sort_order,
            // Estraiamo i metodi di pagamento dall'oggetto relazionale
            accepted_methods: item.payment_methods.map((pm: any) => pm.payment_method)
          }));
          setServices(formattedServices);
        }
      } catch (err) {
        console.error("Errore generico:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [supabase]);

  return (
    <section className="py-20 lg:py-28 bg-white min-h-[500px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Sezione */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Servizi Rapidi</h2>
            {/* COPY AGGIORNATO QUI SOTTO */}
            <p className="text-slate-500 mt-2">Salta la fila alle poste. Ai tuoi pagamenti e ricariche ci pensiamo noi, in modo rapido e sicuro.</p>
          </div>

          {/* Badge Informativo Metodi Pagamento Globale */}
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
            <div className="bg-brand-cyan/10 text-brand-cyan p-2 rounded-lg">
               <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pagamenti Sicuri</p>
              <p className="text-xs text-slate-500">Contanti, Carte e Contactless</p>
            </div>
          </div>
        </div>

        {/* Loader o Grid Servizi */}
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}