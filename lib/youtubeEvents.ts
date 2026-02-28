import fs from "fs";
import path from "path";
import { socialProfiles } from "@/constants/socials";
import { isAdminRepoStorageEnabled, writeRepoFile } from "@/lib/adminRepoStorage";

const YOUTUBE_SEARCH_API = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_CHANNELS_API = "https://www.googleapis.com/youtube/v3/channels";
const YOUTUBE_VIDEOS_API = "https://www.googleapis.com/youtube/v3/videos";
const archiveFile = path.join(process.cwd(), "data", "events", "archive.json");

export type EventStatus = "live" | "completed";

export type EventItem = {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  watchUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  status: EventStatus;
  durationLabel?: string;
  themeLabel?: string;
  source?: "youtube" | "archive";
};

export type YouTubeEventsPayload = {
  isLive: boolean;
  currentLive: EventItem | null;
  events: EventItem[];
  liveChannelUrl?: string;
  channelUrl?: string;
  updatedAt?: string;
  error?: string;
};

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

type YouTubeSearchResponse = {
  items?: YouTubeSearchItem[];
};

type YouTubeChannelItem = {
  id?: string;
};

type YouTubeChannelsResponse = {
  items?: YouTubeChannelItem[];
};

type YouTubeVideosResponse = {
  items?: Array<{
    id?: string;
    contentDetails?: {
      duration?: string;
    };
  }>;
};

type ArchiveRecord = Partial<EventItem> & {
  videoId: string;
  title?: string;
};

export type EventsArchiveRecord = {
  videoId: string;
  title: string;
  channelTitle?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  status?: EventStatus;
  durationLabel?: string;
  themeLabel?: string;
};

function getYouTubeHandleFromSocials(): string | null {
  const youtubeProfile = socialProfiles.find((profile) => profile.name === "YouTube");
  if (!youtubeProfile?.href) {
    return null;
  }
  const match = youtubeProfile.href.match(/youtube\.com\/@([^/?#]+)/i);
  return match?.[1] ?? null;
}

async function resolveChannelId(apiKey: string): Promise<string | null> {
  const handle = getYouTubeHandleFromSocials();
  if (!handle) return null;

  const params = new URLSearchParams({
    part: "id",
    forHandle: handle,
    key: apiKey,
  });

  const response = await fetch(`${YOUTUBE_CHANNELS_API}?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;
  const data = (await response.json()) as YouTubeChannelsResponse;
  return data.items?.[0]?.id ?? null;
}

function guessThemeLabel(title: string) {
  const value = title.toLowerCase();
  if (value.includes("rally")) return "Rally";
  if (value.includes("roadshow")) return "Roadshow";
  if (value.includes("q&a") || value.includes("qa") || value.includes("questions")) return "Q&A";
  if (value.includes("interview")) return "Interview";
  if (value.includes("travel") || value.includes("road trip")) return "Travel";
  if (value.includes("irl") || value.includes("live stream")) return "IRL";
  if (value.includes("campaign")) return "Campaign";
  return "Live event";
}

function parseIso8601Duration(input?: string) {
  if (!input) return 0;
  const match = input.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDurationLabel(seconds: number) {
  if (!seconds) return "";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

async function fetchVideoDurations(apiKey: string, videoIds: string[]) {
  const uniqueIds = Array.from(new Set(videoIds.filter(Boolean)));
  if (!uniqueIds.length) {
    return new Map<string, string>();
  }

  const params = new URLSearchParams({
    part: "contentDetails",
    id: uniqueIds.join(","),
    key: apiKey,
    maxResults: String(uniqueIds.length),
  });

  const response = await fetch(`${YOUTUBE_VIDEOS_API}?${params.toString()}`, {
    next: { revalidate: 1800 },
  });
  if (!response.ok) {
    return new Map<string, string>();
  }

  const data = (await response.json()) as YouTubeVideosResponse;
  const durationMap = new Map<string, string>();
  for (const item of data.items ?? []) {
    if (!item.id) continue;
    const seconds = parseIso8601Duration(item.contentDetails?.duration);
    const formatted = formatDurationLabel(seconds);
    if (formatted) {
      durationMap.set(item.id, formatted);
    }
  }
  return durationMap;
}

function mapSearchItem(item: YouTubeSearchItem, status: EventStatus): EventItem | null {
  const videoId = item.id?.videoId;
  if (!videoId) return null;

  const snippet = item.snippet;
  const title = snippet?.title ?? (status === "live" ? "Live now" : "Recent stream");
  const thumbnailUrl =
    snippet?.thumbnails?.high?.url ??
    snippet?.thumbnails?.medium?.url ??
    snippet?.thumbnails?.default?.url ??
    "";

  return {
    videoId,
    title,
    channelTitle: snippet?.channelTitle ?? "",
    publishedAt: snippet?.publishedAt ?? "",
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl:
      status === "live"
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
        : `https://www.youtube.com/embed/${videoId}`,
    thumbnailUrl,
    status,
    themeLabel: guessThemeLabel(title),
    source: "youtube",
  };
}

async function searchEvents(apiKey: string, channelId: string, eventType: EventStatus, maxResults: number) {
  const params = new URLSearchParams({
    part: "snippet",
    channelId,
    eventType,
    order: "date",
    type: "video",
    maxResults: String(maxResults),
    key: apiKey,
  });

  const response = await fetch(`${YOUTUBE_SEARCH_API}?${params.toString()}`, {
    next: { revalidate: eventType === "live" ? 30 : 300 },
  });

  if (!response.ok) {
    let errorDetail = "";
    try {
      const errJson = (await response.json()) as { error?: { message?: string } };
      errorDetail = errJson.error?.message ? ` - ${errJson.error.message}` : "";
    } catch {}
    throw new Error(`YouTube API error (${eventType}): ${response.status}${errorDetail}`);
  }

  const data = (await response.json()) as YouTubeSearchResponse;
  return (data.items ?? []).map((item) => mapSearchItem(item, eventType)).filter(Boolean) as EventItem[];
}

function ensureArchiveDir() {
  const dir = path.dirname(archiveFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readArchiveItems(): EventItem[] {
  try {
    if (!fs.existsSync(archiveFile)) return [];
    const raw = fs.readFileSync(archiveFile, "utf8");
    const parsed = JSON.parse(raw) as ArchiveRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => Boolean(item?.videoId))
      .map((item) => {
        const title = item.title ?? "Archived event";
        const status: EventStatus = item.status === "live" ? "live" : "completed";
        return {
          videoId: item.videoId,
          title,
          channelTitle: item.channelTitle ?? "",
          publishedAt: item.publishedAt ?? "",
          watchUrl: item.watchUrl ?? `https://www.youtube.com/watch?v=${item.videoId}`,
          embedUrl:
            item.embedUrl ??
            (status === "live"
              ? `https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=1`
              : `https://www.youtube.com/embed/${item.videoId}`),
          thumbnailUrl: item.thumbnailUrl ?? "",
          status,
          durationLabel: item.durationLabel,
          themeLabel: item.themeLabel ?? guessThemeLabel(title),
          source: "archive",
        };
      });
  } catch {
    return [];
  }
}

export function readEventsArchive(): EventsArchiveRecord[] {
  try {
    if (!fs.existsSync(archiveFile)) return [];
    const raw = fs.readFileSync(archiveFile, "utf8");
    const parsed = JSON.parse(raw) as ArchiveRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => Boolean(item?.videoId))
      .map((item) => ({
        videoId: item.videoId,
        title: item.title ?? "Archived event",
        channelTitle: item.channelTitle ?? "",
        publishedAt: item.publishedAt ?? "",
        thumbnailUrl: item.thumbnailUrl ?? "",
        status: item.status === "live" ? "live" : "completed",
        durationLabel: item.durationLabel ?? "",
        themeLabel: item.themeLabel ?? "",
      }));
  } catch {
    return [];
  }
}

function normalizeArchiveRecord(item: Partial<EventsArchiveRecord>): EventsArchiveRecord | null {
  const videoId = String(item.videoId ?? "").trim();
  const title = String(item.title ?? "").trim();
  if (!videoId || !title) return null;

  return {
    videoId,
    title,
    channelTitle: String(item.channelTitle ?? "").trim(),
    publishedAt: String(item.publishedAt ?? "").trim(),
    thumbnailUrl: String(item.thumbnailUrl ?? "").trim(),
    status: item.status === "live" ? "live" : "completed",
    durationLabel: String(item.durationLabel ?? "").trim(),
    themeLabel: String(item.themeLabel ?? "").trim(),
  };
}

export async function writeEventsArchive(items: EventsArchiveRecord[]) {
  ensureArchiveDir();
  const cleaned = items
    .map((item) => normalizeArchiveRecord(item))
    .filter(Boolean) as EventsArchiveRecord[];

  const deduped = cleaned.filter(
    (item, index, arr) => arr.findIndex((entry) => entry.videoId === item.videoId) === index,
  );

  const content = `${JSON.stringify(deduped, null, 2)}\n`;
  if (isAdminRepoStorageEnabled()) {
    await writeRepoFile("data/events/archive.json", content, "Update events archive");
    return deduped;
  }

  fs.writeFileSync(archiveFile, content, "utf8");
  return deduped;
}

export async function importRecentCompletedEventsIntoArchive(maxResults = 8) {
  const payload = await getYouTubeEventsPayload();

  const youtubeCompleted = payload.events
    .filter((item) => item.status === "completed" && item.source === "youtube")
    .slice(0, Math.max(1, maxResults));

  const existing = readEventsArchive();
  const existingMap = new Map(existing.map((item) => [item.videoId, item]));

  const importedRecords: EventsArchiveRecord[] = youtubeCompleted.map((item) => {
    const current = existingMap.get(item.videoId);
    return {
      videoId: item.videoId,
      title: current?.title || item.title,
      channelTitle: current?.channelTitle || item.channelTitle || "",
      publishedAt: current?.publishedAt || item.publishedAt || "",
      thumbnailUrl: current?.thumbnailUrl || item.thumbnailUrl || "",
      status: "completed",
      durationLabel: current?.durationLabel || item.durationLabel || "",
      themeLabel: current?.themeLabel || item.themeLabel || "",
    };
  });

  const merged = [
    ...importedRecords,
    ...existing.filter((item) => !importedRecords.some((imported) => imported.videoId === item.videoId)),
  ];

  const saved = await writeEventsArchive(merged);
  const importedIds = new Set(importedRecords.map((item) => item.videoId));

  return {
    items: saved,
    importedCount: importedRecords.length,
    newCount: importedRecords.filter((item) => !existingMap.has(item.videoId)).length,
    updatedCount: importedRecords.filter((item) => existingMap.has(item.videoId)).length,
    importedVideoIds: saved.filter((item) => importedIds.has(item.videoId)).map((item) => item.videoId),
    payloadError: payload.error,
  };
}

function sortByPublishedAtDesc(items: EventItem[]) {
  return [...items].sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
}

export async function getYouTubeEventsPayload(): Promise<YouTubeEventsPayload> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  let channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey) {
    return {
      isLive: false,
      currentLive: null,
      events: readArchiveItems(),
      error: "Missing YOUTUBE_API_KEY",
    };
  }

  if (!channelId) {
    channelId = await resolveChannelId(apiKey);
  }

  if (!channelId) {
    return {
      isLive: false,
      currentLive: null,
      events: readArchiveItems(),
      error: "Unable to resolve YouTube channel ID. Set YOUTUBE_CHANNEL_ID or update YouTube URL in socials.",
    };
  }

  try {
    const [liveItems, completedItems] = await Promise.all([
      searchEvents(apiKey, channelId, "live", 1),
      searchEvents(apiKey, channelId, "completed", 8),
    ]);

    const archiveItems = readArchiveItems();
    const currentLive = liveItems[0] ?? null;
    const merged = [...liveItems, ...completedItems, ...archiveItems];
    const deduped = merged.filter(
      (item, index, arr) => arr.findIndex((entry) => entry.videoId === item.videoId) === index,
    );

    const durationMap = await fetchVideoDurations(
      apiKey,
      deduped.filter((item) => item.status !== "live").map((item) => item.videoId),
    );

    const enrichedEvents = sortByPublishedAtDesc(
      deduped.map((item) => ({
        ...item,
        durationLabel: item.durationLabel ?? durationMap.get(item.videoId),
        themeLabel: item.themeLabel ?? guessThemeLabel(item.title),
      })),
    );

    return {
      isLive: Boolean(currentLive),
      currentLive: currentLive
        ? {
            ...currentLive,
            themeLabel: currentLive.themeLabel ?? guessThemeLabel(currentLive.title),
          }
        : null,
      events: enrichedEvents,
      liveChannelUrl: `https://www.youtube.com/channel/${channelId}/live`,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    const archiveItems = sortByPublishedAtDesc(readArchiveItems());
    return {
      isLive: false,
      currentLive: null,
      events: archiveItems,
      error: error instanceof Error ? error.message : "Failed to reach YouTube API",
      liveChannelUrl: `https://www.youtube.com/channel/${channelId}/live`,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      updatedAt: new Date().toISOString(),
    };
  }
}
