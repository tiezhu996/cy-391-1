import { LEVELS } from "../constants/levels";
import type { CarbonRecord } from "../types/carbon";

export function totalEmission(records: CarbonRecord[]) {
  return Number(records.reduce((sum, item) => sum + item.emission, 0).toFixed(2));
}

export function currentLevel(monthTotal: number) {
  return LEVELS.find((level) => monthTotal <= level.max) ?? LEVELS[LEVELS.length - 1];
}

export function categoryTotals(records: CarbonRecord[]) {
  return ["transport", "diet", "electricity", "shopping"].map((category) => ({
    category,
    emission: Number(records.filter((r) => r.category === category).reduce((s, r) => s + r.emission, 0).toFixed(2))
  }));
}

export function trend(records: CarbonRecord[]) {
  const days = new Map<string, number>();
  records.forEach((r) => days.set(r.date, (days.get(r.date) ?? 0) + r.emission));
  return Array.from(days.entries()).sort().map(([date, emission]) => ({ date, emission: Number(emission.toFixed(2)) }));
}
