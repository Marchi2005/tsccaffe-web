import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Forza Next.js a non mettere in cache questa pagina, eseguendola ogni volta
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Facciamo una query leggerissima: chiediamo a Supabase di leggerci SOLO l'ID di 1 ordine.
        // Questo è sufficiente per segnalare "attività" ai server di Supabase.
        const { data, error } = await supabase
            .from('web_orders')
            .select('id')
            .limit(1);

        if (error) {
            throw error;
        }

        console.log("⏰ Keep-alive eseguito con successo");
        
        return NextResponse.json({ 
            success: true, 
            message: "Supabase è sveglio! ☕", 
            timestamp: new Date().toISOString() 
        });

    } catch (error: any) {
        console.error("❌ Errore Keepalive:", error.message);
        return NextResponse.json(
            { success: false, error: error.message }, 
            { status: 500 }
        );
    }
}