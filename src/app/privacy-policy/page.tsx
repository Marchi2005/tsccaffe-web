import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-dark mb-8 transition-colors">
          <ArrowLeft size={16} /> Torna alla Home
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Ultimo aggiornamento: Febbraio 2026</p>

        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Titolare del Trattamento</h2>
            <p>
              Il Titolare del trattamento dei dati è: <br />
              <strong>Tabacchi San Clemente di Ianniello Gianpaolo</strong> <br />
              Indirizzo: Via Galatina 95, 81100 San Clemente, Caserta (CE) <br />
              P.IVA: 04124110612 <br />
              Email di contatto: tabacchisanclemente@libero.it
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Tipologia di dati raccolti</h2>
            <p>
              Per l'erogazione del servizio "Box San Valentino", raccogliamo i seguenti dati personali forniti volontariamente dall'utente tramite il modulo di prenotazione:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nome e Cognome</li>
              <li>Numero di telefono (per conferme e comunicazioni urgenti)</li>
              <li>Indirizzo di consegna (solo se selezionata la consegna a domicilio)</li>
              <li>Preferenze alimentari e note sull'ordine</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Finalità del trattamento</h2>
            <p>
              I dati vengono trattati esclusivamente per le seguenti finalità:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Gestione ed evasione dell'ordine (preparazione box, consegna o ritiro).</li>
              <li>Adempimenti fiscali e amministrativi (es. fatturazione).</li>
              <li>Contatto telefonico in caso di problemi con l'ordine.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Modalità e durata di conservazione</h2>
            <p>
              I dati sono trattati con strumenti informatici idonei a garantirne la sicurezza. I dati relativi all'ordine verranno conservati per il tempo necessario all'espletamento del servizio e, successivamente, per i termini di legge previsti per la conservazione dei documenti fiscali (10 anni).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Comunicazione a terzi</h2>
            <p>
              I dati non saranno diffusi. Potranno essere comunicati a terzi solo se strettamente necessario per l'erogazione del servizio (es. fattorini per la consegna) o per obblighi di legge (es. commercialista, autorità competenti).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">6. Diritti dell'interessato</h2>
            <p>
              Ai sensi del GDPR, l'utente ha diritto di chiedere al Titolare l'accesso ai propri dati, la rettifica, la cancellazione degli stessi o la limitazione del trattamento. Le richieste possono essere indirizzate all'email del Titolare indicata al punto 1.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}