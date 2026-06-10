import { create } from "zustand";
import { BADGES } from "../constants/badges";
import { DEFAULT_WEEKLY_GOALS } from "../constants/emission";
import { loadRecords, saveRecords, loadWeeklyGoals, saveWeeklyGoals } from "../storage/indexedDb";
import type { Badge, CarbonCategory, CarbonRecord, WeeklyGoals } from "../types/carbon";
import {
  getWeekRecords,
  getAllWeekCategoryTotals,
  consecutiveWeeksByCategory,
  allCategoriesMetWeek
} from "../utils/analytics";

interface CarbonState {
  records: CarbonRecord[];
  badges: Badge[];
  weeklyGoals: WeeklyGoals;
  hydrate: () => Promise<void>;
  addRecord: (record: CarbonRecord) => void;
  replaceRecords: (records: CarbonRecord[]) => void;
  setWeeklyGoal: (category: CarbonCategory, value: number) => void;
  resetWeeklyGoals: () => void;
}

export const useCarbonStore = create<CarbonState>((set, get) => ({
  records: [],
  badges: BADGES.map((b) => ({ ...b, unlocked: false })),
  weeklyGoals: DEFAULT_WEEKLY_GOALS,
  hydrate: async () => {
    const [records, storedGoals] = await Promise.all([loadRecords(), loadWeeklyGoals()]);
    const goals = storedGoals ?? DEFAULT_WEEKLY_GOALS;
    set({ records, weeklyGoals: goals, badges: unlockBadges(records, goals) });
  },
  addRecord: (record) => {
    const records = [record, ...get().records];
    const goals = get().weeklyGoals;
    saveRecords(records);
    set({ records, badges: unlockBadges(records, goals) });
  },
  replaceRecords: (records) => {
    const goals = get().weeklyGoals;
    saveRecords(records);
    set({ records, badges: unlockBadges(records, goals) });
  },
  setWeeklyGoal: (category, value) => {
    const goals = { ...get().weeklyGoals, [category]: value };
    saveWeeklyGoals(goals);
    set({ weeklyGoals: goals, badges: unlockBadges(get().records, goals) });
  },
  resetWeeklyGoals: () => {
    saveWeeklyGoals(DEFAULT_WEEKLY_GOALS);
    set({ weeklyGoals: DEFAULT_WEEKLY_GOALS, badges: unlockBadges(get().records, DEFAULT_WEEKLY_GOALS) });
  }
}));

function unlockBadges(records: CarbonRecord[], goals: WeeklyGoals): Badge[] {
  const points = records.reduce((sum, r) => sum + r.points, 0);
  const lowTravel = records.filter((r) => ["bike", "walk", "bus", "metro"].includes(r.label)).length;
  const vegan = records.filter((r) => r.label === "vegan").length;

  const consecutiveMap = consecutiveWeeksByCategory(records, goals);
  const maxStreak = Math.max(...Object.values(consecutiveMap));
  const allMetWeeks = allCategoriesMetWeek(records, goals);

  return BADGES.map((b) => ({
    ...b,
    unlocked:
      (b.id === "tree" && points >= 120) ||
      (b.id === "bike" && lowTravel >= 8) ||
      (b.id === "vegan" && vegan >= 10) ||
      (b.id === "week_streak_1" && maxStreak >= 1) ||
      (b.id === "week_streak_4" && maxStreak >= 4) ||
      (b.id === "all_categories" && allMetWeeks >= 1) ||
      (b.id === "perfect_month" && allMetWeeks >= 4)
  }));
}
