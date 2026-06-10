import { create } from "zustand";
import { BADGES } from "../constants/badges";
import { loadRecords, saveRecords } from "../storage/indexedDb";
import type { Badge, CarbonRecord } from "../types/carbon";

interface CarbonState {
  records: CarbonRecord[];
  badges: Badge[];
  hydrate: () => Promise<void>;
  addRecord: (record: CarbonRecord) => void;
  replaceRecords: (records: CarbonRecord[]) => void;
}

export const useCarbonStore = create<CarbonState>((set, get) => ({
  records: [],
  badges: BADGES.map((b) => ({ ...b, unlocked: false })),
  hydrate: async () => set({ records: await loadRecords() }),
  addRecord: (record) => {
    const records = [record, ...get().records];
    saveRecords(records);
    set({ records, badges: unlockBadges(records) });
  },
  replaceRecords: (records) => {
    saveRecords(records);
    set({ records, badges: unlockBadges(records) });
  }
}));

function unlockBadges(records: CarbonRecord[]): Badge[] {
  const points = records.reduce((sum, r) => sum + r.points, 0);
  const lowTravel = records.filter((r) => ["bike", "walk", "bus", "metro"].includes(r.label)).length;
  const vegan = records.filter((r) => r.label === "vegan").length;
  return BADGES.map((b) => ({ ...b, unlocked: (b.id === "tree" && points >= 120) || (b.id === "bike" && lowTravel >= 8) || (b.id === "vegan" && vegan >= 10) }));
}
