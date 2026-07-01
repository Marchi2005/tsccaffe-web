import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

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

// --- SUPABASE CLIENT ---
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- HELPER FUNZIONI ---
const parseCustomerName = (fullName: string) => {
    const prefixes = ["Sig.", "Sig.ra", "Sig./Sig.ra", "Mx."];
    for (const prefix of prefixes) {
        if (fullName.startsWith(prefix + " ")) {
            return { honorific: prefix, name: fullName.substring(prefix.length + 1) };
        }
    }
    return { honorific: "Sig.", name: fullName };
};

// --- CUSTOM HOOK ---
export function useQuoteEditor(id: string) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [editTotalMode, setEditTotalMode] = useState(false);
    const [data, setData] = useState<QuoteData>({
        customerHonorific: "Sig.",
        customerName: "",
        customerPhone: "",
        eventDate: new Date().toISOString().split('T')[0],
        location: "",
        guestCount: 0,
        pricePerPerson: 0,
        setupCost: 0,
        vatRate: 22,
        quoteNumber: "",
        notes: "",
        items: [],
        showUnitPrices: true,
        lockedTotal: null
    });

    useEffect(() => {
        const fetchQuote = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const { data: quote, error } = await supabase
                    .from('quotes')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (quote) {
                    const { honorific, name } = parseCustomerName(quote.customer_name);
                    const calculated = (quote.guest_count * quote.price_per_person) + (quote.setup_cost || 0);
                    const isManualTotal = Math.abs(calculated - quote.total_amount) > 0.1;

                    setData({
                        customerHonorific: honorific,
                        customerName: name,
                        customerPhone: quote.customer_phone || "",
                        eventDate: quote.event_date,
                        location: quote.location || "",
                        guestCount: quote.guest_count,
                        pricePerPerson: quote.price_per_person,
                        setupCost: quote.setup_cost || 0,
                        vatRate: quote.vat_rate || 22,
                        quoteNumber: quote.quote_number,
                        notes: quote.notes || "",
                        items: (quote.items as OrderItem[]) || [],
                        showUnitPrices: quote.show_unit_prices ?? true,
                        lockedTotal: isManualTotal ? quote.total_amount : null
                    });

                    if (isManualTotal) setEditTotalMode(true);
                }
            } catch (err) {
                console.error("Errore caricamento:", err);
                alert("Impossibile caricare il preventivo.");
                router.push("/admin/luna-events/preventivi");
            } finally {
                setLoading(false);
            }
        };
        fetchQuote();
    }, [id, router]);

    const finalTotal = data.lockedTotal !== null 
        ? data.lockedTotal 
        : (data.guestCount * data.pricePerPerson) + data.setupCost;

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
        setData(prev => ({
            ...prev,
            lockedTotal: newTotal,
            pricePerPerson: parseFloat(approxPricePax.toFixed(2))
        }));
    };

    const handlePricePaxChange = (val: string) => {
        const newPrice = parseFloat(val) || 0;
        setData(prev => ({ ...prev, pricePerPerson: newPrice, lockedTotal: null }));
    };

    const toggleEditMode = () => setEditTotalMode(!editTotalMode);

    const addItem = (category: 'food' | 'beverage' | 'setup') => {
        const newItem: OrderItem = {
            id: Math.random().toString(36).substring(2, 11),
            category,
            name: "Nuova Voce",
            description: ""
        };
        setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const updateItem = (itemId: string, field: keyof OrderItem, value: string) => {
        setData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
        }));
    };

    const removeItem = (itemId: string) => {
        setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== itemId) }));
    };

    const handleUpdateDB = async () => {
        setSaveStatus('saving');
        try {
            const fullName = `${data.customerHonorific} ${data.customerName}`;
            const { error } = await supabase
                .from('quotes')
                .update({
                    customer_name: fullName,
                    customer_phone: data.customerPhone,
                    event_date: data.eventDate,
                    location: data.location,
                    guest_count: data.guestCount,
                    price_per_person: data.pricePerPerson,
                    setup_cost: data.setupCost,
                    vat_rate: data.vatRate,
                    total_amount: finalTotal,
                    items: data.items,
                    notes: data.notes,
                    show_unit_prices: data.showUnitPrices
                })
                .eq('id', id);

            if (error) throw error;
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000); 
        } catch (err: any) {
            console.error("Errore aggiornamento:", err);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    return {
        data,
        setData,
        loading,
        saveStatus,
        editTotalMode,
        finalTotal,
        handleInputChange,
        handleTotalChange,
        handlePricePaxChange,
        toggleEditMode,
        addItem,
        updateItem,
        removeItem,
        handleUpdateDB
    };
}