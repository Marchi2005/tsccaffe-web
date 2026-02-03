import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, MapPin, Phone, MessageCircle } from "lucide-react";
import { StatusBadge } from '@/components/ui/status-badge';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 relative z-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* COLONNA 1: BRAND & STORY */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 p-1 transition-transform group-hover:scale-150">
                 <Image 
                    src="/icons/logo-footbar.svg" 
                    alt="Logo TSC" 
                    fill
                    className="object-contain p-1"
                 />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-sm uppercase tracking-wide group-hover:text-brand-red transition-colors">
                  Tabacchi San Clemente
                </span>
                <span className="text-brand-red font-serif italic text-lg">
                  Caffè
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              Non solo un bar, ma il tuo angolo di relax quotidiano. 
              Tra un caffè Illy perfetto, un sorriso e i servizi di cui hai bisogno, 
              ci prendiamo cura della tua giornata.
            </p>

            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/tabacchisanclementecaffe" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 p-2 rounded-full hover:bg-brand-cyan hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.facebook.com/people/Tabacchi-San-Clemente/100012509505700/" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://wa.me/393715428345" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-800 p-2 rounded-full hover:bg-green-500 hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* COLONNA 2: ESPLORA */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Esplora</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-brand-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Menù Caffetteria
                </Link>
              </li>
              <li>
                <Link href="/servizi" className="hover:text-brand-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span> Servizi & Shop
                </Link>
              </li>
              <li>
                <Link href="/prenota-box" className="text-brand-red font-bold hover:text-red-400 transition-colors flex items-center gap-2">
                   San Valentino ❤️
                </Link>
              </li>
            </ul>
          </div>

          {/* COLONNA 3: CONTATTI */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Contatti</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-cyan shrink-0 mt-0.5" />
                <span>Via Galatina N° 95,<br />San Clemente, 81100 Caserta (CE)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-cyan shrink-0" />
                <a href="tel:+393715428345" className="hover:text-white transition-colors">371 542 8345</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-green-500 shrink-0" />
                <a href="https://wa.me/393715428345" className="hover:text-white transition-colors">Scrivici su WhatsApp</a>
              </li>
            </ul>
          </div>

           {/* COLONNA 4: ORARI DI APERTURA (CORRETTA) */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Orari Apertura</h3>
            
            {/* Card Orari: Sfondo chiaro per contrasto e leggibilità del LED */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/10 shadow-lg text-slate-900">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start pb-3 border-b border-slate-200">
                  <span className="font-bold text-slate-800">Lun - Sab</span>
                  <div className="text-right space-y-1 text-slate-600 font-medium">
                    <p>06:30 - 13:30</p>
                    <p>15:30 - 20:00</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-800">Domenica</span>
                  <span className="text-slate-600 font-medium">07:30 - 14:30</span>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100">
                 <StatusBadge className="w-full justify-center bg-white shadow-sm" />
              </div>
            </div>
          </div>

        </div>

        {/* LEGAL BOTTOM */}
        <div className="mt-16 border-t border-slate-800 pt-8 text-xs text-center text-slate-500">
          <p className="font-medium text-slate-400">
            &copy; {currentYear} Tabacchi San Clemente di Ianniello Gianpaolo. Tutti i diritti riservati.
          </p>
          <p className="mt-2">
             P.IVA: 04124110612
          </p>
          <div className="mt-4 flex justify-center gap-4">
             <Link href="/privacy-policy" className="hover:text-brand-cyan transition-colors">Privacy Policy</Link>
             <span>•</span>
             <Link href="/cookie-policy" className="hover:text-brand-cyan transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}