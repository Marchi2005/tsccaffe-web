import { z } from "zod";

// --- 1. CONFIGURAZIONE BOX E PREZZI ---
// Qui definiamo i prezzi base e le regole per ogni Box per il calcolo automatico
export const BOX_TYPES = [
  { 
    id: "royal", 
    name: "Royal Desire", 
    desc: "Lusso puro. Un'esperienza indimenticabile.",
    spremutaIncluded: true, // Spremuta inclusa nel prezzo
    succoPrice: 1.70,       // Prezzo Succo Extra specifico per questa box
    variants: [
      { id: "singola", label: "Singola", price: 25.00 },
      { id: "doppia", label: "Doppia", price: 30.00 }
    ],
    accessories: {
      peluche_l: { price: 13.00, label: "Peluche L (Scontato)" }, // Era 18
      peluche_m: { price: 10.00, label: "Peluche M (Scontato)" }, // Era 14
      rosa: { price: 15.00, label: "Rosa + Baci + Tubo" }
    }
  },
  { 
    id: "velvet", 
    name: "Velvet Dream", 
    desc: "Preziosa ed elegante. Un tocco di classe.",
    spremutaIncluded: true,
    succoPrice: 1.20,
    variants: [
      { id: "singola", label: "Singola", price: 21.00 },
      { id: "doppia", label: "Doppia", price: 25.00 }
    ],
    accessories: {
      peluche_l: { price: 18.00, label: "Peluche L" }, // Prezzo pieno
      peluche_m: { price: 10.00, label: "Peluche M (Scontato)" }, // Era 14
      rosa: { price: 15.00, label: "Rosa + Baci + Tubo" }
    }
  },
  { 
    id: "red_love", 
    name: "Red Love", 
    desc: "Il classico intramontabile. Romantica ed essenziale.",
    // Logica complessa: Spremuta inclusa SOLO nella Medium. Gestita via codice.
    succoPrice: 1.20, 
    // Qui le varianti dipendono anche dalla Size, definiremo i prezzi base
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
    id: "sparkling", 
    name: "Sparkling Love", 
    desc: "Frizzante e unica. Solo versione singola.",
    spremutaIncluded: false,
    succoPrice: 1.70,
    variants: [
      { id: "singola", label: "Singola", price: 10.00 }
      // Nessuna doppia
    ],
    accessories: {
      peluche_l: { price: 18.00, label: "Peluche L" },
      peluche_m: { price: 14.00, label: "Peluche M" },
      rosa: { price: 15.00, label: "Rosa + Baci + Tubo" }
    }
  }
];

// --- 2. LISTA BEVANDE (Solo Caffetteria) ---
export const DRINKS_DATA = [
  { id: "nessuno", label: "NO GRAZIE", icon: "❌", hasCoffeeVariant: false, hasMilkVariant: false },
  { id: "espresso", label: "Espresso", icon: "☕", hasCoffeeVariant: true, hasMilkVariant: false },
  { id: "cappuccino", label: "Cappuccino", icon: "🥛", hasCoffeeVariant: true, hasMilkVariant: true },
  { id: "latte", label: "Latte Bianco", icon: "🥛", hasCoffeeVariant: false, hasMilkVariant: true },
  { id: "latte_macchiato", label: "Latte Macchiato", icon: "🥛", hasCoffeeVariant: true, hasMilkVariant: true },
  { id: "ginseng", label: "Ginseng", icon: "🟤", hasSub: true, hasSize: true, subOptions: ["Dolce", "Amaro"] }
  // Il Succo è stato rimosso da qui perché è un EXTRA separato, come richiesto
];

// --- 3. LISTA DOLCI ---
export const PASTRIES_DATA = [
  { id: "nessuno", label: "NO GRAZIE", category: "Nessuno", bg: "#f1f5f9", border: "#cbd5e1" },
  { id: "vuoto", label: "Vuoto", category: "Cornetto", bg: "#fff7ed", border: "#fdba74" },
  { id: "nutella", label: "Nutella®", category: "Cornetto", isBrand: true, bg: "#ffedd5", border: "#ea580c" },
  { id: "cioccolato_bianco", label: "Cioccolato Bianco", category: "Cornetto", bg: "#fefce8", border: "#eab308" },
  { id: "pistacchio", label: "Pistacchio", category: "Cornetto", bg: "#dcfce7", border: "#16a34a" },
  { id: "bosco", label: "Frutti di Bosco", category: "Cornetto", bg: "#ffe4e6", border: "#e11d48" },
  { id: "albicocca", label: "Albicocca", category: "Cornetto", bg: "#ffedd5", border: "#f97316" },
  { id: "pasticciotto", label: "Pasticciotto", category: "Speciale", desc: "Crema e Amarena", bg: "#fef3c7", border: "#d97706" },
  { id: "polacca", label: "Polacca", category: "Speciale", desc: "Crema e Amarena", bg: "#fffbeb", border: "#b45309" },
  { id: "graffa", label: "Graffa", category: "Speciale", bg: "#f3f4f6", border: "#4b5563" },
  { id: "bomba_cioccolato", label: "Bomba Cioccolato", category: "Bomba", bg: "#3f2c22", border: "#271c19", text: "white" },
  { id: "bomba_crema", label: "Bomba Crema", category: "Bomba", bg: "#fff7ed", border: "#fed7aa" },
];

// --- 4. ORARI ---
export const TIMES = ["07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00"];

// --- 5. VALIDAZIONE DATI (ZOD) ---
export const OrderSchema = z.object({
  fullName: z.string().min(2, "Il nome è obbligatorio"),
  phone: z.string().min(8, "Inserisci un numero valido"),
  deliveryType: z.enum(["domicilio", "ritiro"]),
  address: z.string().optional(),
  preferredTime: z.enum(TIMES as [string, ...string[]]),
  
  // Scelte Box
  boxType: z.string(), // ID della box (royal, velvet...)
  boxFormat: z.enum(["singola", "doppia"]), // Fondamentale
  boxSize: z.enum(["small", "medium"]).optional(), // Solo per Red Love
  
  // Colazione Persona 1 (Obbligatoria)
  drink1: z.string().min(1, "Seleziona una bevanda 1"),
  croissant1: z.string().min(1, "Seleziona un dolce 1"),
  
  // Colazione Persona 2 (Opzionale se singola)
  drink2: z.string().optional(),
  croissant2: z.string().optional(),
  
  // Extra e Accessori
  includeSpremuta: z.string().optional(), // Checkbox HTML invia stringhe "on" o undefined
  includeSucco: z.string().optional(),    // Nuovo: Succo Extra
  accessoriesList: z.string().optional(), // Stringa separata da virgole per checkbox multipli
  
  quantity: z.coerce.number().min(1),
});