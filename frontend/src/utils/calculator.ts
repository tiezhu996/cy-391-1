import { DIET_FACTORS, ELECTRICITY_FACTOR, SHOPPING_FACTOR, TRANSPORT_FACTORS } from "../constants/emission";
import type { CarbonCategory, DietType, TransportMode } from "../types/carbon";

export function calcEmission(category: CarbonCategory, label: string, amount: number): number {
  if (category === "transport") return amount * TRANSPORT_FACTORS[label as TransportMode];
  if (category === "diet") return amount * DIET_FACTORS[label as DietType];
  if (category === "electricity") return amount * ELECTRICITY_FACTOR;
  return amount * SHOPPING_FACTOR;
}

export function calcPoints(category: CarbonCategory, label: string, emission: number): number {
  const bonus = (label === "bike" || label === "walk" || label === "vegan") ? 12 : 4;
  return Math.max(1, Math.round(bonus - emission / 10));
}
