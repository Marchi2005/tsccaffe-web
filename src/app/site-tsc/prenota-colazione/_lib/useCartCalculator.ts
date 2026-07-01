import { useMemo } from "react";
import { getDrinkPrice, getPastryPrice } from "./helpers";
import { PRICE_CONFEZIONE_REGALO } from "@/lib/schemas";

const PRICE_SPREMUTA = 2.50;
const PRICE_SUCCO = 2.50;

interface UseCartProps {
  peopleCount: number | '5+';
  menus: { drink: string; pastry: string }[];
  bulkDrinks: Record<string, number>;
  bulkPastries: Record<string, number>;
  spremuteCount: number;
  succhiCounters: Record<string, number>;
  paymentMethod: string;
  appliedPromo: any;
  giftBoxSelected: boolean;
}

export function useCartCalculator(props: UseCartProps) {
  const { peopleCount, menus, bulkDrinks, bulkPastries, spremuteCount, succhiCounters, paymentMethod, appliedPromo, giftBoxSelected } = props;

  return useMemo(() => {
    let items: Array<{ name: string, qty: number, price: number }> = [];
    let subtotal = 0;

    if (peopleCount === '5+') {
      Object.entries(bulkDrinks).forEach(([name, qty]) => {
        const price = getDrinkPrice(name);
        if (qty > 0 && price > 0) { items.push({ name, qty, price }); subtotal += price * qty; }
      });
      Object.entries(bulkPastries).forEach(([name, qty]) => {
        const price = getPastryPrice(name);
        if (qty > 0 && price > 0) { items.push({ name, qty, price }); subtotal += price * qty; }
      });
    } else {
      for (let i = 0; i < Number(peopleCount); i++) {
        const dPrice = getDrinkPrice(menus[i].drink);
        if (dPrice > 0) { items.push({ name: `P${i + 1} - ${menus[i].drink}`, qty: 1, price: dPrice }); subtotal += dPrice; }
        const pPrice = getPastryPrice(menus[i].pastry);
        if (pPrice > 0) { items.push({ name: `P${i + 1} - ${menus[i].pastry}`, qty: 1, price: pPrice }); subtotal += pPrice; }
      }
    }

    if (giftBoxSelected) {
      items.push({ name: "🎁 Confezione Regalo", qty: 1, price: PRICE_CONFEZIONE_REGALO });
      subtotal += PRICE_CONFEZIONE_REGALO;
    }

    if (spremuteCount > 0) { items.push({ name: "Spremuta d'Arancia", qty: spremuteCount, price: PRICE_SPREMUTA }); subtotal += PRICE_SPREMUTA * spremuteCount; }
    Object.entries(succhiCounters).forEach(([flavor, qty]) => {
      if (qty > 0) { items.push({ name: `Succo (${flavor})`, qty, price: PRICE_SUCCO }); subtotal += PRICE_SUCCO * qty; }
    });

    let promoDiscountValue = 0;
    if (appliedPromo) {
      if (appliedPromo.discount_type === 'percentage') promoDiscountValue = Math.round((subtotal * (appliedPromo.discount_value / 100)) * 100) / 100;
      else promoDiscountValue = Number(appliedPromo.discount_value);
      promoDiscountValue = Math.min(subtotal, promoDiscountValue);
      if (promoDiscountValue > 0) {
        items.push({ name: `🎟️ Codice: ${appliedPromo.code}`, qty: 1, price: -promoDiscountValue });
        subtotal -= promoDiscountValue;
      }
    }

    let stripeFeeValue = 0;
    if (paymentMethod === 'card') {
      stripeFeeValue = Math.round(((subtotal * 0.015) + 0.25) * 100) / 100;
    }

    const totalBeforeRounding = subtotal + stripeFeeValue;
    const remainder = Math.round((totalBeforeRounding % 0.10) * 100);
    
    let finalTotal = totalBeforeRounding;
    let roundingDiscountValue = 0;
    let showRoundingRow = false;

    if (remainder >= 7) {
      finalTotal = Math.ceil(totalBeforeRounding * 10) / 10;
      if (paymentMethod === 'card') stripeFeeValue += (finalTotal - totalBeforeRounding);
    } else if (remainder >= 1 && remainder <= 3) {
      finalTotal = Math.floor(totalBeforeRounding * 10) / 10;
      if (paymentMethod === 'card') stripeFeeValue += (finalTotal - totalBeforeRounding);
    } else if (remainder >= 4 && remainder <= 6) {
      finalTotal = Math.floor(totalBeforeRounding * 10) / 10;
      roundingDiscountValue = Math.round((totalBeforeRounding - finalTotal) * 100) / 100;
      showRoundingRow = true;
    }

    if (paymentMethod === 'card') {
      items.push({ name: "Commissioni Stripe", qty: 1, price: Math.round(stripeFeeValue * 100) / 100 });
    }

    if (showRoundingRow && roundingDiscountValue > 0) {
      items.push({ name: "🎁 Sconto Arrotondamento", qty: 1, price: -roundingDiscountValue });
    }

    const total = Math.round(finalTotal * 100) / 100;
    return { items, total, promoDiscountApplied: promoDiscountValue };
  }, [peopleCount, menus, bulkDrinks, bulkPastries, spremuteCount, succhiCounters, paymentMethod, appliedPromo, giftBoxSelected]);
}