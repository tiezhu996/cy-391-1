import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { NATIONAL_MONTH_AVERAGE } from "../constants/emission";
import { useCarbonStore } from "../stores/carbonStore";
import { categoryTotals, currentLevel, totalEmission, trend } from "../utils/analytics";
import { Card } from "./ui";

export function Dashboard() {
  const records = useCarbonStore((s) => s.records);
  const total = totalEmission(records);
  const level = currentLevel(total);
  const categoryData = categoryTotals(records);
  return <div className="grid gap-4 lg:grid-cols-3">
    <Card><p className="text-sm text-slate-500">本月排放</p><strong className="text-3xl">{total} kg</strong><p className={level.color}>等级：{level.name}</p><p className="text-sm text-slate-500">全国人均月参考 {NATIONAL_MONTH_AVERAGE} kg</p></Card>
    <Card className="lg:col-span-2"><h2 className="mb-2 font-semibold">日趋势</h2><ResponsiveContainer height={220}><LineChart data={trend(records)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="emission" stroke="#047857" strokeWidth={2} /></LineChart></ResponsiveContainer></Card>
    <Card className="lg:col-span-2"><h2 className="mb-2 font-semibold">类别排放</h2><ResponsiveContainer height={240}><BarChart data={categoryData}><XAxis dataKey="category" /><YAxis /><Tooltip /><Bar dataKey="emission" stackId="a" fill="#0f766e" /></BarChart></ResponsiveContainer></Card>
    <Card><h2 className="mb-2 font-semibold">排放占比</h2><ResponsiveContainer height={240}><PieChart><Pie data={categoryData} dataKey="emission" nameKey="category" fill="#10b981" label /></PieChart></ResponsiveContainer></Card>
  </div>;
}
