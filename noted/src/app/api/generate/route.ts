import { NextResponse } from "next/server";
import { generateContentPack } from "@/lib/ai";
import type { GenerateInput } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Partial<GenerateInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const topic = (body.topic ?? "").toString().trim();
  const notes = (body.notes ?? "").toString().trim();

  if (!topic && !notes) {
    return NextResponse.json(
      { error: "Add a topic or paste some notes to generate a content pack." },
      { status: 400 },
    );
  }

  const input: GenerateInput = {
    niche: (body.niche ?? "studygram").toString(),
    topic,
    notes,
    voiceSample: (body.voiceSample ?? "").toString(),
    tone: (body.tone ?? "").toString(),
  };

  try {
    const pack = await generateContentPack(input);
    return NextResponse.json(pack);
  } catch {
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}
