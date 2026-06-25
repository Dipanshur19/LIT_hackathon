"use client";

import Link from "next/link";
import { useState } from "react";
import type { ContentPack } from "@/lib/types";

const NICHES = ["Studygram", "Exam prep", "Concept explainer", "Coding / tech", "Productivity", "Language learning"];

const SAMPLE = {
  niche: "Exam prep",
  topic: "How to revise a chapter fast",
  notes: `Active recall beats re-reading
Use the Feynman technique - explain it like you're teaching a 10 year old
Space your revision over 3 days, not all in one night
Past papers reveal the exam pattern
Make a one-page summary sheet per chapter
Test yourself before looking at notes`,
  voiceSample: "okay so basically here's the thing nobody tells you about revision lol — you're doing it wrong",
};

type TabKey = "carousel" | "reel" | "caption";

export default function AppPage() {
  const [niche, setNiche] = useState("Studygram");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [voiceSample, setVoiceSample] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pack, setPack] = useState<ContentPack | null>(null);
  const [tab, setTab] = useState<TabKey>("carousel");
  const [copied, setCopied] = useState("");

  async function generate() {
    setError("");
    if (!topic.trim() && !notes.trim()) {
      setError("Add a topic or paste some notes first.");
      return;
    }
    setLoading(true);
    setPack(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, topic, notes, voiceSample }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setPack(data as ContentPack);
      setTab("carousel");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setNiche(SAMPLE.niche);
    setTopic(SAMPLE.topic);
    setNotes(SAMPLE.notes);
    setVoiceSample(SAMPLE.voiceSample);
    setError("");
  }

  async function copy(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">N</span>
            Noted
          </Link>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
            Free plan · 5 packs left
          </span>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-5 py-8 lg:grid-cols-[380px_1fr]">
        {/* Input panel */}
        <section className="rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-zinc-900">Create a content pack</h1>
            <button onClick={loadSample} className="text-xs font-semibold text-indigo-600 hover:underline">
              Try a sample
            </button>
          </div>

          <label className="mt-5 block text-sm font-medium text-zinc-700">Your niche</label>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {NICHES.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-medium text-zinc-700">Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How to revise a chapter fast"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <label className="mt-4 block text-sm font-medium text-zinc-700">
            Your notes <span className="text-zinc-400">(paste anything)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={7}
            placeholder="Paste bullet points, a chapter summary, or messy notes…"
            className="thin-scroll mt-1.5 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <label className="mt-4 block text-sm font-medium text-zinc-700">
            Voice sample <span className="text-zinc-400">(optional)</span>
          </label>
          <textarea
            value={voiceSample}
            onChange={(e) => setVoiceSample(e.target.value)}
            rows={2}
            placeholder="Paste one of your old captions so Noted matches your tone."
            className="thin-scroll mt-1.5 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            onClick={generate}
            disabled={loading}
            className="mt-5 w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate content pack →"}
          </button>
        </section>

        {/* Output panel */}
        <section className="rounded-2xl border border-zinc-200 p-6">
          {!pack && !loading && (
            <div className="grid h-full place-items-center py-20 text-center">
              <div>
                <div className="text-5xl">✨</div>
                <p className="mt-4 font-semibold text-zinc-900">Your content pack appears here</p>
                <p className="mt-1 text-sm text-zinc-500">Fill the form or hit “Try a sample” to see it instantly.</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="grid h-full place-items-center py-20 text-center">
              <div className="animate-pulse">
                <div className="mx-auto h-3 w-40 rounded bg-zinc-200" />
                <div className="mx-auto mt-3 h-3 w-56 rounded bg-zinc-200" />
                <div className="mx-auto mt-3 h-3 w-32 rounded bg-zinc-200" />
                <p className="mt-6 text-sm text-zinc-500">Crafting your content pack…</p>
              </div>
            </div>
          )}

          {pack && (
            <div>
              {/* Hook score + source */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-50 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-full text-sm font-bold text-white ${
                      pack.hookScore.score >= 80
                        ? "bg-emerald-500"
                        : pack.hookScore.score >= 60
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                  >
                    {pack.hookScore.score}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Hook score · {pack.hookScore.verdict}</p>
                    <p className="text-xs text-zinc-500">{pack.hookScore.notes[0]}</p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-500 ring-1 ring-zinc-200">
                  {pack.source === "ai" ? "⚡ AI engine" : "⚙️ Smart engine"}
                </span>
              </div>

              {/* Tabs */}
              <div className="mt-5 flex gap-2 border-b border-zinc-100">
                {([
                  ["carousel", "Carousel"],
                  ["reel", "Reel script"],
                  ["caption", "Caption & tags"],
                ] as [TabKey, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
                      tab === key
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Carousel */}
              {tab === "carousel" && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {pack.carousel.map((s, i) => (
                    <div
                      key={i}
                      className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white"
                    >
                      <span className="text-xs font-medium text-indigo-200">Slide {i + 1}</span>
                      <div>
                        <p className="text-lg font-bold leading-snug">{s.title}</p>
                        <p className="mt-2 text-sm text-indigo-100">{s.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reel */}
              {tab === "reel" && (
                <div className="mt-5 space-y-3">
                  {pack.reelScript.map((b, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{b.section}</p>
                      <p className="mt-1 text-sm text-zinc-800">{b.text}</p>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      copy("reel", pack.reelScript.map((b) => `${b.section}\n${b.text}`).join("\n\n"))
                    }
                    className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    {copied === "reel" ? "Copied ✓" : "Copy script"}
                  </button>
                </div>
              )}

              {/* Caption */}
              {tab === "caption" && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-zinc-200 p-4">
                    <p className="whitespace-pre-wrap text-sm text-zinc-800">{pack.caption}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pack.hashtags.map((h) => (
                      <span key={h} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        {h}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => copy("caption", `${pack.caption}\n\n${pack.hashtags.join(" ")}`)}
                    className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    {copied === "caption" ? "Copied ✓" : "Copy caption + tags"}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
