"use client";

import React, { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Download, PackageCheck, Loader2 } from "lucide-react";
import { toPng } from 'html-to-image';

function OrderQRSection({ orderId }: { orderId: string }) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTicketImage = async () => {
    if (ticketRef.current === null) return;

    setIsGenerating(true);
    
    // Piccolo ritardo per assicurarsi che il render sia pronto
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const dataUrl = await toPng(ticketRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, 
        backgroundColor: '#f8fafc',
        // TRUCCO FONDAMENTALE: 
        // L'elemento è opacity:0 nel DOM, ma qui lo forziamo a opacity:1 per la foto
        style: {
            opacity: '1',
            transform: 'scale(1)', // Resetta eventuali trasformazioni
        }
      });

      const link = document.createElement('a');
      link.download = `Ticket-SanValentino-${orderId.slice(0,6).toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Errore generazione immagine:', err);
      alert("Impossibile creare l'immagine. Riprova da PC o attendi un attimo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full animate-fade-in-up">
      
      {/* --- QR CODE VISIBILE --- */}
      <div className="bg-white p-3 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mb-5 relative z-10">
        <div className="bg-white">
            <QRCode 
                value={orderId || "NO-ID"} 
                size={160}
                level={"H"} 
                fgColor="#0f172a"
            />
        </div>
      </div>

      <p className="text-xs text-slate-400 font-medium mb-4 text-center max-w-[200px]">
        Mostra questo codice al banco per ritirare il tuo ordine.
      </p>

      {/* --- TASTO DOWNLOAD --- */}
      <button 
        onClick={generateTicketImage}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all w-full shadow-md shadow-emerald-100 active:scale-95 disabled:opacity-70 disabled:pointer-events-none z-20 relative"
      >
        {isGenerating ? (
           <>
             <Loader2 size={18} className="animate-spin" /> Creazione...
           </>
        ) : (
           <>
             <Download size={18} /> Scarica Ticket Digitale
           </>
        )}
      </button>

      {/* --- TICKET "NASCOSTO" MA PRESENTE --- 
         1. fixed, top:0, left:0 -> È nello schermo (il browser lo disegna).
         2. zIndex: -1000 -> È dietro a tutto il sito.
         3. opacity: 0 -> È invisibile all'occhio umano.
         4. pointerEvents: none -> Non puoi cliccarci sopra per sbaglio.
      */}
      <div 
        ref={ticketRef}
        style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            zIndex: -1000, 
            opacity: 0, 
            pointerEvents: 'none',
            width: '400px' // Larghezza fissa per il ticket
        }} 
        className="bg-slate-50 flex flex-col items-center font-sans p-6"
      >
         <div className="bg-white w-full rounded-[2rem] shadow-2xl border-2 border-slate-100 p-8 relative overflow-hidden text-center">
             
             {/* Sfumatura */}
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-white z-0" />

             <div className="relative z-10 flex flex-col items-center">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-100 border-2 border-emerald-50">
                     <PackageCheck size={40} className="text-emerald-500" strokeWidth={2.5} />
                 </div>
                 
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Ordine Confermato</h2>
                 <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mb-6 border-b border-emerald-100 pb-1">Speciale San Valentino</p>

                 {/* QR Box Ticket */}
                 <div className="bg-white p-4 border-4 border-slate-900 rounded-3xl shadow-lg mb-6">
                     <QRCode value={orderId} size={200} level={"H"} fgColor="#0f172a" />
                 </div>
                 
                 <div className="bg-slate-100 px-6 py-3 rounded-xl border border-slate-200 mb-4 w-full">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Codice Identificativo</p>
                    <p className="text-lg font-mono font-black text-slate-800 break-all leading-none">{orderId.split('-')[0]}...</p>
                 </div>

                 <p className="text-slate-400 text-[10px] font-medium px-4 leading-relaxed uppercase tracking-wider">
                    Mostra questo ticket in cassa
                 </p>

             </div>
         </div>
         <div className="text-slate-400 text-[10px] font-bold mt-6 uppercase tracking-[0.2em]">
             tsccaffè • San Valentino 2026
         </div>
      </div>

    </div>
  );
}

export default OrderQRSection;