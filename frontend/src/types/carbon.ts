export type CarbonCategory = "transport" | "diet" | "electricity" | "shopping";
export type TransportMode = "bus" | "metro" | "car" | "bike" | "walk";
export type DietType = "vegan" | "mixed" | "meat";

export interface CarbonRecord {
  id: string;
  date: string;
  category: CarbonCategory;
  label: string;
  amount: number;
  unit: string;
  emission: number;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  condition: string;
  unlocked: boolean;
}

export type WeeklyGoals = Record<CarbonCategory, number>;

export interface WeeklyProgress {
  category: CarbonCategory;
  actual: number;
  goal: number;
  percentage: number;
  status: "safe" | "warning" | "danger";
}

export interface ConsecutiveWeeks {
  category: CarbonCategory;
  count: number;
}
