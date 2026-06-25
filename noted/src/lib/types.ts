// Shared types for the Noted content-generation engine.

export type CarouselSlide = {
  title: string;
  body: string;
};

export type ReelBeat = {
  section: string; // e.g. "Hook (0-3s)"
  text: string;
};

export type HookScore = {
  score: number; // 0-100
  verdict: string; // short label
  notes: string[]; // actionable feedback
};

export type ContentPack = {
  topic: string;
  niche: string;
  carousel: CarouselSlide[];
  reelScript: ReelBeat[];
  caption: string;
  hashtags: string[];
  hookScore: HookScore;
  source: "ai" | "smart-engine"; // tells the UI which path produced this
};

export type GenerateInput = {
  niche: string;
  topic: string;
  notes: string;
  voiceSample?: string;
  tone?: string;
};
