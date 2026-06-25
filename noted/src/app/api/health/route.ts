import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Visit http://localhost:3000/api/health to check your OpenAI key status.
// It performs a lightweight live check without generating content.
export async function GET() {
  const key = process.env.OPENAI_API_KEY?.trim();

  if (!key) {
    return NextResponse.json({
      engine: "smart-engine",
      ok: false,
      reason: "OPENAI_API_KEY is not set. Add it to noted/.env.local and restart the dev server.",
    });
  }
  if (!key.startsWith("sk-")) {
    return NextResponse.json({
      engine: "smart-engine",
      ok: false,
      reason: `Key should start with "sk-" but starts with "${key.slice(0, 4)}…". This is not a valid OpenAI key.`,
    });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (res.ok) {
      return NextResponse.json({ engine: "ai", ok: true, reason: "OpenAI key is valid. AI engine is active." });
    }
    const body = await res.text().catch(() => "");
    let hint = body.slice(0, 160);
    if (res.status === 401) hint = "Invalid or revoked API key.";
    if (res.status === 429) hint = "Key is valid but the account has no credits/quota. Add billing at platform.openai.com.";
    return NextResponse.json({
      engine: "smart-engine",
      ok: false,
      status: res.status,
      reason: hint,
    });
  } catch (e) {
    return NextResponse.json({
      engine: "smart-engine",
      ok: false,
      reason: `Could not reach OpenAI: ${e instanceof Error ? e.message : String(e)}`,
    });
  }
}
