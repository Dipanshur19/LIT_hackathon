"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Logo } from "@/components/Logo";
import type { ContentPack } from "@/lib/types";

const NICHES = ["Studygram", "Exam prep", "Concept explainer", "Coding / tech", "Productivity", "Language learning"];
const FREE_LIMIT = 5;

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
type HistoryItem = { id: string; at: number; pack: ContentPack };

export default function AppPage() {
  const [niche, setNiche] = useState("Studygram");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [voiceSample, setVoiceSample] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pack, setPack] = useState<ContentPack | null>(null);
  const [tab, setTab] = useState<TabKey>("carousel");
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);
  const [usageLeft, setUsageLeft] = useState(FREE_LIMIT);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  // ---- persistence ----
  useEffect(() => {
    try {
      const u = localStorage.getItem("noted_usage");
      if (u !== null) setUsageLeft(Number(u));
      const h = localStorage.getItem("noted_history");
      if (h) setHistory(JSON.parse(h));
    } catch {
      /* ignore */
    }
  }, []);

  const persistUsage = (n: number) => {
    setUsageLeft(n);
    try {
      localStorage.setItem("noted_usage", String(n));
    } catch {
      /* ignore */
    }
  };
  const persistHistory = (h: HistoryItem[]) => {
    setHistory(h);
    try {
      localStorage.setItem("noted_history", JSON.stringify(h));
    } catch {
      /* ignore */
    }
  };

  const flash = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 1800);
  }, []);

  async function runGenerate(force = false) {
    setError("");
    if (!topic.trim() && !notes.trim()) {
      setError("Add a topic or paste some notes first.");
      return;
    }
    if (usageLeft <= 0 && !force) {
      setShowUpgrade(true);
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
      const p = data as ContentPack;
      setPack(p);
      setTab("carousel");
      if (usageLeft > 0) persistUsage(usageLeft - 1);
      const item: HistoryItem = { id: crypto.randomUUID(), at: Date.now(), pack: p };
      persistHistory([item, ...history].slice(0, 8));
      flash(p.source === "ai" ? "Generated with AI ⚡" : "Content pack ready ✓");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
      flash("Generation failed", "err");
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
      flash(`${label} copied ✓`);
    } catch {
      flash("Couldn't copy", "err");
    }
  }

  function packToText(p: ContentPack): string {
    return [
      `NOTED — Content Pack`,
      `Topic: ${p.topic}  ·  Niche: ${p.niche}`,
      ``,
      `=== CAROUSEL ===`,
      ...p.carousel.map((s, i) => `Slide ${i + 1}: ${s.title}\n${s.body}`),
      ``,
      `=== REEL SCRIPT ===`,
      ...p.reelScript.map((b) => `[${b.section}] ${b.text}`),
      ``,
      `=== CAPTION ===`,
      p.caption,
      ``,
      `=== HASHTAGS ===`,
      p.hashtags.join(" "),
    ].join("\n");
  }

  function downloadText() {
    if (!pack) return;
    const blob = new Blob([packToText(pack)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noted-${pack.topic.slice(0, 24).replace(/\s+/g, "-").toLowerCase() || "pack"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    flash("Downloaded .txt ✓");
  }

  async function downloadSlidesPng() {
    if (!carouselRef.current) return;
    const slides = carouselRef.current.querySelectorAll<HTMLElement>("[data-slide]");
    if (!slides.length) return;
    flash("Rendering images…");
    let n = 0;
    for (const el of Array.from(slides)) {
      try {
        const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true });
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `noted-slide-${n + 1}.png`;
        a.click();
        n++;
      } catch {
        /* skip a failed slide */
      }
    }
    flash(n ? `Downloaded ${n} slide${n > 1 ? "s" : ""} ✓` : "Export failed", n ? "ok" : "err");
  }

  function restore(item: HistoryItem) {
    setPack(item.pack);
    setTopic(item.pack.topic);
    setNiche(item.pack.niche);
    setTab("carousel");
    setError("");
    flash("Restored from history ✓");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 sm:flex">
              <span className={`h-2 w-2 rounded-full ${usageLeft > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
              Free plan · {usageLeft}/{FREE_LIMIT} packs left
            </span>
            <button
              onClick={() => setShowUpgrade(true)}
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-5 py-6 lg:grid-cols-[360px_1fr]">
        {/* ---------- INPUT ---------- */}
        <aside className="flex flex-col gap-5">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
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
              className="focus-ring mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm"
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
              className="focus-ring mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm"
            />

            <label className="mt-4 block text-sm font-medium text-zinc-700">
              Your notes <span className="text-zinc-400">(paste anything)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Paste bullet points, a chapter summary, or messy notes…"
              className="focus-ring thin-scroll mt-1.5 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 text-sm"
            />

            <label className="mt-4 block text-sm font-medium text-zinc-700">
              Voice sample <span className="text-zinc-400">(optional)</span>
            </label>
            <textarea
              value={voiceSample}
              onChange={(e) => setVoiceSample(e.target.value)}
              rows={2}
              placeholder="Paste one of your old captions so Noted matches your tone."
              className="focus-ring thin-scroll mt-1.5 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 text-sm"
            />

            {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

            <button
              onClick={() => runGenerate()}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800 disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                <>Generate content pack →</>
              )}
            </button>
          </section>

          {/* history */}
          {history.length > 0 && (
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-900">Recent packs</h2>
                <button onClick={() => persistHistory([])} className="text-xs text-zinc-400 hover:text-rose-500">
                  Clear
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {history.map((h) => (
                  <li key={h.id}>
                    <button
                      onClick={() => restore(h)}
                      className="w-full rounded-lg border border-zinc-100 px-3 py-2 text-left transition-colors hover:bg-zinc-50"
                    >
                      <p className="truncate text-sm font-medium text-zinc-800">{h.pack.topic}</p>
                      <p className="text-xs text-zinc-400">{h.pack.niche}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* ---------- OUTPUT ---------- */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          {!pack && !loading && (
            <div className="grid h-full min-h-[440px] place-items-center text-center">
              <div className="animate-fade-in">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-3xl">✨</div>
                <p className="mt-4 font-semibold text-zinc-900">Your content pack appears here</p>
                <p className="mt-1 text-sm text-zinc-500">Fill the form or hit “Try a sample” to see it instantly.</p>
                <button
                  onClick={loadSample}
                  className="mt-5 rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Load a sample →
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="min-h-[440px]">
              <div className="flex items-center gap-3">
                <div className="skeleton h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-40 rounded" />
                  <div className="skeleton h-3 w-56 rounded" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton aspect-[4/5] rounded-2xl" />
                ))}
              </div>
            </div>
          )}

          {pack && !loading && (
            <div className="animate-fade-in">
              {/* score + actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-50 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-full text-sm font-bold text-white ${
                      pack.hookScore.score >= 80 ? "bg-emerald-500" : pack.hookScore.score >= 60 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                  >
                    {pack.hookScore.score}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Hook score · {pack.hookScore.verdict}</p>
                    <p className="max-w-md text-xs text-zinc-500">{pack.hookScore.notes[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-500 ring-1 ring-zinc-200">
                    {pack.source === "ai" ? "⚡ AI engine" : "⚙️ Smart engine"}
                  </span>
                  <button
                    onClick={() => runGenerate(true)}
                    className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    ↻ Regenerate
                  </button>
                </div>
              </div>

              {/* tabs */}
              <div className="mt-5 flex items-center justify-between border-b border-zinc-100">
                <div className="flex gap-1">
                  {([
                    ["carousel", "Carousel"],
                    ["reel", "Reel script"],
                    ["caption", "Caption & tags"],
                  ] as [TabKey, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                        tab === key ? "border-indigo-600 text-indigo-600" : "border-transparent text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={downloadText}
                  className="hidden rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 sm:block"
                >
                  ⬇ Download .txt
                </button>
              </div>

              {/* CAROUSEL */}
              {tab === "carousel" && (
                <div className="mt-5 animate-fade-in">
                  <div ref={carouselRef} className="grid gap-4 sm:grid-cols-2">
                    {pack.carousel.map((s, i) => (
                      <div
                        key={i}
                        data-slide
                        className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-5 text-white shadow-md"
                      >
                        <span className="text-xs font-medium text-indigo-200">Slide {i + 1}</span>
                        <div>
                          <p className="text-lg font-bold leading-snug">{s.title}</p>
                          <p className="mt-2 text-sm text-indigo-100">{s.body}</p>
                        </div>
                        <span className="text-[10px] font-medium text-indigo-200/70">@noted</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={downloadSlidesPng}
                      className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      ⬇ Download slides as PNG
                    </button>
                    <button
                      onClick={() => copy("Carousel", pack.carousel.map((s, i) => `Slide ${i + 1}: ${s.title}\n${s.body}`).join("\n\n"))}
                      className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      Copy text
                    </button>
                  </div>
                </div>
              )}

              {/* REEL */}
              {tab === "reel" && (
                <div className="mt-5 animate-fade-in space-y-3">
                  {pack.reelScript.map((b, i) => (
                    <div key={i} className="rounded-xl border border-zinc-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{b.section}</p>
                      <p className="mt-1 text-sm text-zinc-800">{b.text}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => copy("Script", pack.reelScript.map((b) => `${b.section}\n${b.text}`).join("\n\n"))}
                    className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    Copy script
                  </button>
                </div>
              )}

              {/* CAPTION */}
              {tab === "caption" && (
                <div className="mt-5 animate-fade-in space-y-4">
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
                    onClick={() => copy("Caption", `${pack.caption}\n\n${pack.hashtags.join(" ")}`)}
                    className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    Copy caption + tags
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* toast */}
      {toast && (
        <div
          className={`animate-scale-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg ${
            toast.kind === "ok" ? "bg-zinc-900" : "bg-rose-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* upgrade modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5" onClick={() => setShowUpgrade(false)}>
          <div
            className="animate-scale-in w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl">⚡</div>
            <h3 className="mt-4 text-xl font-bold text-zinc-900">Upgrade to Noted Pro</h3>
            <p className="mt-1 text-sm text-zinc-500">
              {usageLeft <= 0
                ? "You've used all 5 free packs this month. Go unlimited for ₹199/mo."
                : "Unlock unlimited packs, 3 brand voices, no watermark and a scheduler."}
            </p>
            <ul className="mt-5 space-y-2.5">
              {["Unlimited content packs", "3 brand voices", "No watermark on exports", "Post scheduler + hooks library"].map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-100 text-[10px] text-indigo-600">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  flash("Pro is a demo — payments not wired up");
                  setShowUpgrade(false);
                }}
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Get Pro — ₹199/mo
              </button>
              {usageLeft <= 0 && (
                <button
                  onClick={() => {
                    setShowUpgrade(false);
                    runGenerate(true);
                  }}
                  className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Continue in demo mode
                </button>
              )}
              <button
                onClick={() => persistUsage(FREE_LIMIT)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                Reset free quota (demo)
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-zinc-200 bg-white py-5 text-center text-xs text-zinc-400">
        <Link href="/" className="hover:text-indigo-600">
          ← Back to home
        </Link>
      </footer>
    </div>
  );
}
