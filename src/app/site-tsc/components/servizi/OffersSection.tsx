"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronRight, Loader2, Smartphone } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { createClient } from '@supabase/supabase-js';

type DescriptionBlock = { type: "title" | "paragraph"; content: string };

interface Product {
  id: string;
  slug: string;
  brand_name: string;
  model: string;
  full_price: number;
  discount_price: number;
  is_new: boolean;
  has_discount: boolean;
  brand_logo: string;
  main_image: string;
  gallery_images: string[];
  bg_class: string;
  colors: string[];
  description: string | DescriptionBlock[];
  features: string[];
  note: string | null;
}

const formatCurrency = (val: number | null) => {
  if (val === null || val === undefined) return "";
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);
};

export default function OffersSection() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('web_products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) console.error("Errore fetch prodotti:", error);
        else if (data) setProducts(data);
      } catch (err) {
        console.error("Errore generico:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [supabase]);

  const uniqueNotes = useMemo(() => {
    const notes = products
      .map(p => p.note)
      .filter((n): n is string => n !== null && n.trim() !== "");
    return Array.from(new Set(notes));
  }, [products]);

  const getNoteSymbol = (note: string | null | undefined) => {
    if (!note || !note.trim()) return null;
    const index = uniqueNotes.indexOf(note);
    return index !== -1 ? "*".repeat(index + 1) : null;
  };

  return (
    <section className="py-24 bg-white overflow-hidden border-b border-slate-100 relative min-h-[500px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Le nostre offerte.</h2>
        <p className="text-slate-500 mb-12">Clicca su una card per scoprire tutti i dettagli.</p>

        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-0 bottom-12 right-0 w-24 bg-gradient-to-l from-white via-white/40 to-transparent z-20 pointer-events-none flex items-center justify-end pr-2 md:hidden">
               <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-slate-100 animate-pulse">
                  <ChevronRight className="text-slate-400" />
               </div>
            </div>

            <div className="flex overflow-x-auto pb-12 pt-4 gap-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
              {products.map((product) => {
                const noteSymbol = getNoteSymbol(product.note);
                return (
                <div
                  key={product.id}
                  onClick={() => { setSelectedProduct(product); setCurrentImgIndex(0); }}
                  className={clsx(
                    "snap-center shrink-0 w-[85vw] md:w-[400px] h-[500px] rounded-[2.5rem] cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 relative overflow-hidden group",
                    product.bg_class 
                  )}
                >
                  {product.is_new && (
                    <div className="absolute top-6 left-6 z-20">
                      <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-slate-700 animate-in fade-in zoom-in duration-300">
                        NEW
                      </span>
                    </div>
                  )}

                  {product.has_discount && (
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] overflow-hidden z-30 pointer-events-none">
                      <div className="absolute top-[18px] -right-[35px] w-[140px] bg-red-600 text-white text-[9px] font-black uppercase tracking-widest py-1.5 text-center rotate-45 shadow-xl animate-pulse">
                        IN SCONTO
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <img src={product.main_image} className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" alt={product.model} />
                  </div>

                  <div className="relative z-10 p-8 bg-gradient-to-b from-white/40 via-transparent to-transparent">
                    <div className="h-9 mb-4 mt-8">
                      <img src={product.brand_logo} alt={product.brand_name} className="h-full opacity-90" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,1)]">
                      {product.model}
                    </h3>

                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xl font-bold text-slate-800 drop-shadow-[0_0_20px_rgba(255,255,255,1)] flex items-start">
                        {formatCurrency(product.discount_price)}
                        {noteSymbol && <span className="text-blue-500 text-xs ml-0.5 -mt-1">{noteSymbol}</span>}
                      </span>
                      {product.full_price && (
                        <span className="text-sm text-slate-400 line-through decoration-slate-300 font-medium">
                          {formatCurrency(product.full_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex justify-between items-end bg-gradient-to-t from-white/20 to-transparent">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-slate-100 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                      Scopri di più
                    </span>
                    <div className="flex gap-1.5 bg-white/50 backdrop-blur-md p-2 rounded-full border border-white/50">
                      {product.colors && product.colors.map((colorClass, i) => (
                        <div key={i} className={clsx("w-3.5 h-3.5 rounded-full border border-white shadow-sm", colorClass)} />
                      ))}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

        {uniqueNotes.length > 0 && !isLoading && (
          <div className="mt-8 space-y-2 border-t border-slate-100 pt-8">
            {uniqueNotes.map((note, idx) => (
              <p key={idx} className="text-xs text-slate-400 font-medium">
                <span className="text-blue-500 font-bold mr-1">{"*".repeat(idx + 1)}</span> {note}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* --- OVERLAY DETTAGLI PRODOTTO --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-400">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-30 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-slate-100 transition-all shadow-sm">
              <span className="text-xl">✕</span>
            </button>

            <div className={clsx("w-full md:w-3/5 relative group flex items-center justify-center overflow-hidden", selectedProduct.bg_class)}>
              <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center p-12">
                <img key={currentImgIndex} src={selectedProduct.gallery_images[currentImgIndex]} className="max-h-full object-contain drop-shadow-3xl animate-in fade-in zoom-in-95 duration-500" alt={selectedProduct.model} />
              </div>
              {selectedProduct.gallery_images.length > 1 && (
                  <>
                      {currentImgIndex > 0 && (
                      <button onClick={() => setCurrentImgIndex(prev => prev - 1)} className="absolute left-6 z-30 w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50">←</button>
                      )}
                      {currentImgIndex < selectedProduct.gallery_images.length - 1 && (
                      <button onClick={() => setCurrentImgIndex(prev => prev + 1)} className="absolute right-6 z-30 w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50">→</button>
                      )}
                      <div className="absolute bottom-8 flex gap-2.5 z-30">
                      {selectedProduct.gallery_images.map((_, idx) => (
                          <button key={idx} onClick={() => setCurrentImgIndex(idx)} className={clsx("h-1.5 transition-all duration-300 rounded-full", currentImgIndex === idx ? "w-8 bg-slate-800" : "w-1.5 bg-slate-300 hover:bg-slate-400")} />
                      ))}
                      </div>
                  </>
              )}
            </div>

            <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
              <div className="pb-4">
                <img src={selectedProduct.brand_logo} className="h-5 mb-6 opacity-40" alt="" />
                <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">{selectedProduct.model}</h2>
                <div className="flex items-center gap-4 mb-8">
                  <p className="text-3xl font-bold text-blue-600 flex items-start">
                    {formatCurrency(selectedProduct.discount_price)}
                    {getNoteSymbol(selectedProduct.note) && <span className="text-blue-500 text-sm ml-0.5 -mt-1">{getNoteSymbol(selectedProduct.note)}</span>}
                  </p>
                  <div className="flex gap-1.5 border-l pl-4 border-slate-200">
                    {selectedProduct.colors && selectedProduct.colors.map((c, i) => (
                      <div key={i} className={clsx("w-4 h-4 rounded-full border border-slate-200 shadow-sm", c)} />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Dettagli Prodotto</h4>
                <div className="space-y-6">
                  {Array.isArray(selectedProduct.description) ? (
                    selectedProduct.description.map((item, idx) => (
                      <div key={idx}>
                        {item.type === "title" ? (
                          <h5 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{item.content}</h5>
                        ) : (
                          <p className="text-slate-600 leading-relaxed text-lg mb-4">{item.content}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600 leading-relaxed text-lg">{selectedProduct.description}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Specifiche Tecniche</h4>
                <ul className="space-y-4">
                  {selectedProduct.features && selectedProduct.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      </div>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-10 border-t border-slate-100 pb-4">
                <Link
                  href={`https://wa.me/393715428345?text=Ciao! Vorrei informazioni su ${selectedProduct.brand_name} ${selectedProduct.model}`}
                  target="_blank"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg"
                >
                  <Smartphone size={22} />
                  Chiedi in negozio
                </Link>
                {selectedProduct.note && (
                  <p className="text-[11px] text-slate-400 mt-6 text-center leading-relaxed italic">
                    <span className="text-blue-500 font-bold mr-1">{getNoteSymbol(selectedProduct.note)}</span> {selectedProduct.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}