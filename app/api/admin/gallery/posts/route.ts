import { NextResponse } from "next/server";
import { adminLog } from "@/lib/adminLogger";
import { assertAdminMfa, assertAdminSecret } from "@/lib/adminAuth";
import { readGalleryPosts, writeGalleryPosts, GalleryPost } from "@/lib/galleryPosts";
import crypto from "crypto";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type ValidationResult = {
  errors: string[];
  date: string;
};

function normalizeImages(payload: Partial<GalleryPost> & { image?: string }) {
  const images = payload.images?.filter(Boolean) ?? [];
  if (!images.length && payload.image) {
    images.push(payload.image);
  }
  return images;
}

function validateGalleryFields(
  payload: Partial<GalleryPost> & { image?: string },
  images: string[],
): ValidationResult {
  const errors: string[] = [];
  if (!payload.title?.trim()) {
    errors.push("Title is required.");
  }
  if (!payload.description?.trim()) {
    errors.push("Description is required.");
  }
  if (!images.length) {
    errors.push("At least one image is required.");
  }
  if (!payload.image?.trim()) {
    errors.push("Primary image path is required.");
  }
  let date = payload.date?.trim() ?? "";
  if (date && !DATE_PATTERN.test(date)) {
    errors.push("Date must use the YYYY-MM-DD format.");
    date = "";
  }
  if (!date) {
    date = new Date().toISOString().split("T")[0];
  }
  return { errors, date };
}

export const runtime = "nodejs";

export async function GET() {
  try {
    const posts = readGalleryPosts();
    adminLog("gallery-posts-read", { count: posts.length });
    return NextResponse.json({ ok: true, posts });
  } catch (error) {
    adminLog("gallery-posts-read-error", { error: String(error) });
    return NextResponse.json({ error: "Unable to fetch gallery posts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const mfaError = assertAdminMfa("gallery-post", request.headers.get("x-admin-otp"));
  if (mfaError) return mfaError;

  const payload = (await request.json().catch(() => null)) as
    | (Partial<GalleryPost> & { secret?: string })
    | null;
  const secretError = assertAdminSecret("gallery-post", payload?.secret);
  if (secretError) return secretError;
  if (!payload) {
    return NextResponse.json({ error: "Request payload is missing." }, { status: 400 });
  }

  const images = normalizeImages(payload);
  const { errors, date } = validateGalleryFields(payload, images);
  if (errors.length) {
    return NextResponse.json({ error: errors.join(" "), errors }, { status: 400 });
  }

  const posts = readGalleryPosts();
  let updatedPost: GalleryPost;
  if (payload.id) {
    const existingIndex = posts.findIndex((post) => post.id === payload.id);
    if (existingIndex >= 0) {
      updatedPost = {
        ...posts[existingIndex],
        ...payload,
        images,
        date,
      } as GalleryPost;
      posts[existingIndex] = updatedPost;
      adminLog("gallery-post-updated", { id: updatedPost.id });
    } else {
      updatedPost = {
        id: payload.id,
        title: payload.title,
        description: payload.description,
        image: payload.image,
        images,
        location: payload.location ?? "",
        pieces: payload.pieces ?? "",
        date,
      };
      posts.push(updatedPost);
      adminLog("gallery-post-created", { id: updatedPost.id });
    }
  } else {
    updatedPost = {
      id: crypto.randomUUID(),
      title: payload.title,
      description: payload.description,
      image: payload.image,
      images,
      location: payload.location ?? "",
      pieces: payload.pieces ?? "",
      date,
    };
    posts.push(updatedPost);
    adminLog("gallery-post-created", { id: updatedPost.id });
  }

  writeGalleryPosts(posts);
  return NextResponse.json({ ok: true, post: updatedPost, posts });
}

export async function DELETE(request: Request) {
  const mfaError = assertAdminMfa("gallery-post-delete", request.headers.get("x-admin-otp"));
  if (mfaError) return mfaError;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing post id." }, { status: 400 });
  }

  const posts = readGalleryPosts();
  const remaining = posts.filter((post) => post.id !== id);
  if (remaining.length === posts.length) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  writeGalleryPosts(remaining);
  adminLog("gallery-post-deleted", { id });
  return NextResponse.json({ ok: true });
}
