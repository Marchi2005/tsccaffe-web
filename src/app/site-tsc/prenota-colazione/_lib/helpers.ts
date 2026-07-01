import { DRINKS_DATA, PASTRIES_DATA } from "@/lib/schemas";

export const getDrinkPrice = (drinkStr: string) => {
  if (!drinkStr || drinkStr.toLowerCase().includes("grazie") || drinkStr.toLowerCase().includes("nessun")) return 0;
  const baseName = drinkStr.split(" (")[0];
  const drinkDef = DRINKS_DATA.find(d => d.label === baseName);
  let base = drinkDef?.price || 1.50;
  let extra = 0;
  if (drinkStr.toLowerCase().includes("grande")) {
    extra = drinkStr.toLowerCase().includes("ginseng") ? 0.30 : 0.20;
  }
  return base + extra;
};

export const getPastryPrice = (pastryStr: string) => {
  if (!pastryStr || pastryStr.toLowerCase().includes("nessun") || pastryStr.toLowerCase().includes("grazie")) return 0;
  const cleanName = pastryStr.replace(" (Vegano)", "").replace(" (Senza Glutine)", "");
  const pastryDef = PASTRIES_DATA.find(p => p.label === cleanName);
  return pastryDef?.price || 1.30;
};

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}