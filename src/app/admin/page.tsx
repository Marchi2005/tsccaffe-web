"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
// Navbar rimossa perché gestita da ClientLayout
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Package, 
  Phone, 
  MapPin, 
  Calendar, 
  Euro, 
  ChefHat,
  RefreshCw,
  Coffee, 
  Cookie, 
  Heart,  
  Citrus,
  Printer,
  Store,
  LogOut 
} from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useRouter } from "next/navigation"; 

// DEFINIZIONE TIPO
type Order = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  address?: string;
  box_type: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  delivery_type: 'domicilio' | 'ritiro';
  preferred_time: string;
  drink_1: string;
  croissant_1: string;
  drink_2: string;
  croissant_2: string;
  notes: string;
  quantity: number;
};

function StatusBadge({ status }: { status: Order['status'] }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: "bg-slate-100 text-slate-500 border-slate-200 decoration-slice line-through",
  };

  const labels = {
    pending: "Da Gestire",
    confirmed: "In Preparazione",
    completed: "Completato",
    cancelled: "Annullato",
  };

  return (
    <span className={clsx("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border", styles[status])}>
      {labels[status]}
    </span>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [stats, setStats] = useState({ total: 0, revenue: 0, pending: 0 });
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    router.push("/"); 
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('web_orders') 
      .select('*')
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
    const activeOrders = data.filter(o => o.status !== 'cancelled');
    const revenue = activeOrders.reduce((acc, curr) => acc + curr.total_price, 0);
    const pending = data.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    setStats({ total: activeOrders.length, revenue, pending });
  };

  const updateStatus = async (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    const { error } = await supabase
      .from('web_orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("Errore aggiornamento stato");
      fetchOrders();
    } else {
      const updatedOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
      calculateStats(updatedOrders);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); 
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'pending') return o.status === 'pending' || o.status === 'confirmed';
    if (filter === 'completed') return o.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- SEZIONE VISIBILE A SCHERMO (Sparisce in stampa) --- */}
      <div className="print:hidden">
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* HEADER & STATS */}
          <div className="mb-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Ordini</h1>
                <p className="text-slate-500 text-sm mt-1">Gestione Box San Valentino</p>
              </div>
              
              <div className="flex gap-2">
                 <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-300 font-bold shadow-sm transition-colors">
                   <LogOut size={16} /> Esci
                </button>

                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white border border-slate-900 rounded-xl hover:bg-slate-800 font-bold shadow-sm transition-colors">
                   <Printer size={16} /> Stampa Lista
                </button>
                
                <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold shadow-sm transition-colors">
                  <RefreshCw size={16} className={clsx(loading && "animate-spin")} /> Aggiorna
                </button>
              </div>
            </div>

            {/* STATISTICHE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Totale Ordini</p>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
                 </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><ChefHat size={24} /></div>
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Da Preparare</p>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.pending}</p>
                 </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Euro size={24} /></div>
                 <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Incasso</p>
                    <p className="text-2xl font-extrabold text-slate-900">€{stats.revenue.toFixed(2)}</p>
                 </div>
              </div>
            </div>

            {/* FILTRI */}
            <div className="flex p-1 bg-white rounded-xl border border-slate-200 w-fit">
              {(['all', 'pending', 'completed'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={clsx("px-4 py-1.5 rounded-lg text-sm font-bold transition-all capitalize", filter === f ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900")}>
                  {f === 'all' ? 'Tutti' : (f === 'pending' ? 'Da Fare' : 'Completati')}
                </button>
              ))}
            </div>
          </div>

          {/* LISTA ORDINI (CARD) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className={clsx("bg-white rounded-2xl border shadow-sm relative overflow-hidden flex flex-col transition-all hover:shadow-md", order.status === 'cancelled' ? "border-slate-100 opacity-60" : "border-slate-200")}>
    
                  {/* STRISCIA LATERALE STATO */}
                  <div className={clsx("absolute left-0 top-0 bottom-0 w-1.5", order.status === 'pending' ? "bg-amber-400" : (order.status === 'confirmed' ? "bg-blue-500" : (order.status === 'completed' ? "bg-emerald-500" : "bg-slate-300")))} />

                  {/* INTESTAZIONE CARD */}
                  <div className="p-4 pb-2 flex justify-between items-start pl-5">
                      <div>
                      <h3 className="font-bold text-lg text-slate-900 leading-tight">{order.full_name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                          <Calendar size={12} />
                          {order.created_at ? format(new Date(order.created_at), "d MMM, HH:mm", { locale: it }) : "N/D"}
                      </div>
                      </div>
                      <div className="text-right">
                      <StatusBadge status={order.status} />
                      <p className="font-extrabold text-lg text-slate-900 mt-1">€{order.total_price.toFixed(2)}</p>
                      </div>
                  </div>

                  {/* DETTAGLI LOGISTICI */}
                  <div className="px-4 py-2 grid grid-cols-2 gap-2 text-sm pl-5">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <a href={`tel:${order.phone}`} className="flex items-center gap-2 font-bold text-slate-700 hover:text-blue-600 transition-colors">
                              <Phone size={14} className="text-slate-400" /> {order.phone}
                          </a>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-2 font-bold text-slate-700">
                              {order.delivery_type === 'domicilio' ? <MapPin size={14} className="text-red-500" /> : <Store size={14} className="text-orange-500" />}
                              <span className="capitalize">{order.preferred_time}</span>
                          </div>
                          {order.address && order.address !== "RITIRO IN SEDE" && (
                          <p className="text-[10px] text-slate-500 mt-1 leading-tight truncate px-0.5">{order.address}</p>
                          )}
                      </div>
                  </div>

                  {/* CONTENUTO BOX */}
                  <div className="px-5 py-3 flex-grow">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contenuto Box</span>
                          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-right">
                          {order.box_type} <span className="text-slate-500">x{order.quantity}</span>
                          </span>
                      </div>
                      
                      <div className="space-y-3">
                          {/* Persona 1 */}
                          <div className="flex items-start gap-3">
                              <div className="mt-0.5 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">1</div>
                              <div className="text-sm">
                                  <div className="font-bold text-slate-800 flex items-center gap-2">
                                      <Coffee size={14} className="text-slate-400" /> {order.drink_1}
                                  </div>
                                  <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5 pl-0.5">
                                      <Cookie size={14} className="text-slate-300" /> {order.croissant_1}
                                  </div>
                              </div>
                          </div>

                          {/* Persona 2 */}
                          <div className="flex items-start gap-3">
                              <div className="mt-0.5 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">2</div>
                              <div className="text-sm">
                                  <div className="font-bold text-slate-800 flex items-center gap-2">
                                      <Coffee size={14} className="text-slate-400" /> {order.drink_2}
                                  </div>
                                  <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5 pl-0.5">
                                      <Cookie size={14} className="text-slate-300" /> {order.croissant_2}
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                          {order.notes?.includes("SPREMUTA") && (
                              <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-xl border border-orange-100 text-xs font-bold shadow-sm">
                                  <Citrus size={16} className="text-orange-500" />
                                  CON SPREMUTA
                              </div>
                          )}

                          {order.notes?.includes("PELUCHE") && (
                              <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-3 py-2 rounded-xl border border-rose-100 text-xs font-bold shadow-sm animate-pulse-slow">
                                  <Heart size={16} className="text-rose-500 fill-rose-500" />
                                  CON PELUCHE (+9.50€)
                              </div>
                          )}
                      </div>
                  </div>

                  {/* BOTTONI AZIONI */}
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3 pl-5">
                      {order.status !== 'completed' && order.status !== 'cancelled' ? (
                          <>
                          <button onClick={() => updateStatus(order.id, 'cancelled')} className="flex justify-center items-center gap-2 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-white hover:text-red-600 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">
                              Annulla
                          </button>
                          <button onClick={() => updateStatus(order.id, order.status === 'pending' ? 'confirmed' : 'completed')} className={clsx("flex justify-center items-center gap-2 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-all active:scale-95", order.status === 'pending' ? "bg-slate-900 hover:bg-slate-800" : "bg-emerald-600 hover:bg-emerald-700")}>
                              {order.status === 'pending' ? 'Accetta Ordine' : 'Completa'} <CheckCircle2 size={14} />
                          </button>
                          </>
                      ) : (
                          <div className="col-span-2 text-center py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                              {order.status === 'cancelled' ? 'Ordine Annullato' : 'Ordine Archiviato'}
                          </div>
                      )}
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>

      {/* --- SEZIONE STAMPA (Nascosta a schermo, visibile in stampa) --- */}
      <div className="hidden print:block p-8 bg-white text-black">
          <div className="flex justify-between items-end mb-8 border-b-2 border-black pb-4">
              <div>
                  <h1 className="text-3xl font-bold uppercase tracking-widest">Lista Produzione</h1>
                  <p className="text-sm mt-1">Ordini da completare: {orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length}</p>
              </div>
              <div className="text-right text-xs">
                  Stampato il: {new Date().toLocaleString('it-IT')}
              </div>
          </div>

          <table className="w-full text-left border-collapse">
              <thead>
                  <tr className="border-b-2 border-black text-xs uppercase">
                      <th className="py-2 w-16">Ora</th>
                      <th className="py-2 w-1/4">Cliente</th>
                      <th className="py-2">Box & Contenuto</th>
                      <th className="py-2 w-1/6 text-right">Extra</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  {orders
                    .filter(o => o.status === 'pending' || o.status === 'confirmed')
                    .map((order) => (
                      <tr key={order.id} className="border-b border-gray-300">
                          {/* ORA */}
                          <td className="py-3 align-top font-bold text-lg">
                              {order.preferred_time}
                          </td>
                          
                          {/* CLIENTE (Con Indirizzo) */}
                          <td className="py-3 align-top pr-4">
                              <div className="font-bold text-base">{order.full_name}</div>
                              <div className="text-xs mt-1">
                                  {order.delivery_type === 'domicilio' ? (
                                    <>
                                        <span className="font-bold bg-black text-white px-1 rounded-sm uppercase text-[10px]">DOMICILIO</span>
                                        {/* INDIRIZZO QUI */}
                                        <div className="mt-1 italic border-l-2 border-black pl-2 leading-tight">
                                            {order.address}
                                        </div>
                                    </>
                                  ) : (
                                    <span className="uppercase text-slate-500 font-bold text-[10px]">RITIRO IN SEDE</span>
                                  )}
                              </div>
                              <div className="text-[10px] mt-2 flex items-center gap-1">
                                <Phone size={10} /> {order.phone}
                              </div>
                          </td>

                          {/* CONTENUTO */}
                          <td className="py-3 align-top">
                              <div className="font-bold mb-1 uppercase text-xs border border-black inline-block px-1 rounded">
                                  {order.box_type} (x{order.quantity})
                              </div>
                              <ul className="text-sm leading-snug space-y-1 mt-1">
                                  <li><span className="font-bold">1:</span> {order.drink_1} + {order.croissant_1}</li>
                                  <li><span className="font-bold">2:</span> {order.drink_2} + {order.croissant_2}</li>
                              </ul>
                          </td>

                          {/* EXTRA */}
                          <td className="py-3 align-top text-right font-bold">
                              {order.notes?.includes("SPREMUTA") && (
                                  <div className="mb-1 text-xs">SPREMUTA</div>
                              )}
                              {order.notes?.includes("PELUCHE") && (
                                  <div className="border border-black px-1 inline-block text-xs">PELUCHE</div>
                              )}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

    </div>
  );
}