type RetryOptions = {
  attempts?: number;
  timeoutMs?: number;
  retryDelayMs?: number;
};

type TelegramApiResponse = {
  ok?: boolean;
  description?: string;
  error_code?: number;
};

type TelegramSendResult = {
  ok: boolean;
  httpStatus: number;
  description?: string;
  errorCode?: number;
};

const TELEGRAM_MAX_MESSAGE_LENGTH = 4000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(status: number) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

export async function fetchWithRetry(
  input: string,
  init: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  const attempts = options.attempts ?? 3;
  const timeoutMs = options.timeoutMs ?? 8000;
  const retryDelayMs = options.retryDelayMs ?? 400;

  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!shouldRetry(response.status) || attempt === attempts - 1) {
        return response;
      }
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt === attempts - 1) {
        throw error;
      }
    }

    await sleep(retryDelayMs * (attempt + 1));
  }

  throw lastError instanceof Error ? lastError : new Error("Fetch failed after retries");
}

export async function notifyTelegram(
  message: string,
  token?: string,
  chatId?: string
): Promise<void> {
  if (!token || !chatId) return;

  await sendTelegramMessage(message, token, chatId);
}

export async function sendTelegramMessage(
  message: string,
  token?: string,
  chatId?: string
): Promise<TelegramSendResult> {
  if (!token || !chatId) {
    return {
      ok: false,
      httpStatus: 500,
      description: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.",
    };
  }

  const chunks = chunkTelegramMessage(message);
  let lastStatus = 200;
  let lastDescription: string | undefined;

  for (const chunk of chunks) {
    const response = await fetchWithRetry(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: chunk,
          disable_web_page_preview: true,
        }),
        cache: "no-store",
      },
      { attempts: 2, timeoutMs: 6000, retryDelayMs: 300 }
    );

    let payload: TelegramApiResponse | null = null;
    try {
      payload = (await response.json()) as TelegramApiResponse;
    } catch {
      payload = null;
    }

    const ok = response.ok && payload?.ok !== false;
    if (!ok) {
      return {
        ok: false,
        httpStatus: response.status,
        description: payload?.description,
        errorCode: payload?.error_code,
      };
    }

    lastStatus = response.status;
    lastDescription = payload?.description;
  }

  return {
    ok: true,
    httpStatus: lastStatus,
    description: lastDescription,
  };
}

function chunkTelegramMessage(message: string) {
  const normalized = message.trim() || "(empty message)";
  if (normalized.length <= TELEGRAM_MAX_MESSAGE_LENGTH) {
    return [normalized];
  }

  const lines = normalized.split("\n");
  const chunks: string[] = [];
  let current = "";

  for (const line of lines) {
    const candidate = current ? `${current}\n${line}` : line;
    if (candidate.length <= TELEGRAM_MAX_MESSAGE_LENGTH) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
    }

    if (line.length <= TELEGRAM_MAX_MESSAGE_LENGTH) {
      current = line;
      continue;
    }

    for (let i = 0; i < line.length; i += TELEGRAM_MAX_MESSAGE_LENGTH) {
      chunks.push(line.slice(i, i + TELEGRAM_MAX_MESSAGE_LENGTH));
    }
    current = "";
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}
