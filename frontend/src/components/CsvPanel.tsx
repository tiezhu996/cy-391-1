import { useRef } from "react";
import { useCarbonStore } from "../stores/carbonStore";
import { exportCsv, importCsv } from "../utils/csv";
import { Button, Card } from "./ui";

export function CsvPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const records = useCarbonStore((s) => s.records);
  const replaceRecords = useCarbonStore((s) => s.replaceRecords);
  function download() {
    const blob = new Blob([exportCsv(records)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), { href: url, download: "carbon-records.csv" });
    link.click();
    URL.revokeObjectURL(url);
  }
  async function upload(file?: File) {
    if (!file) return;
    replaceRecords(importCsv(await file.text()));
  }
  return <Card><h2 className="mb-2 text-lg font-semibold">数据导入导出</h2><div className="flex gap-2"><Button onClick={download}>导出 CSV</Button><Button onClick={() => inputRef.current?.click()}>导入 CSV</Button><input ref={inputRef} hidden type="file" accept=".csv" onChange={(e) => upload(e.target.files?.[0])} /></div></Card>;
}
