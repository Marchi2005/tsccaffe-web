"use client";

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { updateProductPrice, deleteProduct, createProduct } from "./actions"; 
import { 
  Loader2, Save, ArrowLeft, Tag, Euro, Trash2, Plus, X, Image as ImageIcon, List, Palette, AlignLeft 
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

// --- TIPI ---
interface Product {
  id: string;
  model: string;
  brand_name: string;
  main_image: string;
  full_price: number;
  discount_price: number;
  is_new: boolean;
  has_discount: boolean;
  note: string | null;
  gallery_images?: string[];
  colors?: string[];
  features?: string[];
  description?: any;
  bg_class?: string;
  brand_logo?: string;
}

// Struttura temporanea per la descrizione nel form
type DescSection = { title: string; content: string };

export default function ProductsAdmin() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); // Client Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stati azioni
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // --- STATI FORM CREAZIONE ---
  const [isCreating, setIsCreating] = useState(false);
  
  // Campi semplici
  const [newBrand, setNewBrand] = useState("GLO");
  const [newModel, setNewModel] = useState("");
  const [newFullPrice, setNewFullPrice] = useState<number>(0);
  const [newDiscountPrice, setNewDiscountPrice] = useState<number>(0);
  const [newIsNew, setNewIsNew] = useState(true);
  const [newHasDiscount, setNewHasDiscount] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [newBgClass, setNewBgClass] = useState("bg-[#f4f4f7]");
  
  // Campi Complessi (Array dinamici)
  // Partiamo con un elemento vuoto per avere subito l'input
  const [tempDesc, setTempDesc] = useState<DescSection[]>([{ title: "", content: "" }]);
  const [tempMainImage, setTempMainImage] = useState("");
  const [tempBrandLogo, setTempBrandLogo] = useState("/icons/glo-logo.svg");
  const [tempImages, setTempImages] = useState<string[]>([""]); 
  const [tempColors, setTempColors] = useState<string[]>([""]);
  const [tempFeatures, setTempFeatures] = useState<string[]>([""]);

  // Fetch dati iniziale
  const fetchProducts = async () => {
    const { data } = await supabase.from('web_products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- HELPERS ARRAY DINAMICI ---
  const updateArray = (setter: any, list: string[], index: number, val: string) => {
    const newArr = [...list];
    newArr[index] = val;
    setter(newArr);
  };
  const addArrayItem = (setter: any, list: string[]) => setter([...list, ""]);
  const removeArrayItem = (setter: any, list: string[], index: number) => {
    if (list.length === 1) {
      // Se è l'ultimo, lo svuota invece di eliminarlo
      updateArray(setter, list, index, ""); 
    } else {
      setter(list.filter((_, i) => i !== index));
    }
  };

  // --- LOGICA SALVATAGGIO ---
  const handleCreate = async () => {
    if (!newModel || !newBrand) {
      alert("Inserisci almeno Marca e Modello");
      return;
    }

    setLoading(true);

    // 1. Costruisci il JSON descrizione corretto
    const finalDescription = tempDesc
      .filter(d => d.content.trim() !== "") // Rimuovi sezioni vuote
      .flatMap(d => {
        const blocks = [];
        if (d.title.trim()) blocks.push({ type: "title", content: d.title });
        blocks.push({ type: "paragraph", content: d.content });
        return blocks;
      });

    // 2. Pulisci gli array (rimuovi vuoti) e aggiungi path
    const cleanImages = tempImages.filter(s => s.trim() !== "").map(s => s.startsWith('/') ? s : `/images/${s}`);
    const cleanColors = tempColors.filter(s => s.trim() !== "");
    const cleanFeatures = tempFeatures.filter(s => s.trim() !== "");
    
    // Gestione Main Image
    const finalMainImage = tempMainImage.trim() ? (tempMainImage.startsWith('/') ? tempMainImage : `/images/${tempMainImage}`) : "";

    const productPayload = {
      brand_name: newBrand,
      model: newModel,
      full_price: newFullPrice,
      discount_price: newDiscountPrice,
      is_new: newIsNew,
      has_discount: newHasDiscount,
      note: newNote,
      bg_class: newBgClass,
      brand_logo: tempBrandLogo,
      main_image: finalMainImage,
      gallery_images: cleanImages,
      colors: cleanColors,
      features: cleanFeatures,
      description: finalDescription
    };

    const res = await createProduct(productPayload);
    
    if (res.success) {
      setIsCreating(false);
      resetForm();
      await fetchProducts();
    } else {
      alert("Errore: " + res.message);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setNewModel(""); setNewBrand("GLO"); setNewFullPrice(0); setNewDiscountPrice(0);
    setTempDesc([{ title: "", content: "" }]);
    setTempImages([""]); setTempColors([""]); setTempFeatures([""]);
    setTempMainImage("");
  };

  // --- GESTIONE MODIFICA E DELETE (Come prima) ---
  const handleChangeExisting = (id: string, field: keyof Product, value: any) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSaveExisting = async (product: Product) => {
    setSavingId(product.id);
    await updateProductPrice(product.id, {
      full_price: product.full_price,
      discount_price: product.discount_price,
      is_new: product.is_new,
      has_discount: product.has_discount,
      note: product.note
    });
    setSavingId(null);
  };

  const handleDeleteClick = (id: string) => {
    if (deletingId === id) performDelete(id);
    else { setDeletingId(id); setTimeout(() => setDeletingId(null), 3000); }
  };
  
  const performDelete = async (id: string) => {
    setLoading(true);
    await deleteProduct(id);
    setDeletingId(null);
    await fetchProducts();
  };

  if (loading && !isCreating) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans relative">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition">
              <ArrowLeft size={20} className="text-slate-600"/>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Prodotti Web</h1>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
          >
            <Plus size={20} /> Aggiungi Prodotto
          </button>
        </div>

        {/* LISTA PRODOTTI ESISTENTI */}
        <div className="grid grid-cols-1 gap-6 pb-20">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center md:items-start group">
              <div className="w-24 h-24 shrink-0 bg-slate-50 rounded-xl p-2 flex items-center justify-center relative border border-slate-100">
                <img src={p.main_image} alt={p.model} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex-grow w-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{p.brand_name}</span>
                    <h3 className="text-lg font-bold text-slate-900">{p.model}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDeleteClick(p.id)}
                      className={clsx("flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all border", deletingId === p.id ? "bg-red-600 text-white border-red-600 animate-pulse" : "bg-white text-slate-400 border-slate-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50")}
                    >
                      <Trash2 size={16} /> {deletingId === p.id ? "Confermi?" : ""}
                    </button>
                    <button 
                      onClick={() => handleSaveExisting(p)}
                      disabled={savingId === p.id}
                      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      {savingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salva
                    </button>
                  </div>
                </div>

                {/* Controlli Prezzi Rapidi */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium ml-1">Prezzo Listino</label>
                    <input type="number" step="0.01" value={p.full_price || ''} onChange={(e) => handleChangeExisting(p.id, 'full_price', parseFloat(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-blue-600 font-bold ml-1">Prezzo Promo</label>
                    <input type="number" step="0.01" value={p.discount_price || ''} onChange={(e) => handleChangeExisting(p.id, 'discount_price', parseFloat(e.target.value))} className="w-full px-3 py-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-sm font-bold" />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                       <input type="checkbox" className="w-4 h-4 accent-slate-900" checked={p.is_new} onChange={(e) => handleChangeExisting(p.id, 'is_new', e.target.checked)} />
                       <span className="text-xs font-bold text-slate-600">NEW</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                       <input type="checkbox" className="w-4 h-4 accent-red-600" checked={p.has_discount} onChange={(e) => handleChangeExisting(p.id, 'has_discount', e.target.checked)} />
                       <span className="text-xs font-bold text-slate-600">PROMO</span>
                    </label>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium ml-1">Nota</label>
                    <input type="text" value={p.note || ''} onChange={(e) => handleChangeExisting(p.id, 'note', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- OVERLAY CREAZIONE PRODOTTO --- */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsCreating(false)} />
            
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-slate-900">Nuovo Prodotto</h2>
                <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
              </div>

              <div className="p-8 space-y-8 pb-32">
                
                {/* 1. INFO BASE */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Tag size={14}/> Identità</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700">Marca</label>
                      <input type="text" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-900" placeholder="Es: GLO" 
                        value={newBrand} onChange={e => setNewBrand(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700">Modello</label>
                      <input type="text" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-900" placeholder="Es: Hyper Pro" 
                        value={newModel} onChange={e => setNewModel(e.target.value)} />
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100"/>

                {/* 2. DESCRIZIONE A BLOCCHI */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><AlignLeft size={14}/> Descrizione</h3>
                  
                  <div className="space-y-4">
                    {tempDesc.map((section, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                        <div className="mb-2">
                          <input 
                            type="text" 
                            placeholder="Titolo paragrafo (Opzionale)" 
                            className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-0"
                            value={section.title}
                            onChange={(e) => {
                              const newArr = [...tempDesc];
                              newArr[idx].title = e.target.value;
                              setTempDesc(newArr);
                            }}
                          />
                        </div>
                        <textarea 
                          className="w-full bg-white p-3 rounded-lg border border-slate-200 text-sm min-h-[80px] focus:border-slate-900 focus:ring-0"
                          placeholder="Scrivi qui il contenuto del paragrafo..."
                          value={section.content}
                          onChange={(e) => {
                              const newArr = [...tempDesc];
                              newArr[idx].content = e.target.value;
                              setTempDesc(newArr);
                          }}
                        />
                        {/* Tasto Rimuovi Sezione */}
                        <button 
                          onClick={() => {
                            if (tempDesc.length > 1) setTempDesc(tempDesc.filter((_, i) => i !== idx));
                            else setTempDesc([{title: "", content: ""}]); // Reset se è l'ultimo
                          }}
                          className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setTempDesc([...tempDesc, { title: "", content: "" }])}
                    className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-2 py-2"
                  >
                    <Plus size={16} /> Aggiungi Paragrafo
                  </button>
                </section>

                <hr className="border-slate-100"/>

                {/* 3. PREZZI E FLAG */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Euro size={14}/> Prezzi & Stato</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700">Prezzo Listino</label>
                      <input type="number" step="0.01" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-900" 
                        value={newFullPrice} onChange={e => setNewFullPrice(parseFloat(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-blue-600">Prezzo Scontato</label>
                      <input type="number" step="0.01" className="w-full p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 outline-none focus:border-blue-500 font-bold" 
                        value={newDiscountPrice} onChange={e => setNewDiscountPrice(parseFloat(e.target.value))} />
                    </div>
                  </div>
                  
                  {/* CHECKBOX PROMO/NEW */}
                  <div className="flex items-center gap-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-slate-900 rounded focus:ring-0" 
                        checked={newIsNew} 
                        onChange={e => setNewIsNew(e.target.checked)} 
                      />
                      <span className="font-bold text-slate-700 text-sm">Etichetta NEW</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-red-600 rounded focus:ring-0" 
                        checked={newHasDiscount} 
                        onChange={e => setNewHasDiscount(e.target.checked)} 
                      />
                      <span className="font-bold text-slate-700 text-sm">In Sconto (Badge Rosso)</span>
                    </label>
                  </div>
                </section>

                <hr className="border-slate-100"/>

                {/* 4. IMMAGINI (Con Prefisso) */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Galleria</h3>
                  
                  {/* Main Image */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Immagine Principale</label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-slate-900">
                      <span className="pl-3 pr-1 text-slate-400 text-sm select-none font-mono">/images/</span>
                      <input 
                        type="text" 
                        className="w-full p-3 pl-0 bg-transparent border-none outline-none focus:ring-0 text-sm" 
                        placeholder="nome-file.png" 
                        value={tempMainImage} 
                        onChange={e => setTempMainImage(e.target.value)} 
                      />
                    </div>
                  </div>

                  {/* Galleria Dinamica */}
                  <label className="text-xs font-bold text-slate-500 mt-4 block">Altre Immagini</label>
                  <div className="space-y-2">
                    {tempImages.map((img, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="flex-grow flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-slate-900">
                           <span className="pl-3 pr-1 text-slate-400 text-sm select-none font-mono">/images/</span>
                           <input 
                              type="text" 
                              className="w-full p-2 pl-0 bg-transparent border-none outline-none focus:ring-0 text-sm"
                              placeholder={`foto-gallery-${i+1}.png`}
                              value={img}
                              onChange={(e) => updateArray(setTempImages, tempImages, i, e.target.value)}
                           />
                        </div>
                        <button onClick={() => removeArrayItem(setTempImages, tempImages, i)} className="bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 w-10 rounded-xl flex items-center justify-center transition-colors">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem(setTempImages, tempImages)} className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                      <Plus size={14}/> Aggiungi un'altra foto
                    </button>
                  </div>
                </section>

                <hr className="border-slate-100"/>

                {/* 5. CARATTERISTICHE E COLORI */}
                <section className="space-y-6">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><List size={14}/> Dettagli Extra</h3>
                   
                   {/* Features */}
                   <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Lista Caratteristiche</label>
                    {tempFeatures.map((feat, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input 
                           type="text" 
                           className="flex-grow p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:border-slate-900 outline-none" 
                           placeholder="Es: Ricarica rapida..." 
                           value={feat}
                           onChange={(e) => updateArray(setTempFeatures, tempFeatures, i, e.target.value)}
                        />
                        <button onClick={() => removeArrayItem(setTempFeatures, tempFeatures, i)} className="text-slate-400 hover:text-red-500 px-2">
                           <X size={16}/>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem(setTempFeatures, tempFeatures)} className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Plus size={14}/> Aggiungi caratteristica
                    </button>
                  </div>

                  {/* Colori */}
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Colori (Classi CSS)</label>
                    {tempColors.map((col, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input 
                           type="text" 
                           className="flex-grow p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-mono focus:border-slate-900 outline-none" 
                           placeholder="Es: bg-[#FF0000]" 
                           value={col}
                           onChange={(e) => updateArray(setTempColors, tempColors, i, e.target.value)}
                        />
                         {/* Preview Colore */}
                        <div className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center bg-white">
                           {col.includes('bg-[') && <div className="w-6 h-6 rounded-full shadow-sm" style={{backgroundColor: col.match(/\[(.*?)\]/)?.[1]}} />}
                        </div>
                        <button onClick={() => removeArrayItem(setTempColors, tempColors, i)} className="text-slate-400 hover:text-red-500 px-2">
                           <X size={16}/>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem(setTempColors, tempColors)} className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Plus size={14}/> Aggiungi colore
                    </button>
                  </div>
                </section>
              </div>

              {/* FOOTER FISSO */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex justify-between items-center z-20">
                 <button onClick={() => setIsCreating(false)} className="text-slate-500 font-bold px-4 py-3 hover:bg-slate-50 rounded-xl transition">
                    Annulla
                 </button>
                 <button 
                    onClick={handleCreate}
                    disabled={loading}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
                    Salva Prodotto
                  </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}