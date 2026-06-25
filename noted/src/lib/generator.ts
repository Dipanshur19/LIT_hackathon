// Smart, dependency-free content generator.
// This is the fallback engine that runs when no LLM API key is configured,
// so the live demo always produces a real, useful content pack at zero cost.

import type {
  CarouselSlide,
  ContentPack,
  GenerateInput,
  HookScore,
  ReelBeat,
} from "./types";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with",
  "is", "are", "was", "were", "be", "been", "being", "this", "that", "these",
  "those", "it", "its", "as", "at", "by", "from", "into", "than", "then",
  "so", "such", "can", "will", "would", "should", "could", "may", "might",
  "we", "you", "your", "they", "their", "he", "she", "his", "her", "i",
  "about", "also", "very", "more", "most", "some", "any", "all", "if", "when",
  "how", "what", "why", "which", "who", "do", "does", "did", "have", "has",
]);

const CURIOSITY_WORDS = [
  "secret", "mistake", "nobody", "stop", "truth", "actually", "why", "how",
  "before", "never", "everyone", "wish", "fastest", "easiest", "hack",
];

function cleanText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Break the pasted notes into clean, meaningful points.
function extractPoints(notes: string): string[] {
  if (!notes.trim()) return [];

  // Prefer explicit lines / bullets first.
  let chunks = notes
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*([-*•\d.)\]]+)\s*/, "").trim())
    .filter(Boolean);

  // If notes came as one big paragraph, split on sentences instead.
  if (chunks.length <= 1) {
    chunks = notes
      .split(/(?<=[.!?])\s+/)
      .map((s) => cleanText(s))
      .filter(Boolean);
  }

  // De-duplicate and drop tiny fragments.
  const seen = new Set<string>();
  const points: string[] = [];
  for (const c of chunks) {
    const key = c.toLowerCase();
    if (c.length < 8 || seen.has(key)) continue;
    seen.add(key);
    points.push(cleanText(c.replace(/[.;]+$/, "")));
  }
  return points;
}

function keywords(text: string, limit: number): string[] {
  const counts = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z][a-z0-9'-]+/g) ?? []) {
    if (raw.length < 4 || STOPWORDS.has(raw)) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function buildHooks(topic: string, points: string[]): string[] {
  const t = topic.trim() || (points[0] ?? "this topic");
  const tLower = t.toLowerCase();
  return [
    `Nobody told you this about ${tLower}.`,
    `Stop studying ${tLower} the hard way.`,
    `${titleCase(t)} in 60 seconds (save this).`,
    `The ${tLower} mistake that's costing you marks.`,
    `If ${tLower} confuses you, watch this.`,
  ];
}

function applyVoice(text: string, input: GenerateInput): string {
  // Light-touch personalisation so output nods to the creator's voice sample.
  const casual = (input.voiceSample ?? "").match(/(lol|haha|btw|tbh|fr|ngl|guys|okay so|so basically)/i);
  if (casual && !/[!?]$/.test(text)) return text + " 👇";
  return text;
}

export function generateLocally(input: GenerateInput): ContentPack {
  const points = extractPoints(input.notes);
  const topic = cleanText(input.topic) || (points[0]?.slice(0, 40) ?? "Your topic");
  const niche = cleanText(input.niche) || "studygram";
  const hooks = buildHooks(topic, points);

  const corePoints = points.length
    ? points
    : [
        `${titleCase(topic)} matters more than people think.`,
        `Break ${topic.toLowerCase()} into smaller chunks to learn faster.`,
        `Most students skip revision — that's the real gap.`,
        `Teach it back in your own words to lock it in.`,
      ];

  // ---- Carousel (hook slide + value slides + CTA slide) ----
  const valueSlides: CarouselSlide[] = corePoints.slice(0, 6).map((p, i) => ({
    title: `${i + 1}. ${titleCase(p.split(" ").slice(0, 4).join(" "))}`,
    body: applyVoice(p.endsWith(".") ? p : p + ".", input),
  }));

  const carousel: CarouselSlide[] = [
    { title: hooks[0], body: `A quick, no-fluff breakdown of ${topic.toLowerCase()}. Swipe →` },
    ...valueSlides,
    {
      title: "Save this for later 📌",
      body: `Follow for more ${niche.toLowerCase()} content. Which point hit hardest? Tell me below 👇`,
    },
  ];

  // ---- Reel script ----
  const reelScript: ReelBeat[] = [
    { section: "Hook (0-3s)", text: hooks[2] },
    { section: "Setup (3-8s)", text: `Here's how to actually understand ${topic.toLowerCase()} without re-reading the whole chapter.` },
    ...corePoints.slice(0, 4).map((p, i) => ({
      section: `Point ${i + 1} (${8 + i * 6}-${14 + i * 6}s)`,
      text: applyVoice(p, input),
    })),
    { section: "CTA (close)", text: `Save this so you don't forget, and follow for daily ${niche.toLowerCase()} breakdowns.` },
  ];

  // ---- Caption ----
  const kw = keywords(`${topic} ${input.notes}`, 6);
  const caption = applyVoice(
    `${titleCase(topic)} — the version I wish I had earlier.\n\n` +
      corePoints.slice(0, 3).map((p) => `• ${p}`).join("\n") +
      `\n\nSave it, try it this week, and tell me how it goes. Which one are you starting with?`,
    input,
  );

  // ---- Hashtags ----
  const nicheTag = niche.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = ["studygram", "studytips", "studymotivation", "studentlife", "examprep", "studywithme"];
  const hashtags = [
    ...new Set([
      nicheTag,
      ...kw.map((k) => k.replace(/[^a-z0-9]/g, "")),
      ...base,
    ].filter(Boolean)),
  ]
    .slice(0, 12)
    .map((t) => `#${t}`);

  // ---- Hook score (heuristic) ----
  const hookScore = scoreHook(carousel[0].title);

  return {
    topic,
    niche,
    carousel,
    reelScript,
    caption,
    hashtags,
    hookScore,
    source: "smart-engine",
  };
}

export function scoreHook(hook: string): HookScore {
  const notes: string[] = [];
  let score = 50;
  const words = hook.trim().split(/\s+/).length;

  if (words <= 9) {
    score += 15;
  } else {
    notes.push("Shorten the hook to under 9 words for a stronger scroll-stop.");
  }
  if (/\d/.test(hook)) {
    score += 10;
  } else {
    notes.push("Add a number or timeframe (e.g. '3 ways', 'in 60s') to boost specificity.");
  }
  if (CURIOSITY_WORDS.some((w) => hook.toLowerCase().includes(w))) {
    score += 15;
  } else {
    notes.push("Add a curiosity trigger like 'nobody', 'mistake', or 'stop' to spark intrigue.");
  }
  if (/[?!]/.test(hook)) score += 5;
  if (/you|your/i.test(hook)) {
    score += 5;
  } else {
    notes.push("Speak directly to the viewer with 'you' or 'your'.");
  }

  score = Math.max(0, Math.min(100, score));
  const verdict = score >= 80 ? "Scroll-stopping" : score >= 60 ? "Solid" : "Needs a sharper angle";
  if (!notes.length) notes.push("Strong hook — ready to post.");

  return { score, verdict, notes };
}
