import { z } from "zod";

// 1. BOX
export const BOX_TYPES = [
  { id: "sparkling", name: "Sparkling Valentine", price: 7.90, oldPrice: 10.00, desc: "Radiosa. Unica. Un dolce risveglio frizzante." },
  { id: "red_love", name: "Red Love", price: 14.90, oldPrice: 18.00, desc: "Iconica. Romantica. Essenziale. Il classico intramontabile." },
  { id: "velvet", name: "Velvet Dream", price: 19.90, oldPrice: 25.00, desc: "Preziosa. Elegante. Esclusiva. Un'esperienza luxury." }
];

// 2. BEVANDE
export const DRINKS_DATA = [
  { id: "espresso", label: "Espresso", icon: "☕", hasCoffeeVariant: true, hasMilkVariant: false },
  { id: "cappuccino", label: "Cappuccino", icon: "🥛", hasCoffeeVariant: true, hasMilkVariant: true },
  { id: "latte", label: "Latte Bianco", icon: "🥛", hasCoffeeVariant: false, hasMilkVariant: true },
  { id: "latte_macchiato", label: "Latte Macchiato", icon: "🥛", hasCoffeeVariant: true, hasMilkVariant: true },
  { id: "ginseng", label: "Ginseng", icon: "🟤", hasSub: true, hasSize: true, subOptions: ["Dolce", "Amaro"] },
  { 
    id: "succo", 
    label: "Succo Frutta", 
    icon: "🧃", 
    hasSub: true, 
    subOptions: ["Pera", "Pesca", "Ace"], 
    surcharge: 1.30, 
    fullPrice: 2.50 
  }
];

// 3. DOLCI
export const PASTRIES_DATA = [
  { id: "vuoto", label: "Vuoto", category: "Cornetto", bg: "#fff7ed", border: "#fdba74" },
  { id: "nutella", label: "Nutella®", category: "Cornetto", isBrand: true, bg: "#ffedd5", border: "#ea580c" },
  { id: "cioccolato_bianco", label: "Ciocc. Bianco", category: "Cornetto", bg: "#fefce8", border: "#eab308" },
  { id: "pistacchio", label: "Pistacchio", category: "Cornetto", bg: "#dcfce7", border: "#16a34a" },
  { id: "bosco", label: "Frutti di Bosco", category: "Cornetto", bg: "#ffe4e6", border: "#e11d48" },
  { id: "albicocca", label: "Albicocca", category: "Cornetto", bg: "#ffedd5", border: "#f97316" },
  { id: "pasticciotto", label: "Pasticciotto", category: "Speciale", desc: "Crema e Amarena", bg: "#fef3c7", border: "#d97706" },
  { id: "polacca", label: "Polacca", category: "Speciale", desc: "Crema e Amarena", bg: "#fffbeb", border: "#b45309" },
  { id: "graffa", label: "Graffa", category: "Speciale", bg: "#f3f4f6", border: "#4b5563" },
  { id: "bomba_ciocco", label: "Bomba Ciocco", category: "Bomba", bg: "#3f2c22", border: "#271c19", text: "white" },
  { id: "bomba_crema", label: "Bomba Crema", category: "Bomba", bg: "#fff7ed", border: "#fed7aa" },
];

export const TIMES = ["07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00"];

export const OrderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  deliveryType: z.enum(["domicilio", "ritiro"]),
  address: z.string().optional(),
  preferredTime: z.enum(TIMES as [string, ...string[]]),
  boxType: z.string(),
  drink1: z.string(),
  croissant1: z.string(),
  drink2: z.string(),
  croissant2: z.string(),
  includeSpremuta: z.string().optional(),
  includePeluche: z.string().optional(), // NUOVO CAMPO
  quantity: z.coerce.number().min(1),
});