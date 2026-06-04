export type SyncItem = {
  id: string;
  type: "draft" | "render" | "publish" | "asset";
  title: string;
  payload: Record<string, unknown>;
  createdAt: string;
  status: "queued" | "synced";
};

const STORAGE_KEY = "newsforge.offline.queue";

export function readSyncQueue(): SyncItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SyncItem[]) : [];
  } catch {
    return [];
  }
}

export function writeSyncQueue(items: SyncItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function queueOfflineAction(item: Omit<SyncItem, "id" | "createdAt" | "status">) {
  const nextItem: SyncItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "queued",
  };
  const queue = [nextItem, ...readSyncQueue()].slice(0, 50);
  writeSyncQueue(queue);
  window.dispatchEvent(new CustomEvent("offline-sync-updated"));
  return nextItem;
}

export async function syncOfflineQueue() {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return readSyncQueue();
  }

  const synced = readSyncQueue().map((item) => ({ ...item, status: "synced" as const }));
  writeSyncQueue(synced.slice(0, 12));
  window.dispatchEvent(new CustomEvent("offline-sync-updated"));
  return synced;
}
