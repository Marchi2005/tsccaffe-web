import { confirmOrderPayment } from "@/app/prenota-box/actions";

export default async function TestDbPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    return (
      // Aggiunto pt-32 per saltare la navbar
      <div className="p-10 pt-32 flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-xl max-w-md text-center">
            <h1 className="text-red-500 font-black text-2xl mb-4 uppercase">⚠️ ID Mancante</h1>
            <p className="text-slate-600 mb-6">Non hai specificato l'ordine da testare nell'URL.</p>
            <div className="bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-400">
                Esempio: /test-db?id=IL_TUO_ID
            </div>
        </div>
      </div>
    );
  }

  let result;
  try {
    // Chiamiamo la Server Action che deve aggiornare il DB
    result = await confirmOrderPayment(id);
  } catch (e: any) {
    result = { success: false, message: e.message };
  }

  return (
    // Aggiunto pt-32 per distanziarsi dalla navbar
    <div className="min-h-screen bg-slate-50 p-6 pt-32 font-sans flex flex-col items-center">
      
      <div className="max-w-2xl w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Debug Database</h1>
            <p className="text-slate-500">Stai testando l'aggiornamento dello stato per l'ordine live.</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                <span className="font-bold text-slate-700 tracking-tight">ID in fase di test: {id}</span>
            </div>
            
            <div className="mt-4">
              <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-2">Risposta dal Server:</p>
              <pre className="bg-slate-900 text-emerald-400 p-6 rounded-2xl overflow-auto text-sm font-mono shadow-inner border border-slate-800">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                <span className="text-amber-500 text-lg">💡</span>
                <p className="text-amber-800 text-xs leading-relaxed">
                    Se sopra leggi <strong>"success": true</strong>, vai su Supabase. L'ordine deve essere passato allo stato <code className="bg-amber-100 px-1 rounded font-bold">pagato_online</code>.
                </p>
            </div>
          </div>

          <p className="mt-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            Ricordati di eliminare questo file prima del lancio ufficiale
          </p>
      </div>
    </div>
  );
}