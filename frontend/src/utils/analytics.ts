import { LEVELS } from "../constants/levels";
import { DANGER_THRESHOLD, WARNING_THRESHOLD } from "../constants/emission";
import type { CarbonCategory, CarbonRecord, WeeklyGoals, WeeklyProgress } from "../types/carbon";

const CATEGORIES: CarbonCategory[] = ["transport", "diet", "electricity", "shopping"];

export function totalEmission(records: CarbonRecord[]) {
  return Number(records.reduce((sum, item) => sum + item.emission, 0).toFixed(2));
}

export function currentLevel(monthTotal: number) {
  return LEVELS.find((level) => monthTotal <= level.max) ?? LEVELS[LEVELS.length - 1];
}

export function categoryTotals(records: CarbonRecord[]) {
  return CATEGORIES.map((category) => ({
    category,
    emission: Number(records.filter((r) => r.category === category).reduce((s, r) => s + r.emission, 0).toFixed(2))
  }));
}

export function trend(records: CarbonRecord[]) {
  const days = new Map<string, number>();
  records.forEach((r) => days.set(r.date, (days.get(r.date) ?? 0) + r.emission));
  return Array.from(days.entries()).sort().map(([date, emission]) => ({ date, emission: Number(emission.toFixed(2)) }));
}

export function getWeekStart(refDate: Date = new Date()): Date {
  const d = new Date(refDate);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function formatDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function getWeekRecords(records: CarbonRecord[], refDate: Date = new Date()): CarbonRecord[] {
  const weekStart = getWeekStart(refDate);
  const weekEnd = addDays(weekStart, 7);
  return records.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= weekStart && recordDate < weekEnd;
  });
}

export function weekCategoryTotals(records: CarbonRecord[], refDate: Date = new Date()): Record<CarbonCategory, number> {
  const weekRecords = getWeekRecords(records, refDate);
  const result = {} as Record<CarbonCategory, number>;
  CATEGORIES.forEach((cat) => {
    result[cat] = Number(weekRecords.filter((r) => r.category === cat).reduce((s, r) => s + r.emission, 0).toFixed(2));
  });
  return result;
}

export function weeklyProgressList(records: CarbonRecord[], goals: WeeklyGoals, refDate: Date = new Date()): WeeklyProgress[] {
  const totals = weekCategoryTotals(records, refDate);
  return CATEGORIES.map((category) => {
    const actual = totals[category];
    const goal = goals[category];
    const percentage = goal > 0 ? actual / goal : 0;
    let status: WeeklyProgress["status"] = "safe";
    if (percentage >= DANGER_THRESHOLD) status = "danger";
    else if (percentage >= WARNING_THRESHOLD) status = "warning";
    return { category, actual, goal, percentage, status };
  });
}

export function getWarningCategories(progress: WeeklyProgress[]): WeeklyProgress[] {
  return progress.filter((p) => p.status === "warning" || p.status === "danger");
}

export function getAllWeekCategoryTotals(records: CarbonRecord[]): Array<{ weekKey: string; totals: Record<CarbonCategory, number> }> {
  if (records.length === 0) return [];
  const dates = records.map((r) => new Date(r.date)).sort((a, b) => a.getTime() - b.getTime());
  const firstWeek = getWeekStart(dates[0]);
  const lastWeek = getWeekStart(dates[dates.length - 1]);
  const weeks: Array<{ weekKey: string; totals: Record<CarbonCategory, number> }> = [];
  let cursor = firstWeek;
  while (cursor <= lastWeek) {
    const weekKey = formatDateKey(cursor);
    const weekRecords = getWeekRecords(records, cursor);
    const totals = {} as Record<CarbonCategory, number>;
    CATEGORIES.forEach((cat) => {
      totals[cat] = Number(weekRecords.filter((r) => r.category === cat).reduce((s, r) => s + r.emission, 0).toFixed(2));
    });
    weeks.push({ weekKey, totals });
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

export function consecutiveWeeksByCategory(records: CarbonRecord[], goals: WeeklyGoals): Record<CarbonCategory, number> {
  const weeks = getAllWeekCategoryTotals(records);
  const result = {} as Record<CarbonCategory, number>;
  CATEGORIES.forEach((cat) => {
    let streak = 0;
    let current = 0;
    weeks.forEach((w) => {
      if (w.totals[cat] > 0 && w.totals[cat] <= goals[cat]) {
        current += 1;
        streak = Math.max(streak, current);
      } else {
        current = 0;
      }
    });
    result[cat] = streak;
  });
  return result;
}

export function allCategoriesMetWeek(records: CarbonRecord[], goals: WeeklyGoals): number {
  const weeks = getAllWeekCategoryTotals(records);
  let count = 0;
  let consecutive = 0;
  let maxConsecutive = 0;
  weeks.forEach((w) => {
    const allMet = CATEGORIES.every((cat) => w.totals[cat] > 0 && w.totals[cat] <= goals[cat]);
    if (allMet) {
      count += 1;
      consecutive += 1;
      maxConsecutive = Math.max(maxConsecutive, consecutive);
    } else {
      consecutive = 0;
    }
  });
  return maxConsecutive;
}
