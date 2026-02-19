import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/server/leadOps";

type TelegramTestPayload = {
  message?: string;
};

function normalizeMessage(input?: string) {
  if (!input) return "";
  return input.replace(/\s+/g, " ").trim().slice(0, 2000);
}

function isAuthorized(request: Request, querySecret = "") {
  const requiredSecret = process.env.TELEGRAM_TEST_SECRET;
  if (!requiredSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const headerSecret = request.headers.get("x-telegram-test-secret") || "";
  return headerSecret === requiredSecret || querySecret === requiredSecret;
}

async function runTelegramTest(message?: string) {
  const result = await sendTelegramMessage(
    normalizeMessage(message) || `Telegram bot link test\n${new Date().toISOString()}`,
    process.env.TELEGRAM_BOT_TOKEN,
    process.env.TELEGRAM_CHAT_ID
  );

  if (result.ok) {
    return NextResponse.json({
      ok: true,
      status: result.httpStatus,
      description: result.description || "Message sent.",
    });
  }

  const status = result.httpStatus >= 400 ? result.httpStatus : 502;
  return NextResponse.json(
    {
      ok: false,
      status: result.httpStatus,
      error: result.description || "Telegram API request failed.",
      errorCode: result.errorCode,
    },
    { status }
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret") || "";

  if (!isAuthorized(request, querySecret)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized Telegram test request." },
      { status: 401 }
    );
  }

  const message = searchParams.get("message") || undefined;
  return runTelegramTest(message);
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized Telegram test request." },
        { status: 401 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as TelegramTestPayload;
    return runTelegramTest(body.message);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
