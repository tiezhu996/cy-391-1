import type { CarbonRecord } from "../types/carbon";

const DB_NAME = "carbon-footprint-db";
const STORE_NAME = "records";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadRecords(): Promise<CarbonRecord[]> {
  const db = await openDb();
  return new Promise((resolve) => {
    const req = db.transaction(STORE_NAME).objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as CarbonRecord[]);
  });
}

export async function saveRecords(records: CarbonRecord[]) {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).clear();
  records.forEach((record) => tx.objectStore(STORE_NAME).put(record));
}
