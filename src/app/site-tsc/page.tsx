import React from "react";

export default function LuttoPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8 animate-in fade-in duration-1000">
        {/* Linea divisoria elegante superiore */}
        <div className="w-16 h-[1px] bg-zinc-800 mx-auto"></div>
        
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-zinc-200 uppercase">
            Chiuso per lutto
          </h1>
          
          <p className="text-sm md:text-base text-zinc-500 font-light leading-relaxed px-4">
            Il TSC Caffè e le sue attività sono temporaneamente sospese. 
            <br className="hidden md:block" />
            Vi ringraziamo per la comprensione in questo momento.
          </p>
        </div>

        {/* Linea divisoria elegante inferiore */}
        <div className="w-16 h-[1px] bg-zinc-800 mx-auto"></div>
      </div>
    </main>
  );
}