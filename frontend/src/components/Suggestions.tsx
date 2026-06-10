import { useCarbonStore } from "../stores/carbonStore";
import { categoryTotals } from "../utils/analytics";
import { Card } from "./ui";

export function Suggestions() {
  const records = useCarbonStore((s) => s.records);
  const top = categoryTotals(records).sort((a, b) => b.emission - a.emission)[0];
  const message = top?.category === "transport" ? "本月出行排放占比较高，建议减少自驾并优先选择公共交通。"
    : top?.category === "diet" ? "饮食排放偏高，可尝试增加素食餐和本地食材。"
    : top?.category === "electricity" ? "用电排放偏高，建议开启节能模式并减少待机耗电。"
    : "购物排放较高，建议延长物品使用周期并减少冲动消费。";
  return <Card><h2 className="mb-2 text-lg font-semibold">减碳建议</h2><p className="text-slate-700">{records.length ? message : "添加第一条记录后生成个性化建议。"}</p></Card>;
}
