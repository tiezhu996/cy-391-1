import { useEffect, useState } from "react";
import { useCarbonStore } from "../stores/carbonStore";
import type { Badge } from "../types/carbon";

const BADGE_ICONS: Record<string, string> = {
  tree: "🌳",
  bike: "🚴",
  vegan: "🥗",
  week_streak_1: "⭐",
  week_streak_4: "🏅",
  all_categories: "🎯",
  perfect_month: "👑"
};

export function BadgeUnlockToast() {
  const newly = useCarbonStore((s) => s.newlyUnlockedBadges);
  const clear = useCarbonStore((s) => s.clearNewlyUnlocked);

  const [visibleBadges, setVisibleBadges] = useState<Badge[]>([]);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (newly.length > 0) {
      setVisibleBadges(newly);
      setDismissing(false);
    }
  }, [newly]);

  useEffect(() => {
    if (visibleBadges.length === 0 || dismissing) return;
    const timer = setTimeout(() => handleClose(), 6000);
    return () => clearTimeout(timer);
  }, [visibleBadges, dismissing]);

  function handleClose() {
    setDismissing(true);
    setTimeout(() => {
      setVisibleBadges([]);
      clear();
      setDismissing(false);
    }, 350);
  }

  if (visibleBadges.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {visibleBadges.map((b, i) => (
        <div
          key={b.id}
          className={`pointer-events-auto w-full max-w-md transform rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 shadow-2xl transition-all duration-300 ease-out ${
            dismissing ? "translate-y-[-120%] opacity-0" : "translate-y-0 opacity-100"
          }`}
          style={{ animation: !dismissing ? `badge-pop 0.45s ease-out ${i * 0.12}s both` : undefined }}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-3xl shadow-inner">
              {BADGE_ICONS[b.id] ?? "🏆"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">🎉 新勋章解锁</p>
              <p className="mt-0.5 truncate text-lg font-bold text-slate-900">{b.name}</p>
              <p className="mt-0.5 text-xs text-slate-600">{b.condition}</p>
            </div>
            <button
              onClick={handleClose}
              className="flex-none rounded-full p-1.5 text-slate-400 transition hover:bg-amber-100 hover:text-slate-700"
              title="关闭提示"
              aria-label="关闭"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-b-xl bg-amber-100">
            <div
              className={`h-full bg-gradient-to-r from-amber-400 to-yellow-500 ${
                dismissing ? "" : "animate-[badge-progress_6s_linear]"
              }`}
              style={{ animationPlayState: dismissing ? "paused" : "running" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
