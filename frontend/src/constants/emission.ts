import type { CarbonCategory, WeeklyGoals } from "../types/carbon";

export const TRANSPORT_FACTORS = { bus: 0.06, metro: 0.04, car: 0.21, bike: 0, walk: 0 } as const;
export const DIET_FACTORS = { vegan: 0.8, mixed: 1.6, meat: 3.2 } as const;
export const ELECTRICITY_FACTOR = 0.58;
export const SHOPPING_FACTOR = 0.04;
export const NATIONAL_MONTH_AVERAGE = 620;

export const DEFAULT_WEEKLY_GOALS: WeeklyGoals = {
  transport: 25,
  diet: 20,
  electricity: 35,
  shopping: 15
};

export const CATEGORY_LABELS: Record<CarbonCategory, string> = {
  transport: "出行",
  diet: "饮食",
  electricity: "用电",
  shopping: "购物"
};

export const WARNING_THRESHOLD = 0.8;
export const DANGER_THRESHOLD = 0.95;
