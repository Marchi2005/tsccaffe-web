"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowRight, Compass } from "lucide-react";

type DeviceType = "apple" | "google" | null;

export default function MapSection() {
  const [device, setDevice] = useState<DeviceType>(null);

  useEffect(() => {
    // Device detection per cambiare il bottone
    const ua = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|macintosh/.test(ua);
    setDevice(isApple ? "apple" : "google");
  }, []);

  // LINK REALI DA INSERIRE:
  const googleMapsUrl = "https://goo.gl/maps/TUO_LINK_GOOGLE_MAPS"; 
  const appleMapsUrl = "https://maps.apple.com/?q=Tabacchi+San+Clemente+Caffè";

  return (
    <section id="location" className="py-24 bg-slate-50 relative">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-[2.5rem] p-4 shadow-xl overflow-hidden border border-slate-100">
          
          {/* Info Text */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-brand-cyan font-bold mb-2">
              <MapPin size={20} />
              <span>Raggiungici facilmente</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Siamo a San Clemente</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Situati in Via Galatina 95, con facilità di parcheggio proprio di fronte all'ingresso. 
              Ideale per una sosta veloce o una pausa relax.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Indirizzo</p>
                  <p className="text-slate-600">Via Galatina N° 95<br/>San Clemente, 81100 Caserta (CE)</p>
                </div>
              </div>
              
              {/* BOTTONE DINAMICO: Apple Maps per iOS/Mac, Google per gli altri */}
              {device === "apple" ? (
                <a 
                  href={appleMapsUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full bg-slate-900 text-white text-center py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                >
                  <Compass size={18} /> Apri in Apple Maps <ArrowRight size={18} />
                </a>
              ) : (
                <a 
                  href={googleMapsUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full bg-slate-900 text-white text-center py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                >
                  Apri in Google Maps <ArrowRight size={18} />
                </a>
              )}
            </div>
          </div>

          {/* MAPPA SEMPRE GOOGLE (Iframe) */}
          <div className="relative min-h-[400px] w-full bg-slate-200 rounded-3xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.1896677162376!2d14.36590531301392!3d41.064846571223335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133a550011ef672f%3A0x4422ca38b38954bd!2sTabacchi%20San%20Clemente%20Caff%C3%A8!5e0!3m2!1sit!2sit!4v1770066540980!5m2!1sit!2sit" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}