"use client";

import Image from "next/image";
import Link from "next/link";
import { Coffee, Croissant, Wine, Beer, Info, ShoppingBag } from "lucide-react";
import clsx from "clsx";

// Dati del menu estratti dal PDF "Menu deplian 33x24 DEFINITIVO.pdf"
const categories = [
  {
    id: "caffetteria",
    title: "Caffetteria",
    description: "Il cuore della nostra offerta. Miscele pregiate e preparazioni classiche.",
    icon: <Coffee className="w-6 h-6" />,
    imageSrc: "/images/caffe-placeholder.jpg",
    items: [
      // Aggiunto "isIlly: true" per mostrare il logo accanto al nome
      { name: "Caffè Espresso", price: "1.20€", desc: "", isIlly: true }, 
      { name: "Cappuccino", price: "1.50€", desc: "Disponibile anche Senza Lattosio / Soia", isIlly: true },
      { name: "Latte Macchiato", price: "1.80€", desc: "", isIlly: true },
      { name: "Marocchino", price: "1.50€", desc: "", isIlly: true },
      { name: "Americano", price: "1.50€", desc: "", isIlly: true },
      { name: "Caffè Ginseng / Orzo", price: "1.20€", desc: "Tazza piccola o grande (+ 0.30€)" },
      { name: "Crema Caffè", price: "1.50€", desc: "Il piacere di Illy anche freddo", isIlly: true },
      { name: "Cioccolata Calda", price: "3.00€", desc: "Miscela densa" },
      { name: "Twinings Thè Caldo / Camomilla", price: "2.50€", desc: "Vari gusti" },
    ]
  },
  {
    id: "colazione",
    title: "Cornetteria & Colazione",
    description: "Dolce risveglio con prodotti sempre freschi.",
    icon: <Croissant className="w-6 h-6" />,
    imageSrc: "/images/colazione-placeholder.jpg",
    items: [
      { name: "Cornetto Vuoto", price: "1.10€", desc: "Semplice e fragrante" },
      { name: "Cornetto Farcito", price: "1.30€", desc: "Albicocca, Frutti di Bosco, Pistacchio, Cioccolato Bianco" },
      { name: "Cornetto Nutella®", price: "1.50€", desc: "Il classico goloso di nutella", highlight: true },
      { name: "Altra Pasticceria", price: "1.50€", desc: "Farciture speciali" },
      { name: "Cornetto Vegano*", price: "1.20€", desc: "Senza derivati animali *non sempre disponibile" },
      { name: "Senza Glutine", price: "", desc: "Disponibili varie opzioni su richiesta" },
    ]
  },
  {
    id: "aperitivi",
    title: "Aperidrink & Cocktail",
    description: "Ogni drink è accompagnato da una selezione di sfiziosità (Patatine, Olive, Pizzette, ecc).",
    icon: <Wine className="w-6 h-6" />,
    imageSrc: "/images/aperitivo-placeholder.jpg",
    items: [
      { name: "Aperol Spritz", price: "5.00€", desc: "Prosecco, Aperol, Soda"},
      { name: "Gin Tonic / Lemon", price: "6.00€", desc: "Gin premium e tonica/lemon" },
      { name: "Crodino / SanBitter", price: "2.50€", desc: "Analcolico biondo o rosso" },
      { name: "Campari Soda / Bitter", price: "2.50€", desc: "" },
      { name: "Prosecco", price: "3.00€", desc: "Flute" },
      { name: "Martini", price: "5.00€", desc: "Bianco o Rosso" },
    ]
  },
  {
    id: "beverage",
    title: "Bevande, Birre & Amari",
    description: "Dalla bibita rinfrescante al dopocena.",
    icon: <Beer className="w-6 h-6" />,
    imageSrc: "/images/beverage-placeholder.jpg",
    items: [
      { name: "Acqua", price: "0.80€", desc: "Naturale o Frizzante" },
      { name: "Coca Cola / Fanta / Sprite", price: "1.00€", desc: "In vetro o in lattina" },
      { name: "Birra Peroni", price: "1.50€", desc: "33cl. o 66cl. (+1€)" },
      { name: "Nastro Azzurro", price: "2.00€", desc: "" },
      { name: "Corona, Ceres, Tennent's", price: "2.50€", desc: "Altre opzioni" },
      { name: "Amari e Liquori", price: "da 1.50€", desc: "Averna, Jägermeister, Limoncello, Sambuca, ecc." },
    ]
  }
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* 1. HERO BANNER */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark/35 z-0">
             <Image 
                src="/images/menu-cover.png" 
                alt="Bancone Caffetteria"
                fill
                className="object-cover opacity-40 mix-blend-overlay"
                priority
             />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-4">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-cyan/20 text-brand-cyan text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-brand-cyan/30">
            Listino Ufficiale
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight">
            Il Nostro <span className="text-brand-coffee italic">Menù</span>
          </h1>
          <p className="text-slate-200 text-lg md:text-xl font-light max-w-xl mx-auto">
            Dalla colazione all'aperitivo, scopri le nostre <span className="text-brand-red italic">specialità</span>.
          </p>
        </div>
      </section>

      {/* 2. CONTENUTO - Layout a Zig Zag */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        
        {categories.map((cat, index) => (
          <section 
            key={cat.id} 
            className={clsx(
              "flex flex-col lg:flex-row gap-12 items-center",
              index % 2 !== 0 ? "lg:flex-row-reverse" : ""
            )}
          >
            
            {/* COLONNA VISIVA (Immagine) */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[40px] shadow-2xl">
                <div className="absolute inset-0 bg-slate-200 animate-pulse" /> 
                <Image
                  src={cat.imageSrc}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg text-brand-dark">
                  {cat.icon}
                </div>
              </div>

              <div className={clsx(
                "absolute -z-10 w-full h-full top-6 rounded-[40px]",
                index % 2 !== 0 ? "-left-6 bg-brand-coffee/10" : "-right-6 bg-brand-cyan/10"
              )} />
            </div>

            {/* COLONNA LISTINO (Card Vetro) */}
            <div className="w-full lg:w-1/2">
              <div className="space-y-4 mb-8 text-center lg:text-left">
                
                {/* TITOLO CATEGORIA + LOGO ILLY (Se Caffetteria) */}
                <div className="flex items-center justify-center lg:justify-start gap-4">
                    <h2 className="text-4xl font-serif font-bold text-brand-dark">
                        {cat.title}
                    </h2>
                    {cat.id === 'caffetteria' && (
                        <div className="relative w-12 h-12 bg-white rounded-lg shadow-sm p-1.5 flex items-center justify-center border border-slate-100">
                             {/* Placeholder Logo Illy Grande */}
                             <Image 
                                src="/icons/illy.svg" // Assicurati di avere questo file
                                alt="Illy" 
                                fill 
                                className="object-contain p-0.5" 
                             />
                        </div>
                    )}
                </div>

                <p className="text-slate-600 text-lg">
                  {cat.description}
                </p>
              </div>

              <div className={clsx(
                  "relative overflow-hidden p-6 md:p-8",
                  "rounded-[30px]",
                  "bg-white/70",
                  "backdrop-blur-xl",
                  "border border-white/60",
                  "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]"
              )}>
                <ul className="space-y-6">
                  {cat.items.map((item: any, idx) => (
                    <li key={idx} className="group flex justify-between items-baseline">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-lg group-hover:text-brand-cyan transition-colors">
                            {item.name}
                            </span>
                            
                            {/* MINI LOGO ILLY VICINO AL NOME */}
                            {item.isIlly && (
                                <div className="relative w-4 h-4 bg-white rounded-sm shadow-sm">
                                    <Image 
                                        src="/icons/illy.svg" 
                                        alt="Illy" 
                                        fill 
                                        className="object-contain" 
                                    />
                                </div>
                            )}
                        </div>

                        {item.desc && (
                          <span className="text-sm text-slate-500 font-medium">
                            {item.desc}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end pl-4">
                        <span className={clsx(
                            "font-bold text-lg tabular-nums",
                            item.highlight ? "text-brand-red" : "text-brand-dark"
                        )}>
                          {item.price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </section>
        ))}

      </div>

      {/* 3. INFO FOOTER SECTION */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-brand-cyan/10 rounded-full text-brand-cyan mb-2">
            <Info size={24} />
          </div>
          <h3 className="text-2xl font-bold text-brand-dark">Allergeni e Intolleranze</h3>
          <p className="text-slate-600 leading-relaxed">
            Gentile cliente, se soffri di allergie o intolleranze alimentari, ti preghiamo di segnalarlo al nostro personale prima di ordinare.
            Siamo a disposizione per fornirti l'elenco degli ingredienti e degli allergeni presenti nei nostri prodotti.
          </p>
          <div className="pt-4">
                        <Link 
              href="/coming-soon" 
              className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-red-700 hover:shadow-brand-red/40 transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag size={18} />
              Prenota Box San Valentino
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}