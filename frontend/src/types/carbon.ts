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
