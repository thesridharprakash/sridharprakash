import fs from "fs";
import path from "path";
import { isAdminRepoStorageEnabled, writeRepoFile } from "@/lib/adminRepoStorage";

const plannedEventsFile = path.join(process.cwd(), "data", "events.json");

export type PlannedEventRecord = {
  title: string;
  category?: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  startTime?: string;
  endTime?: string;
  location: string;
  mapUrl?: string;
};

function normalizePlannedEvent(item: Partial<PlannedEventRecord>): PlannedEventRecord | null {
  const title = String(item.title ?? "").trim();
  const date = String(item.date ?? "").trim();
  if (!title || !date) return null;

  return {
    title,
    category: String(item.category ?? "").trim(),
    description: String(item.description ?? "").trim(),
    date,
    endDate: String(item.endDate ?? "").trim(),
    time: String(item.time ?? "").trim(),
    startTime: String(item.startTime ?? "").trim(),
    endTime: String(item.endTime ?? "").trim(),
    location: String(item.location ?? "").trim(),
    mapUrl: String(item.mapUrl ?? "").trim(),
  };
}

export function readPlannedEvents(): PlannedEventRecord[] {
  try {
    if (!fs.existsSync(plannedEventsFile)) return [];
    const raw = fs.readFileSync(plannedEventsFile, "utf8");
    const parsed = JSON.parse(raw) as Partial<PlannedEventRecord>[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => normalizePlannedEvent(item)).filter(Boolean) as PlannedEventRecord[];
  } catch {
    return [];
  }
}

export async function writePlannedEvents(items: PlannedEventRecord[]) {
  const cleaned = items.map((item) => normalizePlannedEvent(item)).filter(Boolean) as PlannedEventRecord[];
  const sorted = cleaned.sort((a, b) => new Date(`${a.date}T00:00:00`).getTime() - new Date(`${b.date}T00:00:00`).getTime());
  const content = `${JSON.stringify(sorted, null, 2)}\n`;

  if (isAdminRepoStorageEnabled()) {
    await writeRepoFile("data/events.json", content, "Update planned events");
    return sorted;
  }

  fs.writeFileSync(plannedEventsFile, content, "utf8");
  return sorted;
}
