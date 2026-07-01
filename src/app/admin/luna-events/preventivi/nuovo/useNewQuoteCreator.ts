import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams, useRouter } from "next/navigation";

// --- TIPI ---
export type OrderItem = {
    id: string;
    category: 'food' | 'beverage' | 'setup';
    name: string;
    description?: string;
};

export type QuoteData = {
    customerHonorific: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string; 
    eventDate: string;
    location: string;
    guestCount: number;
    pricePerPerson: number;
    setupCost: number;
    vatRate: number;
    items: OrderItem[];
    notes: string;
    quoteNumber: string;
    showUnitPrices: boolean;
    lockedTotal: number | null;
};

// --- PRESETS ---
export const PRESET_OPTION_1: Partial<QuoteData> = {
    pricePerPerson: 12.00,
    setupCost: 0,
    lockedTotal: null,
    items: [
        { id: 'f1', category: 'food', name: 'Pizzette Assortite', description: 'Margherita classiche, pizzette rosse e varianti della casa' },
        { id: 'f2', category: 'food', name: 'Calzoncini Mignon', description: 'Cotti al forno con ripieni classici' },
        { id: 'f3', category: 'food', name: 'Girelle di Sfoglia', description: 'Con verdure o carne di stagione' },
        { id: 'b1', category: 'beverage', name: 'Welcome Drink', description: 'Analcolico di Benvenuto' },
        { id: 's1', category: 'setup', name: 'Servizio Staff', description: 'Operatori per la gestione del buffet' },
    ]
};

export const PRESET_OPTION_2: Partial<QuoteData> = {
    pricePerPerson: 16.00,
    setupCost: 0,
    lockedTotal: null,
    items: [
        { id: 'f1', category: 'food', name: 'Pizzette Assortite', description: 'Margherita classiche, pizzette rosse e varianti della casa' },
        { id: 'f2', category: 'food', name: 'Calzoncini Mignon', description: 'Cotti al forno con ripieni classici' },
        { id: 'f3', category: 'food', name: 'Bocconcini di Bufala', description: 'Mozzarelline/nodini monoporzione' },
        { id: 'b1', category: 'beverage', name: 'Welcome Drink', description: 'Analcolico di Benvenuto' },
        { id: 'b2', category: 'beverage', name: 'Prosecco', description: 'Scorta maggiorata per brindisi prolungato' },
        { id: 's1', category: 'setup', name: 'Logistica Premium', description: 'Trasporto, montaggio, ghiaccio, 2 operatori specializzati' },
    ]
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const parseCustomerName = (fullName: string) => {
    const prefixes = ["Sig.", "Sig.ra", "Sig./Sig.ra", "Mx."];
    for (const prefix of prefixes) {
        if (fullName.startsWith(prefix + " ")) {
            return { honorific: prefix, name: fullName.substring(prefix.length + 1) };
        }
    }
    return { honorific: "Sig.", name: fullName };
};

export function useNewQuoteCreator() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [editTotalMode, setEditTotalMode] = useState(false);
    const [leadId, setLeadId] = useState<string | null>(null);

    const [data, setData] = useState<QuoteData>({
        customerHonorific: "Sig.",
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        eventDate: new Date().toISOString().split('T')[0],
        location: "",
        guestCount: 50,
        pricePerPerson: 12.00,
        setupCost: 0,
        vatRate: 22,
        quoteNumber: "",
        notes: "Validità offerta: 15 giorni.\nAcconto 30% alla conferma.",
        items: PRESET_OPTION_1.items || [],
        showUnitPrices: true,
        lockedTotal: null
    });

    useEffect(() => {
        if (searchParams) {
            const passedId = searchParams.get("leadId");
            const passedName = searchParams.get("name");
            const passedPhone = searchParams.get("phone");
            const passedEmail = searchParams.get("email");
            
            if (passedId) setLeadId(passedId);
            
            if (passedName || passedPhone || passedEmail) {
                const parsed = passedName ? parseCustomerName(passedName) : { honorific: "Sig.", name: "" };
                
                setData(prev => ({
                    ...prev,
                    customerHonorific: parsed.honorific,
                    customerName: parsed.name || prev.customerName,
                    customerPhone: passedPhone || prev.customerPhone,
                    customerEmail: passedEmail || prev.customerEmail
                }));
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchNextQuoteNumber = async () => {
            const currentYear = new Date().getFullYear();
            const { data: lastQuote } = await supabase
                .from('quotes')
                .select('quote_number')
                .ilike('quote_number', `PV-${currentYear}-%`)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            let nextSequence = 1;
            if (lastQuote && lastQuote.quote_number) {
                const parts = lastQuote.quote_number.split('-');
                if (parts.length === 3) {
                    const lastNum = parseInt(parts[2], 10);
                    if (!isNaN(lastNum)) nextSequence = lastNum + 1;
                }
            }
            const formattedSequence = nextSequence.toString().padStart(3, '0');
            setData(prev => ({ ...prev, quoteNumber: `PV-${currentYear}-${formattedSequence}` }));
        };
        fetchNextQuoteNumber();
    }, []); 

    const finalTotal = data.lockedTotal !== null ? data.lockedTotal : (data.guestCount * data.pricePerPerson) + data.setupCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === "") {
            setData(prev => ({ ...prev, lockedTotal: null }));
            return;
        }
        const newTotal = parseFloat(val);
        const approxPricePax = (newTotal - data.setupCost) / (data.guestCount || 1);
        setData(prev => ({ ...prev, lockedTotal: newTotal, pricePerPerson: parseFloat(approxPricePax.toFixed(2)) }));
    };

    const handlePricePaxChange = (val: string) => {
        const newPrice = parseFloat(val) || 0;
        setData(prev => ({ ...prev, pricePerPerson: newPrice, lockedTotal: null }));
    };

    const toggleEditMode = () => setEditTotalMode(!editTotalMode);
    const loadPreset = (preset: Partial<QuoteData>) => { setData(prev => ({ ...prev, pricePerPerson: preset.pricePerPerson || 0, setupCost: preset.setupCost || 0, lockedTotal: null, items: preset.items || [] })); };
    const addItem = (category: 'food' | 'beverage' | 'setup') => { setData(prev => ({ ...prev, items: [...prev.items, { id: Math.random().toString(36).substr(2, 9), category, name: "Nuova Voce", description: "" }] })); };
    const updateItem = (id: string, field: keyof OrderItem, value: string) => { setData(prev => ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item) })); };
    const removeItem = (id: string) => { setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) })); };

    const handleSaveDB = async (skipRedirect = false) => {
    setSaveStatus('saving');
    console.log("=== DEBUG INIZIO SALVATAGGIO ===");
    console.log("1. Lead ID proveniente dall'URL:", leadId);

    try {
        const finalQuoteNumber = data.quoteNumber === "PV-202X-000" || !data.quoteNumber
            ? `PV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` 
            : data.quoteNumber;

        const quotePayload = {
            customer_name: data.customerName,
            customer_phone: data.customerPhone,
            event_date: data.eventDate,
            location: data.location || "",
            guest_count: data.guestCount,
            price_per_person: data.pricePerPerson,
            setup_cost: data.setupCost,
            vat_rate: data.vatRate,
            items: data.items,
            notes: data.notes,
            quote_number: finalQuoteNumber,
            show_unit_prices: data.showUnitPrices,
            total_amount: finalTotal
        };

        // 3. Salva nella tabella quotes
        console.log("2. Tento di inserire il preventivo nella tabella 'quotes'...");
        const { data: insertedQuote, error: insertError } = await supabase
            .from('quotes')
            .insert([quotePayload])
            .select()
            .single();

        if (insertError) {
            console.error("❌ ERRORE INSERT QUOTE:", insertError);
            throw insertError;
        }
        
        console.log("✅ 3. Preventivo salvato con successo! ID Generato:", insertedQuote.id);

        // 4. DEBUG ASSOCIAZIONE
        if (leadId) {
            const numericLeadId = parseInt(leadId, 10);
            console.log(`4. Tento di associare il preventivo alla richiesta con ID: ${numericLeadId}`);
            
            // PRIMA PROVA: Verifichiamo se la richiesta esiste davvero ed è leggibile
            const { data: checkLead, error: checkError } = await supabase
                .from('luna_preventivi')
                .select('*')
                .eq('id', numericLeadId)
                .single();
                
            console.log("🔍 5. Controllo Esistenza Richiesta (luna_preventivi):", { checkLead, checkError });

            if (checkLead) {
                // SECONDA PROVA: Facciamo l'Update
                console.log("6. Eseguo l'UPDATE su luna_preventivi...");
                const { data: updateData, error: updateError } = await supabase
                    .from('luna_preventivi')
                    .update({ 
                        quote_id: insertedQuote.id,
                        status: 'preventivo_inviato'
                    })
                    .eq('id', numericLeadId)
                    .select(); // IMPORTANTE: Chiediamo a Supabase di restituirci le righe modificate
                
                console.log("📝 7. Risultato UPDATE:", { updateData, updateError });

                // ANALISI DEL RISULTATO IN CONSOLE
                if (updateData && updateData.length === 0) {
                    console.error("🚨 ALLARME ROSSO RLS! L'update è andato a buon fine (nessun errore), ma 0 righe sono state modificate. Le Policy RLS di Supabase stanno bloccando l'UPDATE.");
                }
            } else {
                console.error("🚨 IMPOSSIBILE FARE UPDATE: La richiesta non è stata trovata nel DB!");
            }
        } else {
            console.log("ℹ️ Nessun leadId presente. È un preventivo manuale, non va associato a nessuna richiesta.");
        }

        setSaveStatus('success');
        setData(prev => ({ ...prev, quoteNumber: finalQuoteNumber }));
        
        if (!skipRedirect) {
            setTimeout(() => {
                router.push('/admin/luna-events/preventivi');
            }, 1000);
        }
        
        return insertedQuote; 
    } catch (error: any) {
        console.error("❌ ERRORE FATALE IN HANDLE_SAVE:", error.message || error);
        setSaveStatus('error');
        return null;
    }
};

    return {
        data, setData, saveStatus, editTotalMode, finalTotal, leadId,
        handleInputChange, handleTotalChange, handlePricePaxChange,
        toggleEditMode, loadPreset, addItem, updateItem, removeItem, handleSaveDB
    };
}