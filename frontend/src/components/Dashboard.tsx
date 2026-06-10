import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORY_LABELS, NATIONAL_MONTH_AVERAGE } from "../constants/emission";
import { useCarbonStore } from "../stores/carbonStore";
import { categoryTotals, currentLevel, totalEmission, trend, weeklyProgressList, formatDateKey, getWeekStart, addDays } from "../utils/analytics";
import type { CarbonCategory } from "../types/carbon";
import { Card } from "./ui";

function statusColor(status: "safe" | "warning" | "danger"): string {
  if (status === "danger") return "bg-rose-500";
  if (status === "warning") return "bg-amber-400";
  return "bg-emerald-500";
}

function statusTextColor(status: "safe" | "warning" | "danger"): string {
  if (status === "danger") return "text-rose-700";
  if (status === "warning") return "text-amber-700";
  return "text-emerald-700";
}

function statusBorder(status: "safe" | "warning" | "danger"): string {
  if (status === "danger") return "border-rose-200 bg-rose-50/40";
  if (status === "warning") return "border-amber-200 bg-amber-50/40";
  return "border-emerald-200 bg-emerald-50/40";
}

export function Dashboard() {
  const records = useCarbonStore((s) => s.records);
  const goals = useCarbonStore((s) => s.weeklyGoals);
  const setGoal = useCarbonStore((s) => s.setWeeklyGoal);
  const total = totalEmission(records);
  const level = currentLevel(total);
  const categoryData = categoryTotals(records);
  const progress = weeklyProgressList(records, goals);

  const weekStart = formatDateKey(getWeekStart());
  const weekEnd = formatDateKey(addDays(getWeekStart(), 6));

  const [editingCat, setEditingCat] = useState<CarbonCategory | null>(null);
  const [draftGoal, setDraftGoal] = useState<string>("");

  function startEdit(cat: CarbonCategory, current: number) {
    setEditingCat(cat);
    setDraftGoal(String(current));
  }

  function commitEdit(cat: CarbonCategory) {
    const value = Number(draftGoal);
    if (!Number.isNaN(value) && value > 0) {
      setGoal(cat, Number(value.toFixed(2)));
    }
    setEditingCat(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <p className="text-sm text-slate-500">本月排放</p>
        <strong className="text-3xl">{total} kg</strong>
        <p className={level.color}>等级：{level.name}</p>
        <p className="text-sm text-slate-500">全国人均月参考 {NATIONAL_MONTH_AVERAGE} kg</p>
      </Card>

      <Card className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">本周排放目标进度</h2>
          <span className="text-xs text-slate-500">{weekStart} ~ {weekEnd}</span>
        </div>
        <div className="space-y-3">
          {progress.map((p) => {
            const label = CATEGORY_LABELS[p.category];
            const percent = Math.min(p.percentage * 100, 100);
            const isEditing = editingCat === p.category;
            return (
              <div key={p.category} className={`rounded-lg border p-3 ${statusBorder(p.status)}`}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm">{label}</strong>
                    <span className={`text-xs font-medium ${statusTextColor(p.status)}`}>
                      {p.status === "danger" ? "即将超标" : p.status === "warning" ? "接近目标" : "进度良好"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span>
                      {p.actual.toFixed(2)} /{" "}
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          className="w-16 rounded border border-slate-300 px-1 py-0.5 text-right text-xs"
                          value={draftGoal}
                          autoFocus
                          onBlur={() => commitEdit(p.category)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit(p.category);
                            if (e.key === "Escape") setEditingCat(null);
                          }}
                          onChange={(e) => setDraftGoal(e.target.value)}
                        />
                      ) : (
                        <button
                          className="underline decoration-dotted hover:text-slate-900"
                          onClick={() => startEdit(p.category, p.goal)}
                          title="点击修改周目标"
                        >
                          {p.goal} kg
                        </button>
                      )}
                    </span>
                    <span className={`font-semibold ${statusTextColor(p.status)}`}>{(p.percentage * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusColor(p.status)}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {p.percentage > 1 && (
                  <p className="mt-1 text-xs text-rose-600">已超出目标 {((p.percentage - 1) * 100).toFixed(0)}%</p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <h2 className="mb-2 font-semibold">日趋势</h2>
        <ResponsiveContainer height={220}>
          <LineChart data={trend(records)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="emission" stroke="#047857" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="lg:col-span-2">
        <h2 className="mb-2 font-semibold">类别排放</h2>
        <ResponsiveContainer height={240}>
          <BarChart data={categoryData}>
            <XAxis dataKey="category" tickFormatter={(v) => CATEGORY_LABELS[v as CarbonCategory] ?? v} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="emission" stackId="a" fill="#0f766e" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold">排放占比</h2>
        <ResponsiveContainer height={240}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="emission"
              nameKey="category"
              fill="#10b981"
              label={({ category, percent }) => `${CATEGORY_LABELS[category as CarbonCategory]} ${(percent * 100).toFixed(0)}%`}
            />
            <Tooltip formatter={(value, name) => [value, CATEGORY_LABELS[name as CarbonCategory] ?? name]} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
