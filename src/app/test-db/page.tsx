import { confirmOrderPayment } from "@/app/prenota-box/actions";
import { notFound } from "next/navigation";

export default async function TestDbPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; secret?: string }>;
}) {
  const { id, secret } = await searchParams;

  // PROTEZIONE: Se la secret non è corretta, la pagina restituisce un 404 (come se non esistesse)
  // Puoi cambiare "ilmioboss" con quello che preferisci
  if (secret !== "TSCAdminSecret2026") {
    return notFound();
  }

  if (!id) {
    return (
      <div className="p-10 pt-32 flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl max-w-md text-center">
            <h1 className="text-red-500 font-black text-2xl mb-4 uppercase">⚠️ ID Mancante</h1>
            <p className="text-slate-600 mb-6">Specifica l'ID ordine nell'URL per procedere.</p>
            <div className="bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-400">
                /test-db?id=...&secret=ilmioboss
            </div>
        </div>
      </div>
    );
  }

  let result;
  try {
    // Chiamiamo la Server Action
    result = await confirmOrderPayment(id);
  } catch (e: any) {
    result = { success: false, message: e.message };
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 pt-32 font-sans flex flex-col items-center">
      <div className="max-w-2xl w-full">
          <div className="mb-8 text-center">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                Ambiente di Debug Attivo
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Debug Database</h1>
            <p className="text-slate-500">Aggiornamento manuale stato ordine live.</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-bold text-slate-700 tracking-tight text-sm">Target ID: {id}</span>
            </div>
            
            <div className="mt-4">
              <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-2">Risposta dalla Server Action:</p>
              <pre className="bg-slate-900 text-emerald-400 p-6 rounded-2xl overflow-auto text-sm font-mono shadow-inner border border-slate-800">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                <span className="text-amber-500 text-lg">💡</span>
                <p className="text-amber-800 text-xs leading-relaxed">
                    Risultato <strong>success: true</strong>? L'ordine è ora <code className="bg-amber-100 px-1 rounded font-bold">pagato_online</code> su Supabase.
                </p>
            </div>
          </div>

          <p className="mt-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            Pagina protetta da Secret Key
          </p>
      </div>
    </div>
  );
}