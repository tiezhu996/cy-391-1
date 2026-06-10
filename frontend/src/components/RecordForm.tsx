import { useState } from "react";
import { calcEmission, calcPoints } from "../utils/calculator";
import { useCarbonStore } from "../stores/carbonStore";
import type { CarbonCategory } from "../types/carbon";
import { Button, Card } from "./ui";

const labels = {
  transport: ["bus", "metro", "car", "bike", "walk"],
  diet: ["vegan", "mixed", "meat"],
  electricity: ["kwh"],
  shopping: ["cost"]
};

export function RecordForm() {
  const addRecord = useCarbonStore((s) => s.addRecord);
  const [category, setCategory] = useState<CarbonCategory>("transport");
  const [label, setLabel] = useState("bus");
  const [amount, setAmount] = useState(10);
  function submit() {
    const emission = calcEmission(category, label, amount);
    addRecord({ id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), category, label, amount, unit: category === "shopping" ? "元" : category === "diet" ? "餐" : category === "electricity" ? "度" : "公里", emission, points: calcPoints(category, label, emission) });
  }
  return <Card><h2 className="mb-3 text-lg font-semibold">新增记录</h2><div className="grid gap-3 sm:grid-cols-4">
    <select className="input" value={category} onChange={(e) => { const next = e.target.value as CarbonCategory; setCategory(next); setLabel(labels[next][0]); }}><option value="transport">出行</option><option value="diet">饮食</option><option value="electricity">用电</option><option value="shopping">购物</option></select>
    <select className="input" value={label} onChange={(e) => setLabel(e.target.value)}>{labels[category].map((item) => <option key={item}>{item}</option>)}</select>
    <input className="input" type="number" min="0" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
    <Button onClick={submit}>记录碳排放</Button>
  </div></Card>;
}
