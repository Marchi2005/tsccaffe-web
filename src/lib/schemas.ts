import { z } from "zod";

// --- 0. PREZZI FISSI COLAZIONE ---
export const PRICE_SPREMUTA = 2.50;
export const PRICE_SUCCO = 2.50;

// --- 1. CONFIGURAZIONE BOX E PREZZI ---
export const BOX_TYPES = [
  { 
    id: "royal", 
    name: "Royal Desire", 
    desc: "Esclusiva. Regale. Eterna. Lusso puro, un classico intramontabile.",
    spremutaIncluded: true,
    succoPrice: 1.70,
    variants: [
      { id: "singola", label: "Singola", price: 25.00 },
      { id: "doppia", label: "Doppia", price: 30.00 }
    ],
    accessories: {
      peluche_l: { price: 13.00, label: "Peluche L (Scontato)" },
      peluche_m: { price: 10.00, label: "Peluche M (Scontato)" },
      rosa: { price: 15.00, label: "Rosa + Baci + Tubo" }
    }
  },
  { 
    id: "velvet", 
    name: "Velvet Dream", 
    desc: "Preziosa. Elegante. Esclusiva. Un tocco di classe",
    spremutaIncluded: true,
    succoPrice: 1.20,
    variants: [
      { id: "singola", label: "Singola", price: 21.00 },
      { id: "doppia", label: "Doppia", price: 25.00 }
    ],
    accessories: {
      peluche_l: { price: 18.00, label: "Peluche L" },
      peluche_m: { price: 10.00, label: "Peluche M (Scontato)" },
      rosa: { price: 15.00, label: "Rosa + Baci + Tubo" }
    }
  },
  { 
    id: "red_love", 
    name: "Red Love", 
    desc: "Iconica. Romantica. Essenziale. Senza compromessi.",
    succoPrice: 1.20, 
    sizes: [
      { 
        id: "medium", 
        label: "Medium", 
        spremutaIncluded: true,
        variants: [
           { id: "singola", price: 18.00 },
           { id: "doppia", price: 20.00 }
        ]
      },
      { 
        id: "small", 
        label: "Small", 
        spremutaIncluded: false,
        variants: [
           { id: "singola", price: 13.00 },
           { id: "doppia", price: 15.00 }
        ]
      }
    ],
    accessories: {
      peluche_l: { price: 18.00, label: "Peluche L" },
      peluche_m: { price: 14.00, label: "Peluche M" },
      rosa: { price: 15.00, label: "Rosa + Baci + Tubo" }
    }
  },
  { 
    id: "sparkly", 
    name: "Sparkly Valentine", 
    desc: "Radiosa. Unica. Solo versione singola.",
    spremutaIncluded: false,
    succoPrice: 1.70,
    variants: [
      { id: "singola", label: "Singola", price: 10.00 }
    ],
    accessories: {
      peluche_l: { price: 18.00, label: "Peluche L" },
      peluche_m: { price: 14.00, label: "Peluche M" },
      rosa: { price: 15.00, label: "Rosa + Baci + Tubo" }
    }
  }
];

// --- 2. LISTA BEVANDE (Aggiunti Prezzi per actions.ts) ---
export const DRINKS_DATA = [
  { id: "nessuno", label: "NO GRAZIE", icon: "❌", price: 0, hasCoffeeVariant: false, hasMilkVariant: false },
  { id: "espresso", label: "Espresso", icon: "☕", price: 1.20, hasCoffeeVariant: true, hasMilkVariant: false },
  { id: "cappuccino", label: "Cappuccino", icon: "🥛", price: 1.50, hasCoffeeVariant: true, hasMilkVariant: true },
  { id: "latte", label: "Latte Bianco", icon: "🥛", price: 1.50, hasCoffeeVariant: false, hasMilkVariant: true },
  { id: "latte_macchiato", label: "Latte Macchiato", icon: "🥛", price: 1.80, hasCoffeeVariant: true, hasMilkVariant: true },
  { id: "ginseng", label: "Ginseng", icon: "🟤", price: 1.50, hasSub: true, hasSize: true, subOptions: ["Dolce", "Amaro"] }
];

// --- 3. LISTA DOLCI (Aggiunti Prezzi per actions.ts) ---
export const PASTRIES_DATA = [
  { id: "nessuno", label: "NO GRAZIE", price: 0, category: "Nessuno", bg: "#f1f5f9", border: "#cbd5e1" },
  { id: "vuoto", label: "Vuoto", price: 1.20, category: "Cornetto", bg: "#fff7ed", border: "#fdba74" },
  { id: "nutella", label: "Nutella®", price: 1.50, category: "Cornetto", isBrand: true, bg: "#ffedd5", border: "#ea580c" },
  { id: "cioccolato_bianco", label: "Cioccolato Bianco", price: 1.50, category: "Cornetto", bg: "#fefce8", border: "#eab308" },
  { id: "pistacchio", label: "Pistacchio", price: 1.50, category: "Cornetto", bg: "#dcfce7", border: "#16a34a" },
  { id: "bosco", label: "Frutti di Bosco", price: 1.30, category: "Cornetto", bg: "#ffe4e6", border: "#e11d48" },
  { id: "albicocca", label: "Albicocca", price: 1.30, category: "Cornetto", bg: "#ffedd5", border: "#f97316" },
  { id: "pasticciotto", label: "Pasticciotto", price: 1.50, category: "Speciale", desc: "Crema e Amarena", bg: "#fef3c7", border: "#d97706" },
  { id: "polacca", label: "Polacca", price: 1.50, category: "Speciale", desc: "Crema e Amarena", bg: "#fffbeb", border: "#b45309" },
  { id: "graffa", label: "Graffa", price: 1.20, category: "Speciale", bg: "#f3f4f6", border: "#4b5563" },
  { id: "bomba_cioccolato", label: "Bomba Cioccolato", price: 1.50, category: "Bomba", bg: "#3f2c22", border: "#271c19", text: "white" },
  { id: "bomba_crema", label: "Bomba Crema", price: 1.50, category: "Bomba", bg: "#fff7ed", border: "#fed7aa" },
];

// --- 4. ORARI ---
// Usiamo orari puntuali per permettere la validazione di sicurezza (ritardo max 15min)
export const TIMES = [
  "07:30", 
  "08:00", 
  "08:30", 
  "09:00", 
  "09:30", 
  "10:00", 
  "10:30", 
  "11:00"
];

// --- 5. VALIDAZIONE DATI (ZOD) ---
export const OrderSchema = z.object({
  fullName: z.string().min(2, "Il nome è obbligatorio"),
  phone: z.string().min(8, "Inserisci un numero valido"),
  deliveryType: z.enum(["domicilio", "ritiro"]),
  address: z.string().optional(),
  preferredTime: z.string(),
  boxType: z.string(), 
  boxFormat: z.enum(["singola", "doppia"]), 
  boxSize: z.enum(["small", "medium"]).optional(), 
  drink1: z.string().min(1, "Seleziona una bevanda 1"),
  croissant1: z.string().min(1, "Seleziona un dolce 1"),
  drink2: z.string().optional(),
  croissant2: z.string().optional(),
  includeSpremuta: z.string().optional(), 
  includeSucco: z.string().optional(),
  accessoriesList: z.string().optional(),
  quantity: z.coerce.number().min(1),
});