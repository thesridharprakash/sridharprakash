import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { assertAdminMfa, assertAdminSecret } from "@/lib/adminAuth";
import {
  deleteRepoFile,
  isAdminRepoStorageEnabled,
  repoFileExists,
  writeRepoFile,
} from "@/lib/adminRepoStorage";
import { getAdminStorageWriteErrorMessage } from "@/lib/adminStorageErrors";

export const runtime = "nodejs";
export const maxDuration = 30;

type CreateArticlePayload = {
  title?: string;
  summary?: string;
  date?: string;
  img?: string;
  content?: string;
  slug?: string;
  secret?: string;
  videoUrl?: string;
  voiceUrl?: string;
  category?: "journal" | "video" | "voice";
  overwrite?: boolean;
  status?: "draft" | "published";
};

const articlesDir = path.join(process.cwd(), "content", "articles");

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function sanitizeText(input: string, max: number) {
  return input.trim().replace(/\r\n/g, "\n").slice(0, max);
}

function isValidDate(input: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(input);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateArticlePayload;
    const secretError = assertAdminSecret("publish", body.secret);
    if (secretError) return secretError;
    const status = body.status === "draft" ? "draft" : "published";
    if (status === "published") {
      const mfaError = assertAdminMfa("publish", request.headers.get("x-admin-otp"));
      if (mfaError) return mfaError;
    }

    const title = sanitizeText(body.title || "", 180);
    const summary = sanitizeText(body.summary || "", 320);
    const date = sanitizeText(body.date || "", 20);
    const rawImgValue = sanitizeText(body.img ?? "", 300);
    const content = (body.content || "").trim().replace(/\r\n/g, "\n");
    const rawSlug = sanitizeText(body.slug || "", 200);
    const videoUrl = sanitizeText(body.videoUrl || "", 400);
    const voiceUrl = sanitizeText(body.voiceUrl || "", 400);
    const category: CreateArticlePayload["category"] =
      body.category === "video" || body.category === "voice" ? body.category : "journal";
    const fallbackImg = category === "journal" ? "/images/og-image.jpg" : "";
    const img = rawImgValue || fallbackImg;

    if (!title || !summary || !date || !content) {
      adminLog("publish-missing-field", { title, summary, date });
      return NextResponse.json(
        { error: "Title, summary, date, and content are required." },
        { status: 400 }
      );
    }

    if (!isValidDate(date)) {
      adminLog("publish-invalid-date", { date });
      return NextResponse.json(
        { error: "Date must be in YYYY-MM-DD format." },
        { status: 400 }
      );
    }

    const generatedSlug = slugify(`${date}-${title}`);
    const safeSlug = slugify(rawSlug || generatedSlug);

    if (!safeSlug || !/^[a-z0-9-]+$/.test(safeSlug)) {
      adminLog("publish-invalid-slug", { safeSlug });
      return NextResponse.json(
        { error: "Generated slug is invalid." },
        { status: 400 }
      );
    }

    const fileName = `${safeSlug}.md`;
    const filePath = path.join(articlesDir, fileName);
    if (!filePath.startsWith(articlesDir)) {
      return NextResponse.json(
        { error: "Invalid target file path." },
        { status: 400 }
      );
    }

    const useRepoStorage = isAdminRepoStorageEnabled();
    if (!useRepoStorage) {
      fs.mkdirSync(articlesDir, { recursive: true });
      if (fs.existsSync(filePath) && !body.overwrite) {
        adminLog("publish-duplicate-slug", { slug: safeSlug });
        return NextResponse.json(
          { error: "An article with this slug already exists." },
          { status: 409 }
        );
      }
    } else if (!body.overwrite) {
      const exists = await repoFileExists(`content/articles/${fileName}`);
      if (exists) {
        adminLog("publish-duplicate-slug", { slug: safeSlug });
        return NextResponse.json(
          { error: "An article with this slug already exists." },
          { status: 409 }
        );
      }
    }

    const frontMatter = [
      "---",
      `title: ${JSON.stringify(title)}`,
      `summary: ${JSON.stringify(summary)}`,
      `date: ${JSON.stringify(date)}`,
    ];
    if (img) {
      frontMatter.push(`img: ${JSON.stringify(img)}`);
    }
    frontMatter.push(
      `videoUrl: ${JSON.stringify(videoUrl)}`,
      `voiceUrl: ${JSON.stringify(voiceUrl)}`,
      `category: ${JSON.stringify(category)}`,
      `status: ${JSON.stringify(status)}`,
      "---",
      "",
    );
    const markdown = [...frontMatter, content, ""].join("\n");

    if (useRepoStorage) {
      await writeRepoFile(
        `content/articles/${fileName}`,
        markdown,
        `${body.overwrite ? "Update" : "Create"} article ${safeSlug}`
      );
    } else {
      fs.writeFileSync(filePath, markdown, "utf8");
    }
    adminLog("publish-success", { slug: safeSlug, status, file: filePath });

    return NextResponse.json({
      ok: true,
      slug: safeSlug,
      status,
      file: `content/articles/${fileName}`,
    });
  } catch (error) {
    adminLog("publish-error", { error: String(error) });
    const storageError = getAdminStorageWriteErrorMessage(error, "Article");
    if (storageError) {
      return NextResponse.json({ error: storageError }, { status: 500 });
    }
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const configuredSecret = process.env.ADMIN_ARTICLES_SECRET?.trim();
  if (!configuredSecret) {
    adminLog("article-delete-missing-secret");
    return NextResponse.json(
      { error: "Server is not configured for article publishing." },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const slugParam = url.searchParams.get("slug");
  if (!slugParam) {
    adminLog("article-delete-missing-slug");
    return NextResponse.json({ error: "Missing slug query." }, { status: 400 });
  }

  const safeSlug = slugify(slugParam);
  if (!safeSlug) {
    adminLog("article-delete-invalid-slug", { slug: slugParam });
    return NextResponse.json({ error: "Invalid slug value." }, { status: 400 });
  }

  const fileName = `${safeSlug}.md`;
  const filePath = path.join(articlesDir, fileName);
  if (!filePath.startsWith(articlesDir)) {
    return NextResponse.json(
      { error: "Invalid target file path." },
      { status: 400 }
    );
  }

  if (!fs.existsSync(filePath)) {
    adminLog("article-delete-missing-file", { slug: safeSlug });
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  try {
    if (isAdminRepoStorageEnabled()) {
      await deleteRepoFile(`content/articles/${fileName}`, `Delete article ${safeSlug}`);
    } else {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    adminLog("article-delete-error", { slug: safeSlug, error: String(error) });
    const storageError = getAdminStorageWriteErrorMessage(error, "Article");
    return NextResponse.json(
      { error: storageError || "Unable to delete article." },
      { status: storageError ? 500 : 400 }
    );
  }
  adminLog("article-delete-success", { slug: safeSlug, file: filePath });
  return NextResponse.json({ ok: true });
}
