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
  newlyUnlockedBadges: Badge[];
  hydrate: () => Promise<void>;
  addRecord: (record: CarbonRecord) => void;
  replaceRecords: (records: CarbonRecord[]) => void;
  setWeeklyGoal: (category: CarbonCategory, value: number) => void;
  resetWeeklyGoals: () => void;
  clearNewlyUnlocked: () => void;
}

export const useCarbonStore = create<CarbonState>((set, get) => ({
  records: [],
  badges: BADGES.map((b) => ({ ...b, unlocked: false })),
  weeklyGoals: DEFAULT_WEEKLY_GOALS,
  newlyUnlockedBadges: [],
  hydrate: async () => {
    const [records, storedGoals] = await Promise.all([loadRecords(), loadWeeklyGoals()]);
    const goals = storedGoals ?? DEFAULT_WEEKLY_GOALS;
    set({ records, weeklyGoals: goals, badges: unlockBadges(records, goals), newlyUnlockedBadges: [] });
  },
  addRecord: (record) => {
    const prevBadges = get().badges;
    const records = [record, ...get().records];
    const goals = get().weeklyGoals;
    const nextBadges = unlockBadges(records, goals);
    const newly = nextBadges.filter((b) => b.unlocked && !prevBadges.find((p) => p.id === b.id)?.unlocked);
    saveRecords(records);
    set({ records, badges: nextBadges, newlyUnlockedBadges: newly });
  },
  replaceRecords: (records) => {
    const prevBadges = get().badges;
    const goals = get().weeklyGoals;
    const nextBadges = unlockBadges(records, goals);
    const newly = nextBadges.filter((b) => b.unlocked && !prevBadges.find((p) => p.id === b.id)?.unlocked);
    saveRecords(records);
    set({ records, badges: nextBadges, newlyUnlockedBadges: newly });
  },
  setWeeklyGoal: (category, value) => {
    const prevBadges = get().badges;
    const goals = { ...get().weeklyGoals, [category]: value };
    const nextBadges = unlockBadges(get().records, goals);
    const newly = nextBadges.filter((b) => b.unlocked && !prevBadges.find((p) => p.id === b.id)?.unlocked);
    saveWeeklyGoals(goals);
    set({ weeklyGoals: goals, badges: nextBadges, newlyUnlockedBadges: newly });
  },
  resetWeeklyGoals: () => {
    saveWeeklyGoals(DEFAULT_WEEKLY_GOALS);
    set({ weeklyGoals: DEFAULT_WEEKLY_GOALS, badges: unlockBadges(get().records, DEFAULT_WEEKLY_GOALS), newlyUnlockedBadges: [] });
  },
  clearNewlyUnlocked: () => set({ newlyUnlockedBadges: [] })
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
