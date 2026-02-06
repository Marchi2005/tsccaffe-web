"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Fuse from 'fuse.js';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  CheckCircle2,
  Package,
  Phone,
  MapPin,
  Calendar,
  Euro,
  ChefHat,
  RefreshCw,
  Coffee,
  Cookie,
  Citrus,
  Printer,
  Store,
  LogOut,
  Gift,
  Flower,
  GlassWater,
  CreditCard,
  Banknote,
  Navigation,
  Wallet,
  TrendingDown,
  Search,
  ArrowRight,
  X,
  Camera
} from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useRouter } from "next/navigation";

// --- DEFINIZIONE TIPO ---
type Order = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  address?: string;
  box_type: string;
  box_format?: string;
  box_size?: string;
  quantity: number;
  total_price: number;
  status: string;
  payment_method: string;
  delivery_type: 'domicilio' | 'ritiro';
  preferred_time: string;
  drink_1: string;
  croissant_1: string;
  drink_2: string;
  croissant_2: string;
  include_spremuta: boolean;
  include_succo_extra: boolean;
  include_peluche_l: boolean;
  include_peluche_m: boolean;
  include_rosa: boolean;
  notes: string;
};

// --- HELPER DI MAPPING STATO ---
function getVisualStatus(dbStatus: string): 'pending' | 'confirmed' | 'completed' | 'cancelled' {
  switch (dbStatus) {
    case 'pagato_online':
    case 'da_pagare_in_sede':
    case 'pending':
      return 'pending';
    case 'confirmed':
      return 'confirmed';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
}

function getSuccoFlavor(notes: string | null) {
  if (!notes) return null;
  const match = notes.match(/Succo Extra \(([^)]+)\)/);
  return match ? match[1] : null;
}

function formatBoxName(type: string, format?: string, size?: string) {
  let name = type.replace(/_/g, " ").toUpperCase();
  name = name.replace(" MEDIUM", "").replace(" SMALL", "");
  if (size) name += ` (${size.toUpperCase()})`;
  return name;
}

// Calcolo Commissioni Stripe (1.5% + 0.25€)
function calculateStripeFee(amount: number) {
  return (amount * 0.015) + 0.25;
}

// Badge per lo stato visivo
function StatusBadge({ status }: { status: 'pending' | 'confirmed' | 'completed' | 'cancelled' }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: "bg-slate-100 text-slate-500 border-slate-200 decoration-slice line-through",
  };

  const labels = {
    pending: "DA GESTIRE",
    confirmed: "PAGATO / IN PREP.",
    completed: "COMPLETATO",
    cancelled: "ANNULLATO",
  };

  return (
    <span className={clsx("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm", styles[status])}>
      {labels[status]}
    </span>
  );
}

// Badge Metodo Pagamento
function PaymentBadge({ method, status }: { method: string, status: string }) {
  const isPaidOnline = method === 'card' && status === 'pagato_online';
  const isCashPending = (method === 'instore' || method === 'contanti') && status === 'da_pagare_in_sede';

  if (isPaidOnline) {
    return (
      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap">
        <CreditCard size={10} /> Pagato Online
      </span>
    );
  }

  if (isCashPending) {
    return (
      <span className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap animate-pulse">
        <Banknote size={10} /> DA INCASSARE
      </span>
    );
  }

  if (status === 'confirmed' && (method === 'instore' || method === 'contanti')) {
    return (
      <span className="flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap">
        <Banknote size={10} /> Contanti (Saldato)
      </span>
    );
  }

  return null;
}

function ExtraBadge({ icon, label, colorClass }: { icon: any, label: string, colorClass: string }) {
  return (
    <div className={clsx("flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold shadow-sm whitespace-nowrap", colorClass)}>
      {icon}
      <span className="truncate max-w-[120px]">{label}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    grossRevenue: 0,
    stripeFees: 0,
    netRevenue: 0
  });

  const router = useRouter();

  const handlePrint = () => window.print();
  const handleLogout = () => router.push("/");

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('web_orders')
      .select('*')
      .neq('status', 'bozza_in_attesa')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Errore fetch ordini:", error);
    } else {
      setOrders(data as Order[]);
      calculateStats(data as Order[]);
    }
    setLoading(false);
  };

  const calculateStats = (data: Order[]) => {
    const activeOrders = data.filter(o => getVisualStatus(o.status) !== 'cancelled');

    let gross = 0;
    let fees = 0;

    activeOrders.forEach(order => {
      gross += order.total_price;
      const isCardPayment = order.payment_method === 'card';
      if (isCardPayment) {
        fees += calculateStripeFee(order.total_price);
      }
    });

    const pendingCount = data.filter(o => {
      const visual = getVisualStatus(o.status);
      return visual === 'pending' || visual === 'confirmed';
    }).length;

    setStats({
      totalOrders: activeOrders.length,
      pendingOrders: pendingCount,
      grossRevenue: gross,
      stripeFees: fees,
      netRevenue: gross - fees
    });
  };

  // Funzione Generica Aggiornamento Stato
  const updateStatus = async (id: string, newVisualStatus: 'confirmed' | 'completed' | 'cancelled') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newVisualStatus } : o));

    const { error } = await supabase
      .from('web_orders')
      .update({ status: newVisualStatus })
      .eq('id', id);

    if (error) {
      alert("Errore aggiornamento stato");
      fetchOrders();
    } else {
      const updatedOrders = orders.map(o => o.id === id ? { ...o, status: newVisualStatus } : o);
      calculateStats(updatedOrders);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- LOGICA FILTRO + RICERCA CON FUSE.JS ---
  useEffect(() => {
    let result = orders;

    // 1. Filtro Tab (Tutti/Da Fare/Completati)
    if (filter === 'pending') {
      result = result.filter(o => ['pending', 'confirmed'].includes(getVisualStatus(o.status)));
    }
    if (filter === 'completed') {
      result = result.filter(o => getVisualStatus(o.status) === 'completed');
    }

    // 2. Ricerca Fuzzy (Nome, Telefono, ID per il QR)
    if (searchQuery.trim() !== "") {
      const fuse = new Fuse(result, {
        keys: ['full_name', 'phone', 'id', 'address'],
        threshold: 0.3,
        distance: 100,
      });
      const fuseResults = fuse.search(searchQuery);
      result = fuseResults.map(res => res.item);
    }

    setFilteredOrders(result);
  }, [orders, filter, searchQuery]);


  // --- GESTORE SCANNER ---
  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;
      if (code) {
        setSearchQuery(code);
        setShowScanner(false);
        if (navigator.vibrate) navigator.vibrate(200);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 relative">

      {/* --- MODALE SCANNER --- */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <button onClick={() => setShowScanner(false)} className="absolute top-6 right-6 text-white bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all z-50">
            <X size={32} />
          </button>

          <h2 className="text-white font-bold text-xl mb-6 animate-pulse text-center">Inquadra il QR Code</h2>

          <div className="w-full max-w-sm aspect-square border-4 border-emerald-500 rounded-3xl overflow-hidden shadow-2xl relative bg-black">
            <Scanner
              onScan={handleScan}
              formats={['qr_code']}
              components={{
                onOff: false,
                torch: true,
                // audio: false  <-- Rimosso perché causava l'errore
              }}
              styles={{
                container: { width: '100%', height: '100%' },
                video: { width: '100%', height: '100%', objectFit: 'cover' }
              }}
            />
            {/* Mirino grafico */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-white/50 rounded-lg relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1"></div>
              </div>
            </div>
          </div>
          <p className="text-slate-400 mt-6 text-sm text-center max-w-xs">
            Centra il QR Code nel riquadro.
          </p>
        </div>
      )}

      <div className="print:hidden">

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* HEADER & CONTROLS */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Dashboard Ordini</h1>
                <p className="text-slate-500 text-sm font-medium">Gestione Box San Valentino</p>
              </div>

              <div className="grid grid-cols-2 sm:flex gap-2">
                <button onClick={handleLogout} className="flex justify-center items-center gap-2 px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold shadow-sm text-sm">
                  <LogOut size={16} /> Esci
                </button>

                <button onClick={handlePrint} className="flex justify-center items-center gap-2 px-4 py-3 bg-slate-900 text-white border border-slate-900 rounded-xl hover:bg-slate-800 font-bold shadow-sm text-sm">
                  <Printer size={16} /> Stampa
                </button>

                <button onClick={fetchOrders} className="col-span-2 sm:col-span-1 flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 text-white border border-blue-600 rounded-xl hover:bg-blue-700 font-bold shadow-sm text-sm active:scale-95 transition-transform">
                  <RefreshCw size={16} className={clsx(loading && "animate-spin")} /> Aggiorna
                </button>
              </div>
            </div>

            {/* STATISTICHE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* ORDINI TOTALI */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package size={24} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ordini Attivi</p>
                  <p className="text-2xl font-black text-slate-900">{stats.totalOrders}</p>
                </div>
              </div>

              {/* DA PREPARARE */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><ChefHat size={24} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Da Preparare</p>
                  <p className="text-2xl font-black text-slate-900">{stats.pendingOrders}</p>
                </div>
              </div>

              {/* INCASSO LORDO */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Euro size={16} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Totale Lordo</span>
                </div>
                <p className="text-xl font-bold text-slate-500 line-through decoration-slate-300 decoration-2">
                  €{stats.grossRevenue.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded w-fit">
                  <TrendingDown size={10} /> -€{stats.stripeFees.toFixed(2)} Stripe
                </div>
              </div>

              {/* INCASSO NETTO */}
              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 bg-gradient-to-br from-white to-emerald-50">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg shadow-sm border border-emerald-200">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Netto Reale</p>
                  <p className="text-2xl font-black text-emerald-700">€{stats.netRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* --- BARRA DI RICERCA E FILTRI --- */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar + Scanner Button */}
              <div className="relative flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Cerca cliente, ID o spara QR..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500">
                      <X size={18} />
                    </button>
                  )}
                </div>
                {/* Tasto Scanner */}
                <button onClick={() => setShowScanner(true)} className="px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center">
                  <Camera size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-white rounded-xl border border-slate-200 w-full sm:w-fit overflow-x-auto shrink-0">
                {(['all', 'pending', 'completed'] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={clsx("flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide whitespace-nowrap", filter === f ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900")}>
                    {f === 'all' ? 'Tutti' : (f === 'pending' ? 'Da Fare' : 'Completati')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LISTA ORDINI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium">Nessun ordine trovato.</p>
                <p className="text-sm">Prova con un altro nome o scansiona il QR.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const succoFlavor = getSuccoFlavor(order.notes);
                const boxDisplayName = formatBoxName(order.box_type, order.box_format, order.box_size);
                const isDoppia = order.box_format === 'doppia';
                const visualStatus = getVisualStatus(order.status);
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address || "")}`;
                const showIncassaButton = order.status === 'da_pagare_in_sede' && visualStatus !== 'cancelled';

                return (
                  <div key={order.id} className={clsx("bg-white rounded-2xl border shadow-sm relative overflow-hidden flex flex-col transition-all hover:shadow-md", visualStatus === 'cancelled' ? "border-slate-100 opacity-60" : "border-slate-200", searchQuery && (order.id.includes(searchQuery) || order.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ? "ring-2 ring-blue-500 ring-offset-2" : "")}>

                    <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5", visualStatus === 'pending' ? "bg-amber-400" : (visualStatus === 'confirmed' ? "bg-blue-500" : (visualStatus === 'completed' ? "bg-emerald-500" : "bg-slate-300")))} />

                    {/* INTESTAZIONE CARD */}
                    <div className="p-4 flex justify-between items-start pl-5 border-b border-slate-50">
                      <div className="flex-1 mr-2">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <StatusBadge status={visualStatus} />
                          <PaymentBadge method={order.payment_method} status={order.status} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight break-words">
                          {order.full_name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                          <Calendar size={12} />
                          {order.created_at ? format(new Date(order.created_at), "d MMM, HH:mm", { locale: it }) : "N/D"}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-slate-900">€{order.total_price.toFixed(2)}</p>
                        {order.payment_method === 'card' && visualStatus !== 'cancelled' && (
                          <p className="text-[9px] text-red-400 font-medium mt-0.5">-€{calculateStripeFee(order.total_price).toFixed(2)} fee</p>
                        )}
                      </div>
                    </div>

                    {/* LOGISTICA */}
                    <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm pl-5 bg-slate-50/50">
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="bg-slate-100 p-1.5 rounded-full text-slate-500"><Phone size={14} /></div>
                        <a href={`tel:${order.phone}`} className="font-bold text-slate-700 hover:text-blue-600 truncate">
                          {order.phone}
                        </a>
                      </div>
                      <div className={clsx("bg-white p-2 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3 relative group", order.delivery_type === 'domicilio' && "hover:border-blue-300 transition-colors")}>
                        <div className={clsx("p-1.5 rounded-full shrink-0", order.delivery_type === 'domicilio' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600")}>
                          {order.delivery_type === 'domicilio' ? <MapPin size={14} /> : <Store size={14} />}
                        </div>
                        <div className="overflow-hidden flex-1">
                          <span className="block font-bold text-slate-900 capitalize text-xs">{order.preferred_time}</span>
                          {order.address && order.address !== "RITIRO IN SEDE" && (
                            <div className="flex justify-between items-center gap-2">
                              <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5 w-full" title={order.address}>{order.address}</p>
                              {order.delivery_type === 'domicilio' && (
                                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="ml-auto bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 p-1 rounded transition-all shrink-0" title="Apri Mappa">
                                  <Navigation size={12} />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CONTENUTO BOX */}
                    <div className="px-5 py-4 flex-grow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">BOX</span>
                          <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase">
                            {boxDisplayName}
                          </span>
                        </div>
                        <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase", isDoppia ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-gray-50 text-gray-600 border-gray-200")}>
                          {order.box_format || "Singola"}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Persona 1 */}
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">1</div>
                          <div className="text-sm w-full">
                            <div className="font-bold text-slate-800 flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                              <Coffee size={14} className="text-slate-400" /> {order.drink_1}
                            </div>
                            <div className="font-medium text-slate-600 text-xs flex items-center gap-2 mt-1 p-1.5 pl-2">
                              <Cookie size={14} className="text-amber-400" /> {order.croissant_1}
                            </div>
                          </div>
                        </div>
                        {/* Persona 2 - Se Doppia */}
                        {order.drink_2 && (
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">2</div>
                            <div className="text-sm w-full">
                              <div className="font-bold text-slate-800 flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                <Coffee size={14} className="text-slate-400" /> {order.drink_2}
                              </div>
                              <div className="font-medium text-slate-600 text-xs flex items-center gap-2 mt-1 p-1.5 pl-2">
                                <Cookie size={14} className="text-amber-400" /> {order.croissant_2}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* EXTRA */}
                      {(order.include_spremuta || order.include_succo_extra || order.include_peluche_l || order.include_peluche_m || order.include_rosa) && (
                        <div className="mt-5 pt-3 border-t border-dashed border-slate-200">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Extra Aggiunti</p>
                          <div className="flex flex-wrap gap-2">
                            {order.include_spremuta && <ExtraBadge icon={<Citrus size={12} />} label="Spremuta" colorClass="bg-orange-50 text-orange-700 border-orange-200" />}
                            {order.include_succo_extra && (
                              <ExtraBadge
                                icon={<GlassWater size={12} />}
                                label={succoFlavor ? `Succo: ${succoFlavor}` : "Succo Extra"}
                                colorClass="bg-yellow-50 text-yellow-700 border-yellow-200"
                              />
                            )}
                            {order.include_peluche_l && <ExtraBadge icon={<Gift size={12} />} label="Peluche L" colorClass="bg-pink-50 text-pink-700 border-pink-200" />}
                            {order.include_peluche_m && <ExtraBadge icon={<Gift size={12} />} label="Peluche M" colorClass="bg-pink-50 text-pink-700 border-pink-200" />}
                            {order.include_rosa && <ExtraBadge icon={<Flower size={12} />} label="Rosa" colorClass="bg-red-50 text-red-700 border-red-200" />}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AZIONI */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3 pl-5">
                      {visualStatus !== 'completed' && visualStatus !== 'cancelled' ? (
                        <>
                          <button onClick={() => updateStatus(order.id, 'cancelled')} className="flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-white hover:text-red-600 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">
                            ANNULLA
                          </button>

                          {showIncassaButton ? (
                            <button
                              onClick={() => updateStatus(order.id, 'confirmed')}
                              className="flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-700 animate-pulse"
                            >
                              <Banknote size={16} /> INCASSA ORA
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatus(order.id, visualStatus === 'pending' ? 'confirmed' : 'completed')}
                              className={clsx("flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95", visualStatus === 'pending' ? "bg-slate-900 hover:bg-slate-800" : "bg-emerald-600 hover:bg-emerald-700")}
                            >
                              {visualStatus === 'pending' ? 'PREPARA' : 'COMPLETA'} <CheckCircle2 size={16} />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="col-span-2 text-center py-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                          {visualStatus === 'cancelled' ? <><LogOut size={14} /> Ordine Annullato</> : <><CheckCircle2 size={14} /> Ordine Archiviato</>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* --- SEZIONE STAMPA --- */}
      <div className="hidden print:block p-8 bg-white text-black">
        <div className="flex justify-between items-end mb-8 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest">Lista Produzione</h1>
            <p className="text-sm mt-1">Ordini da completare: {orders.filter(o => getVisualStatus(o.status) === 'pending' || getVisualStatus(o.status) === 'confirmed').length}</p>
          </div>
<div className="text-right text-xs">
    Stampato il: <span suppressHydrationWarning>{new Date().toLocaleString('it-IT')}</span>
</div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-xs uppercase">
              <th className="py-2 w-16">Ora</th>
              <th className="py-2 w-1/4">Cliente</th>
              <th className="py-2">Box & Contenuto</th>
              <th className="py-2 w-1/4 text-right">Extra & Note</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders
              .filter(o => getVisualStatus(o.status) === 'pending' || getVisualStatus(o.status) === 'confirmed')
              .map((order) => {
                const boxFull = formatBoxName(order.box_type, order.box_format, order.box_size);

                return (
                  <tr key={order.id} className="border-b border-gray-300">
                    <td className="py-3 align-top font-bold text-lg">{order.preferred_time}</td>
                    <td className="py-3 align-top pr-4">
                      <div className="font-bold text-base">{order.full_name}</div>
                    </td>
                    <td className="py-3 align-top">
                      <div className="font-bold mb-1 uppercase text-xs border border-black inline-block px-1 rounded">{boxFull}</div>
                      <ul className="text-sm leading-snug space-y-1 mt-1">
                        <li><span className="font-bold">1:</span> {order.drink_1} + {order.croissant_1}</li>
                        {order.drink_2 && <li><span className="font-bold">2:</span> {order.drink_2} + {order.croissant_2}</li>}
                      </ul>
                    </td>
                    <td className="py-3 align-top text-right font-bold text-xs space-y-1">
                      {order.include_spremuta && <div>[SPREMUTA]</div>}
                      {order.include_succo_extra && <div>[SUCCO]</div>}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}