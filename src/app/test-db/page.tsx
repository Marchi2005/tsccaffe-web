import { confirmOrderPayment } from "@/app/prenota-box/actions";

export default async function TestDbPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="p-10">
        <h1 className="text-red-500 font-bold">Errore: Manca l'ID nell'URL</h1>
        <p>Aggiungi <code>?id=IL_TUO_ID_ORDINE</code> alla fine dell'indirizzo.</p>
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
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Test Aggiornamento Database</h1>
      
      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
        <p className="mb-2"><strong>ID Test:</strong> {id}</p>
        
        <div className="mt-4">
          <p className="text-sm uppercase text-slate-500 font-bold">Risultato Action:</p>
          <pre className="bg-white p-4 rounded border mt-2 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-6 text-sm text-slate-500">
        <p>Se vedi <strong>success: true</strong>, controlla Supabase: l'ordine deve essere diventato "pagato_online".</p>
        <p className="mt-2 font-bold text-rose-500 italic underline">
            Ricordati di cancellare questa pagina prima di andare live ufficialmente!
        </p>
      </div>
    </div>
  );
}