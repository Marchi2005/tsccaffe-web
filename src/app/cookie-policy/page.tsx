import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-dark mb-8 transition-colors">
          <ArrowLeft size={16} /> Torna alla Home
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Cookie Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Ultimo aggiornamento: Febbraio 2026</p>

        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Cosa sono i cookie</h2>
            <p>
              I cookie sono piccoli file di testo che i siti visitati dagli utenti inviano ai loro terminali, dove vengono memorizzati per essere ritrasmessi agli stessi siti in occasione di visite successive.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Cookie utilizzati da questo sito</h2>
            <p>
              Questo sito utilizza esclusivamente <strong>Cookie Tecnici</strong>, strettamente necessari per il corretto funzionamento del sito e per l'erogazione del servizio (es. gestione del carrello o della sessione amministratore).
            </p>
            <p className="mt-2">
              <strong>Non vengono utilizzati cookie di profilazione</strong> per scopi pubblicitari o di marketing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Servizi di terze parti</h2>
            <p>
              Il sito potrebbe utilizzare servizi terzi che potrebbero installare propri cookie (es. mappe, font, servizi di hosting). Tuttavia, l'uso di questi cookie è gestito direttamente dalle terze parti.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase / Vercel:</strong> Per l'hosting e il database (Cookie tecnici di sessione).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Gestione dei cookie</h2>
            <p>
              Poiché vengono utilizzati solo cookie tecnici essenziali, non è richiesto il consenso preventivo dell'utente. Tuttavia, l'utente può disabilitare i cookie modificando le impostazioni del proprio browser, ma ciò potrebbe compromettere il funzionamento del modulo di prenotazione.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}