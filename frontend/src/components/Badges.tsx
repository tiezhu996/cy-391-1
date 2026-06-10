import { useCarbonStore } from "../stores/carbonStore";
import { Card } from "./ui";

export function Badges() {
  const badges = useCarbonStore((s) => s.badges);
  return <Card><h2 className="mb-2 text-lg font-semibold">碳积分勋章</h2><div className="grid gap-2 sm:grid-cols-3">{badges.map((b) => <div key={b.id} className={`rounded-md border p-3 ${b.unlocked ? "border-emerald-400 bg-emerald-50" : "bg-slate-50"}`}><strong>{b.name}</strong><p className="text-sm text-slate-500">{b.condition}</p></div>)}</div></Card>;
}
