import Link from "next/link";
import { Check, Home, Truck, MessageCircle, Phone } from "lucide-react"; 
import { confirmOrderPayment } from "@/app/prenota-box/actions"; 
import OrderQRSection from "@/components/OrderQRSection"; 
import { createClient } from "@supabase/supabase-js"; 

// Configurazione Supabase (Client con Service Role per saltare RLS se necessario)
// NOTA: Qui usiamo la anon key per la lettura semplice, 
// ma la conferma del pagamento userà la Service Role dentro la Action.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  
  let orderId = params.order_id;
  if (Array.isArray(orderId)) orderId = orderId[0];
  const finalOrderId = orderId || ""; 

  let showTicket = false;
  let orderAddress = ""; 

  // 1. Logica di conferma e recupero dati
  if (finalOrderId) {
    try {
      // Eseguiamo la conferma del pagamento
      await confirmOrderPayment(finalOrderId);

      // Recuperiamo i dati dell'ordine per la UI
      const { data: orderData, error } = await supabase
        .from('web_orders')
        .select('address') 
        .eq('id', finalOrderId)
        .single();

      if (orderData && !error) {
        orderAddress = orderData.address || ""; 
        if (orderAddress === 'RITIRO IN SEDE') {
          showTicket = true;
        }
      }
    } catch (err) {
      console.error("Errore durante la gestione post-pagamento:", err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 pt-12 animate-fade-in">
      <div className="bg-white p-0 rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-slate-100 text-center relative overflow-hidden max-w-sm w-full">
        
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-emerald-50 to-white z-0" />
        
        <div className="relative z-10 flex flex-col items-center p-8 pb-2">
          
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl shadow-emerald-100 border-4 border-emerald-50 animate-bounce-slow">
            <Check size={32} strokeWidth={3} className="text-emerald-500" />
          </div>

          <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Ordine Confermato!</h1>
          
          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 px-2">
            Grazie! Il pagamento è andato a buon fine.
          </p>

          {/* CONDIZIONE: Ticket o Spedizione */}
          {finalOrderId ? (
             showTicket ? (
               <div className="w-full animate-fade-in-up">
                 <OrderQRSection orderId={finalOrderId} />
               </div>
             ) : (
               <div className="bg-blue-50 p-5 rounded-2xl w-full border border-blue-100 flex flex-col items-center gap-2 mb-4 animate-fade-in-up">
                  <div className="bg-white p-3 rounded-full shadow-sm text-blue-600 mb-1">
                      <Truck size={28} />
                  </div>
                  <div>
                      <p className="text-sm text-blue-900 font-bold">Spedizione Confermata</p>
                      <p className="text-xs text-blue-700/80 mt-1 leading-snug">
                          Il tuo ordine verrà spedito all'indirizzo indicato: <br/>
                          <span className="font-semibold italic text-blue-800">
                            {orderAddress || "Indirizzo in fase di elaborazione..."}
                          </span>
                      </p>
                  </div>
               </div>
             )
          ) : (
             <div className="p-4 bg-red-50 rounded-xl border border-red-100 mb-4">
               <p className="text-red-500 text-xs font-bold uppercase">ID Ordine non trovato</p>
             </div>
          )}

        </div>

        {/* FOOTER CON BOTTONI AZIONE */}
        <div className="bg-white p-6 pt-2 border-t border-slate-50">
          <div className="space-y-3 w-full">
            
            {/* WHATSAPP */}
            <a
              href={`https://wa.me/393715428345?text=${encodeURIComponent(
                `Ciao! Ho appena completato l'ordine #${finalOrderId} sul sito. Avrei bisogno di alcune informazioni e vorrei sapere...`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <MessageCircle size={20} fill="white" />
              Contattaci su WhatsApp
            </a>

            {/* CHIAMATA */}
            <a
              href="tel:+393715428345"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <Phone size={18} />
              Chiamaci in sede
            </a>

            {/* TORNA ALLA HOME */}
            <Link 
              href="/" 
              className="block w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-slate-200 text-sm"
            >
              <Home size={18} /> Torna alla Home
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}