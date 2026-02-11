import { NextResponse } from "next/server";

type VolunteerPayload = {
  name?: string;
  mobile?: string;
  email?: string;
  area?: string;
  interest?: string;
  consent?: boolean;
};

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzSt7eCHxSPV_QHcbY7GpKIXnXVHVLyBA6txMMhCJmk7CzMBqx6gmFbXisAMbEnm3-8LQ/exec";

function isValidMobile(mobile: string) {
  return /^[6-9][0-9]{9}$/.test(mobile);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as VolunteerPayload;

    const name = (payload.name || "").trim();
    const mobile = (payload.mobile || "").trim();
    const email = (payload.email || "").trim();
    const area = (payload.area || "").trim();
    const interest = (payload.interest || "").trim();
    const consent = Boolean(payload.consent);

    if (!name || !mobile || !consent) {
      return NextResponse.json(
        { error: "Name, mobile number, and consent are required." },
        { status: 400 }
      );
    }

    if (!isValidMobile(mobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const upstream = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name, mobile, email, area, interest, consent }),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Unable to submit right now. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
