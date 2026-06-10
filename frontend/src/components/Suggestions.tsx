import { useCarbonStore } from "../stores/carbonStore";
import { categoryTotals, weeklyProgressList, getWarningCategories } from "../utils/analytics";
import { CATEGORY_LABELS } from "../constants/emission";
import type { WeeklyProgress } from "../types/carbon";
import { Card } from "./ui";

const ADVICE: Record<string, string> = {
  transport: "出行排放占比较高，建议减少自驾并优先选择公共交通、骑行或步行。",
  diet: "饮食排放偏高，可尝试增加素食餐和本地食材，减少红肉摄入。",
  electricity: "用电排放偏高，建议开启节能模式、减少待机耗电、合理设置空调温度。",
  shopping: "购物排放较高，建议延长物品使用周期、理性消费、减少冲动购买。"
};

function warningBadge(p: WeeklyProgress) {
  const label = CATEGORY_LABELS[p.category];
  const remaining = Math.max(p.goal - p.actual, 0).toFixed(2);
  if (p.status === "danger") {
    return (
      <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3">
        <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">!</span>
        <div>
          <strong className="text-sm text-rose-800">
            ⚠️ {label}分类即将超标
          </strong>
          <p className="mt-1 text-xs text-rose-700">
            当前 {p.actual.toFixed(2)} kg / 目标 {p.goal} kg，已达 {(p.percentage * 100).toFixed(0)}%。剩余额度仅 {remaining} kg。
          </p>
          <p className="mt-1 text-xs text-rose-700/80">建议：{ADVICE[p.category]}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
      <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-white">~</span>
      <div>
        <strong className="text-sm text-amber-800">
          {label}分类接近目标
        </strong>
        <p className="mt-1 text-xs text-amber-700">
          当前 {p.actual.toFixed(2)} kg / 目标 {p.goal} kg，进度 {(p.percentage * 100).toFixed(0)}%。剩余额度 {remaining} kg。
        </p>
        <p className="mt-1 text-xs text-amber-700/80">提醒：{ADVICE[p.category]}</p>
      </div>
    </div>
  );
}

export function Suggestions() {
  const records = useCarbonStore((s) => s.records);
  const goals = useCarbonStore((s) => s.weeklyGoals);

  const progress = weeklyProgressList(records, goals);
  const warnings = getWarningCategories(progress).sort((a, b) => b.percentage - a.percentage);

  const top = categoryTotals(records).sort((a, b) => b.emission - a.emission)[0];
  const topMessage = ADVICE[top?.category] ?? "持续关注各分类排放，保持低碳习惯。";

  return (
    <Card>
      <h2 className="mb-2 text-lg font-semibold">减碳建议 &amp; 预警</h2>

      {warnings.length > 0 && (
        <div className="mb-3 space-y-2">
          {warnings.map((w) => (
            <div key={w.category}>{warningBadge(w)}</div>
          ))}
        </div>
      )}

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <strong className="text-sm text-slate-700">
          {records.length ? "综合建议" : "欢迎开始记录"}
        </strong>
        <p className="mt-1 text-sm text-slate-600">
          {records.length ? topMessage : "添加第一条记录后，将根据你的排放数据生成个性化建议和目标预警。"}
        </p>
      </div>
    </Card>
  );
}
