import { Badges } from "../components/Badges";
import { BadgeUnlockToast } from "../components/BadgeUnlockToast";
import { CsvPanel } from "../components/CsvPanel";
import { Dashboard } from "../components/Dashboard";
import { Leaderboard } from "../components/Leaderboard";
import { RecordForm } from "../components/RecordForm";
import { Suggestions } from "../components/Suggestions";
import { useHydrateRecords } from "../hooks/useHydrateRecords";

export function HomePage() {
  useHydrateRecords();
  return (
    <>
      <BadgeUnlockToast />
      <main className="mx-auto max-w-7xl space-y-4 px-4 py-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-950">个人碳足迹可视化工具</h1>
          <p className="text-slate-600">记录行为、理解排放、持续低碳。</p>
        </header>
        <RecordForm />
        <Dashboard />
        <div className="grid gap-4 lg:grid-cols-2">
          <Suggestions />
          <Leaderboard />
        </div>
        <Badges />
        <CsvPanel />
      </main>
    </>
  );
}
