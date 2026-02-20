import { NextResponse } from "next/server";
import { socialProfiles } from "@/constants/socials";

const YOUTUBE_SEARCH_API = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_CHANNELS_API = "https://www.googleapis.com/youtube/v3/channels";

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    channelTitle?: string;
    publishedAt?: string;
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
  if (!handle) {
    return null;
  }

  const params = new URLSearchParams({
    part: "id",
    forHandle: handle,
    key: apiKey,
  });

  const response = await fetch(`${YOUTUBE_CHANNELS_API}?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as YouTubeChannelsResponse;
  return data.items?.[0]?.id ?? null;
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  let channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey) {
    return NextResponse.json(
      {
        isLive: false,
        error: "Missing YOUTUBE_API_KEY",
      },
      { status: 500 },
    );
  }

  if (!channelId) {
    channelId = await resolveChannelId(apiKey);
  }

  if (!channelId) {
    return NextResponse.json(
      {
        isLive: false,
        error: "Unable to resolve YouTube channel ID. Set YOUTUBE_CHANNEL_ID or update YouTube URL in socials.",
      },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    part: "snippet",
    channelId,
    eventType: "live",
    type: "video",
    maxResults: "1",
    key: apiKey,
  });

  try {
    const response = await fetch(`${YOUTUBE_SEARCH_API}?${params.toString()}`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      let errorDetail = "";
      try {
        const errJson = (await response.json()) as {
          error?: { message?: string };
        };
        errorDetail = errJson.error?.message ? ` - ${errJson.error.message}` : "";
      } catch {
        errorDetail = "";
      }

      return NextResponse.json(
        {
          isLive: false,
          error: `YouTube API error: ${response.status}${errorDetail}`,
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as YouTubeSearchResponse;
    const firstItem = data.items?.[0];
    const videoId = firstItem?.id?.videoId;

    if (!videoId) {
      return NextResponse.json({
        isLive: false,
      });
    }

    return NextResponse.json({
      isLive: true,
      videoId,
      title: firstItem?.snippet?.title ?? "Live now",
      channelTitle: firstItem?.snippet?.channelTitle ?? "",
      publishedAt: firstItem?.snippet?.publishedAt ?? "",
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`,
      liveChannelUrl: `https://www.youtube.com/channel/${channelId}/live`,
    });
  } catch {
    return NextResponse.json(
      {
        isLive: false,
        error: "Failed to reach YouTube API",
      },
      { status: 502 },
    );
  }
}
