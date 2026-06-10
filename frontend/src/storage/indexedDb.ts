import type { CarbonRecord, WeeklyGoals } from "../types/carbon";

const DB_NAME = "carbon-footprint-db";
const STORE_NAME = "records";
const GOALS_STORE_NAME = "weeklyGoals";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(GOALS_STORE_NAME)) {
        db.createObjectStore(GOALS_STORE_NAME);
      }
    };
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

export async function loadWeeklyGoals(): Promise<WeeklyGoals | null> {
  const db = await openDb();
  return new Promise((resolve) => {
    const req = db.transaction(GOALS_STORE_NAME).objectStore(GOALS_STORE_NAME).get("goals");
    req.onsuccess = () => resolve((req.result as WeeklyGoals) ?? null);
  });
}

export async function saveWeeklyGoals(goals: WeeklyGoals) {
  const db = await openDb();
  const tx = db.transaction(GOALS_STORE_NAME, "readwrite");
  tx.objectStore(GOALS_STORE_NAME).put(goals, "goals");
}
