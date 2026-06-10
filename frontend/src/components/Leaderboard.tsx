import { useCarbonStore } from "../stores/carbonStore";
import { Card } from "./ui";

export function Leaderboard() {
  const records = useCarbonStore((s) => s.records);
  const rows = [...records].sort((a, b) => a.emission - b.emission).slice(0, 8);
  return <Card><h2 className="mb-2 text-lg font-semibold">近 30 天低碳榜</h2><ol className="space-y-2">{rows.map((r) => <li className="flex justify-between text-sm" key={r.id}><span>{r.date} · {r.label}</span><span>{r.emission.toFixed(2)} kg</span></li>)}</ol></Card>;
}
