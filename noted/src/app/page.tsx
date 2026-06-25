import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const stats = [
  { v: "10s", l: "from notes to a full post" },
  { v: "4-in-1", l: "carousel · reel · caption · tags" },
  { v: "₹0", l: "to start — freemium" },
];

const features = [
  { icon: "🖼️", title: "Carousel, done", desc: "A hook-first, swipe-ready 6–8 slide carousel built straight from your notes." },
  { icon: "🎬", title: "Reel script, timed", desc: "A 30-second script with hook, beats and CTA — timestamped so you just record." },
  { icon: "✍️", title: "Caption + hashtags", desc: "An engaging caption with a question that drives comments, plus niche hashtags." },
  { icon: "⚡", title: "Hook score", desc: "Every pack is rated for scroll-stopping power, with fixes to make it sharper." },
  { icon: "🎙️", title: "Your voice, cloned", desc: "Paste one old post and Noted matches your tone — not robotic AI-speak." },
  { icon: "📥", title: "Export anywhere", desc: "Copy to clipboard or download slides as images. Post in seconds." },
];

const steps = [
  { n: "01", t: "Set niche & voice", d: "Pick your niche and paste one old post so Noted learns how you sound." },
  { n: "02", t: "Drop your material", d: "A topic, your notes, or a chapter summary. That's the only input needed." },
  { n: "03", t: "Get a content pack", d: "Carousel, reel script, caption and hashtags — generated in seconds." },
  { n: "04", t: "Edit, copy, post", d: "Tweak anything, copy or download, and ship before the moment passes." },
];

const tiers = [
  {
    name: "Free",
    price: "₹0",
    tagline: "Build the habit",
    points: ["5 content packs / month", "1 saved brand voice", "Carousel + reel + caption", "Hook score"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹199",
    suffix: "/mo",
    tagline: "For creators who post to grow",
    points: ["Unlimited content packs", "3 brand voices", "No watermark on exports", "Post scheduler + hooks library"],
    cta: "Go Pro",
    highlight: true,
  },
];

const faqs = [
  { q: "Who is Noted for?", a: "Student creators — studygram, exam-prep, concept explainers, coding and productivity niches — who already study and want to post consistently without doing the work twice." },
  { q: "Do I need an AI API key?", a: "No. Noted runs on a built-in smart engine for free. If you add an OpenAI key, it automatically upgrades to LLM-powered output — but it works great without one." },
  { q: "How is this different from ChatGPT or Canva?", a: "Noted is built into the study workflow. It understands academic content, clones your voice from past posts, and outputs a complete post pack — not a blank chat box or a design tool you fight with." },
  { q: "Is the demo really live?", a: "Yes. Open the app, paste notes or hit 'Try a sample', and you'll get a real content pack instantly." },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <SiteHeader />

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        {/* animated background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-white to-white" />
          <div className="animate-floaty absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="animate-floaty-slow absolute -right-16 top-24 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-5 pt-20 pb-12 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              For student creators · studygram · exam-prep
            </span>

            <h1 className="animate-fade-up delay-1 mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl md:text-7xl">
              Study once.
              <br />
              <span className="text-gradient">Post everywhere.</span>
            </h1>

            <p className="animate-fade-up delay-2 mx-auto mt-6 max-w-xl text-lg text-zinc-600">
              You already do the hard part — studying. Noted turns your notes into a ready-to-post
              carousel, reel script, caption and hashtags, in your own voice.
            </p>

            <div className="animate-fade-up delay-3 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/app"
                className="group w-full rounded-full bg-zinc-900 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:-translate-y-0.5 hover:bg-zinc-800 sm:w-auto"
              >
                Generate a content pack
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <a
                href="#how"
                className="w-full rounded-full border border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 sm:w-auto"
              >
                See how it works
              </a>
            </div>
            <p className="animate-fade-up delay-4 mt-4 text-sm text-zinc-400">No login needed · works instantly · free to try</p>
          </div>

          {/* Product preview mockup */}
          <div className="animate-scale-in delay-4 mx-auto mt-16 max-w-4xl">
            <div className="rounded-3xl border border-zinc-200 bg-white/80 p-3 shadow-2xl shadow-indigo-200/40 backdrop-blur">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4">
                <div className="mb-4 flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-3 rounded-md bg-white px-3 py-1 text-xs text-zinc-400 ring-1 ring-zinc-200">
                    noted.app/app
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
                  {/* input mock */}
                  <div className="rounded-xl border border-zinc-200 bg-white p-4 text-left">
                    <p className="text-xs font-semibold text-zinc-400">YOUR NOTES</p>
                    <div className="mt-2 space-y-2">
                      <div className="h-2.5 w-4/5 rounded bg-zinc-100" />
                      <div className="h-2.5 w-full rounded bg-zinc-100" />
                      <div className="h-2.5 w-3/4 rounded bg-zinc-100" />
                      <div className="h-2.5 w-2/3 rounded bg-zinc-100" />
                    </div>
                    <div className="mt-4 rounded-full bg-zinc-900 py-2 text-center text-xs font-semibold text-white">
                      Generate →
                    </div>
                  </div>
                  {/* output mock */}
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex aspect-[4/5] flex-col justify-between rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-3 text-white shadow-md"
                      >
                        <span className="text-[10px] text-indigo-200">Slide {i + 1}</span>
                        <div className="space-y-1.5">
                          <div className="h-2 w-full rounded bg-white/70" />
                          <div className="h-2 w-2/3 rounded bg-white/40" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* stats */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">{s.v}</p>
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROBLEM ---------------- */}
      <section className="border-y border-zinc-100 bg-zinc-50/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">The problem</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900">Creators do the work twice</h2>
            <p className="mt-4 text-zinc-600">
              Studygram and exam-prep creators study for hours — then spend another hour turning it into a
              post. During exams that second job disappears, so they go quiet, lose momentum, and growth stalls.
            </p>
            <p className="mt-4 text-zinc-600">
              Generic AI writers don&apos;t understand academic content or a creator&apos;s voice, and a Canva +
              ChatGPT + scheduler stack costs more than a student will ever pay.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["⏳", "1+ hour per post", "Reformatting notes into slides and scripts, every single time."],
              ["📉", "Inconsistent posting", "Exam season kills the streak — and the algorithm punishes silence."],
              ["🧩", "Wrong tools", "Generic AI ignores academic depth and the creator's own tone."],
            ].map(([icon, t, d]) => (
              <div
                key={t}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-semibold text-zinc-900">{t}</p>
                  <p className="text-sm text-zinc-600">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Features</p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">One input. A full content pack.</h2>
          <p className="mt-3 text-zinc-600">Paste your notes once and get everything you need to post — not just a caption.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-zinc-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-2xl transition-colors group-hover:bg-indigo-100">
                {f.icon}
              </div>
              <h3 className="mt-5 font-semibold text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how" className="scroll-mt-20 border-y border-zinc-100 bg-zinc-50/60">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">How it works</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">From notes to post in 4 steps</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} className="relative rounded-2xl border border-zinc-200 bg-white p-6">
                <span className="text-4xl font-black text-gradient">{s.n}</span>
                <h3 className="mt-3 font-semibold text-zinc-900">{s.t}</h3>
                <p className="mt-2 text-sm text-zinc-600">{s.d}</p>
                {i < steps.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-zinc-300 md:block">→</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/app"
              className="inline-block rounded-full bg-zinc-900 px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Try it now →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <section id="pricing" className="mx-auto max-w-5xl scroll-mt-20 px-5 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">Freemium, built for students</h2>
          <p className="mt-3 text-zinc-600">Free hooks the habit. The 5-pack limit and exam-season spikes tip creators into Pro.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-8 transition-all hover:-translate-y-1 ${
                t.highlight
                  ? "border-indigo-300 bg-gradient-to-b from-indigo-50/70 to-white shadow-xl shadow-indigo-100"
                  : "border-zinc-200 bg-white"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1 text-xs font-semibold text-white shadow">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-bold text-zinc-900">{t.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{t.tagline}</p>
              <p className="mt-5 text-5xl font-extrabold text-zinc-900">
                {t.price}
                {t.suffix && <span className="text-base font-medium text-zinc-500">{t.suffix}</span>}
              </p>
              <ul className="mt-6 space-y-3">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-zinc-700">
                    <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-indigo-100 text-[10px] text-indigo-600">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/app"
                className={`mt-8 block rounded-full px-6 py-3 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  t.highlight ? "bg-zinc-900 text-white hover:bg-zinc-800" : "border border-zinc-300 text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="scroll-mt-20 border-t border-zinc-100 bg-zinc-50/60">
        <div className="mx-auto max-w-3xl px-5 py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">Questions, answered</h2>
          </div>
          <div className="mt-12 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 [&_summary]:cursor-pointer"
              >
                <summary className="flex list-none items-center justify-between font-semibold text-zinc-900">
                  {f.q}
                  <span className="text-indigo-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative overflow-hidden bg-zinc-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-floaty absolute -left-10 top-0 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="animate-floaty-slow absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Your next post is one paste away.</h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-300">
            Turn any topic or set of notes into a content pack right now — free, no login.
          </p>
          <Link
            href="/app"
            className="mt-9 inline-block rounded-full bg-white px-8 py-3.5 text-base font-semibold text-zinc-900 transition-all hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            Open Noted →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
