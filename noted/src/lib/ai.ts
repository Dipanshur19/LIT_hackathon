// Orchestrates content generation.
// If an LLM API key is configured via env, call it for higher-quality output.
// Otherwise transparently fall back to the local smart engine so the demo
// always works with zero setup or cost.

import { generateLocally, scoreHook } from "./generator";
import type { ContentPack, GenerateInput } from "./types";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function buildPrompt(input: GenerateInput): string {
  return [
    `You are "Noted", a content engine for student creators in the "${input.niche}" niche.`,
    `Turn the study notes below into one ready-to-post content pack about: "${input.topic}".`,
    input.voiceSample
      ? `Match this creator's voice/tone sample: """${input.voiceSample}"""`
      : "",
    input.tone ? `Preferred tone: ${input.tone}.` : "",
    "",
    "STUDY NOTES:",
    `"""${input.notes}"""`,
    "",
    "Return ONLY valid minified JSON with this exact shape:",
    `{"carousel":[{"title":string,"body":string}],"reelScript":[{"section":string,"text":string}],"caption":string,"hashtags":[string]}`,
    "Rules: carousel = 6-8 slides, slide 1 is a scroll-stopping hook, last slide is a save/CTA.",
    "reelScript = hook (0-3s), setup, 3-4 points with timestamps, CTA. caption is engaging with a question.",
    "hashtags = 8-12 relevant tags WITHOUT the # symbol.",
  ]
    .filter(Boolean)
    .join("\n");
}

// Surfaces the real reason the AI path failed (visible in the dev terminal).
function warn(reason: string) {
  console.warn(`[Noted] OpenAI not used → falling back to smart engine. Reason: ${reason}`);
}

async function generateWithOpenAI(input: GenerateInput): Promise<ContentPack | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    warn("OPENAI_API_KEY is not set (check noted/.env.local and restart the dev server).");
    return null;
  }
  if (!key.startsWith("sk-")) {
    warn(`Key does not look like an OpenAI key (should start with "sk-", got "${key.slice(0, 4)}…").`);
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You output only valid JSON content packs for social media." },
          { role: "user", content: buildPrompt(input) },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      warn(`OpenAI API returned ${res.status} ${res.statusText}. ${body.slice(0, 180)}`);
      return null;
    }
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) {
      warn("OpenAI response had no content.");
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.carousel) || !Array.isArray(parsed.reelScript)) {
      warn("OpenAI returned JSON in an unexpected shape.");
      return null;
    }

    const hashtags: string[] = (parsed.hashtags ?? []).map((t: string) =>
      t.startsWith("#") ? t : `#${t}`,
    );

    return {
      topic: input.topic,
      niche: input.niche,
      carousel: parsed.carousel,
      reelScript: parsed.reelScript,
      caption: parsed.caption ?? "",
      hashtags,
      hookScore: scoreHook(parsed.carousel?.[0]?.title ?? input.topic),
      source: "ai",
    };
  } catch (e) {
    warn(`Network/parse error: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

export async function generateContentPack(input: GenerateInput): Promise<ContentPack> {
  const ai = await generateWithOpenAI(input);
  if (ai) return ai;
  return generateLocally(input);
}
