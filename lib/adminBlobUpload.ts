type BlobUploadResult = {
  url: string;
  pathname?: string;
};

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || "";
}

export function isAdminBlobEnabled() {
  return Boolean(getBlobToken());
}

export async function uploadBlobFromBuffer(
  pathname: string,
  data: Buffer,
  contentType: string
): Promise<BlobUploadResult> {
  const token = getBlobToken();
  if (!token) {
    throw new Error("Vercel Blob is not configured.");
  }

  const resolvedType = contentType || "application/octet-stream";
  const bytes = Uint8Array.from(data);
  const response = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": resolvedType,
      "x-add-random-suffix": "1",
      "x-content-type": resolvedType,
      "x-upsert": "0",
    },
    body: new Blob([bytes], { type: resolvedType }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Blob upload failed (${response.status}): ${detail}`);
  }

  const payload = (await response.json()) as { url?: string; pathname?: string };
  if (!payload.url) {
    throw new Error("Blob upload failed: missing URL");
  }

  return { url: payload.url, pathname: payload.pathname };
}
