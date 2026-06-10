import type { CarbonRecord } from "../types/carbon";

export function exportCsv(records: CarbonRecord[]) {
  const rows = ["id,date,category,label,amount,unit,emission,points", ...records.map((r) => [r.id, r.date, r.category, r.label, r.amount, r.unit, r.emission, r.points].join(","))];
  return rows.join("\n");
}

export function importCsv(text: string): CarbonRecord[] {
  return text.split(/\r?\n/).slice(1).filter(Boolean).map((line) => {
    const [id, date, category, label, amount, unit, emission, points] = line.split(",");
    return { id, date, category: category as CarbonRecord["category"], label, amount: Number(amount), unit, emission: Number(emission), points: Number(points) };
  });
}
